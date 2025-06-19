
"use client";

import AnimatedSection from '@/components/animated-section';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Briefcase } from 'lucide-react';
import WorkWithUsForm from '@/components/work-with-us-form';
import { useState } from 'react';

export default function WorkWithUsSection() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <section id="trabalhe-conosco" className="py-16 md:py-24 bg-card text-card-foreground">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-primary">
            Trabalhe Conosco
          </h2>
          <p className="text-lg sm:text-xl text-center text-foreground/80 mb-12 max-w-3xl mx-auto">
            Faça parte da nossa equipe! Se você é apaixonado por ajudar pessoas a realizar sonhos e busca um ambiente dinâmico e colaborativo, queremos conhecer você.
          </p>
        </AnimatedSection>

        <AnimatedSection className="text-center [--animation-delay:100ms]">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-lg shadow-lg transition-transform hover:scale-105">
                <Briefcase className="mr-2 h-5 w-5" />
                Envie seu Currículo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-background text-foreground border-border">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-semibold text-primary">Formulário de Candidatura</DialogTitle>
                <DialogDescription className="text-sm sm:text-base text-foreground/80">
                  Preencha os campos abaixo para se candidatar a uma vaga na Kennedy Promotora.
                </DialogDescription>
              </DialogHeader>
              <WorkWithUsForm setDialogOpen={setIsDialogOpen} />
            </DialogContent>
          </Dialog>
        </AnimatedSection>
      </div>
    </section>
  );
}
