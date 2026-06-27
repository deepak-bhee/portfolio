import { useQuery } from "@tanstack/react-query";
import { Award, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
export function Certificates() {
  const { data: certs = [] } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .order("issued_on", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
  if (certs.length === 0) return null;
  return (
    <section id="certificates" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeader
          eyebrow="Certificates"
          title={
            <>
              Credentials & <span className="gradient-text">courses</span>
            </>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <div
              key={c.id}
              className="group overflow-hidden rounded-3xl border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"
            >
              <div className="aspect-16/10 overflow-hidden bg-muted">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-gradient-primary text-primary-foreground">
                    <Award className="h-12 w-12" />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-display font-semibold">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.issuer}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {c.issued_on
                      ? new Date(c.issued_on).toLocaleDateString(undefined, {
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                  {c.certificate_url && (
                    <a
                      href={c.certificate_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
