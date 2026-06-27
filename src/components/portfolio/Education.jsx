import { useQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { useGsapReveal } from "@/hooks/useGsapReveal";

export function Education() {
  const ref = useGsapReveal("[data-reveal]");

  const { data: items = [] } = useQuery({
    queryKey: ["educations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("educations").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const list = items.length === 0
    ? [
      { id: "1", degree: "B.Tech in Computer Science", institution: "SDM College of Engineering and Technology,Dharwad", year: "2023 — 2027", grade: "CGPA 8.2" },
      { id: "2", degree: "Higher Secondary (PCMB)", institution: "Prerana PU College,Yadgir", year: "2021 — 2023", grade: "85%" },
    ]
    : items;

  return (
    <section id="education" className="relative py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-5xl px-5">
        <div data-reveal>
          <SectionHeader eyebrow="Education" title={<>My <span className="gradient-text">academic</span> path</>} />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {list.map((e) => (
            <div key={e.id} data-reveal
              className="flex gap-5 rounded-3xl border bg-card p-6 shadow-soft transition-all hover:shadow-card">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base font-semibold">{e.degree}</h3>
                <p className="text-sm text-muted-foreground">{e.institution}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {e.year && <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-accent-foreground">{e.year}</span>}
                  {e.grade && <span className="rounded-full bg-accent px-2.5 py-0.5 font-medium text-accent-foreground">{e.grade}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
