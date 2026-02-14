import { Phone, MapPin } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_DIAL } from '@/lib/contact';

export function HeroSection() {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 bg-white">
      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-block px-4 py-2 bg-accent rounded-full text-sm font-semibold text-accent-foreground mb-6 shadow-soft">
            Quality Millet Processing Since Establishment
          </div>
          
          <h1 className="mb-6 text-foreground font-bold">
            Premium Varagu Husk Manufacturing
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/80 mb-8 leading-relaxed font-medium">
            Radha general Industries specializes in processing high-quality kodo millet (varagu) husk for agricultural and industrial applications across Tamil Nadu.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href={PHONE_DIAL}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold text-lg hover:bg-primary/90 transition-all shadow-medium hover:shadow-lg"
            >
              <Phone className="h-5 w-5" />
              Call: {PHONE_DISPLAY}
            </a>
            <button
              onClick={scrollToContact}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-secondary text-secondary-foreground rounded-lg font-semibold text-lg hover:bg-secondary/90 transition-all border-2 border-border shadow-soft"
            >
              Get in Touch
            </button>
          </div>

          <div className="flex items-start gap-3 p-5 bg-card rounded-lg border-2 border-border shadow-medium">
            <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
            <div>
              <div className="font-semibold text-card-foreground text-lg">Our Location</div>
              <div className="text-card-foreground/70 font-medium">K1 Unit, SIDCO, Theni, Tamil Nadu</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
