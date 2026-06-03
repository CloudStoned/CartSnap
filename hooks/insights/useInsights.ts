'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useGroceryStore } from '@/store/GroceryStore';
import { fetchReceiptsWithItems } from '@/lib/queries/checkout';
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
  
  const [dailyData, setDailyData] = useState<DaySpending[]>([]);
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [animationTrigger, setAnimationTrigger] = useState<boolean>(false);

  // 1. Fetch checkout history from Supabase
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
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

  // 2. Generate daily data when receipts or selectedMonth changes
  useEffect(() => {
    if (loading || !selectedMonth) return;

    // Reset animation trigger so it plays again on month change
    setAnimationTrigger(false);

    const mapped = calculateMonthDailyData(receipts, selectedMonth);
    setDailyData(mapped);

    // Default select the first active day in this month if available
    if (mapped.length > 0) {
      const todayStr = formatLocalDate(new Date());
      const hasToday = mapped.some((d) => d.dateString === todayStr);
      setSelectedDateString(hasToday ? todayStr : mapped[0].dateString);
    } else {
      setSelectedDateString('');
    }

    // Trigger visual slide-up animation
    const timer = setTimeout(() => {
      setAnimationTrigger(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [receipts, loading, selectedMonth]);

  const handleBarClick = (dateString: string) => {
    playSound('click');
    setSelectedDateString(dateString);
  };

  const handleMonthChange = (monthValue: string) => {
    playSound('click');
    setSelectedMonth(monthValue);
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
  };
}
