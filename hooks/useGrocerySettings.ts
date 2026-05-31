'use client';

import { useState } from 'react';
import { TabType, SoundType } from '../store/types';
import { useAudio } from './useAudio';

export function useGrocerySettings() {
  const { playSound: playSynthSound } = useAudio();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [currency, setCurrency] = useState<'₱' | '$'>('₱');
  const [budget, setBudget] = useState<number>(1000);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const playSound = (type: SoundType) => {
    playSynthSound(type, soundEnabled);
  };

  const switchTab = (tab: TabType) => {
    playSound('click');
    setActiveTab(tab);
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
