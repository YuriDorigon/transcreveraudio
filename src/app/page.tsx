
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import HeroSection from '@/components/sections/hero-section';
import AboutUsSection from '@/components/sections/about-us-section';
import ProductsSection from '@/components/sections/products-section';
import OurTeamSection from '@/components/sections/our-team-section';
import TestimonialsSection from '@/components/sections/testimonials-section';
import WorkWithUsSection from '@/components/sections/work-with-us-section';
import ContactSection from '@/components/sections/contact-section';
import WhatsAppButton from '@/components/whatsapp-button';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutUsSection />
        <ProductsSection /> 
        <OurTeamSection />
        <TestimonialsSection />
        <WorkWithUsSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
