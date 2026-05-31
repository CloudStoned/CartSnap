'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGroceryStore } from '../store/GroceryStore';

export default function NotificationLogs() {
  const {
    showNotificationsList,
    clearNotifications,
    notifications
  } = useGroceryStore();

  return (
    <AnimatePresence>
      {showNotificationsList && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white border border-[#0d1c30]/10 rounded-2xl shadow-xl p-4 max-w-lg mx-auto max-h-[220px] overflow-y-auto text-left"
        >
          <div className="flex justify-between items-center mb-2 pb-1.5 border-b">
            <span className="text-[10px] font-bold font-headline text-slate-500 uppercase tracking-widest">SYSTEM EVENT MONITOR LOGS</span>
            <button 
              type="button"
              onClick={clearNotifications} 
              className="text-[10px] text-red-600 font-extrabold border-0 bg-transparent cursor-pointer"
            >
              Clear log list
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-400">No events logged yet. Tap scan elements.</div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {notifications.map((note, i) => (
                <div key={i} className="text-[10px] leading-snug bg-slate-50 text-slate-700 p-2 rounded-lg border-l-2 border-[#006e2f]">
                  {note}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
