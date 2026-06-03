'use client';

import React from 'react';
import { ShoppingBag, Apple, Droplet, Cookie, Beef } from 'lucide-react';
import { ReceiptItem } from './types';
import SlidingReceiptItem from './SlidingReceiptItem';

interface CheckoutDetailsProps {
  selectedDay: {
    dayOfWeek: string;
    dayOfMonth: number;
    totalSpent: number;
    items: ReceiptItem[];
  } | undefined;
  currency: string;
  onRemoveItem: (itemId: string) => Promise<void>;
}

export default function CheckoutDetails({ selectedDay, currency, onRemoveItem }: CheckoutDetailsProps) {
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
        <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
          {selectedDay.items.map((item, idx) => (
            <SlidingReceiptItem
              key={item.id || idx}
              item={item}
              currency={currency}
              onRemove={onRemoveItem}
              getCategoryIcon={getCategoryIcon}
            />
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
