
"use client";

import AnimatedSection from '@/components/animated-section';
import ContactForm from '@/components/contact-form';
import { Mail, MapPin, PhoneCall, Instagram } from 'lucide-react';

export default function ContactSection() {
  const newPhoneNumberDisplay = "(48) 99678-5694";
  const newPhoneNumberTel = "+5548996785694";
  const contactEmail = "kennedypromotora@gmail.com";

  return (
    <section id="contato" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-3 sm:mb-4 text-primary">Entre em Contato</h2>
          <p className="text-base sm:text-lg md:text-xl text-center text-foreground/80 mb-10 sm:mb-12 max-w-3xl mx-auto">
            Estamos prontos para atender você. Clique em uma das opções abaixo ou fale conosco pelos nossos canais.
          </p>
        </AnimatedSection>

        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 items-start">
          <AnimatedSection className="[--animation-delay:100ms]">
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl border border-border/50">
              <ContactForm />
            </div>
          </AnimatedSection>
          
          <AnimatedSection className="space-y-6 sm:space-y-8 [--animation-delay:200ms]">
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl border border-border/50">
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-foreground">Nossos Canais</h3>
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3">
                  <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base text-foreground/90">Telefone</h4>
                    <a href={`tel:${newPhoneNumberTel}`} className="text-xs sm:text-sm text-foreground/70 hover:text-primary transition-colors">
                      {newPhoneNumberDisplay}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base text-foreground/90">Email</h4>
                    <a href={`mailto:${contactEmail}`} className="text-xs sm:text-sm text-foreground/70 hover:text-primary transition-colors">
                      {contactEmail}
                    </a>
                  </div>
                </div>
                 <div className="flex items-center gap-3">
                  <Instagram className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base text-foreground/90">Instagram</h4>
                    <a 
                      href="https://www.instagram.com/kennedypromotora/?e=c85d0859-4057-47d9-a11e-13b94ca8c5de&g=5" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs sm:text-sm text-foreground/70 hover:text-primary transition-colors break-all"
                    >
                      @kennedypromotora
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-sm sm:text-base text-foreground/90">Endereço</h4>
                    <p className="text-xs sm:text-sm text-foreground/70">
                      R. Marcelino Simas, 481 - Estreito, Florianópolis - SC, 88070-030
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-card p-6 sm:p-8 rounded-xl shadow-xl border border-border/50">
              <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-foreground">Horário de Atendimento</h3>
              <p className="text-xs sm:text-sm text-foreground/70">Segunda a Sexta: 9h às 18h</p>
              <p className="text-xs sm:text-sm text-foreground/70">Sábado: Fechado</p>
              <p className="text-xs sm:text-sm text-foreground/70">Domingo: Fechado</p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection className="mt-12 sm:mt-16 [--animation-delay:300ms]">
          <h3 className="font-headline text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-primary">Nossa Localização</h3>
          <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl border border-border/50">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.072599700755!2d-48.57860062403731!3d-27.59134177624975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x952737f0258c2f93%3A0xc470ac78f18d22a5!2sR.%20Marcelino%20Simas%2C%20481%20-%20Estreito%2C%20Florian%C3%B3polis%20-%20SC%2C%2088070-030!5e0!3m2!1spt-BR!2sbr!4v1720368562441!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style={{ border:0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Kennedy Promotora no Google Maps - R. Marcelino Simas, Estreito"
            ></iframe>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
