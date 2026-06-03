'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useGroceryStore } from '@/store/GroceryStore';
import { fetchReceiptsWithItems } from '@/lib/queries/checkout';
import { Receipt } from '@/components/insights/types';
import { generateMonthsList } from './calendarHelper';
import { formatLocalDate } from '@/lib/utils';

/**
 * Custom hook to orchestrate loading, scrolling, and day selection state for the calendar.
 */
export function useCalendar() {
  const { playSound } = useGroceryStore();
  const { session } = useAuth();
  const userId = session?.user?.id;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [monthsList, setMonthsList] = useState<Date[]>([]);

  // 1. Generate months list
  useEffect(() => {
    setMonthsList(generateMonthsList());
  }, []);

  // 2. Load checkout history from Supabase
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchReceiptsWithItems(userId)
      .then((data) => {
        setReceipts((data || []) as Receipt[]);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load receipts for calendar:', err);
        setReceipts([]);
        setLoading(false);
      });
  }, [userId]);

  // Set default selection to today
  useEffect(() => {
    setSelectedDateString(formatLocalDate(new Date()));
  }, []);

  // 3. Auto-scroll to the current month inside the scroll container
  useEffect(() => {
    if (!loading && monthsList.length > 0) {
      const timer = setTimeout(() => {
        const currentMonthEl = document.getElementById('current-month');
        if (currentMonthEl) {
          currentMonthEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, monthsList]);

  const handleDayClick = (dateStr: string) => {
    playSound('click');
    setSelectedDateString(dateStr);
  };

  return {
    receipts,
    loading,
    selectedDateString,
    monthsList,
    handleDayClick,
  };
}
