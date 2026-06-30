"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Package, User, MapPin, LogOut, X, Star } from "lucide-react";
import { useAuth, type AuthUser } from "@/lib/authContext";
import { products } from "@/lib/products";

// ─── Tipi ─────────────────────────────────────────────────────────────────────

type Tab = "ordini" | "dati" | "indirizzi";

const LABEL_PRESETS = ["Casa", "Lavoro", "Altro"] as const;
type LabelPreset = typeof LABEL_PRESETS[number];
type LabelOption = LabelPreset | "Personalizzata";

interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  phone: string;
}

interface AddressForm {
  labelOption: LabelOption;
  labelCustom: string;
  fullName: string;
  street: string;
  city: string;
  zip: string;
  province: string;
  country: string;
  phone: string;
}

const EMPTY_FORM: AddressForm = {
  labelOption: "Casa",
  labelCustom: "",
  fullName: "",
  street: "",
  city: "",
  zip: "",
  province: "",
  country: "Italia",
  phone: "",
};

// ─── Dati ordini finti ────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  "Consegnato":      "bg-green-50 text-green-700 border border-green-100",
  "In transito":     "bg-blue-50 text-blue-700 border border-blue-100",
  "In preparazione": "bg-amber-50 text-amber-700 border border-amber-100",
};

const FAKE_ORDERS = [
  {
    id: "TB-2024-001", date: "12 Giugno 2024", status: "Consegnato",
    items: [{ productId: "tb-core-tee", colorName: "Nero", size: "M", quantity: 1, price: 49 }],
    total: 49,
  },
  {
    id: "TB-2024-002", date: "20 Giugno 2024", status: "In transito",
    items: [
      { productId: "origin-tee",        colorName: "Grigio", size: "L", quantity: 1, price: 49 },
      { productId: "crack-pattern-tee", colorName: "Beige",  size: "S", quantity: 2, price: 49 },
    ],
    total: 147,
  },
  {
    id: "TB-2024-003", date: "24 Giugno 2024", status: "In preparazione",
    items: [{ productId: "archive-tee-vol1", colorName: "Nero", size: "L", quantity: 1, price: 49 }],
    total: 49,
  },
];

// Indirizzi di partenza — diventano initial state
const INITIAL_ADDRESSES: Address[] = [
  {
    id: "addr-1", label: "Casa", fullName: "Lorenzo De Santis",
    street: "Via Roma 42", city: "Milano", zip: "20121", province: "MI",
    country: "Italia", phone: "",
  },
  {
    id: "addr-2", label: "Lavoro", fullName: "Lorenzo De Santis",
    street: "Corso Buenos Aires 77", city: "Milano", zip: "20124", province: "MI",
    country: "Italia", phone: "",
  },
];

// ─── Validazione ──────────────────────────────────────────────────────────────

function validateForm(form: AddressForm): Record<string, string> {
  const errs: Record<string, string> = {};
  if (form.labelOption === "Personalizzata" && !form.labelCustom.trim())
    errs.labelCustom = "Inserisci un'etichetta";
  if (!form.fullName.trim())   errs.fullName = "Campo obbligatorio";
  if (!form.street.trim())     errs.street   = "Campo obbligatorio";
  if (!form.city.trim())       errs.city     = "Campo obbligatorio";
  if (!form.zip.trim())        errs.zip      = "Campo obbligatorio";
  else if (!/^\d+$/.test(form.zip.trim())) errs.zip = "Solo numeri";
  if (!form.province.trim())   errs.province = "Campo obbligatorio";
  if (!form.country.trim())    errs.country  = "Campo obbligatorio";
  return errs;
}

// ─── Sezione Ordini ───────────────────────────────────────────────────────────

function OrdiniSection() {
  return (
    <div>
      <h2 className="text-base font-semibold text-zinc-900 mb-5">I miei ordini</h2>
      <div className="space-y-4">
        {FAKE_ORDERS.map(order => {
          const statusCl = STATUS_STYLE[order.status] ?? "bg-zinc-50 text-zinc-600 border border-zinc-100";
          return (
            <div key={order.id} className="border border-zinc-100 rounded-2xl overflow-hidden bg-white">
              <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-50 border-b border-zinc-100">
                <div>
                  <p className="text-xs font-semibold text-zinc-800">#{order.id}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{order.date}</p>
                </div>
                <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${statusCl}`}>
                  {order.status}
                </span>
              </div>
              <div className="px-5 py-4 space-y-3">
                {order.items.map((item, i) => {
                  const product = products.find(p => p.id === item.productId);
                  const variant  = product?.variants.find(v => v.colorName === item.colorName);
                  const seed     = variant?.images[0] ?? item.productId;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://picsum.photos/seed/${seed}/120/120`} alt={product?.name ?? ""}
                        className="w-12 h-12 rounded-xl object-cover bg-zinc-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-900 truncate">{product?.name ?? item.productId}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{item.colorName} · {item.size} · x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-zinc-800 flex-shrink-0">€{item.price * item.quantity}</p>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 bg-zinc-50/50">
                <p className="text-[11px] text-zinc-400">
                  {order.items.reduce((s, i) => s + i.quantity, 0)} articoli
                </p>
                <p className="text-sm font-bold text-accent">Totale: €{order.total}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Sezione Dati ─────────────────────────────────────────────────────────────

function DatiSection({ user }: { user: AuthUser }) {
  const [editField, setEditField] = useState<"nome" | "email" | "password" | null>(null);
  const [name,  setName]  = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <div>
      <h2 className="text-base font-semibold text-zinc-900 mb-5">I miei dati</h2>
      <div className="bg-white border border-zinc-100 rounded-2xl divide-y divide-zinc-100">

        {/* Nome */}
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex-1 mr-6 min-w-0">
            <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1.5">Nome</p>
            {editField === "nome"
              ? <input value={name} onChange={e => setName(e.target.value)} autoFocus
                  className="w-full text-sm border-b border-accent focus:outline-none pb-1 bg-transparent text-zinc-900" />
              : <p className="text-sm text-zinc-900">{name}</p>
            }
          </div>
          {editField === "nome"
            ? <div className="flex gap-3 flex-shrink-0 pt-5">
                <button onClick={() => setEditField(null)} className="text-xs text-accent underline underline-offset-2 cursor-pointer">Salva</button>
                <button onClick={() => { setName(user.name); setEditField(null); }} className="text-xs text-zinc-400 underline underline-offset-2 cursor-pointer">Annulla</button>
              </div>
            : <button onClick={() => setEditField("nome")} className="text-xs text-zinc-400 hover:text-zinc-900 underline underline-offset-2 cursor-pointer transition-colors pt-5 flex-shrink-0">Modifica</button>
          }
        </div>

        {/* Email */}
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex-1 mr-6 min-w-0">
            <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1.5">Email</p>
            {editField === "email"
              ? <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus
                  className="w-full text-sm border-b border-accent focus:outline-none pb-1 bg-transparent text-zinc-900" />
              : <p className="text-sm text-zinc-900 truncate">{email}</p>
            }
          </div>
          {editField === "email"
            ? <div className="flex gap-3 flex-shrink-0 pt-5">
                <button onClick={() => setEditField(null)} className="text-xs text-accent underline underline-offset-2 cursor-pointer">Salva</button>
                <button onClick={() => { setEmail(user.email); setEditField(null); }} className="text-xs text-zinc-400 underline underline-offset-2 cursor-pointer">Annulla</button>
              </div>
            : <button onClick={() => setEditField("email")} className="text-xs text-zinc-400 hover:text-zinc-900 underline underline-offset-2 cursor-pointer transition-colors pt-5 flex-shrink-0">Modifica</button>
          }
        </div>

        {/* Password */}
        <div className="flex items-start justify-between px-5 py-4">
          <div className="flex-1 mr-6 min-w-0">
            <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-1.5">Password</p>
            {editField === "password"
              ? <div className="space-y-2">
                  <input type="password" placeholder="Nuova password" autoFocus
                    className="w-full text-sm border-b border-accent focus:outline-none pb-1 bg-transparent text-zinc-900 placeholder:text-zinc-300" />
                  <input type="password" placeholder="Conferma password"
                    className="w-full text-sm border-b border-zinc-200 focus:border-accent focus:outline-none pb-1 bg-transparent text-zinc-900 placeholder:text-zinc-300 transition-colors" />
                </div>
              : <p className="text-sm text-zinc-900 tracking-[0.3em]">••••••••</p>
            }
          </div>
          {editField === "password"
            ? <div className="flex gap-3 flex-shrink-0 pt-5">
                <button onClick={() => setEditField(null)} className="text-xs text-accent underline underline-offset-2 cursor-pointer">Salva</button>
                <button onClick={() => setEditField(null)} className="text-xs text-zinc-400 underline underline-offset-2 cursor-pointer">Annulla</button>
              </div>
            : <button onClick={() => setEditField("password")} className="text-xs text-zinc-400 hover:text-zinc-900 underline underline-offset-2 cursor-pointer transition-colors pt-5 flex-shrink-0">Modifica</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Sezione Indirizzi ────────────────────────────────────────────────────────

function IndirizziSection() {
  const [addresses,  setAddresses]  = useState<Address[]>(INITIAL_ADDRESSES);
  const [defaultId,  setDefaultId]  = useState<string | null>(INITIAL_ADDRESSES[0].id);
  const [formOpen,   setFormOpen]   = useState(false);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [form,       setForm]       = useState<AddressForm>(EMPTY_FORM);
  const [errors,     setErrors]     = useState<Record<string, string>>({});

  // ESC chiude il modal
  const closeForm = useCallback(() => {
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

  // Helper: aggiorna un campo e cancella il suo errore
  const setField = (field: keyof AddressForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    };

  const setZip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setForm(prev => ({ ...prev, zip: v }));
    setErrors(prev => { const n = { ...prev }; delete n.zip; return n; });
  };

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setFormOpen(true);
  };

  const openEdit = (addr: Address) => {
    const isPreset = (LABEL_PRESETS as readonly string[]).includes(addr.label);
    setForm({
      labelOption: isPreset ? (addr.label as LabelPreset) : "Personalizzata",
      labelCustom: isPreset ? "" : addr.label,
      fullName:  addr.fullName,
      street:    addr.street,
      city:      addr.city,
      zip:       addr.zip,
      province:  addr.province,
      country:   addr.country,
      phone:     addr.phone,
    });
    setEditingId(addr.id);
    setErrors({});
    setFormOpen(true);
  };

  const handleSave = () => {
    const errs = validateForm(form);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    const label = form.labelOption === "Personalizzata"
      ? form.labelCustom.trim()
      : form.labelOption;

    const saved: Address = {
      id:       editingId ?? `addr-${Date.now()}`,
      label,
      fullName: form.fullName.trim(),
      street:   form.street.trim(),
      city:     form.city.trim(),
      zip:      form.zip.trim(),
      province: form.province.trim(),
      country:  form.country.trim(),
      phone:    form.phone.trim(),
    };

    if (editingId) {
      setAddresses(prev => prev.map(a => a.id === editingId ? saved : a));
    } else {
      setAddresses(prev => [...prev, saved]);
    }
    closeForm();
  };

  const handleDelete = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    if (defaultId === id) setDefaultId(null);
  };

  // Classe per un campo del form
  const inputCl = (field: string) =>
    `w-full border rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-accent transition-colors ${
      errors[field] ? "border-red-300 bg-red-50/20" : "border-zinc-200"
    }`;

  return (
    <div>
      <h2 className="text-base font-semibold text-zinc-900 mb-5">Indirizzi di spedizione</h2>

      {/* Lista indirizzi */}
      <div className="space-y-3">
        {addresses.length === 0 && (
          <p className="text-sm text-zinc-400 py-4">Nessun indirizzo salvato.</p>
        )}

        {addresses.map(addr => (
          <div key={addr.id} className="bg-white border border-zinc-100 rounded-2xl p-5">
            {/* Riga badge + azioni */}
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] tracking-widest uppercase font-medium text-accent bg-accent/8 border border-accent/20 px-2.5 py-1 rounded-full">
                  {addr.label}
                </span>
                {addr.id === defaultId && (
                  <span className="flex items-center gap-1 text-[10px] tracking-widest uppercase font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                    <Star size={9} className="fill-zinc-400 text-zinc-400" />
                    Predefinito
                  </span>
                )}
              </div>
              <div className="flex gap-3 flex-shrink-0">
                {addr.id !== defaultId && (
                  <button
                    onClick={() => setDefaultId(addr.id)}
                    className="text-xs text-zinc-400 hover:text-accent underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Predefinito
                  </button>
                )}
                <button
                  onClick={() => openEdit(addr)}
                  className="text-xs text-zinc-400 hover:text-zinc-900 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Modifica
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-zinc-400 hover:text-red-500 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  Elimina
                </button>
              </div>
            </div>

            {/* Dati indirizzo */}
            <p className="text-sm font-medium text-zinc-900">{addr.fullName}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{addr.street}</p>
            <p className="text-sm text-zinc-500">{addr.zip} {addr.city} ({addr.province})</p>
            <p className="text-sm text-zinc-500">{addr.country}</p>
            {addr.phone && <p className="text-sm text-zinc-400 mt-1">{addr.phone}</p>}
          </div>
        ))}

        {/* Tasto aggiungi */}
        <button
          onClick={openNew}
          className="w-full border-2 border-dashed border-zinc-200 rounded-2xl p-5 text-sm text-zinc-400 hover:border-accent hover:text-accent transition-colors duration-200 cursor-pointer text-center"
        >
          + Aggiungi indirizzo
        </button>
      </div>

      {/* ── Modal form ──────────────────────────────────────────────────────── */}
      {formOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeForm}
          />
          {/* Panel */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">

              {/* Header modal */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-zinc-900">
                  {editingId ? "Modifica indirizzo" : "Nuovo indirizzo"}
                </h3>
                <button onClick={closeForm} className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">

                {/* Etichetta */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Etichetta
                  </label>
                  <select
                    value={form.labelOption}
                    onChange={setField("labelOption")}
                    className="w-full border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-900 focus:outline-none focus:border-accent transition-colors bg-white cursor-pointer"
                  >
                    {LABEL_PRESETS.map(l => <option key={l} value={l}>{l}</option>)}
                    <option value="Personalizzata">Personalizzata…</option>
                  </select>
                  {form.labelOption === "Personalizzata" && (
                    <div className="mt-2">
                      <input
                        value={form.labelCustom}
                        onChange={setField("labelCustom")}
                        placeholder="Es. Casa dei nonni"
                        autoFocus
                        className={inputCl("labelCustom")}
                      />
                      {errors.labelCustom && <p className="text-red-500 text-xs mt-1">{errors.labelCustom}</p>}
                    </div>
                  )}
                </div>

                {/* Nome destinatario */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Nome e cognome <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.fullName}
                    onChange={setField("fullName")}
                    placeholder="Mario Rossi"
                    className={inputCl("fullName")}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                {/* Via */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Via e numero civico <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.street}
                    onChange={setField("street")}
                    placeholder="Via Garibaldi 10"
                    className={inputCl("street")}
                  />
                  {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
                </div>

                {/* Città + CAP + Provincia */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                      Città <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={form.city}
                      onChange={setField("city")}
                      placeholder="Milano"
                      className={inputCl("city")}
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                      CAP <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={form.zip}
                      onChange={setZip}
                      placeholder="20121"
                      inputMode="numeric"
                      maxLength={10}
                      className={inputCl("zip")}
                    />
                    {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                      Prov. <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={form.province}
                      onChange={setField("province")}
                      placeholder="MI"
                      maxLength={4}
                      className={`${inputCl("province")} uppercase w-20`}
                    />
                    {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province}</p>}
                  </div>
                </div>

                {/* Paese */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Paese <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.country}
                    onChange={setField("country")}
                    placeholder="Italia"
                    className={inputCl("country")}
                  />
                  {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
                </div>

                {/* Telefono (opzionale) */}
                <div>
                  <label className="text-[10px] tracking-widest uppercase text-zinc-400 block mb-1.5">
                    Telefono <span className="text-zinc-300 font-normal normal-case tracking-normal text-xs">(opzionale)</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={setField("phone")}
                    placeholder="+39 333 1234567"
                    className={inputCl("phone")}
                  />
                </div>

              </div>

              {/* Azioni */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeForm}
                  className="flex-1 py-3 border border-zinc-200 rounded-full text-sm text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  Annulla
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 bg-accent text-white rounded-full text-sm font-medium hover:bg-[#8300e0] transition-colors cursor-pointer"
                >
                  {editingId ? "Salva modifiche" : "Aggiungi indirizzo"}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard principale ─────────────────────────────────────────────────────

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "ordini",    label: "I miei ordini", icon: Package },
  { key: "dati",      label: "I miei dati",   icon: User    },
  { key: "indirizzi", label: "Indirizzi",     icon: MapPin  },
];

export default function ProfileDashboard() {
  const { isLoggedIn, user, logout } = useAuth();
  const router    = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("ordini");

  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) return null;

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 pt-28 pb-24">

        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] tracking-widest uppercase text-zinc-400 mb-1">Il tuo profilo</p>
            <h1 className="font-display text-5xl text-zinc-900 tracking-wide uppercase leading-none">
              {user.name.split(" ")[0]}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer mb-1"
          >
            <LogOut size={13} />
            Esci
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">

          {/* Sidebar desktop */}
          <aside className="hidden md:block w-48 flex-shrink-0">
            <div className="bg-white border border-zinc-100 rounded-2xl p-2 sticky top-24">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                    activeTab === key
                      ? "bg-accent/8 text-accent font-medium"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Tab mobile */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === key
                    ? "bg-accent text-white"
                    : "bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-400"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Area contenuto */}
          <div className="flex-1 min-w-0">
            {activeTab === "ordini"    && <OrdiniSection />}
            {activeTab === "dati"      && <DatiSection user={user} />}
            {activeTab === "indirizzi" && <IndirizziSection />}
          </div>

        </div>
      </div>
    </div>
  );
}
