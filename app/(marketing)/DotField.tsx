'use client';

import { useEffect, useRef, memo } from 'react';

const TWO_PI = Math.PI * 2;

interface Dot {
  ax: number;
  ay: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  x: number;
  y: number;
}

export interface DotFieldProps {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  glowRadius?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  gradientFrom?: string;
  gradientTo?: string;
  glowColor?: string;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

const DotField = memo(({
  dotRadius = 2.2,
  dotSpacing = 16,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  glowRadius = 160,
  sparkle = false,
  waveAmplitude = 0,
  gradientFrom,
  gradientTo,
  glowColor,
  className = '',
  style,
  ...rest
}: DotFieldProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const cachedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 });
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
  const isVisibleRef = useRef(false);
  const isScrollingRef = useRef(false);
  const sizeRef = useRef({ w: 0, h: 0 });
  const engagement = useRef(0);

  const propsRef = useRef<Record<string, unknown>>({});
  propsRef.current = {
    dotRadius,
    dotSpacing,
    cursorRadius,
    cursorForce,
    bulgeOnly,
    bulgeStrength,
    sparkle,
    waveAmplitude,
    gradientFrom,
    gradientTo,
    glowColor,
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    // Hard-cap DPR to 1.5 to save GPU raster fill-rate while preserving crisp dots
    const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 1.5);
    let resizeTimer: ReturnType<typeof setTimeout>;
    let scrollTimer: ReturnType<typeof setTimeout>;

    function getColors(w: number, h: number, targetCtx: CanvasRenderingContext2D) {
      const p = propsRef.current;
      const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const colorFrom = (p.gradientFrom as string) || (isDark ? 'rgba(255, 255, 255, 0.20)' : 'rgba(0, 0, 0, 0.18)');
      const colorTo = (p.gradientTo as string) || (isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.08)');
      const grad = targetCtx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, colorFrom);
      grad.addColorStop(1, colorTo);
      return grad;
    }

    function buildStaticCache(w: number, h: number, dots: Dot[]) {
      if (typeof document === 'undefined' || w <= 0 || h <= 0) return;
      const cache = document.createElement('canvas');
      cache.width = Math.floor(w * dpr);
      cache.height = Math.floor(h * dpr);
      const cacheCtx = cache.getContext('2d');
      if (!cacheCtx) return;

      cacheCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cacheCtx.fillStyle = getColors(w, h, cacheCtx);
      cacheCtx.beginPath();
      const rad = (propsRef.current.dotRadius as number) / 2;

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        cacheCtx.moveTo(d.ax + rad, d.ay);
        cacheCtx.arc(d.ax, d.ay, rad, 0, TWO_PI);
      }
      cacheCtx.fill();
      cachedCanvasRef.current = cache;
    }

    function blitStatic() {
      const { w, h } = sizeRef.current;
      if (!ctx || w <= 0 || h <= 0) return;
      ctx.clearRect(0, 0, w, h);
      if (cachedCanvasRef.current) {
        ctx.drawImage(cachedCanvasRef.current, 0, 0, w, h);
      }
    }

    function buildDots(w: number, h: number) {
      const p = propsRef.current;
      const step = (p.dotRadius as number) + (p.dotSpacing as number);
      const cols = Math.floor(w / step);
      const rows = Math.floor(h / step);
      if (cols <= 0 || rows <= 0) return;
      const padX = (w % step) / 2;
      const padY = (h % step) / 2;
      const dots: Dot[] = new Array(rows * cols);
      let idx = 0;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ax = padX + col * step + step / 2;
          const ay = padY + row * step + step / 2;
          dots[idx++] = { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
        }
      }
      dotsRef.current = dots;
      buildStaticCache(w, h, dots);
      blitStatic();
    }

    function doResize() {
      const parent = canvas?.parentElement;
      if (!canvas || !parent || !ctx) return;
      const rect = parent.getBoundingClientRect();
      const w = Math.max(Math.floor(rect.width), parent.clientWidth);
      const h = Math.max(Math.floor(rect.height), parent.clientHeight);

      if (w <= 0 || h <= 0) return;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sizeRef.current = { w, h };
      buildDots(w, h);
    }

    function resize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(doResize, 80);
    }

    function startLoop() {
      if (isRunningRef.current || !isVisibleRef.current) return;
      isRunningRef.current = true;
      rafRef.current = requestAnimationFrame(tick);
    }

    function stopLoop() {
      isRunningRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (!isVisibleRef.current || isScrollingRef.current) return;
      const parent = canvas?.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Check if mouse is within interactive boundary of this section (plus cursor margin)
      const margin = 200;
      if (
        clientX < rect.left - margin ||
        clientX > rect.right + margin ||
        clientY < rect.top - margin ||
        clientY > rect.bottom + margin
      ) {
        return;
      }

      const m = mouseRef.current;
      const newX = clientX - rect.left;
      const newY = clientY - rect.top;

      const dx = m.prevX - newX;
      const dy = m.prevY - newY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      m.speed += (dist - m.speed) * 0.5;
      if (m.speed < 0.001) m.speed = 0;

      m.x = newX;
      m.y = newY;
      m.prevX = newX;
      m.prevY = newY;

      if (!isRunningRef.current && isVisibleRef.current) {
        startLoop();
      }
    }

    function onScroll() {
      isScrollingRef.current = true;
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }

    let frameCount = 0;

    function tick() {
      if (!isVisibleRef.current) {
        stopLoop();
        return;
      }

      frameCount++;
      const dots = dotsRef.current;
      const m = mouseRef.current;
      const { w, h } = sizeRef.current;
      const p = propsRef.current;
      const len = dots.length;
      const t = frameCount * 0.02;

      // Gradually decay mouse speed when stationary
      m.speed *= 0.88;
      if (m.speed < 0.001) m.speed = 0;

      const targetEngagement = Math.min(m.speed / 5, 1);
      engagement.current += (targetEngagement - engagement.current) * 0.08;
      if (engagement.current < 0.001) engagement.current = 0;
      const eng = engagement.current;

      const hasWave = (p.waveAmplitude as number) > 0;
      const hasSparkle = Boolean(p.sparkle);

      if (ctx && w > 0 && h > 0 && len > 0) {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = getColors(w, h, ctx);

        const cr = p.cursorRadius as number;
        const crSq = cr * cr;
        const rad = (p.dotRadius as number) / 2;
        const isBulge = p.bulgeOnly as boolean;
        let hasActiveMotion = false;

        ctx.beginPath();

        for (let i = 0; i < len; i++) {
          const d = dots[i];
          const dx = m.x - d.ax;
          const dy = m.y - d.ay;
          const distSq = dx * dx + dy * dy;

          if (distSq < crSq && eng > 0.01) {
            const dist = Math.max(Math.sqrt(distSq), 0.0001);
            if (isBulge) {
              const tDist = 1 - dist / cr;
              const push = tDist * tDist * (p.bulgeStrength as number) * eng;
              // High performance direct vector normal: dx / dist = cos(angle), dy / dist = sin(angle)
              const targetX = d.ax - (dx / dist) * push;
              const targetY = d.ay - (dy / dist) * push;
              d.sx += (targetX - d.sx) * 0.15;
              d.sy += (targetY - d.sy) * 0.15;
              hasActiveMotion = true;
            } else {
              const move = (500 / dist) * (m.speed * (p.cursorForce as number));
              d.vx += (dx / dist) * -move;
              d.vy += (dy / dist) * -move;
              hasActiveMotion = true;
            }
          } else if (isBulge) {
            // Spring back to resting point
            const diffX = d.ax - d.sx;
            const diffY = d.ay - d.sy;
            if (Math.abs(diffX) > 0.03 || Math.abs(diffY) > 0.03) {
              d.sx += diffX * 0.12;
              d.sy += diffY * 0.12;
              hasActiveMotion = true;
            } else {
              d.sx = d.ax;
              d.sy = d.ay;
            }
          }

          if (!isBulge) {
            d.vx *= 0.9;
            d.vy *= 0.9;
            d.x = d.ax + d.vx;
            d.y = d.ay + d.vy;
            d.sx += (d.x - d.sx) * 0.1;
            d.sy += (d.y - d.sy) * 0.1;
            if (Math.abs(d.vx) > 0.01 || Math.abs(d.vy) > 0.01) {
              hasActiveMotion = true;
            }
          }

          let drawX = d.sx;
          let drawY = d.sy;
          if (hasWave) {
            drawY += Math.sin(d.ax * 0.03 + t) * (p.waveAmplitude as number);
            drawX += Math.cos(d.ay * 0.03 + t * 0.7) * (p.waveAmplitude as number) * 0.5;
          }

          if (hasSparkle) {
            const hash = ((i * 2654435761) ^ (frameCount >> 3)) >>> 0;
            const r = hash % 100 < 3 ? rad * 1.8 : rad;
            ctx.moveTo(drawX + r, drawY);
            ctx.arc(drawX, drawY, r, 0, TWO_PI);
          } else {
            ctx.moveTo(drawX + rad, drawY);
            ctx.arc(drawX, drawY, rad, 0, TWO_PI);
          }
        }

        ctx.fill();

        // If dots have fully settled and there's no ongoing waves/sparkle, blit the cached resting frame and sleep!
        if (!hasActiveMotion && eng === 0 && !hasWave && !hasSparkle) {
          blitStatic();
          stopLoop();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    let initAttempts = 0;
    function checkInit() {
      const parent = canvas?.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      if (rect.width > 10 && rect.height > 10) {
        doResize();
      } else if (initAttempts < 25) {
        initAttempts++;
        requestAnimationFrame(checkInit);
      }
    }
    checkInit();

    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
      resize();
    }) : null;
    if (canvas.parentElement && ro) {
      ro.observe(canvas.parentElement);
    }

    // IntersectionObserver: automatically halt rendering when scrolled out of view
    const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
      if (!entry.isIntersecting) {
        stopLoop();
      } else {
        blitStatic();
      }
    }, { threshold: 0 }) : null;

    if (canvas.parentElement && io) {
      io.observe(canvas.parentElement);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      stopLoop();
      clearTimeout(resizeTimer);
      clearTimeout(scrollTimer);
      ro?.disconnect();
      io?.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`w-full h-full relative ${className}`}
      style={{
        ...style,
        transform: 'translate3d(0, 0, 0)',
        willChange: 'transform',
        contain: 'strict',
      }}
      {...rest}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});

DotField.displayName = 'DotField';

export default DotField;

