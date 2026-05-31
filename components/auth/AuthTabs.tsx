'use client';

import React from 'react';

interface AuthTabsProps {
  mode: 'signin' | 'signup';
  setMode: (mode: 'signin' | 'signup') => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
}

export default function AuthTabs({ mode, setMode, setError, setSuccess }: AuthTabsProps) {
  return (
    <div className="w-full flex bg-slate-100/80 p-1 rounded-xl mb-6 border border-slate-200/20">
      <button
        type="button"
        onClick={() => {
          setMode('signin');
          setError(null);
          setSuccess(null);
        }}
        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
          mode === 'signin'
            ? 'bg-white text-[#0b1c30] shadow-sm'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Sign In
      </button>
      <button
        type="button"
        onClick={() => {
          setMode('signup');
          setError(null);
          setSuccess(null);
        }}
        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
          mode === 'signup'
            ? 'bg-white text-[#0b1c30] shadow-sm'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        Sign Up
      </button>
    </div>
  );
}
