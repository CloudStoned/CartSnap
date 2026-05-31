'use client';

import React from 'react';
import { useGroceryStore } from '../store/GroceryStore';
import { cn } from '../lib/utils';

export default function SettingsPanel() {
  const {
    currency,
    setCurrency,
    soundEnabled,
    setSoundEnabled,
    budget,
    setBudget,
    playSound
  } = useGroceryStore();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-4 text-left">
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-headline pb-1.5 border-b">Settings Panel</h4>
      
      {/* Currency Toggle */}
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

      {/* Sound Toggle */}
      <div className="flex justify-between items-center text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-700 font-headline">Synth Audio feedback</span>
          <p className="text-[9px] text-slate-400">Beeper tones when barcodes trigger.</p>
        </div>
        <button 
          type="button"
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            // playSound is called inside state setter or directly. Since setSoundEnabled updates state asynchronously, we can call playSound immediately.
            playSound('click');
          }}
          className={cn(
            "w-9 h-5.5 rounded-full p-0.5 transition-colors relative flex items-center border-0 cursor-pointer outline-hidden",
            soundEnabled ? "bg-[#006e2f]" : "bg-slate-200"
          )}
        >
          <span className={cn(
            "w-4.5 h-4.5 bg-white rounded-full transition-all shadow-sm absolute",
            soundEnabled ? "left-4" : "left-0.5"
          )} />
        </button>
      </div>

      {/* sliding budget monitor */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-slate-700 font-headline">Supermarket daily limit slider</span>
          <span className="font-bold text-slate-800 font-price">{currency}{budget}</span>
        </div>
        
        <input 
          type="range" 
          min="300"
          max="5000"
          step="100"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full accent-[#006e2f] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
        />
        
        <div className="flex justify-between text-[8px] text-slate-400 font-mono">
          <span>{currency}300</span>
          <span>{currency}5,000</span>
        </div>
      </div>
    </div>
  );
}
