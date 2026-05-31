'use client';

import React from 'react';
import { ShoppingBasket, Wallet } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';
import { cn } from '../lib/utils';

export default function BudgetCard() {
  const {
    currency,
    budget,
    finalAmount,
    isOverBudget
  } = useGroceryStore();

  const remaining = Math.max(0, budget - finalAmount);
  const percentageUsed = budget > 0 ? (finalAmount / budget) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-[#006e2f] to-[#124d26] text-white rounded-2xl p-4.5 shadow-lg relative overflow-hidden transition-all hover:shadow-xl">
      <div className="absolute right-[-14px] top-[-14px] opacity-10">
        <ShoppingBasket className="w-32 h-32" />
      </div>
      
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold mb-0.5">Estimated Budget Balance</p>
          <h3 className="text-2.5xl font-black font-price mt-0.5">
            {currency}{remaining.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="p-2 bg-white/10 rounded-xl flex items-center justify-center">
          <Wallet className="w-5 h-5 text-emerald-200" />
        </div>
      </div>

      <div className="border-t border-emerald-400/20 pt-3 flex justify-between items-center text-xs">
        <div>
          <span className="text-emerald-200 text-[10px]">Active Basket</span>
          <p className="font-bold font-price tracking-tight">{currency}{finalAmount.toFixed(0)}</p>
        </div>
        <div className="text-right">
          <span className="text-emerald-200 text-[10px]">Spending Cap Limit</span>
          <p className="font-bold font-price">{currency}{budget}</p>
        </div>
      </div>

      <div className="mt-3.5 space-y-1">
        <div className="flex justify-between text-[9px] text-emerald-100">
          <span>Cap limit usage: {percentageUsed.toFixed(0)}%</span>
          {isOverBudget && <span className="text-red-300 font-extrabold animate-bounce">OVER BUDGET CAP</span>}
        </div>
        <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-500",
              isOverBudget ? "bg-red-400" : "bg-emerald-300"
            )}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
