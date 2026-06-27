import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, AdminInput, AdminTextarea, EmptyState, LoadingRows } from "./AdminUI";
import { ConfirmDialog } from "./ConfirmDialog";

const empty = () => ({ company: "", role: "", start_date: "", end_date: "", is_current: false, description: "", sort_order: 0 });

export function ExperiencesAdmin() {
  const qc = useQueryClient();
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["learning"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experiences").select("*").order("sort_order").order("start_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function save() {
    if (!form.company.trim() || !form.role.trim()) return toast.error("Company and role are required");
    setSaving(true);
    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      start_date: form.start_date || null,
      end_date: form.is_current ? null : (form.end_date || null),
      is_current: form.is_current,
      description: form.description,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } = form.id
      ? await supabase.from("experiences").update(payload).eq("id", form.id)
      : await supabase.from("experiences").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Updated ✓" : "Added ✓");
    setOpen(false); setForm(empty());
    qc.invalidateQueries({ queryKey: ["learning"] });
  }

  async function confirmDelete() {
    setDeleting(true);
    const { error } = await supabase.from("experiences").delete().eq("id", deleteTarget);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDeleteTarget(null);
    qc.invalidateQueries({ queryKey: ["learning"] });
  }

  function fmt(date) {
    if (!date) return "";
    return new Date(date).toLocaleDateString(undefined, { month: "short", year: "numeric" });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Learning / Experience {!isLoading && `(${items.length})`}</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(empty()); }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-glow hover:opacity-90 active:scale-95">
              <Plus className="mr-1 h-4 w-4" /> New entry
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl sm:max-w-md">
            <DialogHeader><DialogTitle>{form.id ? "Edit entry" : "New learning entry"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-1">
              <Field label="Role / Title *"><AdminInput value={form.role} onChange={set("role")} placeholder="Junior Developer" /></Field>
              <Field label="Company / Platform *"><AdminInput value={form.company} onChange={set("company")} placeholder="Self-taught / Udemy / etc." /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date"><AdminInput type="date" value={form.start_date} onChange={set("start_date")} /></Field>
                <Field label="End date"><AdminInput type="date" value={form.end_date} onChange={set("end_date")} disabled={form.is_current} /></Field>
              </div>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border bg-card px-4 py-3 text-sm hover:bg-accent transition-colors">
                <input type="checkbox" checked={form.is_current} onChange={set("is_current")} className="accent-primary h-4 w-4" />
                <span className="font-medium">Currently ongoing</span>
              </label>
              <Field label="Description"><AdminTextarea rows={3} value={form.description} onChange={set("description")} placeholder="What did you learn or do?" /></Field>
              <Field label="Sort order"><AdminInput type="number" value={form.sort_order} onChange={set("sort_order")} /></Field>
              <Button onClick={save} disabled={saving} className="w-full rounded-full bg-gradient-primary hover:opacity-90 active:scale-95">
                {saving ? "Saving…" : form.id ? "Save changes" : "Add entry"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <LoadingRows count={3} /> : isError ? (
        <p className="text-center text-sm text-red-500">Failed to load experiences.</p>
      ) : items.length === 0 ? (
        <EmptyState icon={BookOpen} title="No entries yet" subtitle="Add learning milestones, courses, or work experience." />
      ) : (
        <div className="grid gap-3">
          {items.map((it) => (
            <div key={it.id} className="group flex items-start gap-4 rounded-2xl border bg-card p-4 shadow-soft transition-all hover:shadow-card hover:border-primary/20">
              <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{it.role}</p>
                <p className="text-sm text-muted-foreground">{it.company}</p>
                <p className="text-xs text-primary mt-0.5">
                  {fmt(it.start_date)}{it.start_date ? " — " : ""}{it.is_current ? "Present" : fmt(it.end_date)}
                </p>
                {it.description && <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{it.description}</p>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-primary/40"
                  onClick={() => { setForm({ id: it.id, company: it.company, role: it.role, start_date: it.start_date ?? "", end_date: it.end_date ?? "", is_current: it.is_current, description: it.description ?? "", sort_order: it.sort_order ?? 0 }); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-red-400 hover:text-red-500" onClick={() => setDeleteTarget(it.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete entry?" description="This cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
