'use client';

import React from 'react';
import CurrencySetting from './CurrencySetting';
import SoundSetting from './SoundSetting';
import BudgetLimitSetting from './BudgetLimitSetting';
import CustomDepartmentsSetting from './CustomDepartmentsSetting';
import SignOutButton from './SignOutButton';

/**
 * Main Settings Panel containing modular configuration controls.
 */
export default function SettingsPanel() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-4 text-left">
      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider font-headline pb-1.5 border-b">
        Settings Panel
      </h4>
      
      {/* 1. Currency Switching Controls */}
      <CurrencySetting />

      {/* 2. Audio Toggle Controls */}
      <SoundSetting />

      {/* 3. Daily Limit Slider Control */}
      <BudgetLimitSetting />

      {/* 4. Custom Categories/Departments Control */}
      <CustomDepartmentsSetting />

      {/* 5. User Authentication Sign Out */}
      <div className="pt-3 border-t border-slate-100">
        <SignOutButton />
      </div>
    </div>
  );
}
