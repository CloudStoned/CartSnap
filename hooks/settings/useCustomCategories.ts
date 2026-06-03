'use client';

import { useState, useEffect } from 'react';
import { fetchUserSettings, upsertUserSettings } from '@/lib/queries';
import { isUniqueCategory, mergeCategories } from './settingsHelper';

/**
 * Custom hook to manage custom categories/departments state and database synchronization.
 */
export function useCustomCategories(userId?: string) {
  const [customCategories, setCustomCategoriesState] = useState<string[]>([]);

  useEffect(() => {
    if (!userId) {
      setCustomCategoriesState([]);
      return;
    }
    
    fetchUserSettings(userId).then((data) => {
      if (data) {
        if (data.custom_departments && Array.isArray(data.custom_departments)) {
          setCustomCategoriesState(data.custom_departments);
        } else {
          // Fallback / migration from localStorage
          const stored = localStorage.getItem(`freshtrack_custom_categories_${userId}`);
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              setCustomCategoriesState(parsed);
              // Migrate localStorage to Supabase
              upsertUserSettings(userId, { custom_departments: parsed }).catch((err) => {
                console.error('Failed to migrate custom categories to DB:', err);
              });
            } catch (err) {
              console.error('Failed to parse custom categories from localStorage:', err);
            }
          }
        }
      }
    }).catch((err) => {
      console.error('Failed to load custom categories:', err);
    });
  }, [userId]);

  const addCustomCategory = (category: string): boolean => {
    const trimmed = category.trim();
    if (!isUniqueCategory(trimmed, customCategories)) {
      return false;
    }
    const updated = [...customCategories, trimmed];
    setCustomCategoriesState(updated);
    if (userId) {
      localStorage.setItem(`freshtrack_custom_categories_${userId}`, JSON.stringify(updated));
      upsertUserSettings(userId, { custom_departments: updated }).catch((err) => {
        console.error('Failed to save custom department:', err);
      });
    }
    return true;
  };

  const removeCustomCategory = (category: string) => {
    const updated = customCategories.filter(c => c !== category);
    setCustomCategoriesState(updated);
    if (userId) {
      localStorage.setItem(`freshtrack_custom_categories_${userId}`, JSON.stringify(updated));
      upsertUserSettings(userId, { custom_departments: updated }).catch((err) => {
        console.error('Failed to remove custom department:', err);
      });
    }
  };

  const categories = mergeCategories(customCategories);

  return {
    categories,
    customCategories,
    addCustomCategory,
    removeCustomCategory,
  };
}
