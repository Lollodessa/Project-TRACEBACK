"use client";

// ⚠️ SOLO IN MEMORIA — le modifiche non sono persistenti.
// Le foto vengono mostrate tramite URL.createObjectURL (blob URLs temporanei) —
// NON vengono caricate su nessuno storage. Tutto sparisce al ricarico della pagina.
//
// Per rendere tutto persistente, collegare:
//   - Prodotti: POST/PUT/DELETE /api/products (con Prisma o simile)
//   - Foto:     upload su Supabase Storage / S3, salvare l'URL pubblico in DB
//
// La struttura ProductImage (type: "seed" | "upload") è già pronta per gestire
// sia le immagini esistenti che i nuovi upload in modo distinto.

import { useState, useEffect, useCallback, useRef } from "react";
import { X, Plus, Trash2, Pencil, ImagePlus, AlertTriangle } from "lucide-react";
import {
  products as initialProducts,
  type Product,
  type ColorVariant,
  type Size,
} from "@/lib/products";

// ─── Tipi immagine ─────────────────────────────────────────────────────────────

// Immagine già in products.ts (seed picsum)
interface ExistingImage {
  type: "seed";
  seed: string;
}

// ⚠️ Caricamento simulato — blobUrl è temporaneo (RAM del browser, sessione only).
// Sostituire con upload reale a Supabase Storage / S3 quando ci sarà il backend.
interface UploadedImage {
  type:    "upload";
  file:    File;
  blobUrl: string; // URL.createObjectURL(file) — invalido al ricarico
}

type ProductImage = ExistingImage | UploadedImage;

// ─── Tipi form ─────────────────────────────────────────────────────────────────

const ALL_SIZES: Size[] = ["S", "M", "L", "XL"];

interface VariantForm {
  colorName: string;
  colorHex:  string;
  images:    ProductImage[];
  sizes:     Size[];
  inStock:   boolean;
}

interface ProductForm {
  name:          string;
  description:   string;
  price:         string;
  originalPrice: string;
  variants:      VariantForm[];
}

const EMPTY_VARIANT: VariantForm = {
  colorName: "",
  colorHex:  "#1a1a1a",
  images:    [],
  sizes:     ["S", "M", "L", "XL"],
  inStock:   true,
};

const EMPTY_FORM: ProductForm = {
  name:          "",
  description:   "",
  price:         "",
  originalPrice: "",
  variants:      [{ ...EMPTY_VARIANT }],
};

// ─── Helper URL immagini ────────────────────────────────────────────────────────

// Per le immagini nel form (ProductImage union)
function formImgUrl(img: ProductImage, px = 120): string {
  if (img.type === "upload") return img.blobUrl;
  return `https://picsum.photos/seed/${img.seed}/${px}/${px}`;
}

// Per le immagini già salvate nel Product (stringa: seed o blobUrl)
function productImgUrl(imgStr: string, px = 80): string {
  if (imgStr.startsWith("blob:")) return imgStr;
  return `https://picsum.photos/seed/${imgStr}/${px}/${px}`;
}

// ─── Helpers form ───────────────────────────────────────────────────────────────

function generateId(name: string): string {
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${Date.now().toString(36)}`;
}

function formToProduct(id: string, form: ProductForm): Product {
  return {
    id,
    name:        form.name.trim(),
    description: form.description.trim(),
    price:       parseFloat(form.price) || 0,
    ...(form.originalPrice.trim()
      ? { originalPrice: parseFloat(form.originalPrice) }
      : {}),
    variants: form.variants.map((v, i): ColorVariant => ({
      colorName: v.colorName.trim(),
      colorHex:  v.colorHex,
      // Converte ProductImage[] → string[] (seed o blobUrl temporaneo)
      // ⚠️ In produzione: qui andranno gli URL pubblici dallo storage
      images: v.images.length > 0
        ? v.images.map(img => img.type === "seed" ? img.seed : img.blobUrl)
        : [`${id}-${v.colorName.toLowerCase().replace(/\s+/g, "-")}-${i + 1}`],
      sizes:   v.sizes,
      inStock: v.inStock,
    })),
  };
}

function productToForm(p: Product): ProductForm {
  return {
    name:          p.name,
    description:   p.description,
    price:         String(p.price),
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
    variants:      p.variants.map(v => ({
      colorName: v.colorName,
      colorHex:  v.colorHex,
      // Converte string[] → ExistingImage[] (tratta blobUrl come seed opaco)
      images: v.images.map(s =>
        s.startsWith("blob:")
          ? ({ type: "seed", seed: s } as ExistingImage) // blobUrl già salvato → trattalo come opaco
          : ({ type: "seed", seed: s } as ExistingImage)
      ),
      sizes:   [...v.sizes],
      inStock: v.inStock,
    })),
  };
}

function validateForm(form: ProductForm): Record<string, string> {
  const errs: Record<string, string> = {};
  if (!form.name.trim())  errs.name  = "Campo obbligatorio";
  if (!form.price.trim()) errs.price = "Campo obbligatorio";
  else if (isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
    errs.price = "Prezzo non valido";
  form.variants.forEach((v, i) => {
    if (!v.colorName.trim()) errs[`v${i}_colorName`] = "Nome colore obbligatorio";
    if (v.sizes.length === 0) errs[`v${i}_sizes`]    = "Seleziona almeno una taglia";
    // Immagini mancanti: warning non bloccante (gestito nella UI della variante)
  });
  return errs;
}

// ─── Componente ─────────────────────────────────────────────────────────────────

export default function AdminProdotti() {
  const [adminProducts,   setAdminProducts]   = useState<Product[]>(() => [...initialProducts]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formOpen,        setFormOpen]        = useState(false);
  const [editingId,       setEditingId]       = useState<string | null>(null);
  const [form,            setForm]            = useState<ProductForm>(EMPTY_FORM);
  const [errors,          setErrors]          = useState<Record<string, string>>({});

  // Traccia tutti i blob URL aperti per revocarli se non salvati
  const pendingBlobsRef = useRef<string[]>([]);

  // ESC chiude il modal
  const closeForm = useCallback((wasSaved = false) => {
    // Se chiudo senza salvare, revoca i blob URL nuovi (non quelli che erano già in products)
    if (!wasSaved) {
      pendingBlobsRef.current.forEach(url => URL.revokeObjectURL(url));
    }
    pendingBlobsRef.current = [];
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  }, []);

  useEffect(() => {
    if (!formOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeForm(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [formOpen, closeForm]);

  // ── Handlers prodotto ────────────────────────────────────────────────────────

  const openNew = () => {
    pendingBlobsRef.current = [];
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (p: Product) => {
    pendingBlobsRef.current = [];
    setForm(productToForm(p));
    setEditingId(p.id);
    setErrors({});
    setFormOpen(true);
  };

  const handleSave = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const id    = editingId ?? generateId(form.name);
    const saved = formToProduct(id, form);

    setAdminProducts(prev =>
      editingId
        ? prev.map(p => p.id === editingId ? saved : p)
        : [...prev, saved]
    );
    // I blob URL che finiscono in adminProducts rimangono validi — non revocarli
    pendingBlobsRef.current = [];
    closeForm(true);
  };

  const handleDelete = (id: string) => {
    setAdminProducts(prev => prev.filter(p => p.id !== id));
    setConfirmDeleteId(null);
  };

  // ── Handlers varianti ────────────────────────────────────────────────────────

  const updateVariant = (idx: number, field: keyof VariantForm, value: unknown) => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === idx ? { ...v, [field]: value } : v
      ),
    }));
    const key = `v${idx}_${String(field)}`;
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const toggleSize = (idx: number, size: Size) => {
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) => {
        if (i !== idx) return v;
        const has = v.sizes.includes(size);
        return { ...v, sizes: has ? v.sizes.filter(s => s !== size) : [...v.sizes, size] };
      }),
    }));
    const key = `v${idx}_sizes`;
    if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n; });
  };

  const addVariant = () =>
    setForm(prev => ({ ...prev, variants: [...prev.variants, { ...EMPTY_VARIANT }] }));

  const removeVariant = (idx: number) => {
    // Revoca i blob URL delle immagini della variante rimossa
    form.variants[idx].images.forEach(img => {
      if (img.type === "upload") {
        URL.revokeObjectURL(img.blobUrl);
        pendingBlobsRef.current = pendingBlobsRef.current.filter(u => u !== img.blobUrl);
      }
    });
    setForm(prev => ({ ...prev, variants: prev.variants.filter((_, i) => i !== idx) }));
  };

  // ── Handlers immagini ────────────────────────────────────────────────────────

  const addImages = (variantIdx: number, files: FileList) => {
    const newImgs: UploadedImage[] = Array.from(files).map(file => {
      // ⚠️ Blob URL temporaneo — sessione only. Sostituire con upload a storage reale.
      const blobUrl = URL.createObjectURL(file);
      pendingBlobsRef.current.push(blobUrl);
      return { type: "upload" as const, file, blobUrl };
    });

    setForm(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIdx ? { ...v, images: [...v.images, ...newImgs] } : v
      ),
    }));
  };

  const removeImage = (variantIdx: number, imageIdx: number) => {
    const img = form.variants[variantIdx].images[imageIdx];
    // Revoca subito la RAM per i nuovi upload rimossi esplicitamente
    if (img.type === "upload") {
      URL.revokeObjectURL(img.blobUrl);
      pendingBlobsRef.current = pendingBlobsRef.current.filter(u => u !== img.blobUrl);
    }
    setForm(prev => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIdx
          ? { ...v, images: v.images.filter((_, j) => j !== imageIdx) }
          : v
      ),
    }));
  };

  // ── Helper classi ────────────────────────────────────────────────────────────

  const ic = (field: string) =>
    `w-full border rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-accent transition-colors ${
      errors[field] ? "border-red-300 bg-red-50/20" : "border-zinc-200"
    }`;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Intestazione */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-zinc-800">Prodotti</h2>
        <button
          onClick={openNew}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent text-white text-xs tracking-widest uppercase font-medium rounded-full hover:bg-[#8300e0] transition-colors cursor-pointer"
        >
          <Plus size={13} />
          Aggiungi prodotto
        </button>
      </div>

      {/* ── Tabella ────────────────────────────────────────────────────────── */}
      <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/70">
                <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Prodotto</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Prezzo</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Varianti</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Disponibilità</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-50">
              {adminProducts.map(p => {
                const firstImg    = p.variants[0]?.images[0];
                const allInStock  = p.variants.every(v => v.inStock);
                const someInStock = p.variants.some(v => v.inStock);
                const stockLabel  = allInStock ? "Disponibile" : someInStock ? "Parziale" : "Esaurito";
                const stockColor  = allInStock
                  ? "bg-green-50 text-green-700 border-green-100"
                  : someInStock
                  ? "bg-amber-50 text-amber-700 border-amber-100"
                  : "bg-red-50 text-red-600 border-red-100";

                return (
                  <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                    {/* Prodotto — thumbnail + nome */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0 border border-zinc-100">
                          {firstImg ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={productImgUrl(firstImg, 88)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ImagePlus size={14} className="text-zinc-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900 leading-snug">{p.name}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">{p.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Prezzo */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="font-semibold text-zinc-900">€{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-zinc-300 line-through ml-1.5">€{p.originalPrice}</span>
                      )}
                    </td>

                    {/* Varianti */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {p.variants.map(v => (
                          <div
                            key={v.colorName}
                            className="w-5 h-5 rounded-full border-2 border-white shadow-sm ring-1 ring-zinc-200"
                            style={{ backgroundColor: v.colorHex }}
                            title={v.colorName}
                          />
                        ))}
                        <span className="text-xs text-zinc-400 ml-1">
                          {p.variants.length} {p.variants.length === 1 ? "colore" : "colori"}
                        </span>
                      </div>
                    </td>

                    {/* Disponibilità */}
                    <td className="px-4 py-4">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium border ${stockColor}`}>
                        {stockLabel}
                      </span>
                    </td>

                    {/* Azioni */}
                    <td className="px-5 py-4">
                      {confirmDeleteId === p.id ? (
                        <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                          <span className="text-zinc-500">Eliminare?</span>
                          <button onClick={() => handleDelete(p.id)} className="text-red-500 font-semibold hover:text-red-700 cursor-pointer transition-colors">Sì</button>
                          <button onClick={() => setConfirmDeleteId(null)} className="text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors">No</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(p)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                            <Pencil size={12} />Modifica
                          </button>
                          <button onClick={() => setConfirmDeleteId(p.id)} className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-500 transition-colors cursor-pointer">
                            <Trash2 size={12} />Elimina
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}

              {adminProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-zinc-400 text-sm">
                    Nessun prodotto. Aggiungine uno con il tasto in alto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal form ──────────────────────────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center p-4 pt-8">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => closeForm()} />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl max-h-[88vh] overflow-y-auto">
            <div className="p-6">

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-zinc-900">
                  {editingId ? "Modifica prodotto" : "Nuovo prodotto"}
                </h3>
                <button onClick={() => closeForm()} className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* ── Campi base ──────────────────────────────────────────────── */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Nome prodotto <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={e => {
                      setForm(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => { const n = { ...prev }; delete n.name; return n; });
                    }}
                    placeholder="TB Core Tee"
                    className={ic("name")}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">Descrizione</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descrizione del prodotto..."
                    rows={2}
                    className="w-full border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-accent transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                      Prezzo (€) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.price}
                      onChange={e => {
                        setForm(prev => ({ ...prev, price: e.target.value }));
                        if (errors.price) setErrors(prev => { const n = { ...prev }; delete n.price; return n; });
                      }}
                      placeholder="49"
                      className={ic("price")}
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                      Prezzo barrato (€){" "}
                      <span className="text-zinc-300 font-normal normal-case tracking-normal">(opzionale)</span>
                    </label>
                    <input
                      type="number" min="0" step="0.01"
                      value={form.originalPrice}
                      onChange={e => setForm(prev => ({ ...prev, originalPrice: e.target.value }))}
                      placeholder="69"
                      className="w-full border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* ── Varianti ────────────────────────────────────────────────── */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] tracking-widest uppercase text-zinc-500 font-medium">
                    Varianti colore
                  </p>
                  <button
                    onClick={addVariant}
                    className="flex items-center gap-1 text-xs text-accent hover:text-[#8300e0] font-medium cursor-pointer transition-colors"
                  >
                    <Plus size={12} />
                    Aggiungi colore
                  </button>
                </div>

                <div className="space-y-3">
                  {form.variants.map((v, idx) => (
                    <div key={idx} className="border border-zinc-100 rounded-xl p-4 bg-zinc-50/40">

                      {/* Header variante */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                            Variante {idx + 1}
                          </p>
                          {/* Warning soft: nessuna foto */}
                          {v.images.length === 0 && (
                            <span className="flex items-center gap-1 text-[10px] text-amber-500">
                              <AlertTriangle size={10} />
                              Nessuna foto
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeVariant(idx)}
                          disabled={form.variants.length === 1}
                          className="text-zinc-300 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="space-y-3">
                        {/* Nome + colore */}
                        <div className="grid grid-cols-[1fr_auto] gap-3 items-start">
                          <div>
                            <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                              Nome colore <span className="text-red-400">*</span>
                            </label>
                            <input
                              value={v.colorName}
                              onChange={e => updateVariant(idx, "colorName", e.target.value)}
                              placeholder="Nero"
                              className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-accent transition-colors ${
                                errors[`v${idx}_colorName`] ? "border-red-300 bg-red-50/20" : "border-zinc-200 bg-white"
                              }`}
                            />
                            {errors[`v${idx}_colorName`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`v${idx}_colorName`]}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                              Colore
                            </label>
                            <div className="flex items-center gap-2">
                              <label
                                className="w-10 h-[42px] rounded-xl border-2 border-zinc-200 overflow-hidden cursor-pointer flex-shrink-0"
                                style={{ backgroundColor: v.colorHex }}
                              >
                                <input
                                  type="color"
                                  value={v.colorHex}
                                  onChange={e => updateVariant(idx, "colorHex", e.target.value)}
                                  className="opacity-0 w-full h-full cursor-pointer"
                                />
                              </label>
                              <input
                                type="text"
                                value={v.colorHex}
                                onChange={e => updateVariant(idx, "colorHex", e.target.value)}
                                placeholder="#000000"
                                maxLength={7}
                                className="w-24 border border-zinc-200 bg-white rounded-xl px-3 py-2.5 text-sm text-zinc-900 font-mono focus:outline-none focus:border-accent transition-colors"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Taglie */}
                        <div>
                          <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-2">
                            Taglie <span className="text-red-400">*</span>
                          </label>
                          <div className="flex gap-2">
                            {ALL_SIZES.map(size => {
                              const selected = v.sizes.includes(size);
                              return (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => toggleSize(idx, size)}
                                  className={`w-10 h-10 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                                    selected
                                      ? "bg-accent text-white border-accent"
                                      : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-400"
                                  }`}
                                >
                                  {size}
                                </button>
                              );
                            })}
                          </div>
                          {errors[`v${idx}_sizes`] && (
                            <p className="text-red-500 text-xs mt-1">{errors[`v${idx}_sizes`]}</p>
                          )}
                        </div>

                        {/* Toggle disponibilità */}
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <div
                            onClick={() => updateVariant(idx, "inStock", !v.inStock)}
                            className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${v.inStock ? "bg-accent" : "bg-zinc-200"}`}
                          >
                            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${v.inStock ? "translate-x-5" : "translate-x-0.5"}`} />
                          </div>
                          <span className="text-sm text-zinc-600">Disponibile</span>
                        </label>

                        {/* ── Foto variante ──────────────────────────────── */}
                        <div className="pt-2 border-t border-zinc-100">
                          <label className="text-[10px] tracking-widests uppercase text-zinc-400 block mb-2">
                            Foto variante
                            {/* ⚠️ Upload simulato — blob URL in RAM, sessione only */}
                          </label>

                          {/* Anteprime */}
                          {v.images.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-2">
                              {v.images.map((img, imgIdx) => (
                                <div key={imgIdx} className="relative group w-16 h-16 flex-shrink-0">
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={formImgUrl(img, 128)}
                                    alt=""
                                    className="w-full h-full object-cover rounded-xl border border-zinc-200"
                                  />
                                  <button
                                    onClick={() => removeImage(idx, imgIdx)}
                                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-[11px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                                    title="Rimuovi foto"
                                  >
                                    <X size={10} />
                                  </button>
                                  {img.type === "upload" && (
                                    <span className="absolute bottom-1 left-1 w-2 h-2 bg-accent rounded-full" title="Nuovo upload" />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Area upload */}
                          <label className="flex items-center gap-2.5 border-2 border-dashed border-zinc-200 rounded-xl px-4 py-3 cursor-pointer hover:border-accent hover:bg-accent/2 transition-colors group">
                            <ImagePlus size={15} className="text-zinc-300 group-hover:text-accent transition-colors flex-shrink-0" />
                            <span className="text-xs text-zinc-400 group-hover:text-accent transition-colors">
                              {v.images.length === 0 ? "Aggiungi foto" : "Aggiungi altre foto"}
                              <span className="text-zinc-300 ml-1">(JPG, PNG, WEBP)</span>
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={e => e.target.files && addImages(idx, e.target.files)}
                            />
                          </label>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Footer ──────────────────────────────────────────────────── */}
              <div className="flex gap-3 mt-6 pt-5 border-t border-zinc-100">
                <button
                  onClick={() => closeForm()}
                  className="flex-1 py-3 border border-zinc-200 rounded-full text-sm text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-accent text-white rounded-full text-sm font-medium hover:bg-[#8300e0] transition-colors cursor-pointer"
                >
                  {editingId ? "Salva modifiche" : "Aggiungi prodotto"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
