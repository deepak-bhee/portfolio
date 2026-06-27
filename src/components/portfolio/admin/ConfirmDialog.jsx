import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({ open, title, description, onConfirm, onCancel, loading }) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="rounded-3xl sm:max-w-sm">
        <DialogHeader>
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
          <DialogTitle className="text-center">{title}</DialogTitle>
          {description && <p className="mt-1 text-center text-sm text-muted-foreground">{description}</p>}
        </DialogHeader>
        <div className="mt-4 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button className="flex-1 rounded-full bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm} disabled={loading}>
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
