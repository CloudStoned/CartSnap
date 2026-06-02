'use client';

import React from 'react';
import { Camera, Check, X } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';
import { cn } from '../lib/utils';

export default function ScanHub() {
  const {
    currency,
    productPhoto,
    scannedName,
    setScannedName,
    scannedPrice,
    setScannedPrice,
    scannedCategory,
    setScannedCategory,
    removePhoto,
    handleAddToBasket,
    playSound,
    startCamera
  } = useGroceryStore();

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs space-y-4 text-left">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 font-headline flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-[#006e2f]" /> Smart Scanning Hub
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Snap a photo of the product, then enter its details manually. Everything is calculated locally and offline.
        </p>
      </div>

      <div>
        {/* Card 1: Product Photo */}
        <div 
          onClick={() => !productPhoto && startCamera()}
          className={cn(
            "border-2 border-dashed bg-[#f8f9ff] text-center p-4 rounded-xl relative overflow-hidden transition-all flex flex-col items-center justify-center min-h-[160px]",
            productPhoto 
              ? "border-emerald-500 bg-emerald-50/20 cursor-default" 
              : "border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/10 hover:scale-[1.01] active:scale-[0.99] animate-pulse-glow cursor-pointer"
          )}
        >
          {productPhoto ? (
            <div className="w-full h-full flex flex-col justify-between items-center text-center gap-2">
              <div className="relative w-full max-w-[280px] h-[110px] rounded-lg bg-black overflow-hidden border border-emerald-300 shadow-sm mx-auto">
                <img 
                  src={productPhoto} 
                  alt="Scanned product" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto('product');
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-black/60 text-white hover:bg-black/80 rounded-full border-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <span className="text-xs text-emerald-800 font-extrabold flex items-center gap-1">
                <Check className="w-4 h-4 text-[#006e2f]" /> Product photo captured
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-[#006e2f] mb-1">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-slate-700 font-headline leading-none">Product Snap</span>
              <p className="text-xs text-slate-400">Tap to capture the product photo</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 pt-1">
        <div className="space-y-3.5">
          {/* Input Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Product Name (Optional)</label>
            <input 
              type="text" 
              value={scannedName}
              onChange={(e) => setScannedName(e.target.value)}
              placeholder="e.g. Fuji Apples Mix Pack" 
              className="w-full text-sm bg-[#f8f9ff] text-[#0b1c30] border border-slate-200 px-3.5 py-2.5 rounded-xl outline-hidden focus:ring-2 focus:ring-[#006e2f]/20 font-medium transition-all"
            />
          </div>

          {/* Input Price */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Price (Required)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">{currency}</span>
              <input 
                type="text" 
                inputMode="decimal"
                pattern="[0-9]*\.?[0-9]*"
                value={scannedPrice}
                onChange={(e) => {
                  let val = e.target.value;
                  let cleanVal = val.replace(/[^0-9.]/g, '');
                  const dotIndex = cleanVal.indexOf('.');
                  if (dotIndex !== -1) {
                    cleanVal = cleanVal.slice(0, dotIndex + 1) + cleanVal.slice(dotIndex + 1).replace(/\./g, '');
                  }
                  setScannedPrice(cleanVal);
                }}
                placeholder="0.00" 
                className="w-full text-sm bg-[#f8f9ff] text-[#0b1c30] border border-slate-200 pl-8 pr-3.5 py-2.5 rounded-xl outline-hidden focus:ring-2 focus:ring-[#006e2f]/20 font-price font-bold transition-all"
              />
            </div>
          </div>

          {/* Category SELECTOR */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Supermarket Department</label>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x h-8.5">
              {["Produce", "Dairy", "Bakery", "Pantry", "Meat", "Other"].map((cat) => (
                <button
                   key={cat}
                   type="button"
                   onClick={() => {
                     playSound('click');
                     setScannedCategory(cat);
                   }}
                   className={cn(
                     "flex-none px-4 py-1.5 rounded-full text-xs font-bold leading-none select-none transition-all scroll-snap-align-start active:scale-95 border-0 cursor-pointer",
                     scannedCategory === cat
                       ? "bg-[#006e2f] text-white shadow-xs"
                       : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                   )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Add button */}
        <button 
          type="button"
          onClick={handleAddToBasket}
          className="w-full py-3.5 text-xs font-bold tracking-wider text-white uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-97 shadow-md shadow-[#006e2f]/10 mt-2 border-0 cursor-pointer bg-[#006e2f] hover:bg-emerald-800"
        >
          Add Item to Basket
        </button>
      </div>
    </div>
  );
}
