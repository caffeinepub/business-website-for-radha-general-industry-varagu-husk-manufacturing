import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';
import type { TamilNaduHotelRuleConfig } from '@/hooks/useSalarySplit';
import type { HotelDesignation } from '@/lib/hotelDesignations';
import { HOTEL_DESIGNATIONS } from '@/lib/hotelDesignations';
import { formatCurrency } from '@/lib/currency';

interface TamilNaduHotelRuleConfigProps {
  config: TamilNaduHotelRuleConfig;
  onConfigChange: (config: Partial<TamilNaduHotelRuleConfig>) => void;
  hasError: boolean;
  errorMessage: string;
  selectedDesignation: HotelDesignation | null;
  onDesignationChange: (value: string) => void;
  autoFillMessage: string;
}

export function TamilNaduHotelRuleConfigComponent({
  config,
  onConfigChange,
  hasError,
  errorMessage,
  selectedDesignation,
  onDesignationChange,
  autoFillMessage,
}: TamilNaduHotelRuleConfigProps) {
  const handleBasicPercentageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 100)) {
      onConfigChange({ basicPercentage: numValue || 0 });
    }
  };

  // Fixed DA amount
  const FIXED_DA = 8419;
  const FIXED_GROSS = 8419;

  // Calculate other percentage based on Basic percentage and fixed DA
  const basicAmount = (FIXED_GROSS * config.basicPercentage) / 100;
  const otherAmount = FIXED_GROSS - basicAmount - FIXED_DA;
  const otherPercentage = (otherAmount / FIXED_GROSS) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tamil Nadu Hotel Rule Configuration</CardTitle>
        <CardDescription>
          Configure the Basic percentage. DA is fixed at ₹8,419.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Designation Selector */}
        <div className="space-y-2">
          <Label htmlFor="tn-designation" className="text-base font-semibold">
            Designation
          </Label>
          <Select value={selectedDesignation || 'none'} onValueChange={onDesignationChange}>
            <SelectTrigger id="tn-designation" className="h-12">
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
              Basic percentage will be auto-filled based on designation
            </p>
          )}
        </div>

        {autoFillMessage && (
          <Alert>
            <AlertDescription>{autoFillMessage}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            DA is fixed at ₹8,419 for all zones and designations. Only Basic percentage can be configured.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="basicPercentage" className="text-base font-semibold">
            Basic Percentage
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id="basicPercentage"
              type="number"
              placeholder="50"
              value={config.basicPercentage}
              onChange={(e) => handleBasicPercentageChange(e.target.value)}
              className="text-lg h-12"
              min="0"
              max="100"
              step="0.1"
            />
            <span className="text-lg font-semibold text-muted-foreground">%</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-base font-semibold">
            Dearness Allowance (DA) - Fixed
          </Label>
          <Input
            type="text"
            value={formatCurrency(FIXED_DA)}
            className="text-lg h-12 bg-muted/50"
            readOnly
            disabled
          />
          <p className="text-xs text-muted-foreground">
            DA is fixed at ₹8,419 and cannot be changed
          </p>
        </div>

        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <div className="text-sm font-semibold text-foreground mb-3">Amount Breakdown</div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Gross Salary</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(FIXED_GROSS)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Basic ({config.basicPercentage}%)</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(basicAmount)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">DA (Fixed)</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(FIXED_DA)}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Other ({otherPercentage.toFixed(1)}%)</span>
            <span className="text-sm font-semibold text-accent-foreground">
              {formatCurrency(otherAmount)}
            </span>
          </div>
        </div>

        {hasError && (
          <Alert variant="destructive">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="text-sm text-muted-foreground mb-2">Formula</div>
          <div className="space-y-1 text-sm font-mono text-foreground">
            <div>Gross Salary = ₹8,419 (Fixed)</div>
            <div>Basic = ₹8,419 × {config.basicPercentage}%</div>
            <div>DA = ₹8,419 (Fixed)</div>
            <div>Other = ₹8,419 - Basic - DA</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
