'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface AuthSandboxProps {
  fillDemoCredentials: () => void;
}

export default function AuthSandbox({ fillDemoCredentials }: AuthSandboxProps) {
  return (
    <div className="w-full mt-6 pt-4 border-t border-slate-100 text-center">
      <p className="text-[10px] text-slate-400 mb-2">Want to explore without registering?</p>
      <button
        type="button"
        onClick={fillDemoCredentials}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-50 text-[#006e2f] hover:bg-emerald-100 transition-colors text-[10px] font-bold border-0 cursor-pointer"
      >
        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
        Use Sandbox Demo Account
      </button>
    </div>
  );
}
