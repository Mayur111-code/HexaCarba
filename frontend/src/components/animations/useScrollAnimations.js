import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: options.y || 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 0.8,
          ease: options.ease || 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: options.start || 'top 85%',
            end: options.end || 'bottom 20%',
            toggleActions: options.toggleActions || 'play none none none',
            ...options.scrollTrigger,
          },
          ...options.fromVars,
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);

  return ref;
};

export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [speed]);

  return ref;
};

export const useStaggerReveal = (selector, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll(selector),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: options.duration || 0.6,
          stagger: options.stagger || 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: options.start || 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [selector]);

  return ref;
};
