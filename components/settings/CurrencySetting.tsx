'use client';

import React from 'react';
import { useGroceryStore } from '../../store/GroceryStore';
import { cn } from '../../lib/utils';

export default function CurrencySetting() {
  const { currency, setCurrency, playSound } = useGroceryStore();

  return (
    <div className="flex justify-between items-center text-xs">
      <div className="space-y-0.5">
        <span className="font-bold text-slate-700 font-headline">Default Signifier</span>
        <p className="text-[9px] text-slate-400">Change currency standard Symbol.</p>
      </div>
      <div className="flex border border-slate-200 bg-slate-50 p-0.5 rounded-lg">
        <button 
          type="button"
          onClick={() => {
            setCurrency('₱');
            playSound('click');
          }}
          className={cn(
            "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all active:scale-95",
            currency === '₱' ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-600"
          )}
        >
          ₱
        </button>
        <button 
          type="button"
          onClick={() => {
            setCurrency('$');
            playSound('click');
          }}
          className={cn(
            "px-2.5 py-1 text-[10px] font-bold rounded-md transition-all active:scale-95",
            currency === '$' ? "bg-white text-slate-800 shadow-xs" : "text-slate-400 hover:text-slate-600"
          )}
        >
          $
        </button>
      </div>
    </div>
  );
}
