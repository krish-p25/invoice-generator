import { format as formatDate } from 'date-fns';
import { getCurrencyByCode } from '../constants/currencies';

export function formatCurrency(amount: number, currencyCode: string = 'USD'): string {
  const currency = getCurrencyByCode(currencyCode);
  return `${currency.symbol}${amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatNumber(num: number, decimals: number = 2): string {
  return num?.toFixed(decimals);
}

export function formatDate_DMY(date: Date): string {
  return formatDate(date, 'dd/MM/yyyy');
}

export function formatDate_MDY(date: Date): string {
  return formatDate(date, 'MM/dd/yyyy');
}

export function formatDate_ISO(date: Date): string {
  return formatDate(date, 'yyyy-MM-dd');
}

export function formatDate_Long(date: Date): string {
  return formatDate(date, 'MMMM d, yyyy');
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function parseNumberSafely(value: string | number, defaultValue: number = 0): number {
  const parsed = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}
