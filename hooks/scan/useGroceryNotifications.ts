'use client';

import { useState } from 'react';
import { SoundType } from '../../store/types';

export function useGroceryNotifications(playSound: (type: SoundType) => void) {
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to CartSnap! Snap a photo of your product, enter its price, and start tracking your budget."
  ]);
  const [showNotificationBadge, setShowNotificationBadge] = useState<boolean>(true);
  const [showNotificationsList, setShowNotificationsList] = useState<boolean>(false);

  const addNotification = (text: string) => {
    setNotifications(prev => [text, ...prev]);
    setShowNotificationBadge(true);
  };

  const clearNotifications = () => {
    setNotifications([]);
    playSound('delete');
  };

  return {
    notifications,
    showNotificationBadge,
    setShowNotificationBadge,
    showNotificationsList,
    setShowNotificationsList,
    addNotification,
    clearNotifications
  };
}
