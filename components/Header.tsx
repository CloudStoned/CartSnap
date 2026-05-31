'use client';

import React from 'react';
import { ShoppingBasket, Sparkles, Volume2, VolumeX, Bell } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';

export default function Header() {
  const {
    soundEnabled,
    setSoundEnabled,
    playSound,
    showNotificationBadge,
    setShowNotificationBadge,
    showNotificationsList,
    setShowNotificationsList
  } = useGroceryStore();

  return (
    <header className="sticky top-0 bg-white border-b border-indigo-50/50 px-4 sm:px-6 py-3.5 flex justify-between items-center z-20 shadow-xs">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md overflow-hidden border border-slate-100">
          <img src="/logo.png" alt="CartSnap Logo" className="w-7 h-7 object-contain" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#0b1c30] font-headline">
              CartSnap
            </h1>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-[#006e2f]">
              <Sparkles className="w-2.5 h-2.5 mr-0.5 text-emerald-600 animate-pulse" /> Gemini Vision Active
            </span>
          </div>
          <p className="text-[9px] text-[#006e2f] font-mono tracking-widest font-black uppercase">SMART GROCERY DASHBOARD</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* API Indicator */}
        <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 bg-slate-50 p-1.5 px-3 rounded-lg border border-slate-100/85">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Twin-Lens OCR
        </span>

        {/* Sound Toggle */}
        <button 
          type="button" 
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            // We use setTimeout because state update is asynchronous and we want to play sound immediately if unmutes, or use current value
            playSound('click');
          }} 
          className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-colors relative"
          title={soundEnabled ? "Mute beep sound" : "Unmute beep sound"}
        >
          {soundEnabled ? <Volume2 className="w-4.5 h-4.5 text-[#006e2f]" /> : <VolumeX className="w-4.5 h-4.5 text-slate-300" />}
        </button>

        {/* System Logs trigger */}
        <button 
          onClick={() => {
            setShowNotificationsList(!showNotificationsList);
            setShowNotificationBadge(false);
            playSound('click');
          }}
          className="p-1.5 sm:p-2 hover:bg-slate-50 text-slate-600 rounded-lg transition-all relative"
          title="Supermarket event monitors"
        >
          <Bell className="w-4.5 h-4.5" />
          {showNotificationBadge && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full ring-2 ring-white animate-bounce" />
          )}
        </button>
      </div>
    </header>
  );
}
