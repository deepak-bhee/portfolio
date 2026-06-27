import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, AdminInput, EmptyState, LoadingRows } from "./AdminUI";
import { ConfirmDialog } from "./ConfirmDialog";

const empty = () => ({ degree: "", institution: "", year: "", grade: "", sort_order: 0 });

export function EducationAdmin() {
  const qc = useQueryClient();
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["educations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("educations").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    if (!form.degree.trim() || !form.institution.trim()) return toast.error("Degree and institution are required");
    setSaving(true);
    const payload = {
      degree: form.degree.trim(),
      institution: form.institution.trim(),
      year: form.year || null,
      grade: form.grade || null,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } = form.id
      ? await supabase.from("educations").update(payload).eq("id", form.id)
      : await supabase.from("educations").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Updated ✓" : "Added ✓");
    setOpen(false); setForm(empty());
    qc.invalidateQueries({ queryKey: ["educations"] });
  }

  async function confirmDelete() {
    setDeleting(true);
    const { error } = await supabase.from("educations").delete().eq("id", deleteTarget);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDeleteTarget(null);
    qc.invalidateQueries({ queryKey: ["educations"] });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Education {!isLoading && `(${items.length})`}</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(empty()); }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-glow hover:opacity-90 active:scale-95">
              <Plus className="mr-1 h-4 w-4" /> New education
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl sm:max-w-md">
            <DialogHeader><DialogTitle>{form.id ? "Edit education" : "New education"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-1">
              <Field label="Degree / Course *"><AdminInput value={form.degree} onChange={set("degree")} placeholder="B.Tech in Computer Science" /></Field>
              <Field label="Institution *"><AdminInput value={form.institution} onChange={set("institution")} placeholder="University name" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Year / Range"><AdminInput value={form.year} onChange={set("year")} placeholder="2023 — 2027" /></Field>
                <Field label="Grade / CGPA"><AdminInput value={form.grade} onChange={set("grade")} placeholder="CGPA 8.2" /></Field>
              </div>
              <Field label="Sort order"><AdminInput type="number" value={form.sort_order} onChange={set("sort_order")} /></Field>
              <Button onClick={save} disabled={saving} className="w-full rounded-full bg-gradient-primary hover:opacity-90 active:scale-95">
                {saving ? "Saving…" : form.id ? "Save changes" : "Add education"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <LoadingRows count={2} /> : isError ? (
        <p className="text-center text-sm text-red-500">Failed to load education entries.</p>
      ) : items.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No education entries" subtitle="Add your degrees and qualifications." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((e) => (
            <div key={e.id} className="group flex items-start gap-4 rounded-2xl border bg-card p-4 shadow-soft transition-all hover:shadow-card hover:border-primary/20">
              <div className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-sm">{e.degree}</p>
                <p className="text-xs text-muted-foreground">{e.institution}</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {e.year && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium">{e.year}</span>}
                  {e.grade && <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium">{e.grade}</span>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-primary/40"
                  onClick={() => { setForm({ id: e.id, degree: e.degree, institution: e.institution, year: e.year ?? "", grade: e.grade ?? "", sort_order: e.sort_order ?? 0 }); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-red-400 hover:text-red-500" onClick={() => setDeleteTarget(e.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete education?" description="This cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
