'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useAuthForm } from '@/hooks/auth/useAuthForm';
import { AuthBackground, AuthHeader, AuthTabs, AuthAlerts, AuthForm, AuthSandbox } from '@/components/auth';

export default function AuthCard() {
  const {
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
    fillDemoCredentials,
  } = useAuthForm();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-radial from-[#ffffff] via-[#f5f8fc] to-[#e4ecf7]">
      <AuthBackground />

      {/* Main Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/50 shadow-2xl p-6 sm:p-8 relative z-10 flex flex-col items-center"
      >
        <AuthHeader />

        <AuthTabs
          mode={mode}
          setMode={setMode}
          setError={setError}
          setSuccess={setSuccess}
        />

        <AuthAlerts
          error={error}
          success={success}
        />

        <AuthForm
          mode={mode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          fullName={fullName}
          setFullName={setFullName}
          loading={loading}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          handleAuth={handleAuth}
        />

        <AuthSandbox fillDemoCredentials={fillDemoCredentials} />
      </motion.div>
    </div>
  );
}
