/**
 * Format a number as currency with thousands separators
 * @param value - The numeric value to format
 * @param currency - The currency code (default: 'INR')
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency: string = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Format a number with thousands separators (no currency symbol)
 * @param value - The numeric value to format
 * @returns Formatted number string
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
