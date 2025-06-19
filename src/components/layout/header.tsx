
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from '@/components/ui/sheet';
import useScrollSpy from '@/hooks/use-scroll-spy';
import { cn } from '@/lib/utils';

const WhatsAppIconSvg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.34 3.43 16.8L2 22L7.31 20.58C8.77 21.33 10.37 21.78 12.04 21.78C17.5 21.78 21.95 17.33 21.95 11.87C21.95 6.41 17.5 2 12.04 2ZM12.04 20.13C10.54 20.13 9.1 19.73 7.85 19.03L7.54 18.85L4.5 19.65L5.33 16.71L5.13 16.38C4.35 15.03 3.88 13.51 3.88 11.91C3.88 7.39 7.59 3.68 12.04 3.68C14.23 3.68 16.23 4.53 17.77 5.99C19.32 7.45 20.2 9.38 20.2 11.87C20.2 16.39 16.5 20.13 12.04 20.13ZM16.56 14.44C16.32 14.32 15.06 13.68 14.82 13.59C14.58 13.5 14.4 13.44 14.22 13.68C14.04 13.92 13.5 14.52 13.32 14.7C13.14 14.88 12.96 14.91 12.72 14.79C12.48 14.67 11.61 14.34 10.56 13.41C9.76 12.69 9.24 11.85 9.06 11.55C8.88 11.25 9 11.1 9.15 10.95C9.29 10.81 9.45 10.62 9.6 10.47C9.72 10.35 9.78 10.23 9.9 10.05C10.02 9.87 9.96 9.72 9.9 9.6C9.84 9.48 9.3 8.26 9.06 7.72C8.83 7.19 8.6 7.26 8.45 7.25C8.32 7.25 8.14 7.25 7.96 7.25C7.78 7.25 7.5 7.31 7.26 7.55C7.02 7.79 6.52 8.26 6.52 9.38C6.52 10.5 7.29 11.56 7.41 11.74C7.53 11.92 9.03 14.24 11.34 15.16C12.01 15.44 12.49 15.6 12.85 15.71C13.44 15.88 13.9 15.85 14.25 15.79C14.64 15.71 15.72 15.08 15.93 14.8C16.14 14.53 16.14 14.32 16.08 14.23C16.02 14.14 15.84 14.08 15.6 13.96C15.36 13.84 15.18 13.78 15.27 13.9C15.36 14.02 16.8 14.56 16.56 14.44Z" />
  </svg>
);

const NAV_ITEMS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre-nos', label: 'Sobre Nós' },
  { id: 'nossos-produtos', label: 'Produtos e Vantagens' },
  { id: 'nossa-equipe', label: 'Nossa Equipe' },
  { id: 'depoimentos', label: 'Depoimentos' },
  { id: 'trabalhe-conosco', label: 'Trabalhe Conosco'},
  { id: 'contato', label: 'Contato' },
];

const HEADER_HEIGHT = 80;

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const sectionIds = NAV_ITEMS.map(item => item.id);
  const activeSection = useScrollSpy(sectionIds, HEADER_HEIGHT);

  const kennedyPhoneNumber = "5548996785694";
  const whatsappMessage = "Olá! Gostaria de saber mais sobre os serviços da Kennedy Promotora.";
  const whatsappLink = `https://wa.me/${kennedyPhoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
  const instagramLink = "https://www.instagram.com/kennedypromotora/?e=c85d0859-4057-47d9-a11e-13b94ca8c5de&g=5";


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const targetId = href.substring(1); 
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
      const viewportVerticalPadding = window.innerHeight * 0.1;
      
      const offsetPosition = elementPosition - HEADER_HEIGHT - viewportVerticalPadding;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const NavLink = ({ href, children, id }: { href: string; children: React.ReactNode, id: string }) => (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary",
        activeSection === id ? "text-primary" : "text-foreground/80"
      )}
      onClick={(e) => handleSmoothScroll(e, href)}
    >
      {children}
    </Link>
  );
  
  const MobileNavLink = ({ href, children, id }: { href: string; children: React.ReactNode, id: string }) => (
    <SheetClose asChild>
      <Link
        href={href}
        className={cn(
          "block px-4 py-3 text-lg font-medium transition-colors hover:text-primary",
          activeSection === id ? "text-primary" : "text-foreground"
        )}
        onClick={(e) => {
          handleSmoothScroll(e, href);
        }}
      >
        {children}
      </Link>
    </SheetClose>
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "bg-background/90 shadow-lg backdrop-blur-sm" : "bg-transparent"
      )}
      style={{ height: `${HEADER_HEIGHT}px` }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex h-full items-center justify-between" aria-label="Navegação Principal">
          <Link href="#inicio" className="flex items-center gap-2 text-primary" onClick={(e) => handleSmoothScroll(e, "#inicio")}>
            <Image 
              src="/icon.png" 
              alt="Logotipo da Kennedy Promotora" 
              width={24}
              height={24}
              className="h-5 w-5 sm:h-6 sm:w-6"
              priority 
            />
            <span className="font-headline text-base sm:text-lg font-bold">Kennedy Promotora</span>
          </Link>
          
          <div className="hidden md:flex space-x-4 lg:space-x-6">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.id} href={`#${item.id}`} id={item.id}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menu de navegação">
                  <Menu className="h-6 w-6 text-primary" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] max-w-xs bg-background p-0 flex flex-col" aria-label="Menu Lateral">
                <SheetTitle className="sr-only">Menu Principal</SheetTitle>
                <div className="flex items-center justify-between p-4 border-b border-border">
                     <Link href="#inicio" className="flex items-center gap-2 text-xl font-bold text-primary" onClick={(e) => { handleSmoothScroll(e, "#inicio"); setIsMobileMenuOpen(false); }}>
                        <Image 
                          src="/icon.png" 
                          alt="Logotipo da Kennedy Promotora" 
                          width={24} 
                          height={24}
                          className="h-6 w-6"
                        />
                        <span className="font-headline">Kennedy Promotora</span>
                      </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" aria-label="Fechar menu de navegação">
                        <X className="h-6 w-6 text-primary" />
                      </Button>
                    </SheetClose>
                  </div>
                  <nav className="flex-grow py-6 space-y-2 overflow-y-auto" aria-label="Navegação do menu lateral">
                    {NAV_ITEMS.map((item) => (
                      <MobileNavLink key={item.id} href={`#${item.id}`} id={item.id}>
                        {item.label}
                      </MobileNavLink>
                    ))}
                  </nav>
                  <div className="p-4 border-t border-border">
                    <div className="flex justify-center space-x-6 mb-4">
                        <a
                          href={instagramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/70 hover:text-primary transition-colors p-2"
                          aria-label="Instagram da Kennedy Promotora"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Instagram className="w-6 h-6" />
                        </a>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground/70 hover:text-primary transition-colors p-2"
                          aria-label="WhatsApp da Kennedy Promotora"
                           onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <WhatsAppIconSvg />
                        </a>
                    </div>
                    <Button
                      variant="default"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        const contactSection = document.getElementById('contato');
                        if (contactSection) {
                           handleSmoothScroll({ preventDefault: () => {} } as React.MouseEvent<HTMLAnchorElement>, '#contato');
                        } else {
                           window.open(whatsappLink, '_blank');
                        }
                      }}
                    >
                      Fale Conosco no WhatsApp
                    </Button>
                  </div>
                </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  );
}
