
"use client";

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  animationClassName?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export default function AnimatedSection({ 
  children, 
  className, 
  as: Element = 'div', 
  animationClassName = 'animate-section-on-scroll',
  threshold = 0.1,
  triggerOnce = true,
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce && ref.current) {
              observer.unobserve(ref.current);
            }
          } else if (!triggerOnce) {
            // setIsVisible(false); // Uncomment if you want animation to reverse when out of view
          }
        });
      },
      { threshold }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, triggerOnce]);

  return (
    <Element ref={ref as any} className={cn(className, animationClassName, { 'is-visible': isVisible })}>
      {children}
    </Element>
  );
}
