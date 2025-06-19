
"use client";

import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const applicationSchema = z.object({
  fullName: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres." }),
  desiredPosition: z.string().min(3, { message: "Cargo desejado deve ter pelo menos 3 caracteres." }),
  message: z.string().max(500, { message: "Mensagem não pode exceder 500 caracteres." }).optional(),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface WorkWithUsFormProps {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function WorkWithUsForm({ setDialogOpen }: WorkWithUsFormProps) {
  const { toast } = useToast();
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      fullName: '',
      desiredPosition: '',
      message: '',
    },
  });

  const hrPhoneNumber = "5548996785694"; // Updated Phone Number

  const onSubmit = async (data: ApplicationFormValues) => {
    try {
      let whatsappMessage = "Nova Candidatura Recebida:\n\n";
      whatsappMessage += `Nome: ${data.fullName}\n`;
      whatsappMessage += `Cargo Desejado: ${data.desiredPosition}\n`;
      if (data.message) {
        whatsappMessage += `Mensagem: ${data.message}\n`;
      }
      // Não incluir link do currículo, pois o campo foi removido

      const whatsappLink = `https://wa.me/${hrPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
      
      window.open(whatsappLink, '_blank');

      toast({
        title: 'Redirecionando para o WhatsApp',
        description: 'Sua candidatura está pronta para ser enviada. Continue no WhatsApp.',
        variant: 'default',
      });
      form.reset();
      setDialogOpen(false);

    } catch (error) {
      console.error("Erro ao preparar mensagem para WhatsApp:", error);
      toast({
        title: 'Erro',
        description: 'Não foi possível preparar sua candidatura para o WhatsApp. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="fullNameWork">Nome Completo</FormLabel>
              <FormControl>
                <Input id="fullNameWork" placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desiredPosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="desiredPositionWork">Cargo Desejado</FormLabel>
              <FormControl>
                <Input id="desiredPositionWork" placeholder="Ex: Consultor Financeiro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="messageWork">Mensagem / Carta de Apresentação (Opcional)</FormLabel>
              <FormControl>
                <Textarea
                  id="messageWork"
                  placeholder="Fale um pouco sobre você e seus objetivos (máx. 500 caracteres)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter className="pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" disabled={form.formState.isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {form.formState.isSubmitting ? 'Preparando...' : 'Enviar via WhatsApp'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
