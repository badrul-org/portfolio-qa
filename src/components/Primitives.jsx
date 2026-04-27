import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import { cn } from '../lib/utils';

/* ─────────────────────  SCROLL DIRECTION HOOK  ───────────────────── */
// Tracks whether the user is scrolling DOWN (1) or UP (-1).
function useScrollDirection() {
  const [dir, setDir] = useState(1);
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const cur = window.scrollY;
      if (Math.abs(cur - last) > 4) {
        setDir(cur > last ? 1 : -1);
        last = cur;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return dir;
}

/* ─────────────────────────  MASK REVEAL  ─────────────────────────
 * Jessica-Wells-style word reveal: each word sits in its own
 * overflow:hidden box, then translateY 100% → 0 with long stagger.
 * Re-triggers bidirectionally with scroll direction.
 */
export function MaskReveal({
  text,
  as: Tag = 'div',
  className,
  wordClass,
  delay = 0,
  stagger = 0.07,
  duration = 1.1,
}) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const dir = useScrollDirection();
  const words = text.split(' ');
  // When out of view, parked in the direction of scroll
  const out = dir > 0 ? '100%' : '-100%';

  return (
    <Tag ref={ref} className={cn('inline-block', className)} aria-label={text}>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom mr-[0.25em] last:mr-0"
          aria-hidden
        >
          <motion.span
            className={cn('inline-block will-change-transform', wordClass)}
            initial={false}
            animate={{ y: inView ? '0%' : (reduced ? '0%' : out) }}
            transition={{
              duration: reduced ? 0.4 : duration,
              delay: inView ? delay + i * stagger : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ─────────────────────────  SCROLL VELOCITY MARQUEE  ─────────────────────────
 * Marquee that speeds up & flips direction based on scroll velocity.
 * Pure Jessica Wells feel — content "responds" to how you scroll.
 */
export function ScrollVelocityMarquee({ children, baseVelocity = 80, className }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useSpring(0, { damping: 50, stiffness: 400 });
  const [smoothVelocity, setSmoothVelocity] = useState(0);
  const directionFactor = useRef(1);

  useEffect(() => {
    let last = scrollY.get();
    const unsub = scrollY.on('change', (v) => {
      const delta = v - last;
      scrollVelocity.set(delta * 60);
      last = v;
    });
    const id = setInterval(() => {
      setSmoothVelocity(scrollVelocity.get());
      scrollVelocity.set(scrollVelocity.get() * 0.9);
    }, 16);
    return () => { unsub(); clearInterval(id); };
  }, [scrollY, scrollVelocity]);

  useEffect(() => {
    if (reduced) return;
    let raf;
    const loop = () => {
      const factor = smoothVelocity > 0 ? 1 : smoothVelocity < 0 ? -1 : directionFactor.current;
      directionFactor.current = factor;
      const move = (baseVelocity / 60) * factor + smoothVelocity * 0.15;
      x.set(x.get() - move);
      // wrap when half scrolled
      const wrap = -2000;
      if (x.get() < wrap) x.set(x.get() - wrap);
      if (x.get() > 0) x.set(x.get() + wrap);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [smoothVelocity, baseVelocity, x, reduced]);

  return (
    <div className={cn('w-full overflow-hidden whitespace-nowrap', className)}>
      <motion.div style={{ x }} className="inline-flex shrink-0">
        {children}
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────  CLIP REVEAL (image/box wipe)  ─────────────────────────
 * Image/element revealed by sliding a clip-path mask off one edge.
 * Long, slow timing.
 */
export function ClipReveal({ children, className, from = 'bottom', duration = 1.4, delay = 0 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const startMap = {
    bottom: 'inset(0 0 100% 0)',
    top:    'inset(100% 0 0 0)',
    left:   'inset(0 100% 0 0)',
    right:  'inset(0 0 0 100%)',
  };
  const start = startMap[from];
  const end = 'inset(0 0 0 0)';
  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={{ clipPath: inView ? end : (reduced ? end : start), WebkitClipPath: inView ? end : (reduced ? end : start) }}
      transition={{ duration: reduced ? 0.4 : duration, delay: inView ? delay : 0, ease: [0.77, 0, 0.175, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────  BLUR REVEAL  ───────────────────────── */
export function BlurReveal({ text, as: Tag = 'span', className, delay = 0, stagger = 0.04, by = 'char' }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const dir = useScrollDirection();
  const segments = by === 'word' ? text.split(' ') : text.split('');
  const offset = (reduced ? 0 : 24) * dir;

  return (
    <Tag ref={ref} className={cn('inline-block', className)}>
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={false}
          animate={
            inView
              ? (reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' })
              : (reduced ? { opacity: 0 } : { opacity: 0, y: offset, filter: 'blur(12px)' })
          }
          transition={{
            duration: reduced ? 0.4 : 0.7,
            delay: inView ? delay + i * stagger : 0,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block will-change-transform"
        >
          {seg === ' ' ? ' ' : seg}
          {by === 'word' && i < segments.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
      <span className="sr-only">{text}</span>
    </Tag>
  );
}

/* ─────────────────────────  SCRAMBLE TEXT  ─────────────────────────
 * Letters cycle through random glyphs then settle into the real word on hover.
 */
const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#________';
export function ScrambleText({ text, className, duration = 600 }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(text);
  const queueRef = useRef([]);
  const frameRef = useRef(0);
  const rafRef = useRef(null);

  const update = () => {
    let output = '';
    let complete = 0;
    for (let i = 0; i < queueRef.current.length; i++) {
      const { from, to, start, end, char } = queueRef.current[i];
      if (frameRef.current >= end) { complete++; output += to; }
      else if (frameRef.current >= start) {
        const c = !char || Math.random() < 0.28
          ? SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
          : char;
        queueRef.current[i].char = c;
        output += `<span class="opacity-60">${c}</span>`;
      } else { output += from; }
    }
    setDisplay(output);
    if (complete < queueRef.current.length) {
      rafRef.current = requestAnimationFrame(update);
      frameRef.current++;
    }
  };

  const trigger = () => {
    if (reduced) return;
    cancelAnimationFrame(rafRef.current);
    const oldText = text.replace(/<[^>]+>/g, '');
    const length = Math.max(oldText.length, text.length);
    const queue = [];
    const totalFrames = duration / 16;
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = text[i] || '';
      const start = Math.floor(Math.random() * (totalFrames * 0.4));
      const end = start + Math.floor(Math.random() * (totalFrames * 0.6)) + totalFrames * 0.2;
      queue.push({ from, to, start, end });
    }
    queueRef.current = queue;
    frameRef.current = 0;
    update();
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <span
      className={cn('inline-block cursor-pointer', className)}
      onMouseEnter={trigger}
      onFocus={trigger}
      dangerouslySetInnerHTML={{ __html: display }}
    />
  );
}

/* ─────────────────────────  CONIC BORDER  ─────────────────────────
 * Rotating conic-gradient ring border around children.
 */
export function ConicBorder({ children, className, radius = '1.5rem', speed = 6, colors = ['#adc6ff', '#c4abff', '#4ae176', '#adc6ff'] }) {
  const reduced = useReducedMotion();
  const gradient = `conic-gradient(from var(--angle), ${colors.join(', ')})`;
  return (
    <div
      className={cn('relative p-[1px]', className)}
      style={{
        borderRadius: radius,
        background: gradient,
        animation: reduced ? 'none' : `spin-conic ${speed}s linear infinite`,
        // CSS variable for @property registration in tailwind config
      }}
    >
      <div className="relative h-full w-full" style={{ borderRadius: `calc(${radius} - 1px)`, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────  SECTION INDICATOR  ─────────────────────────
 * Fixed-left rail showing current section number + jump links.
 */
export function SectionIndicator({ sections }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = sections.findIndex((s) => s.id === e.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0.01 }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [sections]);

  return (
    <div aria-hidden className="hidden lg:flex fixed left-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
      {sections.map((s, i) => (
        <button
          key={s.id}
          onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <span
            className={cn(
              'h-px transition-all duration-500',
              i === active ? 'w-8 bg-primary' : 'w-3 bg-white/30 group-hover:w-6 group-hover:bg-white/60'
            )}
          />
          <span
            className={cn(
              'font-mono text-[10px] tracking-widest uppercase transition-all duration-500',
              i === active ? 'text-primary opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100'
            )}
          >
            {String(i + 1).padStart(2, '0')} · {s.label}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ─────────────────────────  CURSOR LABEL  ─────────────────────────
 * Mouse-following pill that shows a label when hovering over targets
 * with [data-cursor="LABEL"] attribute.
 */
export function CursorLabel() {
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 200, damping: 25, mass: 0.5 });
  const y = useSpring(0, { stiffness: 200, damping: 25, mass: 0.5 });
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => { x.set(e.clientX); y.set(e.clientY); };
    const onOver = (e) => {
      const t = e.target.closest('[data-cursor]');
      setLabel(t ? t.getAttribute('data-cursor') : '');
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
    };
  }, [x, y, reduced]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="fixed top-0 left-0 z-[80] pointer-events-none -translate-x-1/2 -translate-y-1/2 hidden md:block"
    >
      <motion.div
        animate={{ scale: label ? 1 : 0, opacity: label ? 1 : 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="px-4 py-2 rounded-full bg-primary text-background font-mono text-[10px] tracking-[0.2em] uppercase font-bold shadow-[0_10px_30px_-5px_rgba(173,198,255,0.6)] whitespace-nowrap"
      >
        {label || ' '}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────  SLIDE IN (left / right)  ─────────────────────────
 * Slides content in horizontally from the specified edge. Re-triggers
 * bidirectionally with viewport entry.
 */
export function SlideIn({ children, className, from = 'left', delay = 0, distance = 80, duration = 1 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-15% 0px' });
  const sign = from === 'left' ? -1 : 1;
  const offset = reduced ? 0 : distance * sign;

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: offset }}
      transition={{ duration: reduced ? 0.4 : duration, delay: inView ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────  FADE UP  ───────────────────────── */
export function FadeUp({ children, className, delay = 0, y = 50 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { margin: '-10% 0px' });
  const dir = useScrollDirection();
  const offset = (reduced ? 0 : y) * dir;

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: offset }}
      transition={{ duration: reduced ? 0.4 : 0.8, delay: inView ? delay : 0, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────  MAGNETIC  ───────────────────────── */
export function Magnetic({ children, strength = 0.4, className }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 150, damping: 15, mass: 0.5 });
  const y = useSpring(useMotionValue(0), { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────  TILT CARD  ───────────────────────── */
export function TiltCard({ children, className, max = 8 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const rx = useSpring(0, { stiffness: 200, damping: 20 });
  const ry = useSpring(0, { stiffness: 200, damping: 20 });
  const glowX = useSpring(50, { stiffness: 100, damping: 20 });
  const glowY = useSpring(50, { stiffness: 100, damping: 20 });

  const handleMove = (e) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * (max * 2));
    rx.set(-(py - 0.5) * (max * 2));
    glowX.set(px * 100);
    glowY.set(py * 100);
  };
  const handleLeave = () => { rx.set(0); ry.set(0); };

  const background = useTransform(
    [glowX, glowY],
    ([gx, gy]) => `radial-gradient(600px circle at ${gx}% ${gy}%, rgba(173,198,255,0.15), transparent 40%)`
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={cn('relative will-change-transform', className)}
    >
      <motion.div style={{ background }} className="absolute inset-0 rounded-[inherit] pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div style={{ transform: 'translateZ(40px)' }} className="relative">
        {children}
      </div>
    </motion.div>
  );
}

/* ─────────────────────────  ANIMATED COUNTER  ───────────────────────── */
export function AnimatedCounter({ to, suffix = '', prefix = '', duration = 2 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setVal(to); return; }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration, reduced]);

  const display = Number.isInteger(to) ? Math.round(val).toLocaleString() : val.toFixed(1);
  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ─────────────────────────  MARQUEE  ───────────────────────── */
export function Marquee({ children, speed = 50, reverse = false, pauseOnHover = true, className }) {
  return (
    <div className={cn('group flex w-full overflow-hidden', className)}>
      <motion.div
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        className={cn('flex shrink-0 gap-8', pauseOnHover && 'group-hover:[animation-play-state:paused]')}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────  SPOTLIGHT (mouse follows)  ───────────────────────── */
export function Spotlight({ className }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const y = useMotionValue(0);
  useEffect(() => {
    if (reduced) return;
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y, reduced]);
  const bg = useTransform(
    [x, y],
    ([mx, my]) => `radial-gradient(700px circle at ${mx}px ${my}px, rgba(173, 198, 255, 0.12), transparent 45%)`
  );
  return <motion.div aria-hidden style={{ background: bg }} className={cn('pointer-events-none fixed inset-0 z-30', className)} />;
}

/* ─────────────────────────  STICKY HIDE-ON-SCROLL NAV  ───────────────────────── */
export function HidingNav({ children, className }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(latest > prev && latest > 200);
  });
  return (
    <motion.nav
      animate={{ y: hidden ? -120 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.nav>
  );
}

/* ─────────────────────────  QA BACKDROP (parallax glyphs + code)  ───────────────────────── */
import { Bug, CheckCircle2, XCircle, Terminal, Code2, GitBranch, TestTube2, Zap } from 'lucide-react';

const QA_SNIPPETS = [
  { type: 'code', text: "await page.goto('/checkout')" },
  { type: 'code', text: "expect(response.status).toBe(200)" },
  { type: 'code', text: "describe('API regression', () => {" },
  { type: 'code', text: "it('should sync to NetSuite', async () => {" },
  { type: 'code', text: "await expect(invoice).toBeVisible()" },
  { type: 'code', text: "newman run shopify.postman.json" },
  { type: 'code', text: "playwright test --project=chromium" },
  { type: 'code', text: "robot --outputdir reports tests/" },
  { type: 'badge', text: '[ PASS ]', color: '#4ae176' },
  { type: 'badge', text: '[ FAIL ]', color: '#ff6b8a' },
  { type: 'badge', text: '200 OK', color: '#4ae176' },
  { type: 'badge', text: '500 ERR', color: '#ff6b8a' },
  { type: 'badge', text: 'P0 · BLOCKER', color: '#ff6b8a' },
  { type: 'badge', text: 'COVERAGE 94%', color: '#adc6ff' },
  { type: 'icon', Icon: Bug, color: '#ff6b8a' },
  { type: 'icon', Icon: CheckCircle2, color: '#4ae176' },
  { type: 'icon', Icon: XCircle, color: '#ff6b8a' },
  { type: 'icon', Icon: Terminal, color: '#adc6ff' },
  { type: 'icon', Icon: Code2, color: '#c4abff' },
  { type: 'icon', Icon: GitBranch, color: '#adc6ff' },
  { type: 'icon', Icon: TestTube2, color: '#4ae176' },
  { type: 'icon', Icon: Zap, color: '#c4abff' },
];

// Deterministic pseudo-random so positions are stable across renders
const seeded = (i, salt = 0) => {
  const x = Math.sin(i * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
};

function QAGlyph({ item, index, scrollYProgress }) {
  // Each glyph gets stable random position + parallax speed
  const left = seeded(index, 1) * 100;        // 0-100%
  const top = seeded(index, 2) * 220 - 10;     // -10% to 210% of viewport
  const speed = seeded(index, 3) * 600 + 100;  // 100-700px parallax
  const direction = seeded(index, 4) > 0.5 ? 1 : -1;
  const rotate = (seeded(index, 5) - 0.5) * 30;
  const scale = 0.7 + seeded(index, 6) * 0.6;

  const y = useTransform(scrollYProgress, [0, 1], [0, -speed * direction]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 0.55, 0.55, 0]);

  let body;
  if (item.type === 'code') {
    body = (
      <span className="font-mono text-[11px] md:text-xs text-white/40 whitespace-nowrap px-3 py-1.5 rounded-md border border-white/10 bg-white/[0.02] backdrop-blur-sm">
        <span className="text-tertiary mr-2">$</span>{item.text}
      </span>
    );
  } else if (item.type === 'badge') {
    body = (
      <span
        className="font-mono text-[10px] md:text-[11px] tracking-widest uppercase font-bold px-2.5 py-1 rounded border bg-white/[0.03] backdrop-blur-sm whitespace-nowrap"
        style={{ color: item.color, borderColor: item.color + '40' }}
      >
        {item.text}
      </span>
    );
  } else {
    const I = item.Icon;
    body = <I className="w-5 h-5 md:w-6 md:h-6" style={{ color: item.color, opacity: 0.7 }} />;
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: `${top}%`,
        y,
        opacity,
        rotate,
        scale,
        translateX: '-50%',
      }}
      className="will-change-transform"
    >
      {body}
    </motion.div>
  );
}

export function QABackdrop({ density = 28 }) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Pick a stable subset of glyphs
  const items = [];
  for (let i = 0; i < density; i++) {
    items.push(QA_SNIPPETS[i % QA_SNIPPETS.length]);
  }

  if (reduced) return null;

  return (
    <div aria-hidden className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {items.map((item, i) => (
        <QAGlyph key={i} item={item} index={i} scrollYProgress={scrollYProgress} />
      ))}
    </div>
  );
}

/* ─────────────────────────  SCROLL PROGRESS BAR  ───────────────────────── */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[100] bg-gradient-to-r from-primary via-secondary to-tertiary"
    />
  );
}
