import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "./SectionHeader";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useGsapReveal } from "@/hooks/useGsapReveal";

const schema = z.object({
  name:    z.string().trim().min(1, "Name is required").max(100),
  email:   z.string().trim().email("Invalid email").max(255),
  subject: z.string().trim().max(150).optional().default(""),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export function Contact() {
  const ref = useGsapReveal("[data-reveal]");
  const [form, setForm]         = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent]         = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("messages").insert(parsed.data);
    setSubmitting(false);
    if (error) { toast.error("Couldn't send message. Please try again."); return; }
    toast.success("Message sent — I'll get back to you soon! 🎉");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <section id="contact" className="relative py-20 md:py-28" ref={ref}>
      <div className="mx-auto max-w-6xl px-5">
        <div data-reveal>
          <SectionHeader
            eyebrow="Contact"
            title={<>Let's build something <span className="gradient-text">great</span></>}
            description="Have a project in mind or just want to say hi? Drop a message."
          />
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1.4fr]">
          {/* Info card */}
          <div data-reveal className="rounded-3xl border bg-card p-7 shadow-soft">
            <h3 className="font-display text-lg font-semibold">Get in touch</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              I usually respond within 24 hours. For urgent things, mention it in the subject.
            </p>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-center gap-3 group">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  <Mail className="h-4 w-4" />
                </span>
                <a
                  href="mailto:deepakbhee2006@gmail.com"
                  className="hover:text-primary transition-colors duration-200"
                >
                  deepakbhee2006@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="text-muted-foreground">India · Remote-friendly</span>
              </li>
            </ul>

            {/* Availability badge */}
            <div className="mt-8 flex items-center gap-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Available for new projects
              </span>
            </div>
          </div>

          {/* Form */}
          <form
            data-reveal
            onSubmit={onSubmit}
            className="rounded-3xl border bg-card p-7 shadow-soft"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="group">
                <label className="text-xs font-medium transition-colors group-focus-within:text-primary">
                  Name
                </label>
                <Input
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Your name"
                  className="mt-1.5 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <div className="group">
                <label className="text-xs font-medium transition-colors group-focus-within:text-primary">
                  Email
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  className="mt-1.5 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-4 group">
              <label className="text-xs font-medium transition-colors group-focus-within:text-primary">
                Subject
              </label>
              <Input
                value={form.subject}
                onChange={set("subject")}
                placeholder="What is this about?"
                className="mt-1.5 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            <div className="mt-4 group">
              <label className="text-xs font-medium transition-colors group-focus-within:text-primary">
                Message
              </label>
              <Textarea
                rows={5}
                value={form.message}
                onChange={set("message")}
                placeholder="Tell me about your project..."
                className="mt-1.5 rounded-xl transition-all duration-200 focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              size="lg"
              className={`mt-6 w-full rounded-full bg-gradient-primary shadow-glow transition-all duration-300
                          hover:opacity-90 hover:shadow-[0_0_50px_oklch(0.55_0.24_285_/_0.5)] active:scale-98
                          ${sent ? "bg-emerald-500 shadow-emerald-500/40" : ""}`}
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending…</>
              ) : sent ? (
                <>✓ Sent!</>
              ) : (
                <><Send className="mr-2 h-4 w-4" /> Send message</>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
