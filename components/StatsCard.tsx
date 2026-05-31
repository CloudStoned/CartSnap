'use client';

import React from 'react';
import { Gift, TrendingUp } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';

export default function StatsCard() {
  const { currency, dynamicDiscount, totalItemCount } = useGroceryStore();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-1 shadow-xs hover:shadow-md transition-shadow text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Smart discount saving</span>
          <Gift className="w-3.5 h-3.5 text-emerald-600" />
        </div>
        <p className="text-lg font-black font-headline text-[#006e2f]">
          {currency}{dynamicDiscount.toFixed(2)}
        </p>
      </div>
      <div className="bg-white rounded-xl border border-slate-100 p-3.5 space-y-1 shadow-xs hover:shadow-md transition-shadow text-left">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">OCR scanned items</span>
          <TrendingUp className="w-3.5 h-3.5 text-slate-600" />
        </div>
        <p className="text-lg font-black font-headline text-slate-800">
          {totalItemCount} {totalItemCount === 1 ? 'Product' : 'Products'}
        </p>
      </div>
    </div>
  );
}
