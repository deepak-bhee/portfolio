import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Initialises Lenis smooth scroll and ticks it through GSAP's RAF loop.
 * Call once at the app root.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,           // smoothing factor (0–1, lower = smoother)
      smoothWheel: true,    // smooth mouse-wheel scroll
      smoothTouch: false,   // keep native touch scrolling on mobile
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Tick Lenis inside GSAP's RAF loop
    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);
    gsap.ticker.lagSmoothing(0);

    // Smooth anchor scrolling for nav links
    const handleAnchorClick = (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    };
    document.addEventListener("click", handleAnchorClick);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
      document.removeEventListener("click", handleAnchorClick);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);
}
