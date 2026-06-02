'use client';

import React, { useState } from 'react';
import { BarChart3, CalendarRange } from 'lucide-react';
import { Receipt } from './types';

interface InsightsHeaderProps {
  receipts: Receipt[];
  currency: string;
  isDemo: boolean;
}

type RangeOption = 'current' | '2m' | '4m' | '6m' | '1y';

export default function InsightsHeader({ receipts, currency, isDemo }: InsightsHeaderProps) {
  const [selectedRange, setSelectedRange] = useState<RangeOption>('current');

  // 1. Calculate the start date based on selected time range
  const getStartDate = (range: RangeOption): Date => {
    const now = new Date();
    const start = new Date();
    switch (range) {
      case 'current':
        // Start of current calendar month
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case '2m':
        start.setMonth(now.getMonth() - 2);
        return start;
      case '4m':
        start.setMonth(now.getMonth() - 4);
        return start;
      case '6m':
        start.setMonth(now.getMonth() - 6);
        return start;
      case '1y':
        start.setFullYear(now.getFullYear() - 1);
        return start;
    }
  };

  const startDate = getStartDate(selectedRange);
  const now = new Date();

  // 2. Filter receipts within the time window
  const filteredReceipts = receipts.filter((r) => {
    const rDate = new Date(r.createdAt);
    return rDate >= startDate && rDate <= now;
  });

  // 3. Compute analytics
  const totalAmount = filteredReceipts.reduce((sum, r) => sum + r.finalAmount, 0);
  
  // Calculate total days in range (at least 1 day to prevent division by zero)
  const diffTime = Math.abs(now.getTime() - startDate.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const dailyAverage = totalAmount / diffDays;
  const transactionAverage = filteredReceipts.length > 0 ? totalAmount / filteredReceipts.length : 0;

  const rangeLabels: Record<RangeOption, string> = {
    current: 'Current Month',
    '2m': 'Past 2 Months',
    '4m': 'Past 4 Months',
    '6m': 'Past 6 Months',
    '1y': 'Past 1 Year',
  };

  return (
    <div className="bg-gradient-to-br from-[#0b1c30] to-[#162e4a] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden text-left">
      <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-5 pointer-events-none">
        <BarChart3 className="w-40 h-40" />
      </div>

      <div className="space-y-4">
        {/* Header Title and Badge */}
        <div className="flex justify-between items-start">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[9px] uppercase tracking-widest font-black text-emerald-400">
                Expenditure Averages
              </span>
              {isDemo && (
                <span className="text-[8px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Sample Data
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-slate-300 font-headline">
              Timeline average comparison
            </h3>
          </div>
          <div className="bg-white/10 backdrop-blur-xs p-2 rounded-xl border border-white/5 flex items-center justify-center">
            <CalendarRange className="w-4 h-4 text-emerald-400" />
          </div>
        </div>

        {/* Range Selector Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950/40 p-1 rounded-xl border border-white/5">
          {(['current', '2m', '4m', '6m', '1y'] as RangeOption[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setSelectedRange(option)}
              className={`flex-1 min-w-[50px] text-center py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border-0 ${
                selectedRange === option
                  ? 'bg-white text-[#0b1c30] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {option === 'current' ? 'Current' : option}
            </button>
          ))}
        </div>

        {/* Averages Display Grid */}
        <div className="pt-2 grid grid-cols-2 gap-4">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Daily Avg Spend
            </span>
            <h4 className="text-xl font-black font-headline text-emerald-400">
              {currency}{dailyAverage.toFixed(2)}
            </h4>
            <p className="text-[8px] text-slate-400">
              Calculated over {diffDays} days in range
            </p>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">
              Avg per Checkout
            </span>
            <h4 className="text-xl font-black font-headline text-slate-100">
              {currency}{transactionAverage.toFixed(2)}
            </h4>
            <p className="text-[8px] text-slate-400">
              Across {filteredReceipts.length} checkouts
            </p>
          </div>
        </div>

        <div className="text-[9px] text-slate-400 border-t border-white/5 pt-2 flex justify-between items-center">
          <span>Active filter: <strong className="text-white">{rangeLabels[selectedRange]}</strong></span>
          <span>Total Spend: <strong className="text-emerald-400">{currency}{totalAmount.toFixed(2)}</strong></span>
        </div>
      </div>
    </div>
  );
}
