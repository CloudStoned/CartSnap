'use client';

import { useState, useEffect, useMemo } from 'react';
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
  // Default selected date string is today
  const [selectedDateString, setSelectedDateString] = useState<string>(() => formatLocalDate(new Date()));

  // 1. Generate months list derived from receipts (using useMemo to avoid unnecessary calculations)
  const monthsList = useMemo(() => generateMonthsList(receipts), [receipts]);

  // 2. Load checkout history from Supabase
  useEffect(() => {
    if (!userId) return;

    // Defer loading state update to avoid synchronous state transitions inside effect body
    Promise.resolve().then(() => {
      setLoading(true);
    });

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
