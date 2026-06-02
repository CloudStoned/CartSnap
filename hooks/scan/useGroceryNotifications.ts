'use client';

import { useState } from 'react';
import { SoundType } from '../../store/types';

export function useGroceryNotifications(playSound: (type: SoundType) => void) {
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to CartSnap! Scan items locally and offline using PaddleOCR."
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
