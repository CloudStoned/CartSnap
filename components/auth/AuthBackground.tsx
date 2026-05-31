'use client';

import React from 'react';

export default function AuthBackground() {
  return (
    <>
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
    </>
  );
}
