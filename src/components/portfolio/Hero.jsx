import { Github, Linkedin, Mail, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ProfileCard from "./ProfileCard";

/* ─── Inline keyframe styles injected once ─────────────────────────────── */




export function Hero() {
  const leftRef  = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {

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

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">

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

        {/* ── Right: ProfileCard ───────────────────────────────────────── */}
        <div ref={rightRef} className="flex items-center justify-center w-full overflow-hidden py-2">
          <ProfileCard
            name="Deepak B"
            title="Full-Stack Developer"
            handle="deepak-bhee"
            status="Available for freelance"
            contactText="Contact Me"
            avatarUrl="/deepak-photo.jpg"
            showUserInfo={false}
            showShine={false}
            enableTilt={true}
            enableMobileTilt={false}
            behindGlowEnabled={true}
            behindGlowColor="rgba(80, 80, 180, 0.6)"
            behindGlowSize="55%"
            innerGradient="linear-gradient(160deg, #0d0d1f 0%, #111133 40%, #0a0a28 70%, #050510 100%)"
            onContactClick={() => window.location.href = '#contact'}
          />
        </div>

      </div>
    </section>
  );
}
