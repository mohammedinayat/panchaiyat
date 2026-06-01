import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ImageIcon } from "lucide-react";
import type { AdminMenuItem } from "@/context/MenuStoreContext";
import type { AdminCategory } from "@/context/MenuStoreContext";

const sizeSchema = z.object({
  S: z.coerce.number().min(1),
  M: z.coerce.number().min(1),
  L: z.coerce.number().min(1),
});

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  diet: z.enum(["veg", "nonveg", "beverage"]),
  hasSizes: z.boolean(),
  price: z.coerce.number().optional(),
  sizes: sizeSchema.optional(),
  note: z.string().optional(),
  imageUrl: z.string().optional(),
  outOfStock: z.boolean(),
  featured: z.boolean(),
}).refine((d) => {
  if (!d.hasSizes && (!d.price || d.price < 1)) return false;
  return true;
}, { message: "Price is required for non-pizza items", path: ["price"] });

type FormValues = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<AdminMenuItem, "id">) => void;
  initial?: AdminMenuItem | null;
  categories: AdminCategory[];
};

export function ItemFormModal({ open, onClose, onSave, initial, categories }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      category: categories[0]?.name ?? "",
      diet: "veg",
      hasSizes: false,
      price: undefined,
      sizes: { S: 0, M: 0, L: 0 },
      note: "",
      imageUrl: "",
      outOfStock: false,
      featured: false,
    },
  });

  const hasSizes = watch("hasSizes");

  useEffect(() => {
    if (initial) {
      reset({
        name: initial.name,
        category: initial.category,
        diet: initial.diet,
        hasSizes: !!initial.sizes,
        price: initial.price,
        sizes: initial.sizes ?? { S: 0, M: 0, L: 0 },
        note: initial.note ?? "",
        imageUrl: initial.imageUrl ?? "",
        outOfStock: initial.outOfStock,
        featured: initial.featured,
      });
    } else {
      reset({
        name: "",
        category: categories[0]?.name ?? "",
        diet: "veg",
        hasSizes: false,
        price: undefined,
        sizes: { S: 0, M: 0, L: 0 },
        note: "",
        imageUrl: "",
        outOfStock: false,
        featured: false,
      });
    }
  }, [initial, open, reset, categories]);

  if (!open) return null;

  const onSubmit = (data: FormValues) => {
    onSave({
      name: data.name,
      category: data.category,
      diet: data.diet,
      price: data.hasSizes ? undefined : data.price,
      sizes: data.hasSizes ? data.sizes : undefined,
      note: data.note || undefined,
      imageUrl: data.imageUrl || undefined,
      outOfStock: data.outOfStock,
      featured: data.featured,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="font-display text-2xl text-foreground">
            {initial ? "EDIT ITEM" : "ADD ITEM"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Item Name *
            </label>
            <input
              {...register("name")}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-saffron transition"
              placeholder="e.g. Chicken Steam Momos"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-saffron transition"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-destructive text-xs mt-1">{errors.category.message}</p>}
          </div>

          {/* Diet */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Diet Type *
            </label>
            <div className="flex gap-2">
              {(["veg", "nonveg", "beverage"] as const).map((d) => (
                <label key={d} className="flex-1">
                  <input type="radio" value={d} {...register("diet")} className="sr-only peer" />
                  <div className="peer-checked:bg-saffron/20 peer-checked:border-saffron peer-checked:text-saffron border border-border rounded-lg py-2 text-center text-xs uppercase tracking-wider cursor-pointer transition text-muted-foreground hover:border-saffron/50">
                    {d === "veg" ? "🟢 Veg" : d === "nonveg" ? "🔴 Non-Veg" : "🟡 Beverage"}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Has sizes toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
            <div>
              <div className="text-sm font-medium text-foreground">Pizza / Size-based pricing</div>
              <div className="text-xs text-muted-foreground">Enable S / M / L sizes</div>
            </div>
            <Controller
              name="hasSizes"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${field.value ? "bg-saffron" : "bg-secondary"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${field.value ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              )}
            />
          </div>

          {/* Price or Sizes */}
          {hasSizes ? (
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                Prices (₹) *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["S", "M", "L"] as const).map((s) => (
                  <div key={s}>
                    <label className="block text-xs text-muted-foreground mb-1">{s}</label>
                    <input
                      type="number"
                      {...register(`sizes.${s}`)}
                      className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-saffron transition"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
                Price (₹) *
              </label>
              <input
                type="number"
                {...register("price")}
                className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:border-saffron transition"
                placeholder="e.g. 80"
              />
              {errors.price && <p className="text-destructive text-xs mt-1">{errors.price.message}</p>}
            </div>
          )}

          {/* Note */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Note / Description (optional)
            </label>
            <input
              {...register("note")}
              className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-saffron transition"
              placeholder="e.g. Onion, Capsicum, Corn"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1.5">
              Image URL (optional)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  {...register("imageUrl")}
                  className="w-full bg-secondary/50 border border-border rounded-lg pl-10 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-saffron transition"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>
            {/* Preview */}
            {watch("imageUrl") && (
              <div className="mt-2 relative h-24 rounded-lg overflow-hidden border border-border bg-secondary/30">
                <img
                  src={watch("imageUrl")}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Paste any image URL. Use <a href="https://unsplash.com" target="_blank" rel="noreferrer" className="text-saffron hover:underline">Unsplash</a> for free food photos.
            </p>
          </div>

          {/* Flags */}
          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="outOfStock"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition text-sm ${
                    field.value
                      ? "bg-destructive/15 border-destructive/40 text-destructive"
                      : "bg-secondary/30 border-border text-muted-foreground hover:border-destructive/40"
                  }`}
                >
                  <span className="text-base">{field.value ? "🚫" : "✅"}</span>
                  {field.value ? "Out of Stock" : "In Stock"}
                </button>
              )}
            />
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <button
                  type="button"
                  onClick={() => field.onChange(!field.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition text-sm ${
                    field.value
                      ? "bg-saffron/15 border-saffron/40 text-saffron"
                      : "bg-secondary/30 border-border text-muted-foreground hover:border-saffron/40"
                  }`}
                >
                  <span className="text-base">{field.value ? "⭐" : "☆"}</span>
                  {field.value ? "Featured" : "Not Featured"}
                </button>
              )}
            />
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
              {initial ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
