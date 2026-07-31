import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "#home",     label: "Home"     },
  { href: "#about",    label: "About"    },
  { href: "#skills",   label: "Skills"   },
  { href: "#projects", label: "Projects" },
  { href: "#learning", label: "Learning" },
  { href: "#contact",  label: "Contact"  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const [active, setActive]     = useState("home");
  const menuRef                 = useRef(null);

  /* ── scroll state ───────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── active section via IntersectionObserver ────────────────── */
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  /* ── scroll-progress bar ────────────────────────────────────── */
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    const onScroll = () => {
      if (!bar) return;
      const pct =
        (document.documentElement.scrollTop /
          (document.documentElement.scrollHeight -
            document.documentElement.clientHeight)) *
        100;
      bar.style.width = pct + "%";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── close menu on outside click ───────────────────────────── */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  /* ── close menu on Escape ──────────────────────────────────── */
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Scroll progress bar */}
      <div id="scroll-progress" aria-hidden="true" />

      {/*
        Outer wrapper: fixed at top.
        Pads top and sides when scrolled so the pill can float.
      */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled ? "px-4 pt-3 sm:px-6 sm:pt-4" : "px-0 pt-0"
        )}
      >
        <header
          className={cn(
            "mx-auto transition-all duration-800 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled
              ? "max-w-3xl rounded-full border border-white/10 bg-black/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
              : "max-w-full rounded-none border-b border-transparent bg-transparent"
          )}
        >
          <div
            className={cn(
              "mx-auto flex items-center justify-between transition-all duration-500",
              scrolled ? "px-5 py-2" : "max-w-6xl px-6 py-4"
            )}
          >
            {/* Logo */}
            <a href="#home" className="group font-display font-bold tracking-tight">
              <span
                className={cn(
                  "text-white transition-all duration-300 group-hover:opacity-80",
                  scrolled ? "text-base" : "text-lg"
                )}
              >
                Deepak
              </span>
              <span className="text-white/40">.</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-0.5 md:flex">
              {links.map((l) => {
                const isActive = active === l.href.slice(1);
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "text-white font-semibold"
                        : "text-white/55 hover:text-white/90"
                    )}
                  >
                    {l.label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Admin CTA */}
              <Link to="/auth" className="hidden md:inline-flex">
                <button
                  className={cn(
                    "rounded-full border border-white/20 text-sm font-semibold transition-all duration-200 active:scale-95",
                    scrolled
                      ? "bg-white text-black px-3.5 py-1 hover:bg-white/90"
                      : "bg-white/10 text-white px-4 py-2 hover:bg-white/20"
                  )}
                >
                  Admin
                </button>
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label="Menu"
                className="grid h-8 w-8 place-items-center rounded-full border border-white/15 bg-white/10 text-white md:hidden hover:bg-white/20 transition-all duration-200 active:scale-95"
              >
                {open ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            ref={menuRef}
            className={cn(
              "overflow-hidden md:hidden transition-all duration-350",
              scrolled
                ? "rounded-b-3xl"
                : "border-t border-white/10 bg-black/80 backdrop-blur-xl",
              open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
            )}
            style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
          >
            <nav className="flex flex-col gap-1 px-5 py-3">
              {links.map((l) => {
                const isActive = active === l.href.slice(1);
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/10 text-white font-semibold"
                        : "hover:bg-white/10 text-white/60"
                    )}
                  >
                    {l.label}
                  </a>
                );
              })}
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-white/10 text-white/60"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
      </div>
    </>
  );
}
