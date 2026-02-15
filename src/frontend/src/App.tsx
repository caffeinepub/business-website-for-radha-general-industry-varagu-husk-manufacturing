import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { SalarySplitCalculator } from './components/salary/SalarySplitCalculator';
import { FinalSalaryWorkflow } from './components/salary/FinalSalaryWorkflow';
import { Separator } from './components/ui/separator';
import { LoginButton } from './components/auth/LoginButton';
import { ProfileSetupDialog } from './components/auth/ProfileSetupDialog';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useCurrentUserProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { LogIn } from 'lucide-react';

const queryClient = new QueryClient();

function AppContent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome to Salary Calculator</CardTitle>
              <CardDescription>
                Please log in to access the salary calculator and staff management features
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <LoginButton />
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1">
        <SalarySplitCalculator />
        
        <div className="w-full max-w-6xl mx-auto px-4 py-8">
          <Separator className="my-8" />
        </div>
        
        <FinalSalaryWorkflow />
      </main>

      <SiteFooter />
      
      {showProfileSetup && <ProfileSetupDialog />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
