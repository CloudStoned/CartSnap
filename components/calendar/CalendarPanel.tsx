'use client';

import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useGroceryStore } from '@/store/GroceryStore';
import { useCalendar, getDayDetails } from '@/hooks/calendar';

export default function CalendarPanel() {
  const { currency } = useGroceryStore();
  const {
    receipts,
    loading,
    selectedDateString,
    monthsList,
    handleDayClick,
  } = useCalendar();

  const weekdayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="bg-white border border-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[350px] shadow-sm">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-bold tracking-widest font-mono uppercase">Syncing calendar...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs text-left">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-3">
        <CalendarIcon className="w-4 h-4 text-emerald-600" />
        <h4 className="text-xs font-bold font-headline uppercase tracking-wider text-slate-800">
          Expenditure Calendar
        </h4>
      </div>

      {/* Vertically Scrollable months container */}
      <div className="space-y-10 overflow-y-auto max-h-[520px] pr-2 scroll-smooth">
        {monthsList.map((monthDate) => {
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();
          const monthName = monthDate.toLocaleString('en-US', { month: 'long' });

          const daysInMonth = new Date(year, month + 1, 0).getDate();
          const startDayOfWeek = new Date(year, month, 1).getDay();

          const daysGrid: (Date | null)[] = [];
          // Empty padding cells for first week
          for (let i = 0; i < startDayOfWeek; i++) {
            daysGrid.push(null);
          }
          // Days of month
          for (let d = 1; d <= daysInMonth; d++) {
            daysGrid.push(new Date(year, month, d));
          }

          const isCurrentMonth = 
            new Date().getFullYear() === year && 
            new Date().getMonth() === month;

          return (
            <div 
              key={`${year}-${month}`} 
              id={isCurrentMonth ? 'current-month' : undefined}
              className="space-y-4 scroll-mt-2"
            >
              {/* Sticky-like Month Header banner */}
              <div className="flex justify-between items-center bg-slate-50/80 backdrop-blur-xs py-2 px-3 rounded-lg border border-slate-100/50">
                <span className="text-xs font-black text-[#0b1c30] font-headline uppercase tracking-wide">
                  {monthName} {year}
                </span>
                {isCurrentMonth && (
                  <span className="text-[8px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Current Month
                  </span>
                )}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Weekday headers */}
                {weekdayHeaders.map((day) => (
                  <div key={day} className="py-1 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                    {day}
                  </div>
                ))}

                {/* Grid Cells */}
                {daysGrid.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/30 rounded-xl" />;
                  }

                  const dateStr = day.toISOString().split('T')[0];
                  const { totalSpent } = getDayDetails(day, receipts);
                  const isSelected = dateStr === selectedDateString;
                  const isToday = new Date().toISOString().split('T')[0] === dateStr;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDayClick(dateStr)}
                      className={`aspect-square p-1.5 flex flex-col justify-between items-center rounded-xl border transition-all active:scale-95 group cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100 font-bold'
                          : isToday
                          ? 'bg-emerald-50 text-[#006e2f] border-emerald-100 hover:bg-emerald-100/50'
                          : 'bg-white hover:bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      {/* Day number */}
                      <span className="text-[10px] sm:text-xs font-headline font-bold">
                        {day.getDate()}
                      </span>
                      
                      {/* Total Cost Display below date */}
                      {totalSpent > 0 ? (
                        <span className={`text-[7px] sm:text-[9px] font-bold truncate max-w-full px-1 py-0.5 rounded-md leading-none ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-50 text-[#006e2f] font-extrabold'
                        }`}>
                          {currency}{totalSpent.toFixed(0)}
                        </span>
                      ) : (
                        <span className="h-2 w-2" /> // spacing spacer
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
