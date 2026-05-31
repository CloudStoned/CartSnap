'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface AuthAlertsProps {
  error: string | null;
  success: string | null;
}

export default function AuthAlerts({ error, success }: AuthAlertsProps) {
  return (
    <AnimatePresence mode="wait">
      {error && (
        <motion.div
          key="error-alert"
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          className="w-full bg-red-50 border border-red-100 rounded-xl p-3 flex items-start gap-2.5 mb-4 text-left overflow-hidden"
        >
          <AlertCircle className="w-4.5 h-4.5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="text-[11px] font-bold text-red-900 font-headline">Authentication Error</h5>
            <p className="text-[10px] leading-relaxed text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          key="success-alert"
          initial={{ opacity: 0, height: 0, y: -10 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0, y: -10 }}
          className="w-full bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-2.5 mb-4 text-left overflow-hidden"
        >
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h5 className="text-[11px] font-bold text-emerald-900 font-headline">Success</h5>
            <p className="text-[10px] leading-relaxed text-emerald-700">{success}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
