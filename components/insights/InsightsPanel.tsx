'use client';

import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { useGroceryStore } from '@/store/GroceryStore';
import { useAuth } from '@/hooks/auth/useAuth';
import { fetchReceiptsWithItems } from '@/lib/queries/checkout';
import DailyChart from './DailyChart';
import CheckoutDetails from './CheckoutDetails';

interface ReceiptItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  productImage: string;
  createdAt: string;
}

interface Receipt {
  id: string;
  receiptRef: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  budgetLimit: number;
  currency: string;
  createdAt: string;
  items: ReceiptItem[];
}

interface DaySpending {
  dateString: string;
  dayOfWeek: string;
  dayOfMonth: number;
  totalSpent: number;
  items: ReceiptItem[];
}

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

export default function InsightsPanel() {
  const { currency, playSound } = useGroceryStore();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dailyData, setDailyData] = useState<DaySpending[]>([]);
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [animationTrigger, setAnimationTrigger] = useState<boolean>(false);

  // 1. Fetch checkout history from Supabase with sample fallback
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchReceiptsWithItems(userId)
      .then((data) => {
        if (!data || data.length === 0) {
          setReceipts(getSampleReceipts(currency));
          setIsDemo(true);
        } else {
          setReceipts(data as Receipt[]);
          setIsDemo(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load insights data, fallback to demo:', err);
        setReceipts(getSampleReceipts(currency));
        setIsDemo(true);
        setLoading(false);
      });
  }, [userId, currency]);

  // 2. Generate past 7 days list and map receipts to days
  useEffect(() => {
    if (loading) return;

    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d);
    }

    const mapped = days.map((day) => {
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

    setDailyData(mapped);

    // Default select today
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedDateString(todayStr);

    // Trigger visual slide-up animation
    setTimeout(() => {
      setAnimationTrigger(true);
    }, 100);
  }, [receipts, loading]);

  const handleBarClick = (dateString: string) => {
    playSound('click');
    setSelectedDateString(dateString);
  };

  // Find currently selected day
  const selectedDay = dailyData.find((d) => d.dateString === selectedDateString);

  // Maximum spend amount for graph height scale mapping
  const maxSpend = Math.max(...dailyData.map((d) => d.totalSpent), 1);

  // Total weekly spending sum
  const weeklyTotal = dailyData.reduce((sum, d) => sum + d.totalSpent, 0);

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-bold tracking-widest font-mono uppercase">Assembling analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Summary Card */}
      <div className="bg-gradient-to-br from-[#0b1c30] to-[#162e4a] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-5 pointer-events-none">
          <BarChart3 className="w-40 h-40" />
        </div>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest font-black text-emerald-400">7-Day Spending Roll</span>
              {isDemo && (
                <span className="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sample Data
                </span>
              )}
            </div>
            <h3 className="text-2xl font-black font-headline tracking-tight">
              {currency}{weeklyTotal.toFixed(2)}
            </h3>
            <p className="text-[10px] text-slate-300">
              Total grocery checkout expenditure over the last 7 calendar days.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/5 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* 2. Interactive Bar Graph Subcomponent */}
      <DailyChart 
        dailyData={dailyData}
        selectedDateString={selectedDateString}
        maxSpend={maxSpend}
        currency={currency}
        animationTrigger={animationTrigger}
        onBarClick={handleBarClick}
      />

      {/* 3. Daily Purchase Breakdown Details Subcomponent */}
      <CheckoutDetails 
        selectedDay={selectedDay}
        currency={currency}
      />
    </div>
  );
}
