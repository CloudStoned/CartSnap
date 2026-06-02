'use client';

import { useState, useEffect } from 'react';
import { TabType, SoundType } from '../store/types';
import { useAudio } from './useAudio';
import { fetchUserSettings, upsertUserSettings } from '@/lib/queries';

export function useGrocerySettings(userId?: string) {
  const { playSound: playSynthSound } = useAudio();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currency, setCurrencyState] = useState<'₱' | '$'>('₱');
  const [budget, setBudgetState] = useState<number>(1000);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(true);

  // 1. Fetch settings from DB on mount/user change
  useEffect(() => {
    if (!userId) return;
    
    fetchUserSettings(userId).then((data) => {
      if (data) {
        if (data.currency) setCurrencyState(data.currency as '₱' | '$');
        if (data.budget_limit !== undefined && data.budget_limit !== null) {
          setBudgetState(Number(data.budget_limit));
        }
        if (data.sound_enabled !== undefined && data.sound_enabled !== null) {
          setSoundEnabledState(data.sound_enabled);
        }
      }
    }).catch((err) => {
      console.error('Failed to load user settings:', err);
    });
  }, [userId]);

  const playSound = (type: SoundType) => {
    playSynthSound(type, soundEnabled);
  };

  const switchTab = (tab: TabType) => {
    playSound('click');
    setActiveTab(tab);
  };

  // 2. Wrap setters to sync with DB
  const setCurrency = async (newCurrency: '₱' | '$') => {
    setCurrencyState(newCurrency);
    if (userId) {
      try {
        await upsertUserSettings(userId, { currency: newCurrency });
      } catch (err) {
        console.error('Failed to save currency:', err);
      }
    }
  };

  const setBudget = async (newBudget: number) => {
    setBudgetState(newBudget);
    if (userId) {
      try {
        await upsertUserSettings(userId, { budget_limit: newBudget });
      } catch (err) {
        console.error('Failed to save budget:', err);
      }
    }
  };

  const setSoundEnabled = async (enabled: boolean) => {
    setSoundEnabledState(enabled);
    if (userId) {
      try {
        await upsertUserSettings(userId, { sound_enabled: enabled });
      } catch (err) {
        console.error('Failed to save sound settings:', err);
      }
    }
  };

  return {
    activeTab,
    switchTab,
    currency,
    setCurrency,
    budget,
    setBudget,
    soundEnabled,
    setSoundEnabled,
    playSound
  };
}
