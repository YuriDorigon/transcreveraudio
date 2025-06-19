
"use client";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-7 h-7"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.34 3.43 16.8L2 22L7.31 20.58C8.77 21.33 10.37 21.78 12.04 21.78C17.5 21.78 21.95 17.33 21.95 11.87C21.95 6.41 17.5 2 12.04 2ZM12.04 20.13C10.54 20.13 9.1 19.73 7.85 19.03L7.54 18.85L4.5 19.65L5.33 16.71L5.13 16.38C4.35 15.03 3.88 13.51 3.88 11.91C3.88 7.39 7.59 3.68 12.04 3.68C14.23 3.68 16.23 4.53 17.77 5.99C19.32 7.45 20.2 9.38 20.2 11.87C20.2 16.39 16.5 20.13 12.04 20.13ZM16.56 14.44C16.32 14.32 15.06 13.68 14.82 13.59C14.58 13.5 14.4 13.44 14.22 13.68C14.04 13.92 13.5 14.52 13.32 14.7C13.14 14.88 12.96 14.91 12.72 14.79C12.48 14.67 11.61 14.34 10.56 13.41C9.76 12.69 9.24 11.85 9.06 11.55C8.88 11.25 9 11.1 9.15 10.95C9.29 10.81 9.45 10.62 9.6 10.47C9.72 10.35 9.78 10.23 9.9 10.05C10.02 9.87 9.96 9.72 9.9 9.6C9.84 9.48 9.3 8.26 9.06 7.72C8.83 7.19 8.6 7.26 8.45 7.25C8.32 7.25 8.14 7.25 7.96 7.25C7.78 7.25 7.5 7.31 7.26 7.55C7.02 7.79 6.52 8.26 6.52 9.38C6.52 10.5 7.29 11.56 7.41 11.74C7.53 11.92 9.03 14.24 11.34 15.16C12.01 15.44 12.49 15.6 12.85 15.71C13.44 15.88 13.9 15.85 14.25 15.79C14.64 15.71 15.72 15.08 15.93 14.8C16.14 14.53 16.14 14.32 16.08 14.23C16.02 14.14 15.84 14.08 15.6 13.96C15.36 13.84 15.18 13.78 15.27 13.9C15.36 14.02 16.8 14.56 16.56 14.44Z" />
  </svg>
);


export default function WhatsAppButton() {
  const phoneNumber = "5548996785694"; // Updated Phone Number
  const message = "Olá! Gostaria de saber mais sobre os serviços da Kennedy Promotora.";
  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50"
            aria-label="Fale Conosco pelo WhatsApp"
            animate={{
              y: [0, -5, 0, -3, 0], // Bounce effect
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
              delay: 2, // Start animation after 2 seconds
              repeatDelay: 3, // Wait 3 seconds between bounces
            }}
          >
            <Button
              size="icon"
              className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-transform hover:scale-110 flex items-center justify-center"
            >
              <WhatsAppIcon />
            </Button>
          </motion.a>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-background text-foreground border-border shadow-md">
          <p>Fale Conosco no WhatsApp!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
