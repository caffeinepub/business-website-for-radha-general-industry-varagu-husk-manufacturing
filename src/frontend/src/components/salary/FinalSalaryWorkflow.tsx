import { useState } from 'react';
import { Calculator, Send, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useFinalSalary } from '@/hooks/useFinalSalary';
import { formatCurrency } from '@/lib/currency';
import {
  generateFinalSalaryMessage,
  generateWhatsAppLink,
  generateSMSLink,
  type FinalSalaryMessageData,
} from '@/lib/finalSalaryMessage';

export function FinalSalaryWorkflow() {
  const {
    formState,
    calculation,
    finalizedEmployees,
    selectedEmployeeId,
    updateField,
    finalizeEmployee,
    resetForm,
    deleteEmployee,
    getEmployeeById,
    setSelectedEmployeeId,
  } = useFinalSalary();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleFinalize = () => {
    const employee = finalizeEmployee();
    if (employee) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSendWhatsApp = (employeeId: string) => {
    const employee = getEmployeeById(employeeId);
    if (!employee) return;

    const earnedSalary = (employee.grossSalary / employee.totalDaysInMonth) * employee.workingDays;
    const totalDeductions = employee.salaryAdvance + employee.pfDeduction + employee.esiDeduction;
    const finalPay = earnedSalary - totalDeductions;

    const messageData: FinalSalaryMessageData = {
      employee,
      earnedSalary,
      totalDeductions,
      finalPay,
    };

    const whatsappUrl = generateWhatsAppLink(messageData);
    window.open(whatsappUrl, '_blank');
  };

  const handleSendSMS = (employeeId: string) => {
    const employee = getEmployeeById(employeeId);
    if (!employee) return;

    const earnedSalary = (employee.grossSalary / employee.totalDaysInMonth) * employee.workingDays;
    const totalDeductions = employee.salaryAdvance + employee.pfDeduction + employee.esiDeduction;
    const finalPay = earnedSalary - totalDeductions;

    const messageData: FinalSalaryMessageData = {
      employee,
      earnedSalary,
      totalDeductions,
      finalPay,
    };

    const smsUrl = generateSMSLink(messageData);
    window.location.href = smsUrl;
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Calculator className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Final Salary Calculator</h2>
        </div>
        <p className="text-muted-foreground">
          Calculate final salary with PF, ESI, working days, and advance deductions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
            <CardDescription>Enter employee information and salary details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Employee Name (Optional)</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter employee name"
                value={formState.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-base font-semibold">
                Mobile Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="10-digit mobile number"
                value={formState.mobile}
                onChange={(e) => updateField('mobile', e.target.value)}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">Required for sending salary details</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pfNumber">PF Number</Label>
                <Input
                  id="pfNumber"
                  type="text"
                  placeholder="PF number"
                  value={formState.pfNumber}
                  onChange={(e) => updateField('pfNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="esiNumber">ESI Number</Label>
                <Input
                  id="esiNumber"
                  type="text"
                  placeholder="ESI number"
                  value={formState.esiNumber}
                  onChange={(e) => updateField('esiNumber', e.target.value)}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="grossSalary" className="text-base font-semibold">
                Gross Salary (Monthly)
              </Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="8419"
                value={formState.grossSalary}
                onChange={(e) => updateField('grossSalary', e.target.value)}
                className="text-lg"
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workingDays">Working Days</Label>
                <Input
                  id="workingDays"
                  type="number"
                  placeholder="0"
                  value={formState.workingDays}
                  onChange={(e) => updateField('workingDays', e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalDays">Total Days in Month</Label>
                <Input
                  id="totalDays"
                  type="number"
                  placeholder="30"
                  value={formState.totalDaysInMonth}
                  onChange={(e) => updateField('totalDaysInMonth', e.target.value)}
                  min="1"
                  step="1"
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="salaryAdvance">Salary Advance</Label>
              <Input
                id="salaryAdvance"
                type="number"
                placeholder="0.00"
                value={formState.salaryAdvance}
                onChange={(e) => updateField('salaryAdvance', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pfDeduction">PF Deduction</Label>
                <Input
                  id="pfDeduction"
                  type="number"
                  placeholder="0.00"
                  value={formState.pfDeduction}
                  onChange={(e) => updateField('pfDeduction', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="esiDeduction">ESI Deduction</Label>
                <Input
                  id="esiDeduction"
                  type="number"
                  placeholder="0.00"
                  value={formState.esiDeduction}
                  onChange={(e) => updateField('esiDeduction', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {calculation.errorMessage && (
              <Alert variant="destructive">
                <AlertDescription>{calculation.errorMessage}</AlertDescription>
              </Alert>
            )}

            {showSuccess && (
              <Alert className="bg-primary/10 border-primary/20">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <AlertDescription className="text-primary">
                  Employee finalized successfully! You can now send the salary details.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleFinalize}
                disabled={!calculation.isValid}
                className="flex-1"
              >
                Finalize Salary
              </Button>
              <Button onClick={resetForm} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Calculation Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Salary Calculation</CardTitle>
              <CardDescription>Final pay breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-muted-foreground">Gross Salary</span>
                  <span className="text-lg font-semibold">
                    {formatCurrency(parseFloat(formState.grossSalary) || 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="font-medium text-muted-foreground">
                    Working Days ({formState.workingDays || 0} / {formState.totalDaysInMonth || 30})
                  </span>
                  <span className="text-lg font-semibold text-primary">
                    {formatCurrency(calculation.earnedSalary)}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2 pl-4 border-l-4 border-destructive">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Salary Advance</span>
                    <span className="font-medium text-destructive">
                      - {formatCurrency(parseFloat(formState.salaryAdvance) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">PF Deduction</span>
                    <span className="font-medium text-destructive">
                      - {formatCurrency(parseFloat(formState.pfDeduction) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ESI Deduction</span>
                    <span className="font-medium text-destructive">
                      - {formatCurrency(parseFloat(formState.esiDeduction) || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border">
                    <span className="font-medium text-muted-foreground">Total Deductions</span>
                    <span className="font-semibold text-destructive">
                      - {formatCurrency(calculation.totalDeductions)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <span className="text-lg font-bold text-foreground">Final Pay</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(calculation.finalPay)}
                  </span>
                </div>
              </div>

              {calculation.isValid && (
                <div className="mt-4 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground space-y-1">
                  <div className="font-semibold mb-1">Formula:</div>
                  <div>Earned Salary = (Gross / Total Days) × Working Days</div>
                  <div>Final Pay = Earned Salary - Total Deductions</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Finalized Employees List */}
          {finalizedEmployees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Finalized Employees</CardTitle>
                <CardDescription>Send salary details individually</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {finalizedEmployees.map((employee) => {
                  const earnedSalary = (employee.grossSalary / employee.totalDaysInMonth) * employee.workingDays;
                  const totalDeductions = employee.salaryAdvance + employee.pfDeduction + employee.esiDeduction;
                  const finalPay = earnedSalary - totalDeductions;

                  return (
                    <div
                      key={employee.id}
                      className="p-4 border rounded-lg space-y-3 bg-card hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-foreground">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.mobile}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Final Pay</div>
                          <div className="text-lg font-bold text-primary">
                            {formatCurrency(finalPay)}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleSendWhatsApp(employee.id)}
                          className="flex-1"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendSMS(employee.id)}
                          className="flex-1"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          SMS
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEmployee(employee.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
