'use client';

import React from 'react';
import { Calendar, BarChart3 } from 'lucide-react';
import { DaySpending } from './types';
import { MonthOption } from '@/hooks/insights';

interface DailyChartProps {
  dailyData: DaySpending[];
  selectedDateString: string;
  maxSpend: number;
  currency: string;
  animationTrigger: boolean;
  onBarClick: (dateString: string) => void;
  monthOptions: MonthOption[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export default function DailyChart({
  dailyData,
  selectedDateString,
  maxSpend,
  currency,
  animationTrigger,
  onBarClick,
  monthOptions,
  selectedMonth,
  onMonthChange
}: DailyChartProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-slate-800">
            Daily Budget Chart
          </h4>
        </div>

        {/* Premium Month Dropdown */}
        {monthOptions.length > 0 && (
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-100 rounded-xl px-4 py-1.5 pr-8 text-[11px] font-bold text-slate-700 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Graph Visual Area */}
      {dailyData.length > 0 ? (
        <div className="h-44 flex items-end gap-2.5 sm:gap-4 justify-start border-b border-slate-100 pb-2 px-1 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {dailyData.map((d) => {
            const heightPercent = (d.totalSpent / maxSpend) * 100;
            const isSelected = d.dateString === selectedDateString;
            
            return (
              <div 
                key={d.dateString}
                onClick={() => onBarClick(d.dateString)}
                className="min-w-[40px] flex-1 max-w-[65px] flex flex-col items-center group cursor-pointer h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded-md font-mono pointer-events-none z-10">
                  {currency}{d.totalSpent.toFixed(2)}
                </div>

                {/* The Bar */}
                <div className="w-full relative h-full flex flex-col justify-end">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-700 ease-out relative ${
                      isSelected 
                        ? 'bg-gradient-to-t from-[#006e2f] to-[#10b981] shadow-md shadow-emerald-200' 
                        : 'bg-slate-100 hover:bg-slate-200 group-hover:bg-slate-200'
                    }`}
                    style={{ 
                      height: animationTrigger ? `${Math.max(d.totalSpent > 0 ? 6 : 0, heightPercent)}%` : '0%' 
                    }}
                  >
                    {/* Selected Indicator Tip */}
                    {isSelected && (
                      <span className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Day Labels */}
                <div className="mt-2 text-center select-none">
                  <span className={`block text-[9px] font-bold tracking-tight leading-none ${
                    isSelected ? 'text-[#006e2f]' : 'text-slate-400'
                  }`}>
                    {d.dayOfWeek}
                  </span>
                  <span className={`block text-[11px] font-black font-headline mt-0.5 leading-none ${
                    isSelected ? 'text-[#0b1c30] font-black' : 'text-slate-600'
                  }`}>
                    {d.dayOfMonth}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-44 flex flex-col items-center justify-center border-b border-slate-100 pb-2 px-1 text-center">
          <div className="w-10 h-10 rounded-full bg-slate-50/80 border border-slate-100 flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>
          <h5 className="text-[11px] font-bold text-[#0b1c30]">No activity recorded</h5>
          <p className="text-[9px] text-slate-400 mt-1 max-w-[220px]">
            No checkouts recorded for this month.
          </p>
        </div>
      )}
    </div>
  );
}
