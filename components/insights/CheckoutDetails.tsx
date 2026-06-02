'use client';

import React from 'react';
import { ShoppingBag, Apple, Droplet, Cookie, Beef } from 'lucide-react';

import { ReceiptItem } from './types';

interface CheckoutDetailsProps {
  selectedDay: {
    dayOfWeek: string;
    dayOfMonth: number;
    totalSpent: number;
    items: ReceiptItem[];
  } | undefined;
  currency: string;
}

export default function CheckoutDetails({ selectedDay, currency }: CheckoutDetailsProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Produce':
        return <Apple className="w-4 h-4 text-emerald-600" />;
      case 'Dairy':
        return <Droplet className="w-4 h-4 text-blue-600" />;
      case 'Bakery':
        return <Cookie className="w-4 h-4 text-amber-600" />;
      case 'Meat':
        return <Beef className="w-4 h-4 text-red-600" />;
      default:
        return <ShoppingBag className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left">
      <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-slate-800">
            Checkout Details
          </h4>
          <p className="text-[10px] text-slate-400">
            {selectedDay ? `Purchased items for ${selectedDay.dayOfWeek}, ${selectedDay.dayOfMonth}` : 'Daily purchases'}
          </p>
        </div>
        {selectedDay && selectedDay.totalSpent > 0 && (
          <span className="text-[11px] font-black text-[#006e2f] bg-emerald-50 px-2.5 py-1 rounded-lg">
            Spent: {currency}{selectedDay.totalSpent.toFixed(2)}
          </span>
        )}
      </div>

      {selectedDay && selectedDay.items.length > 0 ? (
        <div className="space-y-3 divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1">
          {selectedDay.items.map((item, idx) => (
            <div 
              key={item.id || idx} 
              className={`flex items-center gap-3 justify-between ${idx > 0 ? 'pt-3' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden relative">
                  {item.productImage ? (
                    <img 
                      src={item.productImage} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    getCategoryIcon(item.category)
                  )}
                </div>
                <div className="text-left">
                  <h5 className="text-[11px] font-bold text-[#0b1c30] line-clamp-1">{item.name}</h5>
                  <span className="inline-flex items-center gap-1 mt-0.5 text-[8px] font-semibold text-slate-400">
                    {getCategoryIcon(item.category)}
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="block text-[11px] font-bold text-slate-800">
                  {currency}{(item.price * item.quantity).toFixed(2)}
                </span>
                <span className="block text-[8px] font-semibold text-slate-400 mt-0.5">
                  {item.quantity}x {currency}{item.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
            <ShoppingBag className="w-5 h-5 text-slate-400" />
          </div>
          <h5 className="text-[11px] font-bold text-[#0b1c30]">No items recorded</h5>
          <p className="text-[9px] text-slate-400 mt-1 max-w-[200px]">
            No checkouts completed on this day. Tap the camera to scan and purchase items!
          </p>
        </div>
      )}
    </div>
  );
}
