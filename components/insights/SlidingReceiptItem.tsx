'use client';

import React from 'react';
import { Trash2, ChevronsLeft } from 'lucide-react';
import { ReceiptItem } from './types';
import { useSlidingReceiptItem } from '@/hooks/insights';

interface SlidingReceiptItemProps {
  item: ReceiptItem;
  currency: string;
  onRemove: (itemId: string) => Promise<void>;
  getCategoryIcon: (category: string) => React.ReactNode;
}

export default function SlidingReceiptItem({ item, currency, onRemove, getCategoryIcon }: SlidingReceiptItemProps) {
  const {
    currentX,
    isDragging,
    isDeleting,
    containerRef,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
    handleRemove,
  } = useSlidingReceiptItem({
    itemId: item.id,
    onRemove,
  });

  return (
    <div 
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all duration-300 ${
        isDeleting ? 'max-h-0 py-0 opacity-0 scale-95 border-0' : 'max-h-[80px]'
      }`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Background delete button */}
      <button
        type="button"
        onClick={handleRemove}
        className="absolute right-0 top-0 bottom-0 bg-red-500 hover:bg-red-600 text-white flex flex-col items-center justify-center gap-1 w-[70px] z-0 transition-colors border-0 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-[9px] font-bold uppercase tracking-wider">Delete</span>
      </button>

      {/* Sliding Foreground */}
      <div
        style={{
          transform: `translateX(${currentX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        onMouseDown={(e) => {
          handleDragStart(e.clientX);
          e.preventDefault();
        }}
        onMouseMove={(e) => {
          if (isDragging) {
            handleDragMove(e.clientX);
          }
        }}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        className="bg-white flex items-center gap-3 justify-between w-full relative z-10 py-3.5 border-b border-slate-100 last:border-0 cursor-grab active:cursor-grabbing px-1"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 overflow-hidden relative shadow-xs">
            {item.productImage ? (
              <img 
                src={item.productImage} 
                alt={item.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              getCategoryIcon(item.category)
            )}
          </div>
          <div className="text-left min-w-0">
            <h5 className="text-[11px] font-bold text-[#0b1c30] truncate pr-2">{item.name}</h5>
            <span className="inline-flex items-center gap-1 mt-1 text-[8px] font-semibold text-slate-400 uppercase tracking-wide">
              {getCategoryIcon(item.category)}
              {item.category}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Swipe indicator chevron - fades out when opened or dragged */}
          {currentX === 0 && (
            <ChevronsLeft className="w-3.5 h-3.5 text-slate-300 animate-pulse shrink-0 hidden sm:block animate-infinite" />
          )}
          
          <div className="text-right shrink-0">
            <span className="block text-[11px] font-black text-slate-800">
              {currency}{(item.price * item.quantity).toFixed(2)}
            </span>
            <span className="block text-[8px] font-bold text-slate-400 mt-1 uppercase">
              {item.quantity}x {currency}{item.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
