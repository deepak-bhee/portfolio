import { useQuery } from "@tanstack/react-query";
import { Github, ExternalLink, Folder } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { useGsapReveal } from "@/hooks/useGsapReveal";

/** Shimmer skeleton card */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-soft">
      {/* Image area */}
      <div className="aspect-[16/10] animate-shimmer" />
      {/* Body */}
      <div className="p-6 space-y-3">
        <div className="h-5 w-3/5 rounded-full animate-shimmer" />
        <div className="h-3 w-full rounded-full animate-shimmer" />
        <div className="h-3 w-4/5 rounded-full animate-shimmer" />
        <div className="flex gap-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-12 rounded-full animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const ref = useGsapReveal("[data-reveal]");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <section id="projects" className="relative py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal>
          <SectionHeader
            eyebrow="Projects"
            title={<>Selected <span className="gradient-text">work</span></>}
            description="A few things I've recently designed, built, and shipped."
          />
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : projects.length === 0 ? (
          <div
            data-reveal
            className="mx-auto max-w-md rounded-3xl border border-dashed bg-card/50 p-10 text-center"
          >
            <Folder className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-4 text-sm text-muted-foreground">
              No projects yet. Sign in to the admin dashboard to add your first project.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <article
                key={p.id}
                data-reveal
                className="group flex flex-col overflow-hidden rounded-3xl border bg-card shadow-soft
                           transition-all duration-300
                           hover:-translate-y-2 hover:shadow-card hover:border-primary/30"
              >
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-107"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-primary text-primary-foreground">
                      <Folder className="h-10 w-10 opacity-70" />
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                    {p.category}
                  </span>
                  {/* Featured badge */}
                  {p.featured && (
                    <span className="absolute top-3 right-3 rounded-full bg-gradient-primary px-3 py-1 text-xs font-medium text-primary-foreground shadow-glow">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold transition-colors group-hover:text-primary">
                    {p.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                    {p.description}
                  </p>

                  {p.technologies?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.technologies.slice(0, 5).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground
                                     transition-colors duration-200 hover:bg-primary/15 hover:text-primary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Links */}
                  <div className="mt-auto flex items-center gap-2 pt-5">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium
                                   transition-all duration-200 hover:bg-accent hover:border-primary/30 hover:text-primary active:scale-95"
                      >
                        <Github className="h-3.5 w-3.5" /> Code
                      </a>
                    )}
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-medium text-primary-foreground
                                   transition-all duration-200 hover:opacity-90 hover:shadow-glow active:scale-95"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Live
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
