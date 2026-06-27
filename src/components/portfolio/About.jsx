import { SectionHeader } from "./SectionHeader";
import { Briefcase, GraduationCap, Code2 } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const cards = [
  {
    icon: Code2,
    title: "What I do",
    body: "Full-stack web apps with React, Node.js and modern databases. Clean code, strong DX, scalable architecture.",
    accent: "from-violet-500 to-purple-600",
  },
  {
    icon: Briefcase,
    title: "Learning",
    body: "Learning web development through projects, practice, and continuous improvement.",
    accent: "from-blue-500 to-indigo-600",
  },
  {
    icon: GraduationCap,
    title: "Education",
    body: "Computer Science graduate with a focus on web technologies, algorithms and system design.",
    accent: "from-emerald-500 to-teal-600",
  },
];

export function About() {
  const ref = useGsapReveal("[data-reveal]");

  return (
    <section id="about" className="relative py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal>
          <SectionHeader
            eyebrow="About"
            title={<>A bit <span className="gradient-text">about me</span></>}
            description="Passionate full-stack developer focused on building fast, accessible, and beautiful products."
          />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map(({ icon: Icon, title, body, accent }) => (
            <div
              key={title}
              data-reveal
              className="group relative rounded-3xl border bg-card p-7 shadow-soft
                         transition-all duration-300 hover:-translate-y-2 hover:shadow-card overflow-hidden"
            >
              {/* Soft glow on hover */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 bg-gradient-to-br ${accent} pointer-events-none`}
              />

              {/* Icon */}
              <div
                className={`mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow
                            transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-semibold transition-colors group-hover:text-primary">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
