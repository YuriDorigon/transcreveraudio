
"use client";

import AnimatedSection from '@/components/animated-section';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import type { Employee } from '@/types/employee';
import { useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DEFAULT_PLACEHOLDER_URL = `https://placehold.co/300x300.png`;
const INITIAL_MEMBERS_DISPLAY_COUNT = 3;
const MEDIUM_BREAKPOINT = 768;

const isDataUrl = (str: string | undefined): boolean => {
  if (!str) return false;
  return str.startsWith('data:image');
}
const isHttpUrl = (str: string | undefined): boolean => {
  if (!str) return false;
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

interface TeamMemberCardProps {
  member: Employee;
  animationDelay: string;
}

const TeamMemberCard = ({ member, animationDelay }: TeamMemberCardProps) => (
  <AnimatedSection className={animationDelay}>
    <Card className="text-center bg-card border-border/50 shadow-xl hover:shadow-primary/20 transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="pt-6 sm:pt-8">
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden border-4 border-primary mb-3 sm:mb-4">
          <Image
            src={(isDataUrl(member.photoUrl) || isHttpUrl(member.photoUrl)) && member.photoUrl ? member.photoUrl : DEFAULT_PLACEHOLDER_URL}
            alt={`Foto de ${member.name}, ${member.role} na Kennedy Promotora.`}
            width={112} // Intrinsic width of the image for aspect ratio calculation
            height={112} // Intrinsic height
            className="object-cover w-full h-full" // Styles for display
            loading="lazy"
            data-ai-hint="person portrait"
            unoptimized={isDataUrl(member.photoUrl)}
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_PLACEHOLDER_URL; }}
          />
        </div>
        <CardTitle className="text-lg md:text-xl font-semibold text-foreground">{member.name}</CardTitle>
        <CardDescription className="text-sm md:text-base text-primary">{member.role}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow px-4 pb-6 sm:px-6 sm:pb-8">
        <p className="text-sm text-foreground/70">
          {member.description}
        </p>
      </CardContent>
    </Card>
  </AnimatedSection>
);

export default function OurTeamSection() {
  const [teamMembers, setTeamMembers] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [showAllOnSmallScreens, setShowAllOnSmallScreens] = useState(false);
  const [isMediumScreenOrLarger, setIsMediumScreenOrLarger] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMediumScreenOrLarger(window.innerWidth >= MEDIUM_BREAKPOINT);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize, { passive: true });
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);


  const fetchTeamMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "employees"), orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const members: Employee[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        members.push({
            id: doc.id,
            ...data,
            photoUrl: data.photoUrl || DEFAULT_PLACEHOLDER_URL, 
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
         } as Employee);
      });
      setTeamMembers(members);
    } catch (error: any) {
      console.error("Erro detalhado ao buscar membros da equipe: ", error);
      let errorMessage = `Falha ao buscar membros da equipe: ${error.message || 'Erro desconhecido.'}`;
      if (error.code) {
        console.error("Código do Erro Firebase:", error.code);
        errorMessage = `Falha ao buscar membros da equipe (${error.code}): ${error.message}.`;
      }
      toast({
        title: "Erro ao Carregar Equipe",
        description: `${errorMessage}`,
        variant: "destructive",
        duration: 15000
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  if (isLoading) {
    return (
      <section id="nossa-equipe" className="py-16 md:py-24 bg-background/95" aria-labelledby="our-team-heading-loading">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p id="our-team-heading-loading" className="text-muted-foreground">Carregando equipe...</p>
        </div>
      </section>
    );
  }

  let displayedItems;
  if (isMediumScreenOrLarger) {
    displayedItems = teamMembers;
  } else {
    if (teamMembers.length <= INITIAL_MEMBERS_DISPLAY_COUNT) {
      displayedItems = teamMembers;
    } else {
      displayedItems = showAllOnSmallScreens ? teamMembers : teamMembers.slice(0, INITIAL_MEMBERS_DISPLAY_COUNT);
    }
  }
  
  const showButton = !isMediumScreenOrLarger && teamMembers.length > INITIAL_MEMBERS_DISPLAY_COUNT;

  return (
    <section id="nossa-equipe" className="py-16 md:py-24 bg-background/95" aria-labelledby="our-team-heading">
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 id="our-team-heading" className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-primary">Nossa Equipe</h2>
          {teamMembers.length === 0 && !isLoading ? (
            <p className="text-center text-muted-foreground py-10">Nenhum membro da equipe cadastrado no momento.</p>
          ) : (
             <p className="text-base sm:text-lg md:text-xl text-center text-foreground/80 mb-12 max-w-3xl mx-auto">
                Conheça nossa equipe, dedicada a encontrar a melhor solução financeira para você.
             </p>
          )}
        </AnimatedSection>

        {teamMembers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayedItems.map((member, index) => (
                <TeamMemberCard
                key={member.id}
                member={member}
                animationDelay={`[--animation-delay:${index * 100}ms]`}
                />
            ))}
            </div>
        )}

        {showButton && (
          <AnimatedSection className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setShowAllOnSmallScreens(!showAllOnSmallScreens)}
              className="border-primary text-primary hover:bg-primary/10 hover:text-primary transition-all duration-300 ease-in-out group"
              aria-expanded={showAllOnSmallScreens}
            >
              {showAllOnSmallScreens ? (
                <>
                  Ver Menos <ChevronUp className="ml-2 h-5 w-5 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
                </>
              ) : (
                <>
                  Ver Mais <ChevronDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
                </>
              )}
            </Button>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
