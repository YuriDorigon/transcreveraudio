
"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import EmployeeForm from '@/components/admin/employee-form'; // Dynamically imported
import type { Employee } from '@/types/employee';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, orderBy, writeBatch, Timestamp } from 'firebase/firestore';
import dynamic from 'next/dynamic';

const EmployeeForm = dynamic(() => import('@/components/admin/employee-form'), {
  suspense: true,
  ssr: false, // Important for client-side heavy components
});


const DEFAULT_PLACEHOLDER_URL = `https://placehold.co/200x200.png`;

// Helper to check if a string is a valid Data URL (Base64)
const isDataUrl = (str: string | undefined): boolean => {
  if (!str) return false;
  return str.startsWith('data:image');
}
// Helper to check if a string is a valid HTTP/HTTPS URL (for placeholders or existing external URLs)
const isHttpUrl = (str: string | undefined): boolean => {
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}


export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "employees"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const employeesData: Employee[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        employeesData.push({
          id: docSnap.id,
          ...data,
          photoUrl: data.photoUrl || DEFAULT_PLACEHOLDER_URL,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        } as Employee);
      });
      setEmployees(employeesData);
    } catch (error: any) {
      console.error("Erro detalhado ao buscar funcionários: ", error);
      let errorMessage = `Falha ao buscar funcionários: ${error.message || 'Erro desconhecido.'}`;
      if (error.code) {
        errorMessage = `Falha ao buscar funcionários (${error.code}): ${error.message}.`;
      }
      toast({
        title: "Erro ao Carregar Funcionários",
        description: `${errorMessage} Verifique as regras do Firestore, a configuração do projeto e as restrições da chave de API.`,
        variant: "destructive",
        duration: 15000
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteEmployee = async (employeeToDelete: Employee) => {
    setIsSaving(true);
    try {
      await deleteDoc(doc(db, "employees", employeeToDelete.id));

      const updatedEmployees = employees.filter(emp => emp.id !== employeeToDelete.id);
      const batch = writeBatch(db);
      updatedEmployees.forEach((emp, index) => {
        if (emp.order !== index) {
          const employeeRef = doc(db, "employees", emp.id);
          batch.update(employeeRef, { order: index });
        }
      });
      await batch.commit();

      setEmployees(updatedEmployees.map((emp, idx) => ({ ...emp, order: idx })).sort((a,b) => a.order - b.order));
      toast({ title: "Funcionário Removido", description: "O funcionário foi removido com sucesso." });

    } catch (error: any) {
      console.error("Erro ao remover funcionário: ", error);
      toast({ title: "Erro ao Remover", description: `Não foi possível remover o funcionário. Detalhe: ${error.message || 'Erro desconhecido.'}`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEmployee = async (
    employeeData: Omit<Employee, 'id' | 'order' | 'createdAt'>,
    id?: string
  ) => {
    setIsSaving(true);

    // Ensure photoUrl is always a string (Base64 or placeholder)
    const photoUrlToSave = employeeData.photoUrl || DEFAULT_PLACEHOLDER_URL;

    const dataToSave: Partial<Omit<Employee, 'id' | 'order' | 'createdAt'>> & {createdAt?: Timestamp, photoUrl?: string} = {
      name: employeeData.name,
      role: employeeData.role,
      description: employeeData.description,
      photoUrl: photoUrlToSave,
    };
    
    try {
      if (id) {
        const employeeRef = doc(db, "employees", id);
        await updateDoc(employeeRef, dataToSave);
        toast({ title: "Funcionário Atualizado", description: "Os dados do funcionário foram atualizados." });
      } else {
        const maxOrder = employees.length > 0 ? Math.max(...employees.map(e => e.order).filter(o => typeof o === 'number'), -1) : -1;
        const newOrder = maxOrder + 1;
        const newEmployeeData: Omit<Employee, 'id'> = { 
            ...dataToSave, 
            order: newOrder, 
            createdAt: Timestamp.now(),
            name: dataToSave.name!,
            role: dataToSave.role!,
            description: dataToSave.description!,
            photoUrl: dataToSave.photoUrl!,
        };
        await addDoc(collection(db, "employees"), newEmployeeData);
        toast({ title: "Funcionário Adicionado", description: "Novo funcionário cadastrado com sucesso." });
      }
      await fetchEmployees(); // Refresh the list
      setIsFormOpen(false);
      setEditingEmployee(null);
    } catch (error: any)      {
      console.error("---------- ERRO AO SALVAR FUNCIONÁRIO (handleSaveEmployee) ----------");
      console.error("Dados que tentaram ser salvos:", dataToSave);
      console.error("ID (se editando):", id);
      console.error("Objeto de erro completo:", error);
      let description = `Não foi possível salvar os dados do funcionário. Verifique o console para detalhes. Erro: ${error.message || 'Desconhecido'}`;
      if (error.code === 'permission-denied' || (error.message && error.message.toLowerCase().includes("missing or insufficient permissions"))) {
        description = `Falha ao salvar: Permissões insuficientes. VERIFIQUE SUAS REGRAS DO FIRESTORE. Detalhe: ${error.message || 'Erro desconhecido.'}`;
      } else if (error.code === 'invalid-argument' || (error.message && (error.message.toLowerCase().includes("exceeds the maximum size") || error.message.toLowerCase().includes("value is too large")) ) ) {
        description = `Falha ao salvar: A imagem (ou outros dados) pode ser muito grande para o Firestore (limite de 1MB por documento). Tente uma imagem menor ou menos dados. Detalhe: ${error.message || 'Erro desconhecido.'}`;
      } else {
        description = `Erro ao salvar: ${error.message || 'Erro desconhecido.'}`;
      }
      toast({ title: "Erro ao Salvar", description, variant: "destructive", duration: 10000 });
    } finally {
      setIsSaving(false);
    }
  };

  const moveEmployee = async (employeeId: string, direction: 'up' | 'down') => {
    setIsSaving(true);
    const currentIndex = employees.findIndex(emp => emp.id === employeeId);
    if (currentIndex === -1) {
      setIsSaving(false);
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= employees.length) {
      setIsSaving(false);
      return;
    }

    const newEmployees = [...employees];
    const [movedEmployee] = newEmployees.splice(currentIndex, 1);
    newEmployees.splice(targetIndex, 0, movedEmployee);

    const batch = writeBatch(db);
    newEmployees.forEach((emp, index) => {
      if (emp.order !== index) {
        const employeeRef = doc(db, "employees", emp.id);
        batch.update(employeeRef, { order: index });
      }
    });

    try {
      await batch.commit();
      setEmployees(newEmployees.map((emp, idx) => ({ ...emp, order: idx })));
      toast({ title: "Ordem Atualizada", description: "A ordem de exibição dos funcionários foi ajustada." });
    } catch (error: any) {
      console.error("Erro ao reordenar funcionários: ", error);
      toast({ title: "Erro ao Reordenar", description: `Não foi possível ajustar a ordem. Detalhe: ${error.message || 'Erro desconhecido.'}`, variant: "destructive" });
      await fetchEmployees(); 
    } finally {
      setIsSaving(false);
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen bg-background text-foreground">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">Gestão de Funcionários</h1>
        <p className="text-muted-foreground mt-2">Adicione, edite, remova e reordene os membros da equipe.</p>
      </header>

      <div className="mb-6 text-right">
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingEmployee(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={handleAddEmployee} className="bg-primary hover:bg-primary/90" disabled={isSaving}>
              <PlusCircle className="mr-2 h-5 w-5" />
              Adicionar Funcionário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-primary">{editingEmployee ? 'Editar Funcionário' : 'Adicionar Novo Funcionário'}</DialogTitle>
            </DialogHeader>
            <Suspense fallback={<div className="flex justify-center items-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /><p className="ml-2 text-muted-foreground">Carregando formulário...</p></div>}>
              <EmployeeForm
                employee={editingEmployee}
                onSave={handleSaveEmployee}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingEmployee(null);
                }}
                isSaving={isSaving}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2 text-muted-foreground">Carregando funcionários...</p>
        </div>
      )}

      {!isLoading && employees.length === 0 && (
        <p className="text-center text-muted-foreground py-10">Nenhum funcionário cadastrado ainda.</p>
      )}

      {!isLoading && employees.length > 0 && (
        <div className="space-y-4">
          {employees.map((employee, index) => (
            <Card key={employee.id} className="bg-card border-border/70 shadow-md flex flex-col sm:flex-row items-center p-4">
              <CardHeader className="p-0 sm:p-2 flex-shrink-0">
                <Image
                  src={(isDataUrl(employee.photoUrl) || isHttpUrl(employee.photoUrl)) && employee.photoUrl ? employee.photoUrl : DEFAULT_PLACEHOLDER_URL}
                  alt={`Foto de ${employee.name}`}
                  width={80}
                  height={80}
                  className="rounded-full object-cover border-2 border-primary"
                  data-ai-hint="person portrait"
                  unoptimized={isDataUrl(employee.photoUrl)} 
                  onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_URL; }}
                  loading="lazy"
                />
              </CardHeader>
              <CardContent className="p-2 sm:p-4 flex-grow text-center sm:text-left">
                <CardTitle className="text-xl text-foreground">{employee.name}</CardTitle>
                <p className="text-sm text-primary">{employee.role}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{employee.description}</p>
                <p className="text-xs text-muted-foreground mt-1">Ordem: {employee.order ?? 'N/A'}</p>
              </CardContent>
              <CardFooter className="p-2 flex flex-col sm:flex-row sm:items-center gap-2 flex-shrink-0">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => moveEmployee(employee.id, 'up')} disabled={index === 0 || isSaving} aria-label="Mover funcionário para cima na lista">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => moveEmployee(employee.id, 'down')} disabled={index === employees.length - 1 || isSaving} aria-label="Mover funcionário para baixo na lista">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <Button variant="outline" size="icon" onClick={() => handleEditEmployee(employee)} aria-label={`Editar funcionário ${employee.name}`} disabled={isSaving}>
                    <Edit className="h-4 w-4 text-blue-500" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon" aria-label={`Remover funcionário ${employee.name}`} disabled={isSaving}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive">Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                          Tem certeza que deseja remover o funcionário "{employee.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSaving}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteEmployee(employee)} className="bg-destructive hover:bg-destructive/90" disabled={isSaving}>
                          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
    
