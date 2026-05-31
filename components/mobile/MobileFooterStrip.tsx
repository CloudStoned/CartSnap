'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useGroceryStore } from '../../store/GroceryStore';

export default function MobileFooterStrip() {
  const {
    basket,
    isCheckoutOpen,
    setIsCheckoutOpen,
    playSound,
    currency,
    finalAmount
  } = useGroceryStore();

  if (basket.length === 0 || isCheckoutOpen) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-[66px] left-0 right-0 bg-white border-t border-[#0b1c30]/10 p-3 px-4 flex justify-between items-center z-30 shadow-md">
      <div className="text-left">
        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest leading-none mb-1">Estimated Basket Run</span>
        <span className="text-sm font-extrabold text-[#006e2f] font-price">{currency}{finalAmount.toFixed(0)}</span>
      </div>
      
      <button 
        type="button"
        onClick={() => {
          playSound('click');
          setIsCheckoutOpen(true);
        }}
        className="p-3 px-5 bg-[#006e2f] text-white text-xs font-bold uppercase rounded-xl tracking-wider shadow-lg shadow-[#006e2f]/20 flex items-center justify-center gap-1 active:scale-95 border-0 cursor-pointer"
      >
        Checkout <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
