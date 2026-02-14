import { formatCurrency } from './currency';
import type { FinalSalaryEmployee } from '@/hooks/useFinalSalary';

export interface FinalSalaryMessageData {
  employee: FinalSalaryEmployee;
  earnedSalary: number;
  totalDeductions: number;
  finalPay: number;
}

/**
 * Generate a finalized salary message for a single employee
 */
export function generateFinalSalaryMessage(data: FinalSalaryMessageData): string {
  const { employee, earnedSalary, totalDeductions, finalPay } = data;

  const lines: string[] = [
    `Final Salary Statement`,
    ``,
    `Employee: ${employee.name}`,
  ];

  if (employee.pfNumber) {
    lines.push(`PF Number: ${employee.pfNumber}`);
  }

  if (employee.esiNumber) {
    lines.push(`ESI Number: ${employee.esiNumber}`);
  }

  lines.push(
    ``,
    `Gross Salary: ${formatCurrency(employee.grossSalary)}`,
    `Working Days: ${employee.workingDays} / ${employee.totalDaysInMonth}`,
    `Earned Salary: ${formatCurrency(earnedSalary)}`,
    ``,
    `Deductions:`,
  );

  if (employee.salaryAdvance > 0) {
    lines.push(`  Salary Advance: ${formatCurrency(employee.salaryAdvance)}`);
  }

  if (employee.pfDeduction > 0) {
    lines.push(`  PF Deduction: ${formatCurrency(employee.pfDeduction)}`);
  }

  if (employee.esiDeduction > 0) {
    lines.push(`  ESI Deduction: ${formatCurrency(employee.esiDeduction)}`);
  }

  lines.push(
    `  Total Deductions: ${formatCurrency(totalDeductions)}`,
    ``,
    `Final Pay: ${formatCurrency(finalPay)}`,
  );

  return lines.join('\n');
}

/**
 * Generate WhatsApp deep link (wa.me) for a single employee
 */
export function generateWhatsAppLink(data: FinalSalaryMessageData): string {
  const message = generateFinalSalaryMessage(data);
  const encodedMessage = encodeURIComponent(message);
  
  // Remove any non-digit characters from mobile number
  const cleanMobile = data.employee.mobile.replace(/\D/g, '');
  
  // Add country code if not present (assuming India +91)
  const mobileWithCountryCode = cleanMobile.startsWith('91') 
    ? cleanMobile 
    : `91${cleanMobile}`;

  return `https://wa.me/${mobileWithCountryCode}?text=${encodedMessage}`;
}

/**
 * Generate SMS deep link (sms:) for a single employee
 */
export function generateSMSLink(data: FinalSalaryMessageData): string {
  const message = generateFinalSalaryMessage(data);
  const encodedMessage = encodeURIComponent(message);
  
  // Clean mobile number
  const cleanMobile = data.employee.mobile.replace(/\D/g, '');

  // SMS link format varies by platform
  // iOS uses sms:number&body=message
  // Android uses sms:number?body=message
  // We'll use the more universal format with ?
  return `sms:${cleanMobile}?body=${encodedMessage}`;
}
