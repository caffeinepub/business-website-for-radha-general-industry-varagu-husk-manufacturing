import { Calculator } from 'lucide-react';
import { LoginButton } from './auth/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function SiteHeader() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Calculator className="h-8 w-8 text-primary" />
            <div>
              <div className="font-bold text-xl leading-tight text-foreground">
                Salary Calculator
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Attendance-Based Payroll System
              </div>
            </div>
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <LoginButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
