
'use server';

import { z } from 'zod';

// Schema for application form (Work With Us section)
// This schema is not directly used for submission via WhatsApp link anymore,
// but kept for reference or potential future use with a direct server action.
const ApplicationSchema = z.object({
  fullName: z.string().min(1, "Nome completo é obrigatório."),
  email: z.string().email("Email inválido.").optional().or(z.literal('')), // Optional as not used in WhatsApp link
  phone: z.string().min(10, "Telefone inválido.").optional().or(z.literal('')), // Optional
  desiredPosition: z.string().min(1, "Cargo desejado é obrigatório."),
  resumeLink: z.string().url("Link do currículo inválido.").optional().or(z.literal('')), // Optional
  message: z.string().optional(),
});

interface FormState {
  message: string | null;
  errors?: {
    fullName?: string[];
    email?: string[];
    phone?: string[];
    desiredPosition?: string[];
    resumeLink?: string[];
    message?: string[];
    _form?: string[];
  } | null;
}

// This server action is currently NOT USED by the WorkWithUsForm,
// as the form now directly opens a WhatsApp link.
// It's kept here for potential future use if direct submission is re-enabled.
export async function submitApplication(prevState: FormState | null, formData: FormData): Promise<FormState> {
  const validatedFields = ApplicationSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email') || '',
    phone: formData.get('phone') || '',
    desiredPosition: formData.get('desiredPosition'),
    resumeLink: formData.get('resumeLink') || '',
    message: formData.get('message') || '',
  });

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
    };
  }

  try {
    // Simulate submission
    console.log("Nova candidatura recebida (Server Action - ATUALMENTE NÃO USADO):");
    console.log("Nome:", validatedFields.data.fullName);
    console.log("Cargo Desejado:", validatedFields.data.desiredPosition);
    // ... log other fields

    return { message: 'Candidatura enviada com sucesso (simulado)! Entraremos em contato em breve.', errors: null };

  } catch (error) {
    console.error("Error submitting application:", error);
    return { message: 'Erro: Não foi possível processar sua candidatura no momento. Tente novamente mais tarde.', errors: null };
  }
}
