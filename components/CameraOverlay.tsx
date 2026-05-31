'use client';

import React from 'react';
import { Camera, X } from 'lucide-react';
import { useGroceryStore } from '../store/GroceryStore';

export default function CameraOverlay() {
  const {
    cameraActive,
    stopCamera,
    videoRef,
    canvasRef,
    capturePhoto
  } = useGroceryStore();

  return (
    <>
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
    </>
  );
}
