import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

/**
 * Apple-style 3D Coverflow Carousel.
 * Center card is flat & large; ±1 cards angled inward; ±2 further back;
 * cards beyond hidden. Drag, click, dots, arrow keys, autoplay.
 */
export default function Carousel3D({
  items,
  cardWidth = 320,
  cardHeight = 440,
  autoPlayMs = 4000,
  renderCard,
}) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useRef(0);
  const len = items.length;

  const go = (delta) => setActive((p) => (p + delta + len) % len);
  const goTo = (i) => setActive(i);

  // Autoplay
  useEffect(() => {
    if (paused || reduced) return;
    const id = setInterval(() => setActive((p) => (p + 1) % len), autoPlayMs);
    return () => clearInterval(id);
  }, [paused, reduced, autoPlayMs, len]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len]);

  /* ──────  Reduced-motion: simple fade  ────── */
  if (reduced) {
    return (
      <div className="relative w-full" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <div className="relative mx-auto" style={{ width: cardWidth, height: cardHeight }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {renderCard(items[active], active, true)}
            </motion.div>
          </AnimatePresence>
        </div>
        <Controls active={active} len={len} go={go} goTo={goTo} />
      </div>
    );
  }

  // signed shortest distance from active (-len/2 .. +len/2)
  const offsetOf = (i) => {
    let d = i - active;
    if (d > len / 2) d -= len;
    if (d < -len / 2) d += len;
    return d;
  };

  // Visual config per slot offset
  const slotStyle = (offset) => {
    const abs = Math.abs(offset);
    const sign = Math.sign(offset);

    // hide cards beyond ±2
    if (abs > 2) {
      return { x: sign * 700, rotateY: -sign * 60, scale: 0.4, opacity: 0, zIndex: 0, blur: 8 };
    }
    if (abs === 0) {
      return { x: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 30, blur: 0 };
    }
    if (abs === 1) {
      return {
        x: sign * (cardWidth * 0.62),
        rotateY: -sign * 42,
        scale: 0.85,
        opacity: 0.85,
        zIndex: 20,
        blur: 0,
      };
    }
    // abs === 2
    return {
      x: sign * (cardWidth * 1.05),
      rotateY: -sign * 55,
      scale: 0.7,
      opacity: 0.4,
      zIndex: 10,
      blur: 2,
    };
  };

  return (
    <div className="relative w-full select-none" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{ height: cardHeight + 60, perspective: '1600px', perspectiveOrigin: '50% 50%' }}
      >
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragStart={(_, info) => { dragX.current = info.point.x; }}
          onDragEnd={(_, info) => {
            const dx = info.point.x - dragX.current;
            if (Math.abs(dx) > 50) go(dx > 0 ? -1 : 1);
          }}
          className="relative w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => {
            const off = offsetOf(i);
            const s = slotStyle(off);
            const isActive = off === 0;
            return (
              <motion.div
                key={i}
                onClick={() => !isActive && goTo(i)}
                animate={{
                  x: s.x,
                  rotateY: s.rotateY,
                  scale: s.scale,
                  opacity: s.opacity,
                  filter: `blur(${s.blur}px)`,
                }}
                transition={{ type: 'spring', stiffness: 110, damping: 20, mass: 0.9 }}
                className="absolute"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  zIndex: s.zIndex,
                  transformStyle: 'preserve-3d',
                  cursor: isActive ? 'grab' : 'pointer',
                }}
              >
                {renderCard(item, i, isActive)}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Floor reflection glow */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bottom-2 w-[70%] h-24 rounded-[100%] blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(173,198,255,0.3) 0%, transparent 70%)' }}
        />
      </div>

      <Controls active={active} len={len} go={go} goTo={goTo} />
    </div>
  );
}

function Controls({ active, len, go, goTo }) {
  return (
    <div className="mt-12 flex items-center justify-center gap-6">
      <button
        onClick={() => go(-1)}
        aria-label="Previous"
        className="group w-12 h-12 rounded-full border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-primary transition-colors"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <div className="flex items-center gap-2">
        {Array.from({ length: len }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-500',
              i === active ? 'w-10 bg-gradient-to-r from-primary via-secondary to-tertiary' : 'w-1.5 bg-white/20 hover:bg-white/40'
            )}
          />
        ))}
      </div>

      <button
        onClick={() => go(1)}
        aria-label="Next"
        className="group w-12 h-12 rounded-full border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 hover:border-primary transition-colors"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
