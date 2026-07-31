import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, FolderGit2, ExternalLink, Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, AdminInput, AdminTextarea, EmptyState, LoadingRows, ImagePreview } from "./AdminUI";
import { ConfirmDialog } from "./ConfirmDialog";

const empty = () => ({ title: "", description: "", image_url: "", github_url: "", live_url: "", category: "Web", technologies: "", featured: false, sort_order: 0 });

export function ProjectsAdmin() {
  const qc = useQueryClient();
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  async function save() {
    if (!form.title.trim()) return toast.error("Title is required");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      description: form.description,
      image_url: form.image_url || null,
      github_url: form.github_url || null,
      live_url: form.live_url || null,
      category: form.category || "Web",
      technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
    };
    const { error } = form.id
      ? await supabase.from("projects").update(payload).eq("id", form.id)
      : await supabase.from("projects").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Project updated ✓" : "Project added ✓");
    setOpen(false);
    setForm(empty());
    qc.invalidateQueries({ queryKey: ["projects"] });
  }

  async function confirmDelete() {
    setDeleting(true);
    const { error } = await supabase.from("projects").delete().eq("id", deleteTarget);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDeleteTarget(null);
    qc.invalidateQueries({ queryKey: ["projects"] });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Projects {!isLoading && `(${items.length})`}</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(empty()); }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-glow hover:opacity-90 active:scale-95">
              <Plus className="mr-1 h-4 w-4" /> New project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl w-[92vw] sm:max-w-lg p-4 sm:p-6">
            <DialogHeader><DialogTitle>{form.id ? "Edit project" : "New project"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-1">
              <Field label="Title *"><AdminInput value={form.title} onChange={set("title")} placeholder="My Awesome Project" /></Field>
              <Field label="Description"><AdminTextarea rows={3} value={form.description} onChange={set("description")} placeholder="What does this project do?" /></Field>
              <Field label="Image URL" hint="(optional)">
                <AdminInput value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
                <ImagePreview url={form.image_url} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="GitHub URL"><AdminInput value={form.github_url} onChange={set("github_url")} placeholder="https://github.com/..." /></Field>
                <Field label="Live URL"><AdminInput value={form.live_url} onChange={set("live_url")} placeholder="https://..." /></Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Category"><AdminInput value={form.category} onChange={set("category")} placeholder="Web" /></Field>
                <Field label="Sort order"><AdminInput type="number" value={form.sort_order} onChange={set("sort_order")} /></Field>
              </div>
              <Field label="Technologies" hint="comma separated">
                <AdminInput value={form.technologies} onChange={set("technologies")} placeholder="React, Node.js, MongoDB" />
              </Field>
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border bg-card px-4 py-3 text-sm hover:bg-accent transition-colors">
                <input type="checkbox" checked={form.featured} onChange={set("featured")} className="accent-primary h-4 w-4" />
                <span className="font-medium">Mark as featured</span>
              </label>
              <Button onClick={save} disabled={saving} className="w-full rounded-full bg-gradient-primary hover:opacity-90 active:scale-95">
                {saving ? "Saving…" : form.id ? "Save changes" : "Add project"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <LoadingRows count={3} /> : isError ? (
        <p className="text-center text-sm text-red-500">Failed to load projects. Check your connection.</p>
      ) : items.length === 0 ? (
        <EmptyState icon={FolderGit2} title="No projects yet" subtitle="Click 'New project' to add your first one." />
      ) : (
        <div className="grid gap-3">
          {items.map((p) => (
            <div key={p.id} className="group flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 rounded-2xl border bg-card p-3.5 sm:p-4 shadow-soft transition-all hover:shadow-card hover:border-primary/20">
              <div className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                {p.image_url ? <img src={p.image_url} alt="" className="h-full w-full object-cover" /> : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-primary">
                    <FolderGit2 className="h-5 w-5 text-primary-foreground opacity-70" />
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sm sm:text-base">
                  {p.title}
                  {p.featured && <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-primary">⭐ Featured</span>}
                </p>
                <p className="truncate text-xs text-muted-foreground">{p.category} · {p.technologies?.join(", ")}</p>
                <div className="mt-1 flex gap-2">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5"><Github className="h-3 w-3" /> Code</a>}
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-0.5"><ExternalLink className="h-3 w-3" /> Live</a>}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-primary/40" onClick={() => { setForm({ id: p.id, title: p.title, description: p.description ?? "", image_url: p.image_url ?? "", github_url: p.github_url ?? "", live_url: p.live_url ?? "", category: p.category, technologies: p.technologies?.join(", ") ?? "", featured: p.featured, sort_order: p.sort_order ?? 0 }); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-red-400 hover:text-red-500" onClick={() => setDeleteTarget(p.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete project?" description="This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
