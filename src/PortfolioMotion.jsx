import React from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Adds the portfolio's opening and scroll choreography without changing its content. */
export default function PortfolioMotion() {
  React.useLayoutEffect(() => {
    const media = gsap.matchMedia();

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const hero = document.querySelector('.hero-poster');
        if (hero) {
          const opening = gsap.timeline({ defaults: { ease: 'power4.out' } });
          opening
            .fromTo('.poster-subject-video', { scale: 1.075 }, { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
            .fromTo('.poster-headline', { clipPath: 'inset(0 0 100% 0)', y: 92, scaleX: 0.84, transformOrigin: 'left center', opacity: 0 }, { clipPath: 'inset(0 0 0% 0)', y: 0, scaleX: 1, opacity: 1, duration: 1.35 }, 0.14)
            .fromTo('.poster-accent-line', { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 1.05, stagger: 0.12 }, 0.48)
            .fromTo('.poster-aged', { y: 24, opacity: 0, letterSpacing: '0.42em' }, { y: 0, opacity: 1, letterSpacing: '0.14em', duration: 1.1 }, 0.62)
            .fromTo('.poster-label, .poster-title-card, .poster-tour, .poster-explore', { y: 34, opacity: 0, clipPath: 'inset(0 0 35% 0)' }, { y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1.15, stagger: 0.1, ease: 'power3.out' }, 0.72);
        }

        const sectionReveal = (section, titleSelector, itemsSelector, start = 'top 76%') => {
          const title = section.querySelector(titleSelector);
          const items = itemsSelector ? section.querySelectorAll(itemsSelector) : [];
          const head = section.querySelector('.section-head');
          if (!title && !items.length && !head) return;
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: section, start, once: true },
            defaults: { ease: 'power4.out' },
          });
          if (head) timeline.fromTo(head, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0);
          if (title) timeline.fromTo(title, { clipPath: 'inset(0 0 100% 0)', y: 90, scaleX: 0.86, transformOrigin: 'left center', opacity: 0 }, { clipPath: 'inset(0 0 0% 0)', y: 0, scaleX: 1, opacity: 1, duration: 1.2 }, 0.12);
          if (items.length) timeline.fromTo(items, { y: 56, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.95, stagger: 0.13, clearProps: 'transform' }, title || head ? 0.55 : 0);
        };

        const intro = document.querySelector('.intro');
        if (intro) {
          sectionReveal(intro, '.intro-text h2', '', 'top 72%');
          const experience = intro.querySelector('.experience-block');
          if (experience) {
            gsap.fromTo(experience.querySelectorAll('.experience-grid .border-glow-inner > article'), { y: 52, opacity: 0, scale: 0.97 }, {
              y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.13, ease: 'power4.out', clearProps: 'transform',
              scrollTrigger: { trigger: experience, start: 'top 78%', once: true },
            });
          }
          gsap.fromTo(intro.querySelector('.portrait img'), { clipPath: 'inset(0 0 100% 0)', scale: 1.06 }, {
            clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.35, ease: 'power3.out',
            scrollTrigger: { trigger: intro.querySelector('.portrait'), start: 'top 78%', once: true },
          });
          gsap.fromTo(intro.querySelectorAll('.intro-text > :not(h2)'), { y: 24, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.09, clearProps: 'transform',
            scrollTrigger: { trigger: intro.querySelector('.intro-text'), start: 'top 75%', once: true },
          });
        }

        const work = document.querySelector('.work');
        if (work) {
          sectionReveal(work, '.work-title h2', '', 'top 74%');
          gsap.fromTo(work.querySelector('.project-overview'), { y: 46, opacity: 0, clipPath: 'inset(0 0 12% 0)' }, {
            y: 0, opacity: 1, clipPath: 'inset(0 0 0% 0)', duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: work.querySelector('.project-overview'), start: 'top 82%', once: true },
          });
          work.querySelectorAll('.asset-window').forEach((windowCard) => {
            const windowItems = windowCard.querySelectorAll('.window-bar, .window-gallery > *, .window-caption');
            gsap.fromTo(windowItems, { y: 38, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'transform',
              scrollTrigger: { trigger: windowCard, start: 'top 82%', once: true },
            });
            gsap.fromTo(windowCard.querySelectorAll('.poster-glow img'), { clipPath: 'inset(12% 0 12% 0)', scale: 1.08 }, {
              clipPath: 'inset(0% 0 0% 0)', scale: 1, duration: 1, stagger: 0.08, ease: 'power3.out', clearProps: 'clipPath,transform',
              scrollTrigger: { trigger: windowCard, start: 'top 78%', once: true },
            });
          });
        }

        const strength = document.querySelector('.strength');
        if (strength) sectionReveal(strength, '.strength-head h2', '.skill-grid .border-glow-inner > .skill-card', 'top 76%');

        const contact = document.querySelector('.contact');
        if (contact) {
          sectionReveal(contact, '.contact-inner h2', '.email-cta, .contact-links', 'top 78%');
          gsap.fromTo(contact.querySelector('.contact-kicker'), { y: 22, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.75, clearProps: 'transform',
            scrollTrigger: { trigger: contact, start: 'top 75%', once: true },
          });
        }

        const reel = document.querySelector('.reel-interlude');
        if (reel) {
          gsap.fromTo(reel.querySelector('.reel-interlude-video'), { clipPath: 'inset(12% 5% 12% 5%)', scale: 1.06 }, {
            clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none',
            scrollTrigger: { trigger: reel, start: 'top 85%', end: 'bottom 35%', scrub: 0.7 },
          });
          gsap.fromTo(reel.querySelector('.reel-interlude-copy'), { y: 34, opacity: 0 }, {
            y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', clearProps: 'transform',
            scrollTrigger: { trigger: reel, start: 'top 70%', once: true },
          });
        }
      });

      return () => ctx.revert();
    });

    return () => media.revert();
  }, []);

  return null;
}
