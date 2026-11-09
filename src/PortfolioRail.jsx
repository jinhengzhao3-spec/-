import React from 'react';
import FlexCarousel from './FlexCarousel.jsx';

/**
 * Full-bleed portfolio rail.
 *
 * FlexCarousel already scrolls on the wheel, but it free-scrolls and then snaps
 * back to the nearest card after 150ms. One mouse notch is only ~150px, well
 * under half a card, so a normal wheel gesture looked dead. This wrapper turns
 * vertical wheel input into single-card steps (trackpads accumulate smoothly)
 * and hands the wheel back to the page once the rail reaches either end, so the
 * section never becomes a scroll trap.
 */
export default function PortfolioRail({ items }) {
  const stageRef = React.useRef(null);
  const indexRef = React.useRef(0);
  const accRef = React.useRef(0);
  const lastStepRef = React.useRef(0);

  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const total = items.length;

    const onWheel = (event) => {
      if (event.ctrlKey) return;
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      const dx = event.deltaX * unit;
      const dy = event.deltaY * unit;
      // Sideways swipes belong to the carousel itself.
      if (Math.abs(dx) > Math.abs(dy)) return;

      accRef.current += dy;
      const now = performance.now();
      const direction = accRef.current > 0 ? 1 : -1;
      const atEnd = direction > 0 && indexRef.current >= total - 1;
      const atStart = direction < 0 && indexRef.current <= 0;

      // The rail clips its overflow, so the browser would swallow the wheel here.
      // Past either end we scroll the page ourselves instead of trapping the pointer.
      if (atEnd || atStart) {
        const delta = accRef.current;
        accRef.current = 0;
        event.preventDefault();
        window.scrollBy({ top: delta, behavior: 'instant' });
        return;
      }

      if (now - lastStepRef.current < 320) {
        accRef.current = 0;
        event.preventDefault();
        return;
      }
      if (Math.abs(accRef.current) < 80) {
        event.preventDefault();
        return;
      }

      accRef.current = 0;
      lastStepRef.current = now;
      event.preventDefault();
      const container = stage.querySelector('.flex-carousel');
      container?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: direction > 0 ? 'ArrowRight' : 'ArrowLeft',
          bubbles: true,
          cancelable: true,
        })
      );
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [items.length]);

  return (
    <div className="portfolio-stage" ref={stageRef}>
      <FlexCarousel
        items={items}
        preset="liquid"
        intro="rise"
        cardHeight={0.56}
        gap={14}
        radius={6}
        squeeze={0.08}
        autoplay
        interval={6}
        captureWheel={false}
        focusOnClick
        captions
        onChange={(index) => {
          indexRef.current = index;
        }}
      />
    </div>
  );
}
