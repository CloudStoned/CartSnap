import { Receipt, DaySpending, ReceiptItem } from '@/components/insights/types';
import { formatLocalDate } from '@/lib/utils';

export interface MonthOption {
  value: string; // "YYYY-MM"
  label: string; // "May 2026"
}

/**
 * Extracts unique months (YYYY-MM) from receipts and formats them as MonthOptions,
 * descending by date (most recent first). Always includes the current month.
 */
export function getAvailableMonths(receipts: Receipt[]): MonthOption[] {
  const monthsMap = new Map<string, { year: number; month: number }>();
  
  // Always ensure current month is in the options list
  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  monthsMap.set(currentKey, { year: now.getFullYear(), month: now.getMonth() });

  receipts.forEach((r) => {
    const d = new Date(r.createdAt);
    if (!isNaN(d.getTime())) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthsMap.set(key, { year: d.getFullYear(), month: d.getMonth() });
    }
  });

  const sorted = Array.from(monthsMap.entries()).sort((a, b) => {
    return b[0].localeCompare(a[0]); // Descending (most recent first)
  });

  return sorted.map(([value, { year, month }]) => {
    const label = new Date(year, month).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    return { value, label };
  });
}

/**
 * Calculates daily spending and groups items specifically for active days (spending > 0)
 * within the selected month.
 */
export function calculateMonthDailyData(receipts: Receipt[], selectedMonth: string): DaySpending[] {
  const [targetYear, targetMonthStr] = selectedMonth.split('-').map(Number);
  const targetMonth = targetMonthStr - 1; // 0-indexed for Date constructor

  // Filter receipts for the selected month and year
  const filteredReceipts = receipts.filter((r) => {
    const d = new Date(r.createdAt);
    return d.getFullYear() === targetYear && d.getMonth() === targetMonth;
  });

  // Group receipts by day of the month
  const dayGroups = new Map<number, Receipt[]>();
  filteredReceipts.forEach((r) => {
    const d = new Date(r.createdAt);
    const dayOfMonth = d.getDate();
    const existing = dayGroups.get(dayOfMonth) || [];
    existing.push(r);
    dayGroups.set(dayOfMonth, existing);
  });

  // Convert groups to DaySpending objects
  const result: DaySpending[] = [];
  dayGroups.forEach((dayReceipts, dayOfMonth) => {
    const totalSpent = dayReceipts.reduce((sum, r) => sum + r.finalAmount, 0);

    // Group and merge items bought on the same day
    const mergedItems: ReceiptItem[] = [];
    dayReceipts.forEach((r) => {
      r.items.forEach((item) => {
        const existing = mergedItems.find(
          (it) => it.name.toLowerCase() === item.name.toLowerCase() && it.category === item.category
        );
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          mergedItems.push({ ...item });
        }
      });
    });

    const dateObj = new Date(targetYear, targetMonth, dayOfMonth);
    const dateString = formatLocalDate(dateObj);
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    result.push({
      dateString,
      dayOfWeek,
      dayOfMonth,
      totalSpent,
      items: mergedItems,
    });
  });

  // Sort ascending (chronologically)
  return result.sort((a, b) => a.dateString.localeCompare(b.dateString));
}
