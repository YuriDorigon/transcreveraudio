
"use client";

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Landmark, HelpCircle } from 'lucide-react';

const suggestions = [
  {
    id: 'emprestimo',
    buttonLabel: 'Informações sobre Empréstimos',
    whatsappText: 'Olá! Gostaria de mais informações sobre as opções de empréstimo.',
    icon: <DollarSign className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
  },
  {
    id: 'financiamento',
    buttonLabel: 'Simular Financiamento',
    whatsappText: 'Olá! Tenho interesse em fazer uma simulação de financiamento.',
    icon: <Landmark className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
  },
  {
    id: 'solucoes',
    buttonLabel: 'Entender Soluções de Crédito',
    whatsappText: 'Olá! Quero entender melhor como a Kennedy Promotora pode me ajudar.',
    icon: <HelpCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />,
  },
];

export default function ContactForm() {
  const { toast } = useToast();
  const kennedyPhoneNumber = "5548996785694"; // Updated Phone Number

  const handleSuggestionClick = (messageText: string) => {
    const whatsappLink = `https://wa.me/${kennedyPhoneNumber}?text=${encodeURIComponent(messageText)}`;
    window.open(whatsappLink, '_blank');
    toast({
      title: 'Redirecionando para o WhatsApp!',
      description: 'Sua mensagem está pronta para ser enviada. Continue no WhatsApp.',
      variant: 'default',
    });
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-lg mx-auto">
      <p className="text-center text-md sm:text-lg text-foreground/90 mb-1 sm:mb-2 font-medium">
        Como podemos te ajudar?
      </p>
      <p className="text-center text-xs sm:text-sm text-foreground/70 mb-4 sm:mb-6">
        Clique em uma das opções abaixo para iniciar uma conversa via WhatsApp:
      </p>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.id}
          onClick={() => handleSuggestionClick(suggestion.whatsappText)}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm py-3 sm:py-4 rounded-lg shadow-md transition-transform hover:scale-105 flex items-center justify-center"
          size="lg" // Size prop might be overridden by specific py- classes but kept for consistency
        >
          {suggestion.icon}
          {suggestion.buttonLabel}
        </Button>
      ))}
    </div>
  );
}
