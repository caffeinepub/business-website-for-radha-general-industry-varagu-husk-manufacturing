import { formatCurrency } from './currency';
import type { FinalSalaryEmployee } from '@/hooks/useFinalSalary';

export interface FinalSalaryMessageData {
  employee: FinalSalaryEmployee;
  earnedSalary: number;
  totalDeductions: number;
  netPay: number;
}

/**
 * Generate a finalized salary message for a single employee
 */
export function generateFinalSalaryMessage(data: FinalSalaryMessageData): string {
  const { employee, earnedSalary, totalDeductions, netPay } = data;

  const lines: string[] = [
    `Final Salary Statement`,
    ``,
    `Name: ${employee.name}`,
  ];

  if (employee.designation) {
    lines.push(`Designation: ${employee.designation}`);
  }

  if (employee.pfNumber) {
    lines.push(`PF Number: ${employee.pfNumber}`);
  }

  if (employee.esiNumber) {
    lines.push(`ESI Number: ${employee.esiNumber}`);
  }

  lines.push(
    ``,
    `Monthly Gross Pay: ${formatCurrency(employee.monthlyGrossPay)}`,
    `  Basic: ${formatCurrency(employee.basic)}`,
    `  DA: ${formatCurrency(employee.da)}`,
    `  Other Allowance: ${formatCurrency(employee.otherAllowance)}`,
    ``,
    `Attendance (Rule #4):`,
    `  Present Days: ${employee.presentDays}`,
    `  Paid Leave Days: ${employee.paidLeaveDays}`,
    `  Weekly Off Days: ${employee.weeklyOffDays}`,
    `  Paid Days: ${employee.paidDays} / ${employee.totalDaysInMonth}`,
    ``,
    `Earned Salary: ${formatCurrency(earnedSalary)}`,
    ``,
    `Deductions:`,
  );

  if (employee.salaryAdvance > 0) {
    lines.push(`  Salary Advance: ${formatCurrency(employee.salaryAdvance)}`);
  }

  if (employee.pfDeduction > 0) {
    lines.push(`  EPF: ${formatCurrency(employee.pfDeduction)}`);
  }

  if (employee.esiDeduction > 0) {
    lines.push(`  ESI: ${formatCurrency(employee.esiDeduction)}`);
  }

  lines.push(
    `  Total Deductions: ${formatCurrency(totalDeductions)}`,
    ``,
    `Net Pay: ${formatCurrency(netPay)}`,
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
