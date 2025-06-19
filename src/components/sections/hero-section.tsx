
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const HEADER_HEIGHT = 80;

const mainTitleLine1 = "Realize Seus Sonhos";
const mainTitleLine2 = "Com Kennedy Promotora";
const subTitleText = "Soluções de crédito personalizadas para você alcançar seus objetivos financeiros com segurança e agilidade.";
const ctaButtonText = "Fale Conosco";

const typingSpeed = 50; 
const delayAfterLine1Typing = 150; 
const delayAfterLine2Reveal = 100; 
const delayAfterSubtitleReveal = 100;
const cursorBlinkSpeed = 0.35; 
const titleWordAnimationDuration = 0.3;
const subtitleAnimationDuration = 0.4;
const buttonAnimationDuration = 0.3;
const imageFadeInDuration = 0.8;
const arrowAnimationDelay = subtitleAnimationDuration + buttonAnimationDuration + 0.2;


export default function HeroSection() {
  const [displayedLine1, setDisplayedLine1] = React.useState("");
  const [isTypingLine1Complete, setIsTypingLine1Complete] = React.useState(false);
  const [showCursor, setShowCursor] = React.useState(true);
  const [showLine2, setShowLine2] = React.useState(false);
  const [showSubtitle, setShowSubtitle] = React.useState(false);
  const [showButton, setShowButton] = React.useState(false);

  React.useEffect(() => {
    if (displayedLine1.length < mainTitleLine1.length) {
      setShowCursor(true);
      const timeoutId = setTimeout(() => {
        setDisplayedLine1(mainTitleLine1.substring(0, displayedLine1.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeoutId);
    } else {
      setIsTypingLine1Complete(true);
      const cursorTimeout = setTimeout(() => setShowCursor(false), cursorBlinkSpeed * 1000 * 2); 
      const line2TimeoutId = setTimeout(() => {
        setShowLine2(true);
      }, delayAfterLine1Typing);
      return () => {
        clearTimeout(cursorTimeout);
        clearTimeout(line2TimeoutId);
      };
    }
  }, [displayedLine1]);

  React.useEffect(() => {
    if (isTypingLine1Complete && showLine2) { 
      const subtitleTimeoutId = setTimeout(() => {
        setShowSubtitle(true);
      }, delayAfterLine2Reveal);
      return () => clearTimeout(subtitleTimeoutId);
    }
  }, [isTypingLine1Complete, showLine2]);
  
  React.useEffect(() => {
    if (showSubtitle) {
      const buttonTimeoutId = setTimeout(() => {
        setShowButton(true);
      }, delayAfterSubtitleReveal);
      return () => clearTimeout(buttonTimeoutId);
    }
  }, [showSubtitle]);

  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - HEADER_HEIGHT;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };
  
  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: subtitleAnimationDuration, ease: "easeOut" }
    },
  };
  
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: buttonAnimationDuration, ease: "easeOut", type: "spring", stiffness: 120 }
    },
  };

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex flex-col items-center justify-center text-center bg-background text-foreground overflow-hidden px-4 py-20"
      aria-labelledby="hero-heading"
    >
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: imageFadeInDuration, ease: "easeIn" }}
      >
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="Imagem de fundo abstrata e elegante com tons dourados e escuros, simbolizando sofisticação financeira."
          fill // Changed from layout="fill"
          objectFit="cover"
          quality={75} 
          priority // Crucial for LCP
          className="opacity-20" 
          data-ai-hint="abstract geometric gold dark luxury"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background"></div>
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial="hidden"
        animate="visible" 
      >
        <h1 
          id="hero-heading"
          className={cn(
            "font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-3 sm:mb-4 leading-tight tracking-tight"
          )}
        >
          <span className="inline-block min-h-[1.2em] sm:min-h-[1.3em] bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/70">
            {displayedLine1}
            <AnimatePresence>
              {showCursor && (
                <motion.span
                  className="inline-block w-[3px] sm:w-1 h-[0.9em] ml-1 bg-primary align-text-bottom"
                  style={{ animation: `blink-cursor ${cursorBlinkSpeed * 2}s infinite step-end` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: cursorBlinkSpeed / 2 }}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
          </span>
          <AnimatePresence>
            {showLine2 && (
              <motion.span 
                className="block mt-1 sm:mt-2 font-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary/70"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: titleWordAnimationDuration, ease: "easeOut" }}
              >
                {mainTitleLine2}
              </motion.span>
            )}
          </AnimatePresence>
        </h1>

        <AnimatePresence>
          {showSubtitle && (
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-foreground/90 max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-10"
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0 }}
            >
              {subTitleText}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showButton && (
             <motion.div 
                variants={buttonVariants} 
                initial="hidden" 
                animate="visible" 
                exit={{ opacity: 0 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.95 }}
              >
              <Button
                asChild
                size="lg"
                className={cn(
                  "text-md sm:text-lg px-8 sm:px-12 py-3 sm:py-5 rounded-xl shadow-lg motion-safe:animate-subtle-pulse",
                  "bg-primary text-primary-foreground hover:bg-primary/90 transform transition-all duration-300 ease-out",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <Link href="#contato" onClick={(e) => handleSmoothScroll(e, "#contato")}>
                  <MessageCircle className="mr-2 h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  {ctaButtonText}
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: arrowAnimationDelay }}
            className="absolute bottom-8 sm:bottom-10 w-full flex justify-center z-10"
          >
            <Link href="#sobre-nos" aria-label="Rolar para a seção Sobre Nós" onClick={(e) => handleSmoothScroll(e, "#sobre-nos")}>
              <motion.div
                animate={{ y: [0, -5, 0, -3, 0] }} 
                transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
              >
                <ArrowDown className="w-7 h-7 sm:w-8 sm:h-8 text-primary hover:text-accent transition-colors" />
              </motion.div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="absolute bottom-0 left-0 w-full h-16 sm:h-20 md:h-24 z-0 overflow-hidden" aria-hidden="true">
        <svg viewBox="0 0 1440 100" preserveAspectRatio="none" fill="hsl(var(--background))" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 60C158 -20 280 120 480 100C680 80 800 -20 960 20C1120 60 1280 100 1440 60V100H0V60Z" />
        </svg>
      </div>
    </section>
  );
}
