import { SectionHeader } from "./SectionHeader";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGsapReveal } from "@/hooks/useGsapReveal";

gsap.registerPlugin(ScrollTrigger);

const groups = [
  {
    title: "Frontend", icon: "⚛️", skills: [
      { name: "React", level: 85 },
      { name: "JavaScript", level: 78 },
      { name: "Tailwind CSS", level: 90 },
      { name: "HTML / CSS", level: 96 },
      { name: "TypeScript", level: 58 },
    ],
  },
  {
    title: "Backend", icon: "🟩", skills: [
      { name: "Node.js", level: 78 },
      { name: "Express", level: 45 },
      { name: "Python", level: 75 },
    ],
  },
  {
    title: "Database", icon: "🗄️", skills: [
      { name: "MongoDB", level: 20 },
      { name: "MySQL", level: 80 },
    ],
  },
  {
    title: "Tools", icon: "🛠️", skills: [
      { name: "Git / GitHub", level: 92 },
      { name: "Figma", level: 75 },
      { name: "VS Code", level: 95 },
    ],
  },
];

function SkillCard({ group }) {
  const cardRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      data-reveal
      className="group rounded-3xl border bg-card p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex items-center gap-2 mb-5">
        <span className="text-xl leading-none">{group.icon}</span>
        <h3 className="font-display text-lg font-semibold">{group.title}</h3>
      </div>
      <div className="space-y-5">
        {group.skills.map((s, si) => (
          <div key={s.name}>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium">{s.name}</span>
              <span
                className="text-xs font-semibold text-primary tabular-nums transition-all duration-700"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {visible ? `${s.level}%` : "0%"}
              </span>
            </div>
            {/* Track */}
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              {/* Filled bar */}
              <div
                className="h-full rounded-full bg-gradient-primary"
                style={{
                  width: visible ? `${s.level}%` : "0%",
                  transition: `width 0.9s cubic-bezier(0.4,0,0.2,1) ${si * 0.08}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Skills() {
  const ref = useGsapReveal("[data-reveal]");

  return (
    <section id="skills" className="relative py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal>
          <SectionHeader
            eyebrow="Skills"
            title={<>Tools I work <span className="gradient-text">with</span></>}
            description="A snapshot of the technologies I use day-to-day to ship products end-to-end."
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {groups.map((g) => (
            <SkillCard key={g.title} group={g} />
          ))}
        </div>
      </div>
    </section>
  );
}
