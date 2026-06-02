'use client';

import React from 'react';
import { Home, Camera, User, BarChart3 } from 'lucide-react';
import { useGroceryStore } from '../../store/GroceryStore';

export default function MobileNav() {
  const {
    activeTab,
    switchTab
  } = useGroceryStore();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-indigo-50/70 h-[66px] px-2 flex justify-around items-center z-35 shadow-lg">
      {/* Tab 1: Home */}
      <button 
        type="button"
        onClick={() => switchTab('home')}
        className={`flex flex-col items-center justify-center gap-1 w-14 h-full relative transition-all active:scale-95 border-0 bg-transparent cursor-pointer ${
          activeTab === 'home' ? "text-[#006e2f]" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <Home className="w-5 h-5 animate-fade-in" />
        <span className="text-[10px] font-bold font-headline">Home</span>
        {activeTab === 'home' && (
          <span className="absolute bottom-1 w-1 h-1 bg-[#006e2f] rounded-full animate-fade-in" />
        )}
      </button>

      {/* Tab 2: Snapshot trigger FAB */}
      <div className="relative -top-4 w-18 h-12 flex items-center justify-center">
        <button 
          type="button"
          onClick={() => switchTab('scan')}
          className={`w-13 h-13 rounded-full flex items-center justify-center transform transition-all active:scale-90 shadow-lg border-4 border-white cursor-pointer ${
            activeTab === 'scan' 
              ? "bg-[#22c55e] text-white shadow-[#22c55e]/25 animate-bounce" 
              : "bg-[#006e2f] text-white hover:bg-emerald-800 shadow-[#006e2f]/35"
          }`}
          style={{ animationDuration: activeTab === 'scan' ? '2.5s' : '0s' }}
          title="Scan items"
        >
          <Camera className="w-5.5 h-5.5 shrink-0" />
        </button>
      </div>

      {/* Tab 3: Insights */}
      <button 
        type="button"
        onClick={() => switchTab('insights')}
        className={`flex flex-col items-center justify-center gap-1 w-14 h-full relative transition-all active:scale-95 border-0 bg-transparent cursor-pointer ${
          activeTab === 'insights' ? "text-[#006e2f]" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <BarChart3 className="w-5 h-5 animate-fade-in" />
        <span className="text-[10px] font-bold font-headline">Insights</span>
        {activeTab === 'insights' && (
          <span className="absolute bottom-1 w-1 h-1 bg-[#006e2f] rounded-full animate-fade-in" />
        )}
      </button>

      {/* Tab 4: Account / Settings */}
      <button 
        type="button"
        onClick={() => switchTab('account')}
        className={`flex flex-col items-center justify-center gap-1 w-14 h-full relative transition-all active:scale-95 border-0 bg-transparent cursor-pointer ${
          activeTab === 'account' ? "text-[#006e2f]" : "text-slate-400 hover:text-slate-600"
        }`}
      >
        <User className="w-5 h-5 animate-fade-in" />
        <span className="text-[10px] font-bold font-headline">Account</span>
        {activeTab === 'account' && (
          <span className="absolute bottom-1 w-1 h-1 bg-[#006e2f] rounded-full animate-fade-in" />
        )}
      </button>
    </nav>
  );
}
