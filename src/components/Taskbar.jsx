import React, { useEffect, useState } from 'react';
import { Menu } from 'lucide-react';

export default function Taskbar({ onStartClick }) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const format = () => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, '0');
      const mm = d.getMinutes().toString().padStart(2, '0');
      return `${hh}:${mm}`;
    };
    setTime(format());
    const id = setInterval(() => setTime(format()), 1000 * 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 flex items-center justify-center z-50">
      <div className="backdrop-blur-xl bg-black/40 border border-white/10 text-white rounded-2xl px-3 py-1.5 flex items-center gap-4 shadow-2xl">
        <button
          onClick={onStartClick}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center active:scale-95 transition"
          aria-label="Open Start"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-sm font-medium tabular-nums hidden sm:block px-2 py-1 rounded-md bg-white/10">
          {time}
        </div>
      </div>
    </div>
  );
}
