'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, AlertCircle } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';

export default function CheckoutModal() {
  const {
    currency,
    basket,
    totalAmount,
    dynamicDiscount,
    finalAmount,
    budget,
    isOverBudget,
    isCheckoutOpen,
    setIsCheckoutOpen,
    handleConfirmCheckout
  } = useGroceryStore();

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCheckoutOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />
          
          {/* Slate Sheet */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 lg:bottom-auto lg:top-[15%] lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-md bg-white rounded-t-2xl lg:rounded-2xl z-50 p-5 space-y-4 max-h-[85vh] overflow-y-auto border border-slate-100 shadow-2xl flex flex-col text-left"
          >
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto lg:hidden" />
            
            <div className="flex justify-between items-center pb-2.5 border-b">
              <h3 className="text-base font-extrabold text-[#0b1c30] font-headline tracking-tight">Order Invoice Summary</h3>
              <button 
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 px-2.2 text-[#0b1c30] hover:bg-slate-100 rounded-lg text-xs font-semibold border-0 bg-transparent cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* invoice goods list */}
            <div className="divide-y divide-slate-100 max-h-[200px] overflow-y-auto space-y-1.5 pr-1">
              {basket.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-bold text-slate-800 truncate leading-snug">{item.name}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {item.quantity}x • {currency}{item.price.toFixed(0)}
                    </span>
                  </div>
                  <span className="font-bold font-price text-slate-700 flex-shrink-0">
                    {currency}{(item.price * item.quantity).toFixed(0)}
                  </span>
                </div>
              ))}
            </div>

            {/* invoice pricing summary */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal:</span>
                <span className="font-medium font-price">{currency}{totalAmount.toFixed(0)}</span>
              </div>
              
              {dynamicDiscount > 0 && (
                <div className="flex justify-between text-xs text-[#006e2f] bg-emerald-50/60 p-2 rounded-lg">
                  <span className="flex items-center gap-1 font-bold">
                    <Sparkles className="w-3.5 h-3.5" /> Savings deductions:
                  </span>
                  <span className="font-extrabold font-price">-{currency}{dynamicDiscount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm pt-1 border-t">
                <span className="font-bold text-slate-900 font-headline">Grand Total dues:</span>
                <span className="font-black text-lg font-price text-[#006e2f]">
                  {currency}{finalAmount.toFixed(0)}
                </span>
              </div>

              {isOverBudget && (
                <div className="bg-red-50 text-red-700 text-[10px] p-2 rounded-lg flex items-start gap-1.5 leading-snug">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span>Run exceeds Cap slider budget of {currency}{budget} by {currency}{(finalAmount - budget).toFixed(0)}! Consider buying fewer items.</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="space-y-2 pt-2">
              <button 
                type="button"
                onClick={handleConfirmCheckout}
                className="w-full py-3 bg-[#006e2f] hover:bg-emerald-800 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg transition-all border-0 cursor-pointer"
              >
                Approve Order & Settle Payment
              </button>
              <button 
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-semibold hover:bg-slate-50 rounded-xl transition-all block text-center border-0 bg-transparent cursor-pointer"
              >
                Continue Reviewing Basket
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
