
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import type { Employee } from '@/types/employee';
import Image from 'next/image';
import { Loader2, Scissors, UploadCloud, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const employeeFormSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres." }),
  role: z.string().min(2, { message: "Cargo deve ter pelo menos 2 caracteres." }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres." }).max(200, { message: "Descrição não pode exceder 200 caracteres."}),
});

type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  employee?: Employee | null;
  onSave: (data: Omit<Employee, 'id' | 'order' | 'createdAt'>, id?: string) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

const DEFAULT_PLACEHOLDER_URL = `https://placehold.co/200x200.png`;
const MAX_FILE_SIZE_BYTES = 700 * 1024; // 700KB
const MAX_BASE64_SIZE_BYTES = 950 * 1024; // Approx 950KB for Base64 (Firestore limit is ~1MB for the whole doc)
const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

export default function EmployeeForm({ employee, onSave, onCancel, isSaving }: EmployeeFormProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [photoForDisplay, setPhotoForDisplay] = useState<string>(employee?.photoUrl || DEFAULT_PLACEHOLDER_URL);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageBase64ForSave, setCroppedImageBase64ForSave] = useState<string | null>(employee?.photoUrl || null);


  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: employee?.name || '',
      role: employee?.role || '',
      description: employee?.description || '',
    },
  });

  useEffect(() => {
    if (employee) {
      form.reset({
        name: employee.name,
        role: employee.role,
        description: employee.description,
      });
      setPhotoForDisplay(employee.photoUrl || DEFAULT_PLACEHOLDER_URL);
      setCroppedImageBase64ForSave(employee.photoUrl || null); 
      setOriginalImageSrc(null); 
    } else {
      form.reset({ name: '', role: '', description: '' });
      setPhotoForDisplay(DEFAULT_PLACEHOLDER_URL);
      setCroppedImageBase64ForSave(null);
      setOriginalImageSrc(null);
    }
  }, [employee, form]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: "Arquivo Muito Grande",
          description: `O arquivo excede ${(MAX_FILE_SIZE_BYTES / (1024)).toFixed(0)}KB. A imagem Base64 resultante pode ser muito grande para salvar no Firestore. Considere uma imagem menor.`,
          variant: "destructive",
          duration: 9000,
        });
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast({ title: "Tipo de Arquivo Inválido", description: "Selecione um arquivo de imagem (JPG, PNG, WebP).", variant: "destructive" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setOriginalImageSrc(base64String); 
        // Do not set photoForDisplay or croppedImageBase64ForSave here yet
        setIsCropModalOpen(true); 
        setCrop(undefined); 
      };
      reader.onerror = () => {
        toast({ title: "Erro ao Ler Arquivo", description: "Não foi possível processar o arquivo.", variant: "destructive" });
        if (fileInputRef.current) fileInputRef.current.value = "";
        setOriginalImageSrc(null);
        setPhotoForDisplay(employee?.photoUrl || DEFAULT_PLACEHOLDER_URL);
        setCroppedImageBase64ForSave(employee?.photoUrl || null);
      };
      reader.readAsDataURL(file);
    }
  };

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop({ unit: '%', width: 90 }, ASPECT_RATIO, width, height),
      width,
      height
    );
    setCrop(crop);
  }

  async function handleApplyCrop() {
    const image = imgRef.current;
    if (!image || !completedCrop || !originalImageSrc) {
      toast({ title: "Erro no Recorte", description: "Imagem ou área de recorte não definida.", variant: "destructive" });
      return;
    }

    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.floor(completedCrop.width * scaleX);
    canvas.height = Math.floor(completedCrop.height * scaleY);

    if (canvas.width < MIN_DIMENSION || canvas.height < MIN_DIMENSION) {
      toast({ title: 'Recorte Muito Pequeno', description: `Área recortada menor que ${MIN_DIMENSION}x${MIN_DIMENSION}px.`, variant: 'destructive' });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toast({ title: "Erro no Recorte", description: "Contexto do canvas indisponível.", variant: "destructive" });
      return;
    }

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0, 0, canvas.width, canvas.height
    );

    const croppedBase64 = canvas.toDataURL('image/png'); // Consider image/jpeg for better compression
    if (croppedBase64.length > MAX_BASE64_SIZE_BYTES) {
      toast({
        title: "Imagem Recortada Muito Grande",
        description: `A imagem recortada tem aprox. ${(croppedBase64.length / (1024)).toFixed(0)}KB e pode exceder o limite para salvar no Firestore (${(MAX_BASE64_SIZE_BYTES/(1024)).toFixed(0)}KB). O salvamento pode falhar. Tente uma área menor ou uma imagem original menor.`,
        variant: "destructive",
        duration: 9000
      });
    }
    setPhotoForDisplay(croppedBase64); 
    setCroppedImageBase64ForSave(croppedBase64); 
    setIsCropModalOpen(false);
  }

  const handleRemovePhoto = () => {
    setPhotoForDisplay(DEFAULT_PLACEHOLDER_URL);
    setOriginalImageSrc(null);
    setCroppedImageBase64ForSave(null); 
    if (fileInputRef.current) fileInputRef.current.value = ""; 
    setCrop(undefined);
  };

  const onSubmit = async (data: EmployeeFormValues) => {
    const finalPhotoUrl = croppedImageBase64ForSave || DEFAULT_PLACEHOLDER_URL;

    if (finalPhotoUrl.startsWith('data:') && finalPhotoUrl.length > MAX_BASE64_SIZE_BYTES) {
      toast({
        title: "Imagem Final Muito Grande",
        description: `A imagem tem aprox. ${(finalPhotoUrl.length / (1024)).toFixed(0)}KB e excede o limite para salvar no Firestore (${(MAX_BASE64_SIZE_BYTES/(1024)).toFixed(0)}KB). O salvamento pode falhar. Por favor, use uma imagem menor ou recorte uma área menor.`,
        variant: "destructive",
        duration: 10000 
      });
    }

    const dataToSave: Omit<Employee, 'id' | 'order' | 'createdAt'> = {
      ...data,
      photoUrl: finalPhotoUrl,
    };
    await onSave(dataToSave, employee?.id);
    if (fileInputRef.current) fileInputRef.current.value = ""; 
  };

  const isDataUrl = (str: string | undefined): boolean => str?.startsWith('data:image') || false;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="employeeName">Nome Completo</FormLabel>
                <FormControl>
                  <Input id="employeeName" placeholder="Nome do funcionário" {...field} className="bg-input border-border/70" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="employeeRole">Cargo</FormLabel>
                <FormControl>
                  <Input id="employeeRole" placeholder="Ex: Consultor Financeiro" {...field} className="bg-input border-border/70" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="employeeDescription">Descrição Curta</FormLabel>
                <FormControl>
                  <Textarea id="employeeDescription" placeholder="Uma breve descrição sobre o funcionário e suas atribuições." {...field} className="bg-input border-border/70 resize-none" rows={3}/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel htmlFor="photoUploadInput">Foto do Funcionário</FormLabel>
            <div className="flex items-center gap-4 mt-2">
              <Image
                src={photoForDisplay} 
                alt={employee?.name ? `Foto atual de ${employee.name}` : "Preview do funcionário"}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-primary"
                data-ai-hint="person portrait"
                onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_URL; }}
                unoptimized={isDataUrl(photoForDisplay)} 
              />
              <div className="flex flex-col gap-2">
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isSaving}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Enviar Nova Foto
                </Button>
                <Input
                  id="photoUploadInput"
                  type="file"
                  accept="image/jpeg, image/png, image/gif, image/webp"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  aria-label="Escolher foto do funcionário"
                />
                {originalImageSrc && ( 
                  <Button type="button" variant="outline" onClick={() => setIsCropModalOpen(true)} disabled={isSaving}>
                    <Scissors className="mr-2 h-4 w-4" /> Recortar Foto
                  </Button>
                )}
                {(photoForDisplay !== DEFAULT_PLACEHOLDER_URL || originalImageSrc) && ( 
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemovePhoto} disabled={isSaving} className="text-destructive hover:text-destructive/80 justify-start px-0">
                    <RotateCcw className="mr-2 h-4 w-4" /> Usar placeholder
                  </Button>
                )}
              </div>
            </div>
            <FormDescription className="mt-2">
              Arquivo: JPG, PNG, WebP (Recomendado: abaixo de {(MAX_FILE_SIZE_BYTES / (1024)).toFixed(0)}KB).
              A imagem final (após recorte) deve ter menos de {(MAX_BASE64_SIZE_BYTES / (1024)).toFixed(0)}KB para salvar no Firestore.
            </FormDescription>
          </FormItem>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => {
                onCancel(); 
                if (fileInputRef.current) fileInputRef.current.value = ""; 
                setPhotoForDisplay(employee?.photoUrl || DEFAULT_PLACEHOLDER_URL);
                setOriginalImageSrc(null);
                setCroppedImageBase64ForSave(employee?.photoUrl || null);
            }} disabled={isSaving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSaving}
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSaving ? 'Salvando...' : 'Salvar Funcionário'}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={isCropModalOpen} onOpenChange={(isOpen) => {
        setIsCropModalOpen(isOpen);
        if (!isOpen && !croppedImageBase64ForSave && originalImageSrc) {
           // If modal is closed without applying crop, and no previous crop exists,
           // set display to original (or placeholder if original too big / error)
           // This logic might need refinement based on desired UX
           // For now, let's keep it simple: if closed without crop, previous state persists.
        }
      }}>
        <DialogContent className="sm:max-w-[600px] bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-primary">Recortar Imagem</DialogTitle>
          </DialogHeader>
          {originalImageSrc && (
            <div className="my-4 flex justify-center items-center max-h-[60vh] overflow-auto">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                minWidth={MIN_DIMENSION} 
                minHeight={MIN_DIMENSION}
                circularCrop={true}
                ariaLabels={{
                  cropArea: 'Área de recorte da imagem',
                  previewCropArea: 'Pré-visualização da área de recorte'
                }}
              >
                <img
                  ref={imgRef}
                  alt="Recortar imagem do funcionário"
                  src={originalImageSrc} 
                  onLoad={onImageLoad}
                  style={{ maxHeight: '50vh', objectFit: 'contain' }} 
                  role="presentation"
                />
              </ReactCrop>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar Recorte</Button>
            </DialogClose>
            <Button type="button" onClick={handleApplyCrop} className="bg-primary hover:bg-primary/90">
              Aplicar Recorte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
