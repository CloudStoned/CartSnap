'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBasket, Minus, Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';

interface BasketPanelProps {
  isWidescreen?: boolean;
}

export default function BasketPanel({ isWidescreen = false }: BasketPanelProps) {
  const {
    currency,
    basket,
    totalItemCount,
    totalAmount,
    dynamicDiscount,
    finalAmount,
    budget,
    isOverBudget,
    playSound,
    updateQuantity,
    deleteItem,
    clearBasket,
    addNotification,
    setIsCheckoutOpen
  } = useGroceryStore();

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs space-y-4 text-left">
      <div className="flex justify-between items-center border-b pb-2.5">
        <div className="flex items-center gap-1.5">
          <h3 className="text-xs font-extrabold text-[#0b1c30] uppercase tracking-wider font-headline">Items in Basket</h3>
          <span className="bg-emerald-50 text-[#006e2f] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
            {totalItemCount}
          </span>
        </div>
        {basket.length > 0 && (
          <button 
            type="button"
            onClick={() => {
              playSound('delete');
              clearBasket();
              addNotification("Cleaned up basket contents.");
            }} 
            className="text-[10px] text-slate-400 hover:text-red-500 font-semibold border-0 bg-transparent cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {basket.length === 0 ? (
        <div className="py-12 text-center space-y-3.5">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-100/70">
            <ShoppingBasket className="w-5.5 h-5.5 text-slate-400" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 font-headline">No goods inside basket</h4>
            <p className="text-[10px] text-slate-400 max-w-[220px] mx-auto leading-relaxed">
              Snap photos with scanning lens triggers above or enter item details manually.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {basket.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -30 }}
                className="bg-slate-50 border border-slate-100 p-2 rounded-xl flex gap-2.5 items-center justify-between"
              >
                <div className="w-10 h-10 rounded-lg bg-white overflow-hidden relative flex-shrink-0 border border-slate-200/50">
                  <img 
                    src={item.productImage} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{item.name}</h4>
                  <span className="text-[8px] bg-slate-200/80 text-slate-500 rounded p-0.5 px-1.5 font-bold uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Stepper controls */}
                  <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5">
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 active:scale-90 border-0 cursor-pointer"
                    >
                      <Minus className="w-2.5 h-2.5" />
                    </button>
                    <span className="text-xs font-bold px-1.5 text-slate-700 min-w-4 text-center font-price">
                      {item.quantity}
                    </span>
                    <button 
                      type="button"
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 hover:bg-slate-100 rounded text-slate-500 active:scale-90 border-0 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  {/* Pricing info */}
                  <div className="text-right min-w-[50px]">
                    <p className="text-xs font-bold font-price text-[#0b1c30]">
                      {currency}{(item.price * item.quantity).toFixed(0)}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-[8px] text-slate-400 font-mono">
                        {currency}{item.price.toFixed(0)} ea
                      </p>
                    )}
                  </div>

                  <button 
                    type="button"
                    onClick={() => deleteItem(item.id, item.name)}
                    className="p-1 text-slate-300 hover:text-red-500 rounded transition-colors border-0 bg-transparent cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Persistent widescreen calculations */}
      {basket.length > 0 && isWidescreen && (
        <div className="border-t border-slate-100 pt-3.5 space-y-2.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Subtotal:</span>
            <span className="font-medium font-price">{currency}{totalAmount.toFixed(2)}</span>
          </div>
          
          {dynamicDiscount > 0 && (
            <div className="flex justify-between text-xs text-[#006e2f] bg-emerald-50/70 p-2 rounded-lg">
              <span className="flex items-center gap-1 font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Savings Deductions:
              </span>
              <span className="font-bold font-price">-{currency}{dynamicDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm pt-1 border-t">
            <span className="font-bold text-slate-900 font-headline">Grand Total:</span>
            <span className="font-extrabold text-base font-price text-[#006e2f]">
              {currency}{finalAmount.toFixed(2)}
            </span>
          </div>

          {isOverBudget && (
            <div className="bg-red-50 text-red-700 text-[10px] p-2.5 rounded-lg flex items-start gap-1.5 leading-snug">
              <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
              <span>Exceeds limit of {currency}{budget} by {currency}{(finalAmount - budget).toFixed(2)}! Consider buying fewer items.</span>
            </div>
          )}

          <button 
            type="button"
            onClick={() => {
              playSound('click');
              setIsCheckoutOpen(true);
            }}
            className="w-full py-3 bg-[#006e2f] hover:bg-emerald-800 text-white text-xs uppercase tracking-wider font-extrabold rounded-xl shadow-lg transition-all border-0 cursor-pointer"
          >
            Confirm order and Pay
          </button>
        </div>
      )}
    </div>
  );
}
