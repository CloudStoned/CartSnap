'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useGroceryStore } from '../../store/GroceryStore';

export default function CustomDepartmentsSetting() {
  const [newCategoryName, setNewCategoryName] = useState('');
  const {
    customCategories,
    addCustomCategory,
    removeCustomCategory,
    playSound
  } = useGroceryStore();

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (trimmed) {
      const added = addCustomCategory(trimmed);
      if (added) {
        playSound('success');
        setNewCategoryName('');
      } else {
        playSound('beep');
      }
    }
  };

  return (
    <div className="space-y-3 pt-3 border-t border-slate-100">
      <div className="flex justify-between items-center">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-700 font-headline text-xs">Custom Departments</span>
          <p className="text-[9px] text-slate-400">Add custom categories for products.</p>
        </div>
        <span className="text-[9px] text-slate-400 font-mono font-bold bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md">
          {customCategories.length} added
        </span>
      </div>
      
      {/* List of custom categories */}
      {customCategories.length > 0 ? (
        <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-1">
          {customCategories.map((cat) => (
            <span 
              key={cat} 
              className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#006e2f] text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100/50"
            >
              {cat}
              <button
                type="button"
                onClick={() => {
                  playSound('delete');
                  removeCustomCategory(cat);
                }}
                className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-emerald-100 text-[#006e2f]/70 hover:text-[#006e2f] border-0 cursor-pointer p-0"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="text-[9px] text-slate-400 italic">No custom departments created yet.</p>
      )}

      {/* Input form to add a category */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="New Category (e.g. Seafood)"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 text-[11px] bg-slate-50 border border-slate-100 rounded-xl px-3 py-1.5 font-medium text-slate-700 outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddCategory();
            }
          }}
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="px-3.5 py-1.5 bg-[#006e2f] hover:bg-emerald-800 text-white font-bold rounded-xl text-[10px] flex items-center justify-center transition-all active:scale-[0.98] border-0 cursor-pointer"
        >
          Add
        </button>
      </div>
    </div>
  );
}
