import { Heart } from 'lucide-react';

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  
  const getAppIdentifier = () => {
    if (typeof window !== 'undefined') {
      return encodeURIComponent(window.location.hostname);
    }
    return 'unknown-app';
  };

  return (
    <footer className="bg-white border-t border-border py-8">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground font-medium">
            © {currentYear} Salary Split Calculator. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 font-medium">
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
