'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useGroceryStore } from '@/store/GroceryStore';
import { fetchReceiptsWithItems, deleteReceiptItem } from '@/lib/queries/checkout';
import { Receipt, DaySpending } from '@/components/insights/types';
import { getAvailableMonths, calculateMonthDailyData, MonthOption } from './insightsHelper';
import { formatLocalDate } from '@/lib/utils';

/**
 * Custom hook to orchestrate insights data, including month selection dropdown
 * and filtering for only dates with spending.
 */
export function useInsights() {
  const { session } = useAuth();
  const { playSound } = useGroceryStore();
  const userId = session?.user?.id;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const [monthOptions, setMonthOptions] = useState<MonthOption[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(''); // "YYYY-MM"
  
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [animationTrigger, setAnimationTrigger] = useState<boolean>(false);

  // Derive dailyData from receipts and selectedMonth using useMemo to avoid state cascading and unnecessary updates
  const dailyData = useMemo(() => {
    if (!selectedMonth) return [];
    return calculateMonthDailyData(receipts, selectedMonth);
  }, [receipts, selectedMonth]);

  // 1. Fetch checkout history from Supabase
  useEffect(() => {
    if (!userId) return;

    Promise.resolve().then(() => {
      setLoading(true);
    });
    fetchReceiptsWithItems(userId)
      .then((data) => {
        const userReceipts = (data || []) as Receipt[];
        setReceipts(userReceipts);
        setIsDemo(false);
        
        // Determine available months
        const options = getAvailableMonths(userReceipts);
        setMonthOptions(options);
        
        // Default select the most recent month option
        if (options.length > 0) {
          setSelectedMonth(options[0].value);
        }
        
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load insights data:', err);
        setReceipts([]);
        setIsDemo(false);
        setLoading(false);
      });
  }, [userId]);

  // 2. Generate daily data selections when receipts or selectedMonth changes
  useEffect(() => {
    if (loading || !selectedMonth) return;

    // Reset animation trigger so it plays again on month change
    Promise.resolve().then(() => {
      setAnimationTrigger(false);
    });

    // Default select the first active day in this month if available
    if (dailyData.length > 0) {
      const todayStr = formatLocalDate(new Date());
      const hasToday = dailyData.some((d) => d.dateString === todayStr);
      
      // Defer state update to avoid synchronous state transitions inside effect body
      Promise.resolve().then(() => {
        setSelectedDateString((prev) => {
          // Keep previous selection if it's still in the current dailyData, otherwise update
          const isValid = dailyData.some((d) => d.dateString === prev);
          if (isValid) return prev;
          return hasToday ? todayStr : dailyData[0].dateString;
        });
      });
    } else {
      Promise.resolve().then(() => {
        setSelectedDateString('');
      });
    }

    // Trigger visual slide-up animation
    const timer = setTimeout(() => {
      setAnimationTrigger(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [dailyData, loading, selectedMonth]);

  const handleBarClick = (dateString: string) => {
    playSound('click');
    setSelectedDateString(dateString);
  };

  const handleMonthChange = (monthValue: string) => {
    playSound('click');
    setSelectedMonth(monthValue);
  };

  const handleRemoveItem = async (itemId: string) => {
    playSound('delete');
    try {
      await deleteReceiptItem(itemId);
      
      // Reload receipts to update all analytics calculations
      if (userId) {
        setLoading(true);
        const data = await fetchReceiptsWithItems(userId);
        const userReceipts = (data || []) as Receipt[];
        setReceipts(userReceipts);
        setIsDemo(false);

        // Re-determine available months
        const options = getAvailableMonths(userReceipts);
        setMonthOptions(options);

        // Keep selected month if still valid, otherwise default to first available
        if (options.length > 0) {
          const stillValid = options.some((opt) => opt.value === selectedMonth);
          if (!stillValid) {
            setSelectedMonth(options[0].value);
          }
        } else {
          setSelectedMonth('');
        }
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to remove receipt item:', err);
      setLoading(false);
    }
  };

  // Find currently selected day
  const selectedDay = dailyData.find((d) => d.dateString === selectedDateString);

  // Maximum spend amount for graph height scale mapping
  const maxSpend = Math.max(...dailyData.map((d) => d.totalSpent), 1);

  // Total weekly spending sum
  const weeklyTotal = dailyData.reduce((sum, d) => sum + d.totalSpent, 0);

  return {
    receipts,
    isDemo,
    loading,
    monthOptions,
    selectedMonth,
    setSelectedMonth: handleMonthChange,
    dailyData,
    selectedDateString,
    animationTrigger,
    selectedDay,
    maxSpend,
    weeklyTotal,
    handleBarClick,
    handleRemoveItem,
  };
}
