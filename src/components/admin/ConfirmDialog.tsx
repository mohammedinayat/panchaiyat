import { AlertTriangle, X } from "lucide-react";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-destructive/15 grid place-items-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="font-display text-xl text-foreground">{title}</h3>
        </div>

        <p className="text-sm text-muted-foreground mb-6">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground transition"
          >
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onCancel(); }}
            className="flex-1 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
