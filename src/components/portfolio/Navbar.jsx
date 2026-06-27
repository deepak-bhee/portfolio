import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { href: "#home",     label: "Home"     },
  { href: "#about",    label: "About"    },
  { href: "#skills",   label: "Skills"   },
  { href: "#projects", label: "Projects" },
  { href: "#learning", label: "Learning" },
  { href: "#contact",  label: "Contact"  },
];

export function Navbar() {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled]     = useState(false);
  const [open, setOpen]             = useState(false);
  const [active, setActive]         = useState("home");
  const menuRef                     = useRef(null);

  /* ── scroll shadow ─────────────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "glass border-b shadow-soft" : "bg-transparent"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          {/* Logo */}
          <a href="#home" className="group font-display text-xl font-bold tracking-tight">
            <span className="gradient-text transition-all duration-300 group-hover:opacity-80">
              Deepak
            </span>
            <span className="text-foreground">.</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-250",
                    isActive
                      ? "nav-active"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {l.label}
                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid h-10 w-10 place-items-center rounded-full border bg-card text-foreground hover:bg-accent hover:scale-110 transition-all duration-200 active:scale-95"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link to="/auth" className="hidden md:inline-flex">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label="Menu"
              className="grid h-10 w-10 place-items-center rounded-full border bg-card md:hidden hover:bg-accent transition-all duration-200 active:scale-95"
            >
              <span
                className="transition-all duration-300"
                style={{ display: "grid", placeItems: "center" }}
              >
                {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu — slide down */}
        <div
          ref={menuRef}
          className={cn(
            "overflow-hidden border-t bg-background/95 backdrop-blur-md md:hidden transition-all duration-350",
            open ? "max-h-96 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-3">
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
                      ? "bg-accent text-foreground font-semibold"
                      : "hover:bg-accent text-muted-foreground"
                  )}
                >
                  {l.label}
                </a>
              );
            })}
            <Link
              to="/auth"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-accent text-muted-foreground"
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
