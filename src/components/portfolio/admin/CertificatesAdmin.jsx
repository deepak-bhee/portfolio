import { useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Award, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, AdminInput, EmptyState, LoadingRows, ImagePreview } from "./AdminUI";
import { ConfirmDialog } from "./ConfirmDialog";

const empty = () => ({ title: "", issuer: "", image_url: "", certificate_url: "", issued_on: "" });

export function CertificatesAdmin() {
  const qc = useQueryClient();
  const [open, setOpen]         = useState(false);
  const [form, setForm]         = useState(empty());
  const [saving, setSaving]     = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certificates").select("*").order("issued_on", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    if (!form.title.trim() || !form.issuer.trim()) return toast.error("Title and issuer are required");
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      issuer: form.issuer.trim(),
      image_url: form.image_url || null,
      certificate_url: form.certificate_url || null,
      issued_on: form.issued_on || null,
    };
    const { error } = form.id
      ? await supabase.from("certificates").update(payload).eq("id", form.id)
      : await supabase.from("certificates").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Certificate updated ✓" : "Certificate added ✓");
    setOpen(false);
    setForm(empty());
    qc.invalidateQueries({ queryKey: ["certificates"] });
  }

  async function confirmDelete() {
    setDeleting(true);
    const { error } = await supabase.from("certificates").delete().eq("id", deleteTarget);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    setDeleteTarget(null);
    qc.invalidateQueries({ queryKey: ["certificates"] });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Certificates {!isLoading && `(${items.length})`}</h2>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setForm(empty()); }}>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-gradient-primary shadow-glow hover:opacity-90 active:scale-95">
              <Plus className="mr-1 h-4 w-4" /> New certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[85vh] overflow-y-auto rounded-3xl w-[92vw] sm:max-w-md p-4 sm:p-6">
            <DialogHeader><DialogTitle>{form.id ? "Edit certificate" : "New certificate"}</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-1">
              <Field label="Title *"><AdminInput value={form.title} onChange={set("title")} placeholder="AWS Certified Developer" /></Field>
              <Field label="Issuer *"><AdminInput value={form.issuer} onChange={set("issuer")} placeholder="Amazon Web Services" /></Field>
              <Field label="Issued on"><AdminInput type="date" value={form.issued_on} onChange={set("issued_on")} /></Field>
              <Field label="Image URL" hint="(optional)">
                <AdminInput value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
                <ImagePreview url={form.image_url} />
              </Field>
              <Field label="Certificate URL" hint="(optional)">
                <AdminInput value={form.certificate_url} onChange={set("certificate_url")} placeholder="https://..." />
              </Field>
              <Button onClick={save} disabled={saving} className="w-full rounded-full bg-gradient-primary hover:opacity-90 active:scale-95">
                {saving ? "Saving…" : form.id ? "Save changes" : "Add certificate"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <LoadingRows count={3} /> : isError ? (
        <p className="text-center text-sm text-red-500">Failed to load certificates.</p>
      ) : items.length === 0 ? (
        <EmptyState icon={Award} title="No certificates yet" subtitle="Add your first certification to show it on the portfolio." />
      ) : (
        <div className="grid gap-3 w-full overflow-hidden">
          {items.map((c) => (
            <div key={c.id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border bg-card p-3.5 sm:p-4 shadow-soft transition-all hover:shadow-card hover:border-primary/20 min-w-0 w-full overflow-hidden">
              <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                <div className="h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {c.image_url ? <img src={c.image_url} alt="" className="h-full w-full object-cover" /> : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-primary">
                      <Award className="h-5 w-5 text-primary-foreground opacity-70" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <p className="truncate font-semibold text-sm sm:text-base">{c.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {c.issuer} {c.issued_on ? `· ${new Date(c.issued_on).toLocaleDateString()}` : ""}
                  </p>
                  {c.certificate_url && (
                    <a href={c.certificate_url} target="_blank" rel="noreferrer" className="mt-0.5 text-xs text-primary hover:underline flex items-center gap-0.5">
                      <ExternalLink className="h-3 w-3" /> View certificate
                    </a>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-primary/40"
                  onClick={() => { setForm({ id: c.id, title: c.title, issuer: c.issuer, image_url: c.image_url ?? "", certificate_url: c.certificate_url ?? "", issued_on: c.issued_on ?? "" }); setOpen(true); }}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-red-400 hover:text-red-500" onClick={() => setDeleteTarget(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete certificate?" description="This action cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
