import React, { useCallback, useMemo, useState } from 'react';
import Desktop from './components/Desktop.jsx';
import Taskbar from './components/Taskbar.jsx';
import StartMenu from './components/StartMenu.jsx';
import WindowManager from './components/WindowManager.jsx';

const portfolioItems = [
  { title: 'Social design system', url: 'https://www.figma.com' },
  { title: 'Landing page', url: 'https://www.figma.com' },
  { title: 'Dashboard Design', url: 'https://www.figma.com' },
  { title: 'Product Pages', url: 'https://www.figma.com' },
  { title: 'Social Media Content', url: 'https://www.figma.com' },
  { title: 'Performance marketing ads', url: 'https://www.figma.com' },
  { title: 'UX and UI design case study', url: 'https://www.figma.com' },
  { title: 'Brand Guidelines', url: 'https://www.figma.com' },
  { title: 'Print Ads', url: 'https://www.figma.com' },
  { title: 'Video samples', url: 'https://www.figma.com' },
];

export default function App() {
  const [startOpen, setStartOpen] = useState(false);
  const [windows, setWindows] = useState([]);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const toggleStart = useCallback(() => setStartOpen((s) => !s), []);
  const closeStart = useCallback(() => setStartOpen(false), []);

  const openWindow = useCallback((item) => {
    setWindows((prev) => {
      const id = Date.now() + Math.random();
      const baseW = Math.min(1000, Math.max(720, window.innerWidth * 0.7));
      const baseH = Math.min(700, Math.max(520, window.innerHeight * 0.7));
      const w = isMobile ? window.innerWidth : baseW;
      const h = isMobile ? window.innerHeight - 56 : baseH; // leave room for taskbar
      const x = isMobile ? 0 : Math.max(16, (window.innerWidth - w) / 2);
      const y = isMobile ? 0 : Math.max(16, (window.innerHeight - h) / 3);
      return [
        ...prev,
        {
          id,
          title: item.title,
          url: item.url,
          x,
          y,
          width: w,
          height: h,
          z: prev.length ? Math.max(...prev.map((p) => p.z)) + 1 : 1,
          maximized: isMobile,
        },
      ];
    });
    closeStart();
  }, [closeStart, isMobile]);

  const bringToFront = useCallback((id) => {
    setWindows((prev) => {
      const maxZ = prev.length ? Math.max(...prev.map((w) => w.z)) : 0;
      return prev.map((w) => (w.id === id ? { ...w, z: maxZ + 1 } : w));
    });
  }, []);

  const updateWindow = useCallback((id, data) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...data } : w)));
  }, []);

  const closeWindow = useCallback((id) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const desktopActions = useMemo(() => ({ openWindow }), [openWindow]);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none" onClick={closeStart}>
      <Desktop items={portfolioItems} actions={desktopActions} />

      <WindowManager
        windows={windows}
        onFocus={bringToFront}
        onUpdate={updateWindow}
        onClose={closeWindow}
      />

      <StartMenu
        open={startOpen}
        items={portfolioItems}
        onOpenItem={openWindow}
        onRequestClose={closeStart}
      />

      <Taskbar onStartClick={(e) => { e.stopPropagation(); toggleStart(); }} />
    </div>
  );
}
