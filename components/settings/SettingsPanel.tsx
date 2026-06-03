'use client';

import React from 'react';
import { X } from 'lucide-react';
import { useGroceryStore } from '../../store/GroceryStore';
import { cn } from '../../lib/utils';
import { useAuth } from '@/hooks/auth/useAuth';

export default function SettingsPanel() {
  const {
    currency,
    setCurrency,
    soundEnabled,
    setSoundEnabled,
    budget,
    setBudget,
    playSound,
    customCategories,
    addCustomCategory,
    removeCustomCategory
  } = useGroceryStore();

  const { signOut } = useAuth();

  const handleSignOut = async () => {
    playSound('click');
    await signOut();
  };

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

      {/* sliding budget limit */}
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

      {/* Custom Categories Section */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <span className="font-bold text-slate-700 font-headline text-xs">Custom Departments</span>
            <p className="text-[9px] text-slate-400">Add custom categories for products.</p>
          </div>
          <span className="text-[9px] text-slate-400 font-mono font-bold bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
            {customCategories.length} added
          </span>
        </div>
        
        {/* List of custom categories */}
        {customCategories.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
            {customCategories.map((cat) => (
              <span 
                key={cat} 
                className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#006e2f] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100/50"
              >
                {cat}
                <button
                  type="button"
                  onClick={() => {
                    playSound('delete');
                    removeCustomCategory(cat);
                  }}
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-emerald-100 text-[#006e2f]/70 hover:text-[#006e2f] border-0 cursor-pointer p-0"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[9px] text-slate-400 italic">No custom departments created yet.</p>
        )}

        {/* Input form to add a category */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New Category (e.g. Seafood)"
            id="new-category-input"
            className="flex-1 text-[11px] bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 font-medium text-slate-700 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const btn = document.getElementById('add-category-btn');
                if (btn) btn.click();
              }
            }}
          />
          <button
            type="button"
            id="add-category-btn"
            onClick={() => {
              const input = document.getElementById('new-category-input') as HTMLInputElement;
              if (input && input.value.trim()) {
                const added = addCustomCategory(input.value);
                if (added) {
                  playSound('success');
                  input.value = '';
                } else {
                  playSound('beep');
                }
              }
            }}
            className="px-3.5 py-1.5 bg-[#006e2f] hover:bg-emerald-800 text-white font-bold rounded-xl text-[10px] flex items-center justify-center transition-all active:scale-[0.98] border-0 cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleSignOut}
          className="w-full py-2 bg-red-50 hover:bg-red-100/70 text-red-600 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border-0 cursor-pointer"
        >
          Sign Out of Account
        </button>
      </div>
    </div>
  );
}
