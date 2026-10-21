import React from 'react';

/** Lightweight spring trail for fine pointers. The native cursor stays visible. */
export default function SmoothCursor({ isHome = true }) {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!canvas || !context || !finePointer.matches || reducedMotion.matches) return;

    const count = 40;
    const points = Array.from({ length: count }, () => ({ x: 0, y: 0, vx: 0, vy: 0 }));
    const target = { x: 0, y: 0 };
    let initialized = false;
    let frame = 0;
    let lastMoveAt = 0;
    let visible = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      frame = 0;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let speed = 0;

      for (let i = 0; i < count; i += 1) {
        const point = points[i];
        const anchor = i === 0 ? target : points[i - 1];
        point.vx = (point.vx + (anchor.x - point.x) * 0.14) * 0.76;
        point.vy = (point.vy + (anchor.y - point.y) * 0.14) * 0.76;
        point.x += point.vx;
        point.y += point.vy;
        speed = Math.max(speed, Math.abs(point.vx), Math.abs(point.vy));
      }

      const age = now - lastMoveAt;
      const fade = Math.max(0, 1 - age / 1050);
      if (visible && fade > 0.01) {
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.shadowColor = 'rgba(230, 56, 28, 0.22)';
        context.shadowBlur = 2;

        // Stroke short sections individually so the trail thins and fades toward its end.
        for (let i = 0; i < count - 1; i += 1) {
          const progress = i / (count - 1);
          const tailFade = Math.pow(1 - progress, 1.65);
          context.beginPath();
          context.moveTo(points[i].x, points[i].y);
          context.lineTo(points[i + 1].x, points[i + 1].y);
          context.strokeStyle = '#e6381c';
          context.globalAlpha = fade * 0.46 * tailFade;
          context.lineWidth = 0.3 + 1.6 * tailFade;
          context.stroke();
        }
        context.globalAlpha = 1;
        context.shadowBlur = 0;
      }

      if (visible && (fade > 0.01 || speed > 0.04)) frame = window.requestAnimationFrame(draw);
      else visible = false;
    };

    const start = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!initialized) {
        points.forEach((point) => { point.x = target.x; point.y = target.y; });
        initialized = true;
      }
      visible = true;
      lastMoveAt = performance.now();
      start();
    };

    const onPointerLeave = (event) => {
      if (event.relatedTarget) return;
      lastMoveAt = performance.now() - 400;
      start();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerout', onPointerLeave, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas ref={canvasRef} className={`smooth-cursor-trail${isHome ? ' is-home-layer' : ''}`} aria-hidden="true" />;
}
