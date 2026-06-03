import { Receipt } from '@/components/insights/types';

/**
 * Generates an 8-month list, from 6 months ago up to 1 month from now.
 */
export function generateMonthsList(): Date[] {
  const list: Date[] = [];
  for (let i = -6; i <= 1; i++) {
    const d = new Date();
    d.setDate(1); // Set to 1st to prevent overflow on months with varying day counts
    d.setMonth(d.getMonth() + i);
    list.push(d);
  }
  return list;
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
