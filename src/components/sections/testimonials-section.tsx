
"use client";

import AnimatedSection from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: 'Carlos Alberto S.',
    testimonial: 'A Kennedy Promotora me ajudou a expandir meu negócio com um empréstimo rápido e com ótimas taxas. O atendimento foi impecável!',
    rating: 5,
  },
  {
    name: 'Mariana Lima',
    testimonial: 'Consegui realizar o sonho da casa própria graças à assessoria da Kennedy Promotora. Processo transparente e equipe muito atenciosa.',
    rating: 5,
  },
  {
    name: 'Fernanda Oliveira',
    testimonial: 'Fui muito bem atendida e consegui as melhores condições para meu empréstimo consignado. Recomendo a Kennedy Promotora!',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="depoimentos" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
            O Que Nossos Clientes Dizem
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-center text-foreground/80 mb-12 max-w-3xl mx-auto">
            A satisfação de quem confia em nossos serviços é nossa maior recompensa.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((testimonial, index) => (
            <AnimatedSection
              key={testimonial.name} // Changed key to name for uniqueness if multiple testimonials have same index after filtering
              className={cn(
                'h-full',
                `[--animation-delay:${index * 100}ms]`
              )}
            >
              <Card className="bg-card border-border/50 shadow-xl h-full flex flex-col p-4 sm:p-6">
                <CardHeader className="pb-3 sm:pb-4">
                  <Quote className="w-6 h-6 sm:w-8 md:w-10 text-primary/50 mb-2" />
                  <div className="flex">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-3 h-3 sm:w-4 md:w-5",
                            i < testimonial.rating ? 'text-primary fill-primary' : 'text-muted-foreground'
                          )}
                        />
                      ))}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-xs sm:text-sm md:text-base text-foreground/80 italic mb-3 sm:mb-4">
                    "{testimonial.testimonial}"
                  </p>
                </CardContent>
                <CardFooter>
                  <div>
                    <p className="font-semibold text-sm sm:text-base text-foreground">{testimonial.name}</p>
                    {/* <p className="text-xs sm:text-sm text-primary">{testimonial.role}</p> Removed role */}
                  </div>
                </CardFooter>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

