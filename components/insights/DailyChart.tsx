'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface DaySpending {
  dateString: string;
  dayOfWeek: string;
  dayOfMonth: number;
  totalSpent: number;
}

interface DailyChartProps {
  dailyData: DaySpending[];
  selectedDateString: string;
  maxSpend: number;
  currency: string;
  animationTrigger: boolean;
  onBarClick: (dateString: string) => void;
}

export default function DailyChart({
  dailyData,
  selectedDateString,
  maxSpend,
  currency,
  animationTrigger,
  onBarClick
}: DailyChartProps) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-4 h-4 text-emerald-600" />
        <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-slate-800">
          Daily Budget Chart
        </h4>
      </div>

      {/* Graph Visual Area */}
      <div className="h-44 flex items-end gap-2.5 sm:gap-4 justify-between border-b border-slate-100 pb-2 px-1 relative">
        {dailyData.map((d) => {
          const heightPercent = (d.totalSpent / maxSpend) * 100;
          const isSelected = d.dateString === selectedDateString;
          
          return (
            <div 
              key={d.dateString}
              onClick={() => onBarClick(d.dateString)}
              className="flex-1 flex flex-col items-center group cursor-pointer h-full justify-end"
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
              <div className="mt-2 text-center">
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
    </div>
  );
}
