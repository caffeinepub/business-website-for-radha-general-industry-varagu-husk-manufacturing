import { Heart } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_DIAL } from '@/lib/contact';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  const getAppIdentifier = () => {
    if (typeof window !== 'undefined') {
      return encodeURIComponent(window.location.hostname);
    }
    return 'unknown-app';
  };

  return (
    <footer className="bg-muted/50 border-t-2 border-border py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/generated/rgi-logo.dim_512x512.png"
                alt="Radha general Industries"
                className="h-10 w-10 object-contain"
              />
              <div>
                <div className="font-bold text-foreground">Radha general Industries</div>
                <div className="text-sm text-foreground/70 font-medium">Varagu Husk Manufacturing</div>
              </div>
            </div>
            <p className="text-sm text-foreground/70 font-medium">
              Quality millet processing for agricultural and industrial applications.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Products', 'Process', 'Contact'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => {
                      const element = document.getElementById(link.toLowerCase());
                      if (element) {
                        const offset = 80;
                        const elementPosition = element.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - offset;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className="text-sm text-foreground/70 hover:text-primary transition-colors font-medium"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-foreground/70 font-medium">
              <li>K1 Unit, SIDCO</li>
              <li>Theni, Tamil Nadu</li>
              <li className="pt-2">
                <a
                  href={PHONE_DIAL}
                  className="text-primary hover:underline font-semibold"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-foreground/70 font-medium">
            © {currentYear} Radha general Industries. All rights reserved.
          </p>
          <p className="text-sm text-foreground/70 flex items-center gap-1 font-medium">
            Built with <Heart className="h-4 w-4 text-destructive fill-destructive" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${getAppIdentifier()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
