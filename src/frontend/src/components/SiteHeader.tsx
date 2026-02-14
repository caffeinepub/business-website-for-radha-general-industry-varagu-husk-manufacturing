import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_DIAL } from '@/lib/contact';

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Products', id: 'products' },
    { label: 'Process', id: 'process' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/98 backdrop-blur-md shadow-lg border-b border-border' : 'bg-background/95 backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20 px-4">
          {/* Logo */}
          <button
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/rgi-logo.dim_512x512.png"
              alt="Radha general Industries"
              className="h-12 w-12 object-contain"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-lg leading-tight text-foreground">
                Radha general Industries
              </div>
              <div className="text-xs text-foreground/70 font-medium">Varagu Husk Manufacturing</div>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 text-sm font-semibold text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent/50"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Call Now Button - Desktop */}
          <a
            href={PHONE_DIAL}
            className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-soft hover:shadow-medium"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border shadow-lg">
            <nav className="flex flex-col py-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-6 py-3 text-left text-foreground font-medium hover:bg-accent transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <a
                href={PHONE_DIAL}
                className="mx-6 mt-4 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-soft"
              >
                <Phone className="h-4 w-4" />
                Call Now: {PHONE_DISPLAY}
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
