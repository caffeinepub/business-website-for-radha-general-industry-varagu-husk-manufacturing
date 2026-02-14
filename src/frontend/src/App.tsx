import { SiteHeader } from './components/SiteHeader';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { ProductsSection } from './components/sections/ProductsSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { ContactSection } from './components/sections/ContactSection';
import { SiteFooter } from './components/SiteFooter';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <ProcessSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </div>
  );
}

export default App;
