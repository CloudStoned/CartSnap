'use client';

import React from 'react';
import { useAuth } from '@/hooks/auth/useAuth';
import { useGroceryStore } from '../../store/GroceryStore';

export default function SignOutButton() {
  const { signOut } = useAuth();
  const { playSound } = useGroceryStore();

  const handleSignOut = async () => {
    playSound('click');
    await signOut();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full py-2 bg-red-50 hover:bg-red-100/70 text-red-600 font-bold rounded-xl text-[10px] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] border-0 cursor-pointer"
    >
      Log Out
    </button>
  );
}
