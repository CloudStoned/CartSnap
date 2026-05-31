'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGroceryStore } from '../store/GroceryStore';

export default function SuccessDialog() {
  const {
    showOrderDone,
    setShowOrderDone,
    receiptRef
  } = useGroceryStore();

  return (
    <AnimatePresence>
      {showOrderDone && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xl text-center space-y-4 max-w-md mx-auto"
        >
          <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Check className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900 font-headline">Order Check-out Approved!</h3>
            <p className="text-xs text-slate-500">Your mock transaction was processed successfully. The basket list is cleared.</p>
          </div>
          
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50 space-y-1.5 text-left">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Receipt ID:</span>
              <span className="font-mono font-medium">{receiptRef}</span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Pay status:</span>
              <span className="text-emerald-700 font-extrabold uppercase">PAID & CLOSED</span>
            </div>
          </div>

          <div className="flex gap-2.5">
            <button 
              type="button"
              onClick={() => setShowOrderDone(false)} 
              className="flex-1 py-2 text-xs bg-[#006e2f] hover:bg-emerald-800 text-white font-semibold rounded-lg transition-all active:scale-95 border-0 cursor-pointer"
            >
              Clear Dialog
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
