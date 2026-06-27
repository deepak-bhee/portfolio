import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Attach a GSAP ScrollTrigger "reveal" animation to a container ref.
 *
 * @param {string} childSelector  – CSS selector for children to animate (default: "[data-reveal]")
 * @param {object} opts           – optional overrides
 */
export function useGsapReveal(childSelector = "[data-reveal]", opts = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const els = ref.current?.querySelectorAll(childSelector);
      if (!els?.length) return;

      gsap.fromTo(
        els,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: opts.duration ?? 0.8,
          ease: opts.ease ?? "power4.out",
          stagger: {
            amount: opts.staggerAmount ?? (els.length > 4 ? 0.5 : 0.35),
            ease: "power2.inOut",
          },
          scrollTrigger: {
            trigger: ref.current,
            start: opts.start ?? "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [childSelector, opts.stagger, opts.start, opts.duration, opts.ease]);

  return ref;
}
