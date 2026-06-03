'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { GroceryContextType } from './types';

// Custom Hooks
import { useGrocerySettings } from '../hooks/settings';
import { useGroceryNotifications } from '../hooks/scan/useGroceryNotifications';
import { useGroceryScan } from '../hooks/scan';
import { useGroceryBasket } from '../hooks/useGroceryBasket';
import { useCamera } from '../hooks/useCamera';
import { useAuth } from '../hooks/auth/useAuth';

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export function GroceryProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  // 1. Settings state & logic
  const settings = useGrocerySettings(userId);

  // 2. Notifications log logic (depends on settings.playSound)
  const notifications = useGroceryNotifications(settings.playSound);

  // 3. Scanning state & logic (depends on settings.playSound, notifications.addNotification)
  const scan = useGroceryScan(settings.playSound, notifications.addNotification);

  // 4. Camera state & refs
  const camera = useCamera({
    setCameraActive: scan.setCameraActive,
    setProductPhoto: scan.setProductPhoto,
    playSound: settings.playSound,
  });

  // 5. Basket state & calculations (depends on scan, settings, notifications)
  const basket = useGroceryBasket(
    scan.productPhoto,
    scan.scannedName,
    scan.scannedPrice,
    scan.scannedCategory,
    scan.setProductPhoto,
    scan.setScannedName,
    scan.setScannedPrice,
    settings.switchTab,
    settings.playSound,
    notifications.addNotification,
    settings.budget,
    userId,
    settings.currency
  );

  return (
    <GroceryContext.Provider value={{
      activeTab: settings.activeTab,
      switchTab: settings.switchTab,
      currency: settings.currency,
      setCurrency: settings.setCurrency,
      budget: settings.budget,
      setBudget: settings.setBudget,
      soundEnabled: settings.soundEnabled,
      setSoundEnabled: settings.setSoundEnabled,
      playSound: settings.playSound,
      categories: settings.categories,
      customCategories: settings.customCategories,
      addCustomCategory: settings.addCustomCategory,
      removeCustomCategory: settings.removeCustomCategory,
      
      basket: basket.basket,
      receiptRef: basket.receiptRef,
      totalItemCount: basket.totalItemCount,
      totalAmount: basket.totalAmount,
      dynamicDiscount: basket.dynamicDiscount,
      finalAmount: basket.finalAmount,
      isOverBudget: basket.isOverBudget,
      
      productPhoto: scan.productPhoto,
      setProductPhoto: scan.setProductPhoto,
      scannedName: scan.scannedName,
      setScannedName: scan.setScannedName,
      scannedPrice: scan.scannedPrice,
      setScannedPrice: scan.setScannedPrice,
      scannedCategory: scan.scannedCategory,
      setScannedCategory: scan.setScannedCategory,
      cameraActive: scan.cameraActive,
      setCameraActive: scan.setCameraActive,
      
      videoRef: camera.videoRef,
      canvasRef: camera.canvasRef,
      startCamera: camera.startCamera,
      capturePhoto: camera.capturePhoto,
      stopCamera: camera.stopCamera,
      
      isCheckoutOpen: basket.isCheckoutOpen,
      setIsCheckoutOpen: basket.setIsCheckoutOpen,
      showOrderDone: basket.showOrderDone,
      setShowOrderDone: basket.setShowOrderDone,
      
      notifications: notifications.notifications,
      showNotificationBadge: notifications.showNotificationBadge,
      setShowNotificationBadge: notifications.setShowNotificationBadge,
      showNotificationsList: notifications.showNotificationsList,
      setShowNotificationsList: notifications.setShowNotificationsList,
      addNotification: notifications.addNotification,
      clearNotifications: notifications.clearNotifications,
      
      handleAddToBasket: basket.handleAddToBasket,
      removePhoto: scan.removePhoto,
      updateQuantity: basket.updateQuantity,
      deleteItem: basket.deleteItem,
      handleConfirmCheckout: basket.handleConfirmCheckout,
      clearBasket: basket.clearBasket
    }}>
      {children}
    </GroceryContext.Provider>
  );
}

export function useGroceryStore() {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGroceryStore must be used within a GroceryProvider');
  }
  return context;
}
