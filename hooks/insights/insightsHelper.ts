import { Receipt, DaySpending, ReceiptItem } from '@/components/insights/types';

/**
 * Calculates daily spending and groups purchased items over the last 7 days.
 */
export function calculateDailyData(receipts: Receipt[]): DaySpending[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }

  return days.map((day) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    // Find receipts created on this calendar day
    const dayReceipts = receipts.filter((r) => {
      const rDate = new Date(r.createdAt);
      return rDate >= dayStart && rDate <= dayEnd;
    });

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

    const dayOfWeek = day.toLocaleDateString('en-US', { weekday: 'short' });
    const dayOfMonth = day.getDate();
    const dateString = day.toISOString().split('T')[0];

    return {
      dateString,
      dayOfWeek,
      dayOfMonth,
      totalSpent,
      items: mergedItems,
    };
  });
}
