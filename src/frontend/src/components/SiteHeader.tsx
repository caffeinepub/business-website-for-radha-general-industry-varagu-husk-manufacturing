import { Calculator } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-center h-16 px-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            <div>
              <div className="font-bold text-xl leading-tight text-foreground">
                Salary Split Calculator
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Calculate Basic, DA & Other Components
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
