'use client';

import React from 'react';
import { useGroceryStore } from '../../store/GroceryStore';
import { cn } from '../../lib/utils';

export default function SoundSetting() {
  const { soundEnabled, setSoundEnabled, playSound } = useGroceryStore();

  return (
    <div className="flex justify-between items-center text-xs">
      <div className="space-y-0.5">
        <span className="font-bold text-slate-700 font-headline">Synth Audio feedback</span>
        <p className="text-[9px] text-slate-400">Beeper tones when barcodes trigger.</p>
      </div>
      <button 
        type="button"
        onClick={() => {
          setSoundEnabled(!soundEnabled);
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
  );
}
