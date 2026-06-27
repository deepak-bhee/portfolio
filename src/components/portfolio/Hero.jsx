import { Github, Linkedin, Mail, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/* ─── Inline keyframe styles injected once ─────────────────────────────── */
const ANIM_STYLE = `
@keyframes hero-float   { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-14px)} }
@keyframes hero-spin-cw { from{transform:rotate(0deg)}      to{transform:rotate(360deg)}      }
@keyframes hero-spin-ccw{ from{transform:rotate(0deg)}      to{transform:rotate(-360deg)}     }
@keyframes hero-blink   { 0%,100%{opacity:1}               50%{opacity:0}                    }
@keyframes hero-slide-up{ from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
@keyframes hero-glow    { 0%,100%{box-shadow:0 0 18px 4px rgba(139,92,246,.35)} 50%{box-shadow:0 0 38px 10px rgba(139,92,246,.55)} }
@keyframes hero-type    { from{width:0} to{width:100%} }
@keyframes hero-orb     { 0%{transform:translate(0,0)} 33%{transform:translate(8px,-10px)} 66%{transform:translate(-6px,8px)} 100%{transform:translate(0,0)} }
`;

/* ─── Code lines shown in the terminal card ─────────────────────────────── */
const CODE_LINES = [
  { indent: 0, tokens: [{ t: "const ", c: "#c084fc" }, { t: "deepak", c: "#e2e8f0" }, { t: " = {", c: "#94a3b8" }] },
  { indent: 1, tokens: [{ t: "role: ", c: "#94a3b8" }, { t: '"Full-Stack Dev"', c: "#86efac" }, { t: ",", c: "#94a3b8" }] },
  { indent: 1, tokens: [{ t: "stack: ", c: "#94a3b8" }, { t: "[ ", c: "#fbbf24" }, { t: '"React"', c: "#86efac" }, { t: ", ", c: "#94a3b8" }, { t: '"Node"', c: "#86efac" }, { t: ", ", c: "#94a3b8" }, { t: '"TS"', c: "#86efac" }, { t: " ],", c: "#fbbf24" }] },
  { indent: 1, tokens: [{ t: "passion: ", c: "#94a3b8" }, { t: '"Building things"', c: "#86efac" }, { t: ",", c: "#94a3b8" }] },
  { indent: 1, tokens: [{ t: "open: ", c: "#94a3b8" }, { t: "true", c: "#f97316" }, { t: ",", c: "#94a3b8" }] },
  { indent: 0, tokens: [{ t: "};", c: "#94a3b8" }] },
  { indent: 0, tokens: [] },
  { indent: 0, tokens: [{ t: "deepak", c: "#e2e8f0" }, { t: ".build(", c: "#c084fc" }, { t: '"dream"', c: "#86efac" }, { t: ");", c: "#94a3b8" }] },
];

const BADGES = [
  { label: "⚛️ React",        top: "8%",  left: "10%" },
  { label: "🟩 Node.js",      top: "14%", right: "6%" },
  { label: "🔷 TypeScript",   bottom:"16%",left: "6%" },
  { label: "🐙 GitHub",       bottom:"10%",right:"10%" },
];

export function Hero() {
  const styleRef = useRef(null);
  const leftRef  = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    // Inject CSS keyframes
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.textContent = ANIM_STYLE;
      document.head.appendChild(el);
      styleRef.current = el;
    }

    // GSAP entrance
    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(
        rightRef.current,
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.3 }
      );
    });

    return () => {
      ctx.revert();
      if (styleRef.current) { styleRef.current.remove(); styleRef.current = null; }
    };
  }, []);

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero" />
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-primary/30 blur-3xl animate-blob" />
      <div className="pointer-events-none absolute top-40 -right-24 h-96 w-96 rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "4s" }} />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-[1.1fr_1fr]">

        {/* ── Left: Text ───────────────────────────────────────────────── */}
        <div ref={leftRef}>
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/70 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-soft">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Available for freelance
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Hi, I'm <span className="gradient-text">Deepak</span>
            <br />
            Full-Stack Developer
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            I design and build delightful web products — from polished interfaces to
            scalable backends. Currently shipping with React, Node.js, and modern cloud tools.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" className="rounded-full bg-gradient-primary shadow-glow hover:opacity-95" asChild>
              <a href="#contact">Hire Me <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <a href="/Deepak-resume.pdf" download>
                <Download className="mr-2 h-4 w-4" /> Resume
              </a>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3">
            {[
              { icon: Github,   href: "https://github.com/deepak-bhee",                   label: "GitHub"   },
              { icon: Linkedin, href: "https://www.linkedin.com/in/deepak-b-60620b375/",  label: "LinkedIn" },
              { icon: Mail,     href: "mailto:deepakbhee2006@gmail.com",                  label: "Email"    },
            ].map(({ icon: Icon, href, label }) => (
              <a key={label} href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer" aria-label={label}
                className="grid h-11 w-11 place-items-center rounded-full border bg-card transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary hover:shadow-soft">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Right: Animated Visual ───────────────────────────────────── */}
        <div ref={rightRef} className="relative flex items-center justify-center">

          {/* Ambient glow orbs */}
          <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,.28) 0%,transparent 70%)", animation:"hero-orb 7s ease-in-out infinite", top:"10%", left:"5%", pointerEvents:"none" }} />
          <div style={{ position:"absolute", width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,.22) 0%,transparent 70%)", animation:"hero-orb 9s ease-in-out infinite reverse", bottom:"5%", right:"8%", pointerEvents:"none" }} />

          {/* Orbit rings */}
          <div style={{ position:"absolute", inset:-16, borderRadius:"50%", border:"1px solid rgba(139,92,246,.18)", animation:"hero-spin-cw 22s linear infinite" }} />
          <div style={{ position:"absolute", inset:8,   borderRadius:"50%", border:"1px dashed rgba(139,92,246,.12)", animation:"hero-spin-ccw 15s linear infinite" }} />

          {/* Floating tech badge pills */}
          {BADGES.map(({ label, ...pos }) => (
            <div key={label} style={{ position:"absolute", zIndex:20, animation:`hero-float ${4 + Math.random()*2}s ease-in-out infinite`, animationDelay:`${Math.random()*2}s`, ...pos }}>
              <span style={{
                display:"inline-block", padding:"5px 12px", borderRadius:999,
                background:"rgba(15,12,30,.85)", border:"1px solid rgba(139,92,246,.35)",
                fontSize:"0.72rem", fontWeight:600, color:"#e2e8f0",
                backdropFilter:"blur(8px)", boxShadow:"0 4px 20px rgba(0,0,0,.4)",
                whiteSpace:"nowrap",
              }}>
                {label}
              </span>
            </div>
          ))}

          {/* ── Terminal card ── */}
          <div style={{
            position:"relative", width:"min(340px,90vw)", borderRadius:16,
            background:"rgba(10,8,24,.92)", border:"1px solid rgba(139,92,246,.3)",
            boxShadow:"0 0 0 1px rgba(139,92,246,.08), 0 20px 60px rgba(0,0,0,.6)",
            backdropFilter:"blur(16px)",
            animation:"hero-float 5s ease-in-out infinite, hero-glow 4s ease-in-out infinite",
            overflow:"hidden",
          }}>

            {/* Title bar */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 16px", borderBottom:"1px solid rgba(255,255,255,.06)", background:"rgba(255,255,255,.03)" }}>
              <span style={{ width:11, height:11, borderRadius:"50%", background:"#ff5f57", display:"inline-block" }} />
              <span style={{ width:11, height:11, borderRadius:"50%", background:"#febc2e", display:"inline-block" }} />
              <span style={{ width:11, height:11, borderRadius:"50%", background:"#28c840", display:"inline-block" }} />
              <span style={{ marginLeft:"auto", fontSize:"0.65rem", color:"rgba(255,255,255,.3)", letterSpacing:"0.08em" }}>deepak.ts</span>
            </div>

            {/* Code area */}
            <div style={{ padding:"18px 20px 20px", fontFamily:"'JetBrains Mono','Fira Code',monospace", fontSize:"0.8rem", lineHeight:1.8 }}>
              {/* Line numbers + code */}
              {CODE_LINES.map((line, li) => (
                <div key={li} style={{
                  display:"flex", alignItems:"flex-start", gap:12,
                  animation:`hero-slide-up .4s ease both`,
                  animationDelay:`${li * 0.07}s`,
                }}>
                  <span style={{ color:"rgba(255,255,255,.18)", userSelect:"none", minWidth:16, textAlign:"right", fontSize:"0.7rem", paddingTop:2 }}>{li + 1}</span>
                  <span>
                    {line.indent > 0 && <span style={{ color:"transparent" }}>{"  ".repeat(line.indent * 2)}</span>}
                    {line.tokens.map((tok, ti) => (
                      <span key={ti} style={{ color: tok.c }}>{tok.t}</span>
                    ))}
                    {/* Blinking cursor on last line */}
                    {li === CODE_LINES.length - 1 && (
                      <span style={{ display:"inline-block", width:8, height:"1em", background:"#c084fc", marginLeft:2, verticalAlign:"text-bottom", animation:"hero-blink 1s step-end infinite" }} />
                    )}
                  </span>
                </div>
              ))}

              {/* Status bar */}
              <div style={{ marginTop:14, paddingTop:10, borderTop:"1px solid rgba(255,255,255,.06)", display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:"#28c840", display:"inline-block", boxShadow:"0 0 8px #28c840" }} />
                <span style={{ fontSize:"0.67rem", color:"rgba(255,255,255,.35)", letterSpacing:"0.06em" }}>ready · TypeScript · UTF-8</span>
              </div>
            </div>
          </div>


        </div>

      </div>
    </section>
  );
}
