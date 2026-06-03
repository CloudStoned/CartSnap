'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export function useAuthForm() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: (typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined),
            data: {
              full_name: fullName,
            },
          },
        });

        if (signUpError) throw signUpError;

        if (data.user && data.session === null) {
          setSuccess('Account created! Please check your email inbox to verify your account.');
          setEmail('');
          setPassword('');
          setFullName('');
        } else {
          setSuccess('Account created successfully! Logging you in...');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;
        setSuccess('Logged in successfully!');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    loading,
    error,
    setError,
    success,
    setSuccess,
    showPassword,
    setShowPassword,
    handleAuth,
  };
}
