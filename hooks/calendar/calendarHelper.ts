import { Receipt } from '@/components/insights/types';

/**
 * Generates list of months that have receipts data in them, plus the current month.
 */
export function generateMonthsList(receipts: Receipt[]): Date[] {
  const monthsMap = new Map<string, Date>();

  // Always include the current month
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${now.getMonth()}`;
  const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
  monthsMap.set(currentKey, currentMonthDate);

  // Add months from receipts
  receipts.forEach((r) => {
    const d = new Date(r.createdAt);
    if (!isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!monthsMap.has(key)) {
        monthsMap.set(key, new Date(d.getFullYear(), d.getMonth(), 1));
      }
    }
  });

  // Sort chronologically ascending
  return Array.from(monthsMap.values()).sort((a, b) => a.getTime() - b.getTime());
}

/**
 * Calculates the total expenditure on a specific day.
 */
export function getDayDetails(day: Date, receipts: Receipt[]) {
  const dayStart = new Date(day);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(day);
  dayEnd.setHours(23, 59, 59, 999);

  const dayReceipts = receipts.filter((r) => {
    const rDate = new Date(r.createdAt);
    return rDate >= dayStart && rDate <= dayEnd;
  });

  const totalSpent = dayReceipts.reduce((sum, r) => sum + r.finalAmount, 0);

  return { totalSpent };
}
