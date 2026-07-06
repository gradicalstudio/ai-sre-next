"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      // tweak these to taste
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    // Keep ScrollTrigger's internal scroll position in sync with Lenis
    // on every Lenis scroll tick.
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP's own ticker instead of a separate rAF loop —
    // this is what keeps pinned/scrubbed ScrollTrigger animations from
    // drifting or jittering relative to the smooth-scrolled position.
    const update = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);

    // Lenis already smooths scroll itself; let it (not GSAP) own the lag,
    // so disable GSAP's own internal smoothing to avoid double-smoothing.
    gsap.ticker.lagSmoothing(0);

    // Whenever the page's layout changes (images load, slices mount/unmount,
    // accordions open, etc.) ScrollTrigger's cached measurements can go
    // stale — keep it informed.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
      window.removeEventListener("resize", refresh);
    };
  }, []);

  return <>{children}</>;
}