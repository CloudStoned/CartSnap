'use client';

import React from 'react';
import { Camera, Tag, Check, X, Sparkles } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';
import { useCamera } from '../hooks/useCamera';
import { cn } from '../lib/utils';

export default function ScanHub() {
  const {
    currency,
    productPhoto,
    pricePhoto,
    scannedName,
    setScannedName,
    scannedPrice,
    setScannedPrice,
    scannedCategory,
    setScannedCategory,
    isProcessing,
    removePhoto,
    handleAddToBasket,
    playSound
  } = useGroceryStore();

  const {
    startCamera,
    handleFileUpload
  } = useCamera();

  return (
    <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-xs space-y-4 text-left">
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-800 font-headline flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-[#006e2f]" /> Smart Scanning Hub
        </h3>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Align receipts, labels or product shapes. Gemini retrieves OCR price markings using your webcam or photo uploads.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3.5">
        {/* Card 1: Product Photo */}
        <div 
          className={cn(
            "border-2 border-dashed bg-[#f8f9ff] text-center p-3 rounded-xl cursor-all relative overflow-hidden transition-all flex flex-col items-center justify-center min-h-[140px]",
            productPhoto ? "border-emerald-500 bg-emerald-50/20" : "border-slate-300 hover:border-emerald-600 animate-pulse-glow"
          )}
        >
          {productPhoto ? (
            <div className="w-full h-full flex flex-col justify-between items-center text-center gap-1.5">
              <div className="relative w-full h-[85px] rounded-lg bg-black overflow-hidden border border-emerald-300 shadow-sm">
                <img 
                  src={productPhoto} 
                  alt="Scanned product" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  type="button"
                  onClick={() => removePhoto('product')}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white hover:bg-black/80 rounded-full border-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-emerald-800 font-extrabold flex items-center gap-0.5">
                <Check className="w-3.5 h-3.5" /> Product photo
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#006e2f] mb-1">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 font-headline leading-none">Product Snap</span>
              <p className="text-[9px] text-slate-400">Grocery design</p>
              
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <button 
                  type="button"
                  onClick={() => startCamera('product')}
                  className="text-[8px] bg-[#006e2f] font-bold text-white px-2 py-1 rounded hover:bg-emerald-800 transition-colors border-0 cursor-pointer"
                >
                  Lens
                </button>
                <label 
                  className="text-[8px] bg-slate-200 font-bold text-slate-700 px-2 py-1 rounded cursor-pointer hover:bg-slate-300 transition-colors"
                >
                  File
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'product')} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Card 2: Price Photo */}
        <div 
          className={cn(
            "border-2 border-dashed bg-[#f8f9ff] text-center p-3 rounded-xl cursor-all relative overflow-hidden transition-all flex flex-col items-center justify-center min-h-[140px]",
            pricePhoto ? "border-emerald-500 bg-emerald-50/20" : "border-slate-300 hover:border-emerald-600 animate-pulse-glow"
          )}
        >
          {pricePhoto ? (
            <div className="w-full h-full flex flex-col justify-between items-center text-center gap-1.5">
              <div className="relative w-full h-[85px] rounded-lg bg-black overflow-hidden border border-emerald-300 shadow-sm">
                <img 
                  src={pricePhoto} 
                  alt="Scanned price" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  type="button"
                  onClick={() => removePhoto('price')}
                  className="absolute top-1 right-1 p-1 bg-black/60 text-white hover:bg-black/80 rounded-full border-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-emerald-800 font-extrabold flex items-center gap-0.5">
                <Check className="w-3.5 h-3.5" /> Price photo
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1.5 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-[#006e2f] mb-1">
                <Tag className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-700 font-headline leading-none">Price Tag</span>
              <p className="text-[9px] text-slate-400">Barcode/sticker</p>
              
              <div className="mt-2.5 flex items-center justify-center gap-2">
                <button 
                  type="button"
                  onClick={() => startCamera('price')}
                  className="text-[8px] bg-[#006e2f] font-bold text-white px-2 py-1 rounded hover:bg-emerald-800 transition-colors border-0 cursor-pointer"
                >
                  Lens
                </button>
                <label 
                  className="text-[8px] bg-slate-200 font-bold text-slate-700 px-2 py-1 rounded cursor-pointer hover:bg-slate-300 transition-colors"
                >
                  File
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'price')} className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* OCR EXTRACTION PANEL */}
      <div className="space-y-4 pt-1">
        {isProcessing ? (
          <div className="flex items-center gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
            <div className="w-5 h-5 rounded-full border-2 border-[#006e2f] border-t-transparent animate-spin flex-shrink-0" />
            <div className="space-y-0.5 flex-1 min-w-0">
              <p className="text-[11px] font-bold text-emerald-900 font-headline uppercase tracking-wider animate-pulse">Gemini AI OCR scanning...</p>
              <p className="text-[9px] text-slate-500 truncate">Converting physical pricing sticker tags into clean text fields.</p>
            </div>
          </div>
        ) : scannedName ? (
          <div className="flex items-center gap-2 bg-emerald-50 p-2 px-3 rounded-xl text-emerald-800 text-[10px] font-bold border border-emerald-100/60 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#006e2f]" /> OCR Verification Success
          </div>
        ) : null}

        <div className="space-y-3.5">
          {/* Input Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">Product Name Label</label>
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
            <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">OCR Extracted Price ({currency})</label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">{currency}</span>
              <input 
                type="number" 
                value={scannedPrice}
                onChange={(e) => setScannedPrice(e.target.value)}
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
          disabled={isProcessing}
          className={cn(
            "w-full py-3.5 text-xs font-bold tracking-wider text-white uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-97 shadow-md shadow-[#006e2f]/10 mt-2 border-0 cursor-pointer",
            isProcessing ? "bg-slate-300 opacity-60 cursor-not-allowed" : "bg-[#006e2f] hover:bg-emerald-800"
          )}
        >
          {isProcessing ? "Extracting Details..." : "Add Scanned Item into Basket"}
        </button>
      </div>
    </div>
  );
}
