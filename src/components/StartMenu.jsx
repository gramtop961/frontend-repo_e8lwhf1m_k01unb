import React from 'react';
import { LayoutGrid } from 'lucide-react';

export default function StartMenu({ open, items, onOpenItem, onRequestClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center"
      onClick={onRequestClose}
    >
      <div
        className="mx-4 mb-20 sm:mb-0 w-full max-w-2xl rounded-2xl backdrop-blur-2xl bg-black/60 border border-white/10 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/10 flex items-center gap-2">
          <LayoutGrid className="w-5 h-5" />
          <span className="font-semibold">Start</span>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {items.map((item) => (
            <button
              key={item.title}
              onClick={() => onOpenItem(item)}
              className="group text-left rounded-xl p-3 bg-white/10 hover:bg-white/20 transition border border-white/10"
            >
              <div className="w-8 h-8 rounded-md bg-blue-500/30 border border-blue-400/30 flex items-center justify-center mb-2">
                <LayoutGrid className="w-4 h-4 text-blue-300" />
              </div>
              <div className="text-sm font-medium leading-tight line-clamp-2">{item.title}</div>
              <div className="text-xs text-white/60">Open</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
