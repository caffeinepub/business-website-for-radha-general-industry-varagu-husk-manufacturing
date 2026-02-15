import { useState, useMemo } from 'react';

export interface FinalSalaryEmployee {
  id: string;
  name: string;
  mobile: string;
  pfNumber: string;
  esiNumber: string;
  designation: string;
  basic: number;
  da: number;
  otherAllowance: number;
  monthlyGrossPay: number;
  presentDays: number;
  paidLeaveDays: number;
  weeklyOffDays: number;
  paidDays: number;
  totalDaysInMonth: number;
  salaryAdvance: number;
  pfDeduction: number;
  esiDeduction: number;
  timestamp: number;
}

export interface FinalSalaryCalculation {
  earnedSalary: number;
  totalDeductions: number;
  netPay: number;
  paidDays: number;
  isValid: boolean;
  errorMessage: string;
}

interface FinalSalaryFormState {
  name: string;
  mobile: string;
  pfNumber: string;
  esiNumber: string;
  designation: string;
  basic: string;
  da: string;
  otherAllowance: string;
  presentDays: string;
  paidLeaveDays: string;
  weeklyOffDays: string;
  totalDaysInMonth: string;
  salaryAdvance: string;
  pfDeduction: string;
  esiDeduction: string;
}

const DEFAULT_DA = '8419';
const DEFAULT_TOTAL_DAYS = '30';

const createDefaultFormState = (): FinalSalaryFormState => ({
  name: '',
  mobile: '',
  pfNumber: '',
  esiNumber: '',
  designation: '',
  basic: '0',
  da: DEFAULT_DA,
  otherAllowance: '0',
  presentDays: '0',
  paidLeaveDays: '0',
  weeklyOffDays: '0',
  totalDaysInMonth: DEFAULT_TOTAL_DAYS,
  salaryAdvance: '0',
  pfDeduction: '0',
  esiDeduction: '0',
});

export function useFinalSalary() {
  const [formState, setFormState] = useState<FinalSalaryFormState>(createDefaultFormState());
  const [finalizedEmployees, setFinalizedEmployees] = useState<FinalSalaryEmployee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const calculation = useMemo<FinalSalaryCalculation>(() => {
    const basic = parseFloat(formState.basic) || 0;
    const da = parseFloat(formState.da) || 0;
    const otherAllowance = parseFloat(formState.otherAllowance) || 0;
    const monthlyGrossPay = basic + da + otherAllowance;

    const presentDays = parseFloat(formState.presentDays) || 0;
    const paidLeaveDays = parseFloat(formState.paidLeaveDays) || 0;
    const weeklyOffDays = parseFloat(formState.weeklyOffDays) || 0;
    const paidDays = presentDays + paidLeaveDays + weeklyOffDays;

    const totalDays = parseFloat(formState.totalDaysInMonth) || 30;
    const advance = parseFloat(formState.salaryAdvance) || 0;
    const pf = parseFloat(formState.pfDeduction) || 0;
    const esi = parseFloat(formState.esiDeduction) || 0;

    let earnedSalary = 0;
    let totalDeductions = 0;
    let netPay = 0;
    let isValid = false;
    let errorMessage = '';

    // Validation
    if (!formState.mobile || formState.mobile.trim() === '') {
      errorMessage = 'Mobile number is required for messaging';
    } else if (!/^\d{10}$/.test(formState.mobile.replace(/\s/g, ''))) {
      errorMessage = 'Please enter a valid 10-digit mobile number';
    } else if (presentDays < 0 || paidLeaveDays < 0 || weeklyOffDays < 0) {
      errorMessage = 'Attendance values cannot be negative';
    } else if (paidDays > totalDays) {
      errorMessage = 'Paid Days cannot exceed Total Days in Month';
    } else if (totalDays <= 0) {
      errorMessage = 'Total days in month must be greater than zero';
    } else if (advance < 0 || pf < 0 || esi < 0) {
      errorMessage = 'Deductions and advance cannot be negative';
    } else if (monthlyGrossPay <= 0) {
      errorMessage = 'Monthly Gross Pay must be greater than zero';
    } else {
      // Calculate earned salary based on Rule #4: Present + Paid Leave + Weekly Off
      earnedSalary = (monthlyGrossPay / totalDays) * paidDays;
      totalDeductions = advance + pf + esi;
      netPay = earnedSalary - totalDeductions;

      if (netPay < 0) {
        errorMessage = 'Net Pay cannot be negative. Please check deductions and advance.';
      } else {
        isValid = true;
      }
    }

    return {
      earnedSalary,
      totalDeductions,
      netPay,
      paidDays,
      isValid,
      errorMessage,
    };
  }, [formState]);

  const updateField = (field: keyof FinalSalaryFormState, value: string) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const prefillFromStaff = (staff: {
    name: string;
    mobile: string;
    designation: string;
    basic: number;
    da: number;
    otherAllowance: number;
  }) => {
    setFormState(prev => ({
      ...prev,
      name: staff.name,
      mobile: staff.mobile,
      designation: staff.designation,
      basic: staff.basic.toString(),
      da: staff.da.toString(),
      otherAllowance: staff.otherAllowance.toString(),
    }));
  };

  const finalizeEmployee = (): FinalSalaryEmployee | null => {
    if (!calculation.isValid) {
      return null;
    }

    const employee: FinalSalaryEmployee = {
      id: Date.now().toString(),
      name: formState.name.trim() || 'Employee',
      mobile: formState.mobile.replace(/\s/g, ''),
      pfNumber: formState.pfNumber.trim(),
      esiNumber: formState.esiNumber.trim(),
      designation: formState.designation,
      basic: parseFloat(formState.basic),
      da: parseFloat(formState.da),
      otherAllowance: parseFloat(formState.otherAllowance),
      monthlyGrossPay: parseFloat(formState.basic) + parseFloat(formState.da) + parseFloat(formState.otherAllowance),
      presentDays: parseFloat(formState.presentDays),
      paidLeaveDays: parseFloat(formState.paidLeaveDays),
      weeklyOffDays: parseFloat(formState.weeklyOffDays),
      paidDays: calculation.paidDays,
      totalDaysInMonth: parseFloat(formState.totalDaysInMonth),
      salaryAdvance: parseFloat(formState.salaryAdvance),
      pfDeduction: parseFloat(formState.pfDeduction),
      esiDeduction: parseFloat(formState.esiDeduction),
      timestamp: Date.now(),
    };

    setFinalizedEmployees(prev => [employee, ...prev]);
    setSelectedEmployeeId(employee.id);
    
    // Reset form for next employee
    setFormState(createDefaultFormState());

    return employee;
  };

  const resetForm = () => {
    setFormState(createDefaultFormState());
    setSelectedEmployeeId(null);
  };

  const deleteEmployee = (id: string) => {
    setFinalizedEmployees(prev => prev.filter(emp => emp.id !== id));
    if (selectedEmployeeId === id) {
      setSelectedEmployeeId(null);
    }
  };

  const getEmployeeById = (id: string): FinalSalaryEmployee | undefined => {
    return finalizedEmployees.find(emp => emp.id === id);
  };

  return {
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
  };
}
