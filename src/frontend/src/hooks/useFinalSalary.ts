import { useState, useMemo } from 'react';

export interface FinalSalaryEmployee {
  id: string;
  name: string;
  mobile: string;
  pfNumber: string;
  esiNumber: string;
  grossSalary: number;
  workingDays: number;
  totalDaysInMonth: number;
  salaryAdvance: number;
  pfDeduction: number;
  esiDeduction: number;
  timestamp: number;
}

export interface FinalSalaryCalculation {
  earnedSalary: number;
  totalDeductions: number;
  finalPay: number;
  isValid: boolean;
  errorMessage: string;
}

interface FinalSalaryFormState {
  name: string;
  mobile: string;
  pfNumber: string;
  esiNumber: string;
  grossSalary: string;
  workingDays: string;
  totalDaysInMonth: string;
  salaryAdvance: string;
  pfDeduction: string;
  esiDeduction: string;
}

const DEFAULT_GROSS_SALARY = '8419';
const DEFAULT_TOTAL_DAYS = '30';

const createDefaultFormState = (): FinalSalaryFormState => ({
  name: '',
  mobile: '',
  pfNumber: '',
  esiNumber: '',
  grossSalary: DEFAULT_GROSS_SALARY,
  workingDays: '',
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
    const gross = parseFloat(formState.grossSalary) || 0;
    const workingDays = parseFloat(formState.workingDays) || 0;
    const totalDays = parseFloat(formState.totalDaysInMonth) || 30;
    const advance = parseFloat(formState.salaryAdvance) || 0;
    const pf = parseFloat(formState.pfDeduction) || 0;
    const esi = parseFloat(formState.esiDeduction) || 0;

    let earnedSalary = 0;
    let totalDeductions = 0;
    let finalPay = 0;
    let isValid = false;
    let errorMessage = '';

    // Validation
    if (!formState.mobile || formState.mobile.trim() === '') {
      errorMessage = 'Mobile number is required for messaging';
    } else if (!/^\d{10}$/.test(formState.mobile.replace(/\s/g, ''))) {
      errorMessage = 'Please enter a valid 10-digit mobile number';
    } else if (gross <= 0) {
      errorMessage = 'Gross salary must be greater than zero';
    } else if (workingDays <= 0) {
      errorMessage = 'Working days must be greater than zero';
    } else if (workingDays > totalDays) {
      errorMessage = 'Working days cannot exceed total days in month';
    } else if (totalDays <= 0) {
      errorMessage = 'Total days in month must be greater than zero';
    } else if (advance < 0 || pf < 0 || esi < 0) {
      errorMessage = 'Deductions and advance cannot be negative';
    } else {
      // Calculate earned salary based on working days
      earnedSalary = (gross / totalDays) * workingDays;
      totalDeductions = advance + pf + esi;
      finalPay = earnedSalary - totalDeductions;

      if (finalPay < 0) {
        errorMessage = 'Final pay cannot be negative. Please check deductions and advance.';
      } else {
        isValid = true;
      }
    }

    return {
      earnedSalary,
      totalDeductions,
      finalPay,
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
      grossSalary: parseFloat(formState.grossSalary),
      workingDays: parseFloat(formState.workingDays),
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
    finalizeEmployee,
    resetForm,
    deleteEmployee,
    getEmployeeById,
    setSelectedEmployeeId,
  };
}
