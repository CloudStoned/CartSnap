'use client';

import { useState } from 'react';
import { GroceryItem, SoundType } from '../store/types';

let uniqueCounter = 0;
function getUniquelyGeneratedId(): string {
  uniqueCounter += 1;
  return `item-${Date.now()}-${uniqueCounter}`;
}

function generateRandomReceiptRef(): string {
  return `FT-${Math.floor(Math.random() * 900000 + 100000)}`;
}

export function useGroceryBasket(
  productPhoto: string | null,
  scannedName: string,
  scannedPrice: string,
  scannedCategory: string,
  setProductPhoto: (photo: string | null) => void,
  setScannedName: (name: string) => void,
  setScannedPrice: (price: string) => void,
  switchTab: (tab: 'home' | 'scan' | 'account') => void,
  playSound: (type: SoundType) => void,
  addNotification: (text: string) => void,
  budget: number
) {
  const [basket, setBasket] = useState<GroceryItem[]>([]);
  const [receiptRef, setReceiptRef] = useState<string>('FT-128394');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [showOrderDone, setShowOrderDone] = useState<boolean>(false);

  const handleAddToBasket = () => {
    // 1. Validation: product photo must be captured/uploaded
    if (!productPhoto) {
      alert("Please capture a product photo first.");
      return;
    }
    
    // 2. Validation: price is required
    const trimmedPrice = scannedPrice.trim();
    if (!trimmedPrice) {
      alert("Please enter the price.");
      return;
    }
    const priceNum = parseFloat(trimmedPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      alert("Please enter a valid price greater than 0.");
      return;
    }

    // 3. Name is optional: default to 'Grocery Item' if empty
    const finalName = scannedName.trim() || 'Grocery Item';
    
    const newItem: GroceryItem = {
      id: getUniquelyGeneratedId(),
      name: finalName,
      category: scannedCategory,
      price: priceNum,
      quantity: 1,
      productImage: productPhoto,
      priceImage: ''
    };

    setBasket(prev => {
      const existingIdx = prev.findIndex(item => item.name.toLowerCase() === finalName.toLowerCase() && item.category === scannedCategory);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        return updated;
      }
      return [...prev, newItem];
    });

    playSound('success');
    addNotification(`Added 1x "${finalName}" into basket.`);
    
    setProductPhoto(null);
    setScannedName('');
    setScannedPrice('');
    
    switchTab('home');
  };

  const updateQuantity = (id: string, delta: number) => {
    playSound('click');
    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, newQty) };
      }
      return item;
    }));
  };

  const deleteItem = (id: string, name: string) => {
    playSound('delete');
    setBasket(prev => prev.filter(item => item.id !== id));
    addNotification(`Removed "${name}" from basket.`);
  };

  const clearBasket = () => {
    setBasket([]);
  };

  const handleConfirmCheckout = () => {
    playSound('success');
    setReceiptRef(generateRandomReceiptRef());
    setShowOrderDone(true);
    setIsCheckoutOpen(false);
    clearBasket();
    addNotification(`Checked out successfully! Thank you for using CartSnap.`);
  };

  // Calculations
  const totalItemCount = basket.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const getDiscounts = () => {
    let savings = 0;
    const produceCount = basket.filter(item => item.category === 'Produce').reduce((sum, item) => sum + item.quantity, 0);
    
    if (produceCount >= 3) {
      const produceTotal = basket
        .filter(item => item.category === 'Produce')
        .reduce((sum, item) => sum + (item.price * item.quantity), 0);
      savings += produceTotal * 0.15;
    }

    const hasBakery = basket.some(item => item.category === 'Bakery');
    const hasDairy = basket.some(item => item.category === 'Dairy');
    if (hasBakery && hasDairy) {
      savings += 35.00;
    }

    return Math.min(savings, totalAmount);
  };

  const dynamicDiscount = getDiscounts();
  const finalAmount = Math.max(0, totalAmount - dynamicDiscount);
  const isOverBudget = finalAmount > budget;

  return {
    basket,
    receiptRef,
    isCheckoutOpen,
    setIsCheckoutOpen,
    showOrderDone,
    setShowOrderDone,
    handleAddToBasket,
    updateQuantity,
    deleteItem,
    clearBasket,
    handleConfirmCheckout,
    totalItemCount,
    totalAmount,
    dynamicDiscount,
    finalAmount,
    isOverBudget
  };
}
