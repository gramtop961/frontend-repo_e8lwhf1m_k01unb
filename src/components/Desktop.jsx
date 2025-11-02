import React from 'react';
import Spline from '@splinetool/react-spline';
import { Folder, AppWindow } from 'lucide-react';

function DesktopIcon({ title, onOpen }) {
  return (
    <div
      className="flex flex-col items-center justify-center w-24 h-24 rounded-md hover:bg-white/10 text-white cursor-default"
      onDoubleClick={onOpen}
      title={title}
    >
      <div className="w-10 h-10 flex items-center justify-center">
        <Folder className="w-8 h-8 text-white" />
      </div>
      <span className="text-xs text-center mt-2 line-clamp-2 drop-shadow-sm">{title}</span>
    </div>
  );
}

export default function Desktop({ items, actions }) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-indigo-950/50" />
      </div>

      <div className="relative z-10 h-full w-full p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 content-start">
        {items.map((item) => (
          <DesktopIcon key={item.title} title={item.title} onOpen={() => actions.openWindow(item)} />
        ))}
      </div>

      <div className="absolute bottom-20 right-4 z-10 text-white/80 text-xs backdrop-blur-sm bg-black/20 rounded-md px-2 py-1 flex items-center gap-2">
        <AppWindow className="w-3 h-3" />
        <span>Double‑click icons to open • Click tiles in Start</span>
      </div>
    </div>
  );
}
