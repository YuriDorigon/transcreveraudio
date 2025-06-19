
"use client";

import { useState, useEffect, useCallback } from 'react';

const useScrollSpy = (sectionIds: string[], offset = 0) => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + offset + (window.innerHeight / 2); // Adjusted to be more centered
    let currentActiveSection: string | null = null;

    for (const id of sectionIds) {
      const element = document.getElementById(id);
      if (element) {
        const elementTop = element.offsetTop;
        const elementBottom = elementTop + element.offsetHeight;
        if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
          currentActiveSection = id;
          break;
        }
      }
    }
    
    // If no section is "active" (e.g. in between sections, or at the very top/bottom)
    // keep the last active one or set to the first one if at top.
    if (!currentActiveSection && sectionIds.length > 0) {
      if (window.scrollY < offset + (document.getElementById(sectionIds[0])?.offsetTop ?? 0)) {
        currentActiveSection = sectionIds[0];
      }
    }


    setActiveSection(currentActiveSection);
  }, [sectionIds, offset]);

  useEffect(() => {
    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return activeSection;
};

export default useScrollSpy;
