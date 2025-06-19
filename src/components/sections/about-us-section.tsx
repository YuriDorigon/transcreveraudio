
"use client";

import AnimatedSection from '@/components/animated-section';
import Image from 'next/image';

export default function AboutUsSection() {
  return (
    <section id="sobre-nos" className="py-16 md:py-24 bg-background" aria-labelledby="about-us-heading">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 id="about-us-heading" className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 text-primary">Quem Somos</h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <AnimatedSection>
            <Image
              src="/fotoquemsomos.jpeg"
              alt="Equipe da Kennedy Promotora reunida em seu escritório moderno, demonstrando profissionalismo e colaboração."
              width={600}
              height={400}
              className="rounded-xl shadow-2xl object-cover w-full"
              loading="lazy"
              data-ai-hint="team photo office"
            />
          </AnimatedSection>
          
          <div className="space-y-6 text-center md:text-left">
            <AnimatedSection as="div" className="[--animation-delay:100ms]">
              <p className="text-foreground/80 leading-relaxed text-base sm:text-lg">
                Na Kennedy Promotora, acreditamos que crédito com responsabilidade transforma vidas. Atuamos há mais de 5 anos no mercado, oferecendo soluções financeiras personalizadas para aposentados, pensionistas e servidores públicos, com foco em transparência, agilidade e atendimento humanizado.
              </p>
            </AnimatedSection>
            <AnimatedSection as="div" className="[--animation-delay:200ms]">
              <p className="text-foreground/80 leading-relaxed text-base sm:text-lg">
                Construída com dedicação, ética e paixão pelo que fazemos. Hoje, com uma estrutura moderna e uma equipe altamente capacitada, atendemos com excelência tanto presencialmente quanto online, conectando tecnologia e relacionamento de forma prática e acessível.
              </p>
            </AnimatedSection>
            <AnimatedSection as="div" className="[--animation-delay:400ms]">
              <p className="text-primary font-bold text-xl sm:text-2xl text-center mt-6">
                VEM COM O CERTO!
              </p>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  );
}
