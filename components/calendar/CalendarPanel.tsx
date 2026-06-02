'use client';

import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useGroceryStore } from '@/store/GroceryStore';
import { useAuth } from '@/hooks/auth/useAuth';
import { fetchReceiptsWithItems } from '@/lib/queries/checkout';
import { Receipt, ReceiptItem } from '@/components/insights/types';

function getSampleReceipts(currency: '₱' | '$'): Receipt[] {
  const isUSD = currency === '$';
  const scale = isUSD ? 0.02 : 1.0;

  return [
    {
      id: 'sample-1',
      receiptRef: 'FT-823910',
      totalAmount: 190.00 * scale,
      discountAmount: 0.00 * scale,
      finalAmount: 190.00 * scale,
      budgetLimit: 1000.00 * scale,
      currency: currency,
      createdAt: new Date().toISOString(),
      items: [
        { id: 'item-s1', name: 'Fresh Red Apples', category: 'Produce', price: 45.00 * scale, quantity: 2, productImage: '', createdAt: new Date().toISOString() },
        { id: 'item-s2', name: 'Whole Milk 1L', category: 'Dairy', price: 100.00 * scale, quantity: 1, productImage: '', createdAt: new Date().toISOString() }
      ]
    },
    {
      id: 'sample-2',
      receiptRef: 'FT-482910',
      totalAmount: 260.00 * scale,
      discountAmount: 30.00 * scale,
      finalAmount: 230.00 * scale,
      budgetLimit: 1000.00 * scale,
      currency: currency,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { id: 'item-s3', name: 'Organic Bananas Bunch', category: 'Produce', price: 35.00 * scale, quantity: 3, productImage: '', createdAt: new Date().toISOString() },
        { id: 'item-s4', name: 'Premium Greek Yogurt', category: 'Dairy', price: 125.00 * scale, quantity: 1, productImage: '', createdAt: new Date().toISOString() }
      ]
    },
    {
      id: 'sample-3',
      receiptRef: 'FT-182931',
      totalAmount: 120.00 * scale,
      discountAmount: 10.00 * scale,
      finalAmount: 110.00 * scale,
      budgetLimit: 1000.00 * scale,
      currency: currency,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { id: 'item-s5', name: 'Artisan Sourdough Loaf', category: 'Bakery', price: 80.00 * scale, quantity: 1, productImage: '', createdAt: new Date().toISOString() },
        { id: 'item-s6', name: 'Butter Croissants 2x', category: 'Bakery', price: 40.00 * scale, quantity: 1, productImage: '', createdAt: new Date().toISOString() }
      ]
    },
    {
      id: 'sample-4',
      receiptRef: 'FT-928172',
      totalAmount: 480.00 * scale,
      discountAmount: 30.00 * scale,
      finalAmount: 450.00 * scale,
      budgetLimit: 1000.00 * scale,
      currency: currency,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { id: 'item-s7', name: 'Premium Angus Ribeye', category: 'Meat', price: 380.00 * scale, quantity: 1, productImage: '', createdAt: new Date().toISOString() },
        { id: 'item-s8', name: 'Fresh Baby Spinach', category: 'Produce', price: 100.00 * scale, quantity: 1, productImage: '', createdAt: new Date().toISOString() }
      ]
    }
  ];
}

export default function CalendarPanel() {
  const { currency, playSound } = useGroceryStore();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [monthsList, setMonthsList] = useState<Date[]>([]);

  // 1. Generate a range of 8 months: 6 months ago up to 1 month from now
  useEffect(() => {
    const list: Date[] = [];
    for (let i = -6; i <= 1; i++) {
      const d = new Date();
      d.setDate(1); // Set to 1st to prevent overflow on months with varying day counts
      d.setMonth(d.getMonth() + i);
      list.push(d);
    }
    setMonthsList(list);
  }, []);

  // 2. Load checkout history from Supabase with sample fallback
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchReceiptsWithItems(userId)
      .then((data) => {
        if (!data || data.length === 0) {
          setReceipts(getSampleReceipts(currency));
        } else {
          setReceipts(data as Receipt[]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load receipts for calendar:', err);
        setReceipts(getSampleReceipts(currency));
        setLoading(false);
      });
  }, [userId, currency]);

  // Set default selection to today
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedDateString(todayStr);
  }, []);

  // 3. Auto-scroll to the current month inside the scroll container
  useEffect(() => {
    if (!loading && monthsList.length > 0) {
      setTimeout(() => {
        const currentMonthEl = document.getElementById('current-month');
        if (currentMonthEl) {
          currentMonthEl.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      }, 150);
    }
  }, [loading, monthsList]);

  const handleDayClick = (dateStr: string) => {
    playSound('click');
    setSelectedDateString(dateStr);
  };

  // Group items by day
  const getDayDetails = (day: Date) => {
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
  };

  const weekdayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-bold tracking-widest font-mono uppercase">Syncing calendar...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-3">
        <CalendarIcon className="w-4 h-4 text-emerald-600" />
        <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-slate-800">
          Expenditure Calendar
        </h4>
      </div>

      {/* Vertically Scrollable months container */}
      <div className="space-y-10 overflow-y-auto max-h-[520px] pr-2 scroll-smooth">
        {monthsList.map((monthDate) => {
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();
          const monthName = monthDate.toLocaleString('en-US', { month: 'long' });

          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const startDayOfWeek = new Date(year, month, 1).getDay();

          const daysGrid: (Date | null)[] = [];
          // Empty padding cells for first week
          for (let i = 0; i < startDayOfWeek; i++) {
            daysGrid.push(null);
          }
          // Days of month
          for (let d = 1; d <= daysInMonth; d++) {
            daysGrid.push(new Date(year, month, d));
          }

          const isCurrentMonth = 
            new Date().getFullYear() === year && 
            new Date().getMonth() === month;

          return (
            <div 
              key={`${year}-${month}`} 
              id={isCurrentMonth ? 'current-month' : undefined}
              className="space-y-4 scroll-mt-2"
            >
              {/* Sticky-like Month Header banner */}
              <div className="flex justify-between items-center bg-slate-50/80 backdrop-blur-xs py-2 px-3 rounded-lg border border-slate-100/50">
                <span className="text-xs font-black text-[#0b1c30] font-headline uppercase tracking-wide">
                  {monthName} {year}
                </span>
                {isCurrentMonth && (
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Current Month
                  </span>
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Weekday headers */}
                {weekdayHeaders.map((day) => (
                  <div key={day} className="py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}

                {/* Grid Cells */}
                {daysGrid.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/30 rounded-xl" />;
                  }

                  const dateStr = day.toISOString().split('T')[0];
                  const { totalSpent } = getDayDetails(day);
                  const isSelected = dateStr === selectedDateString;
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDayClick(dateStr)}
                      className={`aspect-square p-1.5 flex flex-col justify-between items-center rounded-xl border transition-all active:scale-95 group cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100 font-bold'
                          : isToday
                          ? 'bg-emerald-50 text-[#006e2f] border-emerald-100 hover:bg-emerald-100/50'
                          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      {/* Day number */}
                      <span className="text-[10px] sm:text-xs font-headline font-bold">
                        {day.getDate()}
                      </span>
                      
                      {/* Total Cost Display below date */}
                      {totalSpent > 0 ? (
                        <span className={`text-[7px] sm:text-[9px] font-bold truncate max-w-full px-1 py-0.5 rounded-md leading-none ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-50 text-[#006e2f] font-extrabold'
                        }`}>
                          {currency}{totalSpent.toFixed(0)}
                        </span>
                      ) : (
                        <span className="h-2 w-2" /> // spacing spacer
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
