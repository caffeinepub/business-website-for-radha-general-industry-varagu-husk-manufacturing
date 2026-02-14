import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { SalarySplitCalculator } from './components/salary/SalarySplitCalculator';
import { FinalSalaryWorkflow } from './components/salary/FinalSalaryWorkflow';
import { Separator } from './components/ui/separator';

function App() {
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
    </div>
  );
}

export default App;
