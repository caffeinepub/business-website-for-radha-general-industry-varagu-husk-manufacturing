import { useState } from 'react';
import { Calculator, Send, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StaffMasterPanel } from '../staff/StaffMasterPanel';
import { useFinalSalary } from '@/hooks/useFinalSalary';
import { formatCurrency } from '@/lib/currency';
import {
  generateFinalSalaryMessage,
  generateWhatsAppLink,
  generateSMSLink,
  type FinalSalaryMessageData,
} from '@/lib/finalSalaryMessage';
import type { Staff } from '@/backend';

export function FinalSalaryWorkflow() {
  const {
    formState,
    calculation,
    finalizedEmployees,
    selectedEmployeeId,
    updateField,
    prefillFromStaff,
    finalizeEmployee,
    resetForm,
    deleteEmployee,
    getEmployeeById,
    setSelectedEmployeeId,
  } = useFinalSalary();

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSelectStaff = (staff: Staff) => {
    prefillFromStaff(staff);
  };

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

    const earnedSalary = (employee.monthlyGrossPay / employee.totalDaysInMonth) * employee.paidDays;
    const totalDeductions = employee.salaryAdvance + employee.pfDeduction + employee.esiDeduction;
    const netPay = earnedSalary - totalDeductions;

    const messageData: FinalSalaryMessageData = {
      employee,
      earnedSalary,
      totalDeductions,
      netPay,
    };

    const whatsappUrl = generateWhatsAppLink(messageData);
    window.open(whatsappUrl, '_blank');
  };

  const handleSendSMS = (employeeId: string) => {
    const employee = getEmployeeById(employeeId);
    if (!employee) return;

    const earnedSalary = (employee.monthlyGrossPay / employee.totalDaysInMonth) * employee.paidDays;
    const totalDeductions = employee.salaryAdvance + employee.pfDeduction + employee.esiDeduction;
    const netPay = earnedSalary - totalDeductions;

    const messageData: FinalSalaryMessageData = {
      employee,
      earnedSalary,
      totalDeductions,
      netPay,
    };

    const smsUrl = generateSMSLink(messageData);
    window.location.href = smsUrl;
  };

  const monthlyGrossPay = (parseFloat(formState.basic) || 0) + (parseFloat(formState.da) || 0) + (parseFloat(formState.otherAllowance) || 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <StaffMasterPanel onSelectStaff={handleSelectStaff} />

      <Separator className="my-12" />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Calculator className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">Attendance-Based Salary Calculator</h2>
        </div>
        <p className="text-muted-foreground">
          Calculate salary using Rule #4: Present Days + Paid Leave + Weekly Off = Paid Days
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle>Employee Details</CardTitle>
            <CardDescription>Enter employee information and attendance</CardDescription>
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

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Salary Components</h3>
              
              <div className="space-y-2">
                <Label htmlFor="basic">Basic Salary</Label>
                <Input
                  id="basic"
                  type="number"
                  placeholder="0.00"
                  value={formState.basic}
                  onChange={(e) => updateField('basic', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="da">DA (Fixed)</Label>
                <Input
                  id="da"
                  type="text"
                  value={formatCurrency(parseFloat(formState.da) || 0)}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="otherAllowance">Other Allowance</Label>
                <Input
                  id="otherAllowance"
                  type="number"
                  placeholder="0.00"
                  value={formState.otherAllowance}
                  onChange={(e) => updateField('otherAllowance', e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Monthly Gross Pay</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(monthlyGrossPay)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Attendance (Rule #4)</h3>
              
              <div className="space-y-2">
                <Label htmlFor="presentDays">Present Days</Label>
                <Input
                  id="presentDays"
                  type="number"
                  placeholder="0"
                  value={formState.presentDays}
                  onChange={(e) => updateField('presentDays', e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidLeaveDays">Paid Leave Days</Label>
                <Input
                  id="paidLeaveDays"
                  type="number"
                  placeholder="0"
                  value={formState.paidLeaveDays}
                  onChange={(e) => updateField('paidLeaveDays', e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeklyOffDays">Weekly Off Days</Label>
                <Input
                  id="weeklyOffDays"
                  type="number"
                  placeholder="0"
                  value={formState.weeklyOffDays}
                  onChange={(e) => updateField('weeklyOffDays', e.target.value)}
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="p-3 bg-accent/20 rounded-lg border border-accent/30">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-foreground">Paid Days (Derived)</span>
                  <span className="text-lg font-bold text-accent-foreground">
                    {calculation.paidDays.toFixed(1)}
                  </span>
                </div>
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

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Deductions</h3>
              
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
                  <Label htmlFor="pfDeduction">EPF Deduction</Label>
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
              <CardDescription>Earned salary and net pay breakdown</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Monthly Gross Pay</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatCurrency(monthlyGrossPay)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Basic ({formatCurrency(parseFloat(formState.basic) || 0)}) + DA ({formatCurrency(parseFloat(formState.da) || 0)}) + Other ({formatCurrency(parseFloat(formState.otherAllowance) || 0)})
                  </div>
                </div>

                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-sm text-muted-foreground mb-1">
                    Earned Salary (Rule #4)
                  </div>
                  <div className="text-xl font-bold text-primary">
                    {formatCurrency(calculation.earnedSalary)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Formula: (Gross Pay ÷ {formState.totalDaysInMonth || 30}) × {calculation.paidDays.toFixed(1)} paid days
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Paid Days = Present ({formState.presentDays || 0}) + Paid Leave ({formState.paidLeaveDays || 0}) + Weekly Off ({formState.weeklyOffDays || 0})
                  </div>
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
                    <span className="text-sm text-muted-foreground">EPF Deduction</span>
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

                <div className="p-4 bg-accent/20 rounded-lg border-2 border-accent">
                  <div className="text-sm font-medium text-muted-foreground mb-1">Net Pay</div>
                  <div className="text-3xl font-bold text-accent-foreground">
                    {formatCurrency(calculation.netPay)}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Earned Salary − Total Deductions
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formula Explanation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Rule #4: Attendance-Based Calculation</p>
              <p>1. Calculate Paid Days = Present + Paid Leave + Weekly Off</p>
              <p>2. Earned Salary = (Monthly Gross Pay ÷ Total Days) × Paid Days</p>
              <p>3. Net Pay = Earned Salary − (Salary Advance + EPF + ESI)</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Finalized Employees Table */}
      {finalizedEmployees.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Finalized Employees</CardTitle>
            <CardDescription>
              {finalizedEmployees.length} employee{finalizedEmployees.length !== 1 ? 's' : ''} finalized
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead className="text-right">Paid Days</TableHead>
                    <TableHead className="text-right">Net Pay</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {finalizedEmployees.map((employee) => {
                    const earnedSalary = (employee.monthlyGrossPay / employee.totalDaysInMonth) * employee.paidDays;
                    const totalDeductions = employee.salaryAdvance + employee.pfDeduction + employee.esiDeduction;
                    const netPay = earnedSalary - totalDeductions;

                    return (
                      <TableRow
                        key={employee.id}
                        className={selectedEmployeeId === employee.id ? 'bg-primary/5' : ''}
                      >
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell className="text-muted-foreground">{employee.mobile}</TableCell>
                        <TableCell className="text-right font-medium">
                          {employee.paidDays.toFixed(1)} / {employee.totalDaysInMonth}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-primary">
                          {formatCurrency(netPay)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendWhatsApp(employee.id)}
                              title="Send via WhatsApp"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendSMS(employee.id)}
                              title="Send via SMS"
                            >
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteEmployee(employee.id)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
