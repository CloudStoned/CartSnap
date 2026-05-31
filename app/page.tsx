'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { GroceryProvider, useGroceryStore } from '../store/GroceryStore';

// General Sub components
import Header from '../components/Header';
import BudgetCard from '../components/BudgetCard';
import StatsCard from '../components/StatsCard';
import SettingsPanel from '../components/SettingsPanel';
import ScanHub from '../components/ScanHub';
import BasketPanel from '../components/BasketPanel';
import CheckoutModal from '../components/CheckoutModal';
import CameraOverlay from '../components/CameraOverlay';
import SuccessDialog from '../components/SuccessDialog';
import NotificationLogs from '../components/NotificationLogs';

// Mobile Sub components
import MobileNav from '../components/mobile/MobileNav';
import MobileFooterStrip from '../components/mobile/MobileFooterStrip';

function CartSnapAppContent() {
  const { activeTab } = useGroceryStore();

  return (
    <div id="cartsnap-root" className="min-h-screen w-full bg-[#f8f9ff] text-[#0b1c30] flex flex-col relative font-sans select-none">
      {/* Dynamic Camera constraints viewport */}
      <CameraOverlay />

      {/* TOP RESPONSIVE LOGO HEADER */}
      <Header />

      {/* CORE ADAPTIVE LAYOUT SECTION */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 pb-28 lg:pb-6 space-y-6">
        {/* SUCCESS INLINE NOTIFICATION STATUS */}
        <SuccessDialog />

        {/* LOG SYSTEM NOTIFICATION BAR */}
        <NotificationLogs />

        {/* 1. WIDESCREEN GRID SYSTEM FOR DESKTOPS (lg: and up) */}
        <div className="hidden lg:grid grid-cols-12 gap-6 items-start">
          {/* Left space col (Width 3/12) */}
          <div className="col-span-3 space-y-6">
            <BudgetCard />
            <StatsCard />
          </div>

          {/* Center scan area col (Width 5/12) */}
          <div className="col-span-5 space-y-6">
            <ScanHub />
          </div>

          {/* Right persistent basket (Width 4/12) */}
          <div className="col-span-4 space-y-6">
            <BasketPanel isWidescreen={true} />
          </div>
        </div>

        {/* 2. MOBILE FEED LAYOUT WITH BOTTOM NAVIGATION (under lg: breakpoint) */}
        <div className="lg:hidden space-y-5">
          {activeTab === 'home' && (
            <>
              <BudgetCard />
              <BasketPanel isWidescreen={false} />
            </>
          )}

          {activeTab === 'scan' && (
            <>
              <ScanHub />
            </>
          )}

          {activeTab === 'account' && (
            <>
              <StatsCard />
              <SettingsPanel />
              {/* Hardware alerts warnings */}
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-start gap-2.5 shadow-xs text-left">
                <AlertCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-[11px] font-bold text-[#0b1c30] font-headline">Permissions Guidelines</h5>
                  <p className="text-[9px] leading-relaxed text-slate-400">
                    We securely request standard browser camera hooks to allow snapping price tag photos. Standard SSL HTTPS is mandatory.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* MOBILE PERSISTENT FLOATING TOTAL STRIP */}
      <MobileFooterStrip />

      {/* BOTTOM SLIDE-UP MODAL SHEET (Checkout order summary) */}
      <CheckoutModal />

      {/* MOBILE STICKY NAVIGATION FOOTER BAR (under lg: breakpoint) */}
      <MobileNav />
    </div>
  );
}

export default function Page() {
  return (
    <GroceryProvider>
      <CartSnapAppContent />
    </GroceryProvider>
  );
}
