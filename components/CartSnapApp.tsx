'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Home, 
  User, 
  X, 
  Check, 
  AlertCircle, 
  ChevronRight 
} from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';

// Sub components
import Header from './Header';
import BudgetCard from './BudgetCard';
import StatsCard from './StatsCard';
import SettingsPanel from './SettingsPanel';
import ScanHub from './ScanHub';
import BasketPanel from './BasketPanel';
import CheckoutModal from './CheckoutModal';

export default function CartSnapApp() {
  const {
    activeTab,
    switchTab,
    cameraActive,
    showOrderDone,
    setShowOrderDone,
    receiptRef,
    showNotificationsList,
    setShowNotificationsList,
    notifications,
    clearNotifications,
    basket,
    finalAmount,
    currency,
    isCheckoutOpen,
    setIsCheckoutOpen,
    playSound,
    videoRef,
    canvasRef,
    capturePhoto,
    stopCamera
  } = useGroceryStore();

  return (
    <div id="cartsnap-root" className="min-h-screen w-full bg-[#f8f9ff] text-[#0b1c30] flex flex-col relative font-sans select-none">
      
      {/* Dynamic Camera constraints viewport */}
      {cameraActive && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-6">
          <div className="flex justify-between items-center text-white">
            <span className="text-sm font-semibold tracking-wider flex items-center gap-1.5 font-headline">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse" />
              LIVE BARCODE/LABEL CAM
            </span>
            <button 
              type="button"
              onClick={stopCamera} 
              className="p-2 bg-white/15 hover:bg-white/20 rounded-full border-0 cursor-pointer"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="relative aspect-[3/4] max-w-sm mx-auto bg-slate-955 rounded-2xl overflow-hidden border border-white/20 flex items-center justify-center w-full">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover animate-fade-in"
            />
            <div className="absolute inset-8 border-2 border-dashed border-[#22c55e]/60 rounded-xl pointer-events-none flex items-center justify-center">
              <div className="w-10 h-0.5 bg-[#22c55e] absolute animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col gap-4 text-center pb-2 max-w-sm mx-auto w-full">
            <p className="text-xs text-slate-300">
              Align pricing sticker or barcode label inside the lens container.
            </p>
            <button 
              type="button"
              onClick={capturePhoto}
              className="py-4 bg-[#006e2f] active:scale-95 transition-transform text-white rounded-xl font-semibold tracking-wide flex items-center justify-center gap-2 border-0 cursor-pointer"
            >
              <Camera className="w-5 h-5" /> Take Snapshot
            </button>
          </div>
        </div>
      )}

      {/* Canvas for taking screenshot snapshots */}
      <canvas ref={canvasRef} className="hidden" />

      {/* TOP RESPONSIVE LOGO HEADER */}
      <Header />

      {/* CORE ADAPTIVE LAYOUT SECTION */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 pb-28 lg:pb-6 space-y-6">
        
        {/* SUCCESS INLINE NOTIFICATION STATUS */}
        <AnimatePresence>
          {showOrderDone && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xl text-center space-y-4 max-w-md mx-auto"
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Check className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-900 font-headline">Order Check-out Approved!</h3>
                <p className="text-xs text-slate-500">Your mock transaction was processed successfully. The basket list is cleared.</p>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100/50 space-y-1.5 text-left">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Receipt ID:</span>
                  <span className="font-mono font-medium">{receiptRef}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Pay status:</span>
                  <span className="text-emerald-700 font-extrabold uppercase">PAID & CLOSED</span>
                </div>
              </div>

              <div className="flex gap-2.5">
                <button 
                  type="button"
                  onClick={() => setShowOrderDone(false)} 
                  className="flex-1 py-2 text-xs bg-[#006e2f] hover:bg-emerald-800 text-white font-semibold rounded-lg transition-all active:scale-95 border-0 cursor-pointer"
                >
                  Clear Dialog
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* LOG SYSTEM NOTIFICATION BAR */}
        <AnimatePresence>
          {showNotificationsList && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-[#0d1c30]/10 rounded-2xl shadow-xl p-4 max-w-lg mx-auto max-h-[220px] overflow-y-auto text-left"
            >
              <div className="flex justify-between items-center mb-2 pb-1.5 border-b">
                <span className="text-[10px] font-bold font-headline text-slate-500 uppercase tracking-widest">SYSTEM EVENT MONITOR LOGS</span>
                <button 
                  type="button"
                  onClick={clearNotifications} 
                  className="text-[10px] text-red-600 font-extrabold border-0 bg-transparent cursor-pointer"
                >
                  Clear log list
                </button>
              </div>
              {notifications.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-400">No events logged yet. Tap scan elements.</div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {notifications.map((note, i) => (
                    <div key={i} className="text-[10px] leading-snug bg-slate-50 text-slate-700 p-2 rounded-lg border-l-2 border-[#006e2f]">
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

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
      {basket.length > 0 && !isCheckoutOpen && (
        <div className="lg:hidden fixed bottom-[66px] left-0 right-0 bg-white border-t border-[#0b1c30]/10 p-3 px-4 flex justify-between items-center z-30 shadow-md">
          <div className="text-left">
            <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-widest leading-none mb-1">Estimated Basket Run</span>
            <span className="text-sm font-extrabold text-[#006e2f] font-price">{currency}{finalAmount.toFixed(0)}</span>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              playSound('click');
              setIsCheckoutOpen(true);
            }}
            className="p-3 px-5 bg-[#006e2f] text-white text-xs font-bold uppercase rounded-xl tracking-wider shadow-lg shadow-[#006e2f]/20 flex items-center justify-center gap-1 active:scale-95 border-0 cursor-pointer"
          >
            Checkout <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* BOTTOM SLIDE-UP MODAL SHEET (Checkout order summary) */}
      <CheckoutModal />

      {/* MOBILE STICKY NAVIGATION FOOTER BAR (under lg: breakpoint) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-indigo-50/70 h-[66px] px-2 flex justify-around items-center z-35 shadow-lg">
        {/* Tab 1: Home */}
        <button 
          type="button"
          onClick={() => switchTab('home')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full relative transition-all active:scale-95 border-0 bg-transparent cursor-pointer ${
            activeTab === 'home' ? "text-[#006e2f]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold font-headline">Home</span>
          {activeTab === 'home' && (
            <span className="absolute bottom-1 w-1 h-1 bg-[#006e2f] rounded-full" />
          )}
        </button>

        {/* Tab 2: Snapshot trigger FAB */}
        <div className="relative -top-4 w-18 h-12 flex items-center justify-center">
          <button 
            type="button"
            onClick={() => switchTab('scan')}
            className={`w-13 h-13 rounded-full flex items-center justify-center transform transition-all active:scale-90 shadow-lg border-4 border-white cursor-pointer ${
              activeTab === 'scan' 
                ? "bg-[#22c55e] text-white shadow-[#22c55e]/25 animate-bounce" 
                : "bg-[#006e2f] text-white hover:bg-emerald-800 shadow-[#006e2f]/35"
            }`}
            style={{ animationDuration: activeTab === 'scan' ? '2.5s' : '0s' }}
            title="Scan items"
          >
            <Camera className="w-5.5 h-5.5 shrink-0" />
          </button>
        </div>

        {/* Tab 3: Account / Settings */}
        <button 
          type="button"
          onClick={() => switchTab('account')}
          className={`flex flex-col items-center justify-center gap-1 w-14 h-full relative transition-all active:scale-95 border-0 bg-transparent cursor-pointer ${
            activeTab === 'account' ? "text-[#006e2f]" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-bold font-headline">Account</span>
          {activeTab === 'account' && (
            <span className="absolute bottom-1 w-1 h-1 bg-[#006e2f] rounded-full" />
          )}
        </button>
      </nav>
    </div>
  );
}
