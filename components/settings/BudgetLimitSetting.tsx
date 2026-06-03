'use client';

import React from 'react';
import { useGroceryStore } from '../../store/GroceryStore';

export default function BudgetLimitSetting() {
  const { budget, setBudget, currency } = useGroceryStore();
  const maxBudget = 50000;
  const minBudget = 500;

  return (
    <div className="space-y-2 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-bold text-slate-700 font-headline">Supermarket daily limit slider</span>
        <span className="font-bold text-slate-800 font-price">{currency}{budget}</span>
      </div>
      
      <input 
        type="range" 
        min={minBudget}
        max={maxBudget}
        step="100"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="w-full accent-[#006e2f] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
      />
      
      <div className="flex justify-between text-[8px] text-slate-400 font-mono">
        <span>{currency}{minBudget}</span>
        <span>{currency}{maxBudget}</span>
      </div>
    </div>
  );
}
