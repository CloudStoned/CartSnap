'use client';

import React from 'react';

export default function AuthHeader() {
  return (
    <div className="flex flex-col items-center mb-6">
      <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100 mb-3 overflow-hidden">
        <img src="/logo.png" alt="CartSnap Logo" className="w-11 h-11 object-contain" />
      </div>
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0b1c30] font-headline">
        Welcome to CartSnap
      </h2>
      <p className="text-xs text-slate-500 mt-1 font-sans text-center">
        Scan products, extract prices, and track your grocery budget in real-time.
      </p>
    </div>
  );
}
