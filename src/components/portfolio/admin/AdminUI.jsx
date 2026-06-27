import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function Field({ label, children, hint }) {
  return (
    <div>
      <label className="text-xs font-medium text-foreground">{label}</label>
      {hint && <span className="ml-2 text-xs text-muted-foreground">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function AdminInput(props) {
  return <Input {...props} className={`rounded-xl transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary ${props.className ?? ""}`} />;
}

export function AdminTextarea(props) {
  return <Textarea {...props} className={`rounded-xl resize-none transition-all focus:ring-2 focus:ring-primary/30 focus:border-primary ${props.className ?? ""}`} />;
}

export function EmptyState({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-card/50 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-accent text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <p className="font-semibold text-foreground">{title}</p>
      {subtitle && <p className="mt-1 max-w-xs text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

export function LoadingRows({ count = 3 }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl animate-shimmer" />
      ))}
    </div>
  );
}

export function ImagePreview({ url }) {
  if (!url) return null;
  return (
    <div className="mt-2 overflow-hidden rounded-xl border bg-muted">
      <img
        src={url}
        alt="Preview"
        className="h-32 w-full object-cover"
        onError={(e) => { e.target.style.display = "none"; }}
      />
    </div>
  );
}
