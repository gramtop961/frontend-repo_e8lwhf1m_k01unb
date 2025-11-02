import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

function useResizeObserver(targetRef, callback) {
  useEffect(() => {
    if (!targetRef.current) return;
    const ro = new ResizeObserver(callback);
    ro.observe(targetRef.current);
    return () => ro.disconnect();
  }, [targetRef, callback]);
}

function Window({ w, onFocus, onUpdate, onClose }) {
  const nodeRef = useRef(null);
  const contentRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [resizing, setResizing] = useState(false);
  const [scale, setScale] = useState(1);

  const onPointerDownTitle = (e) => {
    e.stopPropagation();
    onFocus(w.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const { x, y } = w;
    setDrag({ startX, startY, x, y });
  };

  const onPointerMove = (e) => {
    if (drag && !w.maximized) {
      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;
      onUpdate(w.id, { x: Math.max(0, drag.x + dx), y: Math.max(0, drag.y + dy) });
    }
  };

  const onPointerUp = () => setDrag(null);

  useEffect(() => {
    if (drag) {
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      };
    }
  }, [drag]);

  const startResize = (e) => {
    e.stopPropagation();
    onFocus(w.id);
    setResizing(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = w.width;
    const startH = w.height;

    const move = (ev) => {
      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;
      const newW = Math.max(360, startW + dx);
      const newH = Math.max(240, startH + dy);
      onUpdate(w.id, { width: newW, height: newH });
    };
    const up = () => {
      setResizing(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const toggleMax = () => {
    if (!w.maximized) {
      onUpdate(w.id, {
        maximized: true,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight - 56,
      });
    } else {
      onUpdate(w.id, { maximized: false });
    }
  };

  const fitScale = useCallback(() => {
    if (!contentRef.current) return;
    const wrapper = contentRef.current;
    const targetW = 1920;
    const targetH = 1080;
    const availW = wrapper.clientWidth;
    const availH = wrapper.clientHeight;
    const s = Math.min(availW / targetW, availH / targetH);
    setScale(s > 0 ? s : 1);
  }, []);

  useResizeObserver(contentRef, fitScale);
  useEffect(() => {
    fitScale();
    window.addEventListener('resize', fitScale);
    return () => window.removeEventListener('resize', fitScale);
  }, [fitScale]);

  return (
    <div
      className="absolute rounded-xl overflow-hidden backdrop-blur-xl bg-black/60 border border-white/10 shadow-2xl"
      style={{ left: w.x, top: w.y, width: w.width, height: w.height, zIndex: w.z }}
      onMouseDown={() => onFocus(w.id)}
    >
      <div
        className="h-10 flex items-center justify-between px-3 gap-2 bg-white/10 text-white cursor-grab active:cursor-grabbing select-none"
        onPointerDown={onPointerDownTitle}
      >
        <div className="font-medium text-sm truncate">{w.title}</div>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded-md hover:bg-white/10"
            onClick={toggleMax}
            aria-label={w.maximized ? 'Restore' : 'Maximize'}
          >
            {w.maximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button className="p-1 rounded-md hover:bg-red-500/20" onClick={() => onClose(w.id)} aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div ref={contentRef} className="relative w-full h-[calc(100%-2.5rem)] bg-black">
        <div
          className="absolute top-1/2 left-1/2 origin-top-left"
          style={{ width: 1920, height: 1080, transform: `translate(-50%, -50%) scale(${scale})` }}
        >
          <iframe
            title={w.title}
            src={w.url}
            className="w-full h-full rounded-md border-0"
            allow="fullscreen"
          />
        </div>
      </div>
      {!w.maximized && (
        <div
          onPointerDown={startResize}
          className="absolute right-0 bottom-0 w-4 h-4 cursor-nwse-resize bg-white/0"
          title="Resize"
        />
      )}
    </div>
  );
}

export default function WindowManager({ windows, onFocus, onUpdate, onClose }) {
  const sorted = useMemo(() => [...windows].sort((a, b) => a.z - b.z), [windows]);
  return (
    <div className="absolute inset-0">
      {sorted.map((w) => (
        <Window key={w.id} w={w} onFocus={onFocus} onUpdate={onUpdate} onClose={onClose} />)
      )}
    </div>
  );
}
