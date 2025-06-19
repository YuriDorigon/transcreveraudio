
"use client";

import AnimatedSection from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Repeat, Users, Award, Zap, Star } from 'lucide-react';

const products = [
  {
    icon: Briefcase,
    title: 'ANTECIPAÇÃO DO FGTS',
    description: 'Retire seu saldo em menos de 15 minutos!',
  },
  {
    icon: Repeat,
    title: 'PORTABILIDADE',
    description: 'Reduza a taxa de juros do seu consignado para a menor do mercado!',
  },
  {
    icon: Users,
    title: 'ATENDIMENTO ÁGIL',
    description: 'Equipe dedicada para orientar suas melhores escolhas financeiras.',
  },
];

const stats = [
  {
    icon: Award,
    value: 'Milhares de Sonhos',
    label: 'Realizados com Nosso Apoio',
  },
  {
    icon: Zap,
    value: 'Liberação Ágil',
    label: 'Crédito Rápido e Descomplicado',
  },
  {
    icon: Star,
    value: 'Nota 4.9',
    label: 'De avaliação no Google',
  },
];

export default function ProductsSection() {
  return (
    <section id="nossos-produtos" className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
            Nossos Produtos e Vantagens
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center text-foreground/80 mb-12 max-w-3xl mx-auto">
            Soluções de crédito pensadas para você.
          </p>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {products.map((product, index) => (
            <AnimatedSection key={index} className={`[--animation-delay:${index * 100}ms]`}>
              <Card className="bg-background border-border/50 shadow-xl hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col p-4 sm:p-6 rounded-lg">
                <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 pb-3 sm:pb-4">
                  <div className="p-2 sm:p-3 bg-primary/10 rounded-full">
                    <product.icon className="w-5 h-5 sm:w-6 md:w-7 text-primary" />
                  </div>
                  <CardTitle className="text-md sm:text-lg md:text-xl font-semibold text-foreground">{product.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs sm:text-sm md:text-base text-foreground/70 leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="mt-16 md:mt-20">
          <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
            O Que Nos Destaca
          </h3>
        </AnimatedSection>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
          {stats.map((stat, index) => (
            <AnimatedSection key={index} className={`[--animation-delay:${(index + products.length) * 100}ms]`}>
              <div className="p-4 sm:p-6 rounded-lg "> 
                <stat.icon className="w-7 h-7 sm:w-8 md:w-10 text-primary mx-auto mb-3 sm:mb-4" />
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-1 sm:mb-2">{stat.value}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
