'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useGroceryStore } from '@/store/GroceryStore';
import { fetchReceiptsWithItems } from '@/lib/queries/checkout';
import { Receipt, DaySpending } from '@/components/insights/types';
import { calculateDailyData } from './insightsHelper';

/**
 * Custom hook to orchestrate loading, animation, and interaction state for insights.
 */
export function useInsights() {
  const { session } = useAuth();
  const { playSound } = useGroceryStore();
  const userId = session?.user?.id;

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [dailyData, setDailyData] = useState<DaySpending[]>([]);
  const [selectedDateString, setSelectedDateString] = useState<string>('');
  const [animationTrigger, setAnimationTrigger] = useState<boolean>(false);

  // 1. Fetch checkout history from Supabase
  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    fetchReceiptsWithItems(userId)
      .then((data) => {
        setReceipts((data || []) as Receipt[]);
        setIsDemo(false);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load insights data:', err);
        setReceipts([]);
        setIsDemo(false);
        setLoading(false);
      });
  }, [userId]);

  // 2. Generate daily data and default selection
  useEffect(() => {
    if (loading) return;

    const mapped = calculateDailyData(receipts);
    setDailyData(mapped);

    // Default select today
    const todayStr = new Date().toISOString().split('T')[0];
    setSelectedDateString(todayStr);

    // Trigger visual slide-up animation
    const timer = setTimeout(() => {
      setAnimationTrigger(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [receipts, loading]);

  const handleBarClick = (dateString: string) => {
    playSound('click');
    setSelectedDateString(dateString);
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
    dailyData,
    selectedDateString,
    animationTrigger,
    selectedDay,
    maxSpend,
    weeklyTotal,
    handleBarClick,
  };
}
