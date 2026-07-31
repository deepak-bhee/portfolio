import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Mail, MailOpen, Inbox } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { EmptyState, LoadingRows } from "./AdminUI";
import { ConfirmDialog } from "./ConfirmDialog";
import { cn } from "@/lib/utils";

export function MessagesAdmin() {
  const qc = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);
  const [expanded, setExpanded]         = useState(null);

  const { data: items = [], isLoading, isError } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const unread = items.filter((m) => !m.is_read).length;

  async function toggleRead(m) {
    await supabase.from("messages").update({ is_read: !m.is_read }).eq("id", m.id);
    qc.invalidateQueries({ queryKey: ["messages"] });
  }

  async function confirmDelete() {
    setDeleting(true);
    const { error } = await supabase.from("messages").delete().eq("id", deleteTarget);
    setDeleting(false);
    if (error) return toast.error(error.message);
    toast.success("Message deleted");
    setDeleteTarget(null);
    qc.invalidateQueries({ queryKey: ["messages"] });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold flex items-center gap-2">
          Messages
          {!isLoading && items.length > 0 && (
            <span className="text-sm font-normal text-muted-foreground">
              ({items.length} total{unread > 0 && `, `}
              {unread > 0 && <span className="font-semibold text-primary">{unread} unread</span>})
            </span>
          )}
        </h2>
        {unread > 0 && (
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{unread}</span>
        )}
      </div>

      {isLoading ? <LoadingRows count={4} /> : isError ? (
        <p className="text-center text-sm text-red-500">Failed to load messages.</p>
      ) : items.length === 0 ? (
        <EmptyState icon={Inbox} title="No messages yet" subtitle="Contact form submissions will appear here." />
      ) : (
        <div className="grid gap-3">
          {items.map((m) => {
            const isOpen = expanded === m.id;
            return (
              <div key={m.id}
                className={cn(
                  "rounded-2xl border bg-card shadow-soft transition-all duration-200",
                  !m.is_read && "border-primary/30 bg-primary/5"
                )}
              >
                {/* Header row — always visible */}
                <div className="flex cursor-pointer items-start gap-2.5 sm:gap-3 p-3.5 sm:p-4" onClick={() => { setExpanded(isOpen ? null : m.id); if (!m.is_read) toggleRead(m); }}>
                  <div className={cn("mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl", m.is_read ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary")}>
                    {m.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className={cn("font-semibold", !m.is_read && "text-primary")}>{m.name}</span>
                      {!m.is_read && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">NEW</span>}
                      <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <a href={`mailto:${m.email}`} className="text-xs text-primary hover:underline" onClick={(e) => e.stopPropagation()}>{m.email}</a>
                    {m.subject && <p className="mt-0.5 text-sm font-medium">{m.subject}</p>}
                    {!isOpen && <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{m.message}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1.5 ml-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-primary/40" title={m.is_read ? "Mark unread" : "Mark read"} onClick={() => toggleRead(m)}>
                      {m.is_read ? <Mail className="h-3.5 w-3.5" /> : <MailOpen className="h-3.5 w-3.5" />}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full h-8 w-8 hover:border-red-400 hover:text-red-500" onClick={() => setDeleteTarget(m.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Expanded message body */}
                {isOpen && (
                  <div className="border-t px-4 pb-4 pt-3">
                    <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">{m.message}</p>
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || "Your message")}`}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90 active:scale-95 transition-all">
                      <Mail className="h-3.5 w-3.5" /> Reply via email
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog open={!!deleteTarget} title="Delete message?" description="This cannot be undone." onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)} loading={deleting} />
    </div>
  );
}
