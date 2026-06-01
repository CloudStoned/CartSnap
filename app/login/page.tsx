'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { AuthCard } from '@/components/auth';

export default function LoginPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && session) {
      router.push('/');
    }
  }, [session, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8f9ff]">
        <div className="relative flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg border border-slate-100 mb-6 overflow-hidden animate-bounce">
            <img src="/logo.png" alt="CartSnap Logo" className="w-11 h-11 object-contain" />
          </div>
          {/* Animated outer spinner ring */}
          <div className="w-10 h-10 rounded-full border-2 border-emerald-500/20 border-t-[#006e2f] animate-spin mb-4" />
          <p className="text-[10px] font-black text-slate-400 tracking-widest font-mono uppercase animate-pulse">Checking Session</p>
        </div>
      </div>
    );
  }

  if (session) {
    return null;
  }

  return <AuthCard />;
}

