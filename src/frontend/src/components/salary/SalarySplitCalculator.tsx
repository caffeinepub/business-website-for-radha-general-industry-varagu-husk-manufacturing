import { Calculator, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useSalarySplit, type CalculationMode } from '@/hooks/useSalarySplit';
import { formatCurrency } from '@/lib/currency';
import { TamilNaduHotelRuleConfigComponent } from './TamilNaduHotelRuleConfig';
import { HOTEL_DESIGNATIONS } from '@/lib/hotelDesignations';
import type { Zone } from '@/lib/zoneDesignationBasicConfig';

export function SalarySplitCalculator() {
  const {
    selectedZone,
    salaryState,
    calculation,
    mode,
    tnHotelRule,
    selectedDesignation,
    autoFillMessage,
    autoApplyBasic50,
    updateZone,
    updateGrossSalary,
    updateBasic,
    updateDA,
    updateMode,
    updateTnHotelRule,
    updateDesignation,
    toggleAutoApplyBasic50,
    reset,
  } = useSalarySplit();

  const hasValues = salaryState.basic !== '' || salaryState.da !== '';

  const handleModeChange = (value: string) => {
    updateMode(value as CalculationMode);
  };

  const handleZoneChange = (value: string) => {
    updateZone(value as Zone);
  };

  const handleDesignationChange = (value: string) => {
    updateDesignation(value === 'none' ? null : (value as any));
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Calculator className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-foreground">Salary Split Calculator</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Calculate your salary breakdown: Basic, DA, and Other components
        </p>
      </div>

      {/* Zone Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Zone</CardTitle>
          <CardDescription>Choose the applicable zone for salary calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedZone} onValueChange={handleZoneChange} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="A">Zone A</TabsTrigger>
              <TabsTrigger value="B">Zone B</TabsTrigger>
              <TabsTrigger value="C">Zone C</TabsTrigger>
              <TabsTrigger value="D">Zone D</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="tn-hotel-rule">Tamil Nadu Hotel Rule</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Manual Input Form */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Details - Zone {selectedZone}</CardTitle>
                <CardDescription>Enter your gross salary and component amounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Designation Selector */}
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-base font-semibold">
                    Designation
                  </Label>
                  <Select value={selectedDesignation || 'none'} onValueChange={handleDesignationChange}>
                    <SelectTrigger id="designation" className="h-12">
                      <SelectValue placeholder="Select designation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">-- Select Designation --</SelectItem>
                      {HOTEL_DESIGNATIONS.map((designation) => (
                        <SelectItem key={designation} value={designation}>
                          {designation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedDesignation && (
                    <p className="text-xs text-muted-foreground">
                      Basic will be auto-filled based on designation
                    </p>
                  )}
                </div>

                {autoFillMessage && (
                  <Alert>
                    <AlertDescription>{autoFillMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="grossSalary" className="text-base font-semibold">
                    Gross Salary (Fixed)
                  </Label>
                  <Input
                    id="grossSalary"
                    type="text"
                    value={salaryState.grossSalary}
                    className="text-lg h-12 bg-muted/50"
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Gross salary is fixed at ₹8,419 for all zones
                  </p>
                </div>

                {/* Auto-apply Basic 50% Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBasic" className="text-base font-medium">
                      Auto-apply Basic 50%
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically calculate Basic as 50% of Gross Salary
                    </p>
                  </div>
                  <Switch
                    id="autoBasic"
                    checked={autoApplyBasic50}
                    onCheckedChange={toggleAutoApplyBasic50}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basic" className="text-base font-semibold">
                    Basic Salary
                    {autoApplyBasic50 && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        (Auto-calculated)
                      </span>
                    )}
                  </Label>
                  <Input
                    id="basic"
                    type="number"
                    placeholder="0.00"
                    value={salaryState.basic}
                    onChange={(e) => updateBasic(e.target.value)}
                    className="text-lg h-12"
                    min="0"
                    step="0.01"
                    readOnly={autoApplyBasic50}
                    disabled={autoApplyBasic50}
                  />
                  {autoApplyBasic50 && (
                    <p className="text-xs text-muted-foreground">
                      Turn off auto-apply to edit manually
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="da" className="text-base font-semibold">
                    Dearness Allowance (DA) - Fixed
                  </Label>
                  <Input
                    id="da"
                    type="text"
                    value={formatCurrency(parseFloat(salaryState.da))}
                    className="text-lg h-12 bg-muted/50"
                    readOnly
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    DA is fixed at ₹8,419 for all zones
                  </p>
                </div>

                {calculation.errorMessage && (
                  <Alert variant="destructive">
                    <AlertDescription>{calculation.errorMessage}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={reset}
                  variant="outline"
                  className="w-full"
                  disabled={!hasValues}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Zone {selectedZone}
                </Button>
              </CardContent>
            </Card>

            {/* Salary Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Breakdown</CardTitle>
                <CardDescription>Your salary components for Zone {selectedZone}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-base font-medium text-muted-foreground">Gross Salary</span>
                    <span className="text-xl font-bold text-foreground">
                      {formatCurrency(calculation.grossSalary)}
                    </span>
                  </div>

                  <div className="space-y-3 p-4 bg-background border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Basic Salary</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(calculation.basic)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Dearness Allowance (DA)</span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(calculation.da)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">Other Components</span>
                      <span className="text-lg font-semibold text-accent-foreground">
                        {formatCurrency(calculation.other)}
                      </span>
                    </div>
                  </div>

                  {calculation.isValid && (
                    <Alert className="bg-primary/10 border-primary/20">
                      <AlertDescription className="text-foreground">
                        ✓ Salary breakdown is valid and ready to use
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="text-sm font-semibold text-foreground mb-2">Formula</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Gross Salary = ₹8,419 (Fixed)</div>
                    <div>DA = ₹8,419 (Fixed)</div>
                    <div>Other = Gross Salary - Basic - DA</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tn-hotel-rule" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* TN Hotel Rule Configuration */}
            <TamilNaduHotelRuleConfigComponent
              config={tnHotelRule}
              onConfigChange={updateTnHotelRule}
              hasError={!calculation.isValid && calculation.errorMessage !== ''}
              errorMessage={calculation.errorMessage}
              selectedDesignation={selectedDesignation}
              onDesignationChange={handleDesignationChange}
              autoFillMessage={autoFillMessage}
            />

            {/* Salary Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Breakdown</CardTitle>
                <CardDescription>
                  Calculated using Tamil Nadu Hotel Rule for Zone {selectedZone}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <span className="text-base font-medium text-muted-foreground">Gross Salary</span>
                    <span className="text-xl font-bold text-foreground">
                      {formatCurrency(calculation.grossSalary)}
                    </span>
                  </div>

                  <div className="space-y-3 p-4 bg-background border rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Basic Salary ({tnHotelRule.basicPercentage}%)
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(calculation.basic)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Dearness Allowance (DA) - Fixed
                      </span>
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(calculation.da)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="text-sm text-muted-foreground">Other Components</span>
                      <span className="text-lg font-semibold text-accent-foreground">
                        {formatCurrency(calculation.other)}
                      </span>
                    </div>
                  </div>

                  {calculation.isValid && (
                    <Alert className="bg-primary/10 border-primary/20">
                      <AlertDescription className="text-foreground">
                        ✓ Salary breakdown is valid and ready to use
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="text-sm font-semibold text-foreground mb-2">Formula</div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Gross Salary = ₹8,419 (Fixed)</div>
                    <div>Basic = ₹8,419 × {tnHotelRule.basicPercentage}%</div>
                    <div>DA = ₹8,419 (Fixed)</div>
                    <div>Other = ₹8,419 - Basic - DA</div>
                  </div>
                </div>

                <Button
                  onClick={reset}
                  variant="outline"
                  className="w-full"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Zone {selectedZone}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
