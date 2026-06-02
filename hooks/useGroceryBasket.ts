'use client';

import { useState, useEffect } from 'react';
import { GroceryItem, SoundType } from '../store/types';
import {
  fetchCartItems,
  addCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
  createCheckout
} from '@/lib/queries';

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
  budget: number,
  userId?: string,
  currency: string = '₱'
) {
  const [basket, setBasket] = useState<GroceryItem[]>([]);
  const [receiptRef, setReceiptRef] = useState<string>('FT-128394');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [showOrderDone, setShowOrderDone] = useState<boolean>(false);

  // 1. Fetch initial cart items from Supabase when user ID becomes available
  useEffect(() => {
    if (!userId) {
      setBasket([]);
      return;
    }
    fetchCartItems(userId)
      .then((items) => {
        setBasket(items);
      })
      .catch((err) => {
        console.error('Failed to load active cart items:', err);
      });
  }, [userId]);

  const handleAddToBasket = async () => {
    // Validation: product photo must be captured/uploaded
    if (!productPhoto) {
      alert("Please capture a product photo first.");
      return;
    }
    
    // Validation: price is required
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

    // Name is optional: default to 'Grocery Item' if empty
    const finalName = scannedName.trim() || 'Grocery Item';
    
    const existingItem = basket.find(
      item => item.name.toLowerCase() === finalName.toLowerCase() && item.category === scannedCategory
    );

    if (existingItem) {
      const newQty = existingItem.quantity + 1;
      if (userId) {
        try {
          await updateCartItemQuantity(userId, existingItem.id, newQty);
        } catch (err) {
          console.error("Failed to sync updated cart quantity:", err);
        }
      }
      setBasket(prev => prev.map(item => item.id === existingItem.id ? { ...item, quantity: newQty } : item));
    } else {
      const newItemData: Omit<GroceryItem, 'id'> = {
        name: finalName,
        category: scannedCategory,
        price: priceNum,
        quantity: 1,
        productImage: productPhoto,
        priceImage: ''
      };

      let finalId = getUniquelyGeneratedId();
      if (userId) {
        try {
          const saved = await addCartItem(userId, newItemData);
          finalId = saved.id;
        } catch (err) {
          console.error("Failed to save cart item to database:", err);
        }
      }

      setBasket(prev => [...prev, { ...newItemData, id: finalId }]);
    }

    playSound('success');
    addNotification(`Added 1x "${finalName}" into basket.`);
    
    setProductPhoto(null);
    setScannedName('');
    setScannedPrice('');
    
    switchTab('home');
  };

  const updateQuantity = async (id: string, delta: number) => {
    playSound('click');
    const item = basket.find(i => i.id === id);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    if (userId) {
      try {
        await updateCartItemQuantity(userId, id, newQty);
      } catch (err) {
        console.error("Failed to sync quantity update:", err);
      }
    }

    setBasket(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const deleteItem = async (id: string, name: string) => {
    playSound('delete');
    if (userId) {
      try {
        await deleteCartItem(userId, id);
      } catch (err) {
        console.error("Failed to delete cart item:", err);
      }
    }
    setBasket(prev => prev.filter(item => item.id !== id));
    addNotification(`Removed "${name}" from basket.`);
  };

  const clearBasket = async () => {
    if (userId) {
      try {
        await clearCart(userId);
      } catch (err) {
        console.error("Failed to clear cart in database:", err);
      }
    }
    setBasket([]);
  };

  const handleConfirmCheckout = async () => {
    playSound('success');
    const newReceiptRef = generateRandomReceiptRef();

    if (userId) {
      try {
        await createCheckout(userId, {
          receiptRef: newReceiptRef,
          totalAmount,
          discountAmount: dynamicDiscount,
          finalAmount,
          budgetLimit: budget,
          currency,
          items: basket
        });
      } catch (err) {
        console.error("Failed to save checkout to database:", err);
        alert("Unable to process checkout. Please try again.");
        return;
      }
    }

    setReceiptRef(newReceiptRef);
    setShowOrderDone(true);
    setIsCheckoutOpen(false);
    setBasket([]);
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
