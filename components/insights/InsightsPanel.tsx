'use client';

import React from 'react';
import { useGroceryStore } from '@/store/GroceryStore';
import { useInsights } from '@/hooks/insights';
import DailyChart from './DailyChart';
import CheckoutDetails from './CheckoutDetails';
import InsightsHeader from './InsightsHeader';

export default function InsightsPanel() {
  const { currency } = useGroceryStore();
  const {
    receipts,
    isDemo,
    loading,
    dailyData,
    selectedDateString,
    animationTrigger,
    selectedDay,
    maxSpend,
    handleBarClick,
  } = useInsights();

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-bold tracking-widest font-mono uppercase font-bold">Assembling analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Summary Card (Averages comparison) */}
      <InsightsHeader 
        receipts={receipts}
        currency={currency}
        isDemo={isDemo}
      />

      {/* 2. Interactive Bar Graph Subcomponent */}
      <DailyChart 
        dailyData={dailyData}
        selectedDateString={selectedDateString}
        maxSpend={maxSpend}
        currency={currency}
        animationTrigger={animationTrigger}
        onBarClick={handleBarClick}
      />

      {/* 3. Daily Purchase Breakdown Details Subcomponent */}
      <CheckoutDetails 
        selectedDay={selectedDay}
        currency={currency}
      />
    </div>
  );
}
