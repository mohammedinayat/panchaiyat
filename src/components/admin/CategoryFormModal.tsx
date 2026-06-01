import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import type { AdminCategory } from "@/context/MenuStoreContext";

const schema = z.object({
  name: z.string().min(1, "Name is required").transform((v) => v.toUpperCase()),
  icon: z.string().min(1, "Icon is required"),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<AdminCategory, "id">) => void;
  initial?: AdminCategory | null;
  nextSortOrder: number;
};

const EMOJI_SUGGESTIONS = ["🍔", "🥟", "🍕", "🍜", "🍟", "🥤", "🍿", "🌮", "🍱", "🥗", "🍛", "🍝", "🧆", "🥙", "🍣", "🍦", "☕", "🧃"];

export function CategoryFormModal({ open, onClose, onSave, initial, nextSortOrder }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", icon: "🍽️" },
  });

  const currentIcon = watch("icon");

  useEffect(() => {
    if (initial) {
      reset({ name: initial.name, icon: initial.icon });
    } else {
      reset({ name: "", icon: "🍽️" });
    }
  }, [initial, open, reset]);

  if (!open) return null;

  const onSubmit = (data: FormValues) => {
    onSave({
      name: data.name,
      icon: data.icon,
      sortOrder: initial?.sortOrder ?? nextSortOrder,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-display text-2xl text-foreground">
            {initial ? "EDIT CATEGORY" : "ADD CATEGORY"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Icon picker */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Icon *
            </label>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/50 border border-border grid place-items-center text-2xl">
                {currentIcon}
              </div>
              <input
                {...register("icon")}
                className="flex-1 bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-saffron transition"
                placeholder="Paste any emoji"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {EMOJI_SUGGESTIONS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setValue("icon", e)}
                  className={`w-9 h-9 rounded-lg border text-lg transition ${
                    currentIcon === e
                      ? "border-saffron bg-saffron/15"
                      : "border-border bg-secondary/30 hover:border-saffron/50"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
            {errors.icon && <p className="text-destructive text-xs mt-1">{errors.icon.message}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Category Name *
            </label>
            <input
              {...register("name")}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-saffron transition uppercase"
              placeholder="e.g. PASTA"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-lg bg-saffron text-primary-foreground text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition"
            >
              {initial ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
