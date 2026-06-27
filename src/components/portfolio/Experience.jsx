import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { useGsapReveal } from "@/hooks/useGsapReveal";

function formatRange(start, end, current) {
  const s = start ? new Date(start).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "";
  const e = current ? "Present" : end ? new Date(end).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "";
  return [s, e].filter(Boolean).join(" — ");
}

export function Learning() {
  const ref = useGsapReveal("[data-reveal]");

  const { data: items = [] } = useQuery({
    queryKey: ["learning"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("sort_order")
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <section id="learning" className="relative py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-4xl px-5">
        <div data-reveal>
          <SectionHeader eyebrow="Learning" title={<>What I&apos;m <span className="gradient-text">learning</span></>} />
        </div>

        {items.length === 0 ? (
          <div data-reveal className="rounded-3xl border bg-card p-10 text-center shadow-soft">
            <p className="text-sm font-medium text-primary">No professional history yet</p>
            <h3 className="mt-4 font-display text-2xl font-semibold">I&apos;m building my skills every day</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              I&apos;m currently learning web development, working on projects, and preparing to contribute in a professional role soon.
            </p>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-linear-to-b from-primary/60 via-border to-transparent md:left-1/2" />
            <div className="space-y-10">
              {items.map((it, i) => (
                <div key={it.id} data-reveal className={`relative md:grid md:grid-cols-2 md:gap-10 ${i % 2 === 0 ? "" : "md:[&>*:first-child]:order-2"}`}>
                  <div className="absolute left-4 top-3 -translate-x-1/2 md:left-1/2">
                    <div className="h-4 w-4 rounded-full border-4 border-background bg-gradient-primary shadow-glow" />
                  </div>
                  <div className="ml-10 md:ml-0 md:px-6">
                    <div className="rounded-2xl border bg-card p-6 shadow-soft transition-all hover:shadow-card">
                      <p className="text-xs font-medium text-primary">{formatRange(it.start_date, it.end_date, it.is_current)}</p>
                      <h3 className="mt-1 font-display text-lg font-semibold">{it.role}</h3>
                      <p className="text-sm text-muted-foreground">{it.company}</p>
                      <p className="mt-3 text-sm leading-relaxed">{it.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
