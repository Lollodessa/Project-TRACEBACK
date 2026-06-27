"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "@/lib/products";

// Colori unici con hex derivati dal catalogo (ordine di prima apparizione)
const FILTER_COLORS: { name: string; hex: string }[] = (() => {
  const map = new Map<string, string>();
  products.forEach(p => p.variants.forEach(v => {
    if (!map.has(v.colorName)) map.set(v.colorName, v.colorHex);
  }));
  return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
})();

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ─── Pannello filtri ──────────────────────────────────────────────────────────

interface FilterPanelProps {
  selectedColors: string[];
  toggleColor: (c: string) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  priceInvalid: boolean;
  activeCount: number;
  onReset: () => void;
  dark?: boolean;
}

function FilterPanel({
  selectedColors, toggleColor,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  priceInvalid,
  activeCount, onReset,
  dark = false,
}: FilterPanelProps) {
  const label   = dark ? "text-white/40"  : "text-zinc-400";
  const symbol  = dark ? "text-white/25"  : "text-zinc-300";
  const dash    = dark ? "text-white/20"  : "text-zinc-300";
  const resetCl = dark ? "text-white/35 hover:text-white" : "text-zinc-400 hover:text-zinc-800";
  const inputBase   = dark ? "bg-white/5 text-white placeholder:text-white/20" : "bg-white text-zinc-800 placeholder:text-zinc-300";
  const inputBorder = priceInvalid
    ? "border-red-400"
    : dark ? "border-white/10 focus-within:border-accent" : "border-zinc-200 focus-within:border-accent";

  return (
    <div className="space-y-8">

      {/* Colore */}
      <div>
        <p className={`text-[10px] tracking-widest uppercase mb-4 ${label}`}>Colore</p>
        <div className="flex items-center gap-3 flex-wrap">
          {FILTER_COLORS.map(({ name, hex }) => {
            const active = selectedColors.includes(name);
            const isBianco = name === "Bianco";
            return (
              <button
                key={name}
                onClick={() => toggleColor(name)}
                title={name}
                aria-label={name}
                className={`p-[3px] rounded-full transition-all duration-150 cursor-pointer ${
                  active ? "bg-accent" : "bg-transparent"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    backgroundColor: hex,
                    boxShadow: isBianco
                      ? dark
                        ? "inset 0 0 0 1px rgba(255,255,255,0.2)"
                        : "inset 0 0 0 1px rgba(0,0,0,0.12)"
                      : undefined,
                  }}
                />
              </button>
            );
          })}
        </div>
        {selectedColors.length > 0 && (
          <p className={`text-xs mt-3 ${label}`}>{selectedColors.join(", ")}</p>
        )}
      </div>

      {/* Prezzo */}
      <div>
        <p className={`text-[10px] tracking-widest uppercase mb-4 ${label}`}>Prezzo</p>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <span className={`text-[10px] block mb-1.5 ${label}`}>Da</span>
            <div className={`flex items-center gap-1.5 border rounded-xl px-3 py-2.5 transition-colors duration-150 ${inputBase} ${inputBorder}`}>
              <span className={`text-sm flex-shrink-0 ${symbol}`}>€</span>
              <input
                type="text"
                inputMode="numeric"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="0"
                className="bg-transparent text-sm w-full focus:outline-none"
              />
            </div>
          </div>
          <div className={`text-sm pb-2.5 flex-shrink-0 ${dash}`}>—</div>
          <div className="flex-1">
            <span className={`text-[10px] block mb-1.5 ${label}`}>A</span>
            <div className={`flex items-center gap-1.5 border rounded-xl px-3 py-2.5 transition-colors duration-150 ${inputBase} ${inputBorder}`}>
              <span className={`text-sm flex-shrink-0 ${symbol}`}>€</span>
              <input
                type="text"
                inputMode="numeric"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder=""
                className="bg-transparent text-sm w-full focus:outline-none"
              />
            </div>
          </div>
        </div>
        {priceInvalid && (
          <p className={`text-xs mt-2 ${dark ? "text-red-400" : "text-red-500"}`}>
            Il minimo non può superare il massimo.
          </p>
        )}
      </div>

      {activeCount > 0 && (
        <button
          onClick={onReset}
          className={`text-xs underline underline-offset-2 transition-colors cursor-pointer ${resetCl}`}
        >
          Azzera filtri
        </button>
      )}
    </div>
  );
}

// ─── Componente principale ────────────────────────────────────────────────────

export default function ShopClient() {
  const [search,         setSearch]         = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [minPrice,       setMinPrice]       = useState("");
  const [maxPrice,       setMaxPrice]       = useState("");
  const [modalOpen,      setModalOpen]      = useState(false);

  const parsedMin    = minPrice !== "" ? parseInt(minPrice, 10) : null;
  const parsedMax    = maxPrice !== "" ? parseInt(maxPrice, 10) : null;
  const priceInvalid = parsedMin !== null && parsedMax !== null && parsedMin > parsedMax;
  const priceActive  = (parsedMin !== null || parsedMax !== null) && !priceInvalid;
  const activeCount  = selectedColors.length + (priceActive ? 1 : 0);

  const toggleColor  = (c: string) => setSelectedColors(prev => toggle(prev, c));
  const resetFilters = () => { setSelectedColors([]); setMinPrice(""); setMaxPrice(""); };

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    document.documentElement.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [modalOpen]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      // il prodotto appare se ALMENO UNA variante corrisponde ai colori selezionati
      if (selectedColors.length > 0 && !p.variants.some(v => selectedColors.includes(v.colorName))) return false;
      if (!priceInvalid) {
        if (parsedMin !== null && p.price < parsedMin) return false;
        if (parsedMax !== null && p.price > parsedMax) return false;
      }
      return true;
    });
  }, [search, selectedColors, parsedMin, parsedMax, priceInvalid]);

  return (
    <>
      {/* ── Search bar ──────────────────────────────────────────────────────── */}
      <div className="px-4 md:px-6 pt-24 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-md rounded-full px-4 py-3">
            <Search size={15} className="text-white/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Cerca maglia..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none min-w-0"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-white/30 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              >
                <X size={13} />
              </button>
            )}
            <div className="md:hidden flex items-center">
              <div className="w-px h-4 bg-white/20 mx-1" />
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors cursor-pointer pl-1"
              >
                <SlidersHorizontal size={15} />
                {activeCount > 0 && (
                  <span className="bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {activeCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Layout ──────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-24 flex gap-8 items-stretch">

        <aside className="hidden md:flex flex-col w-52 flex-shrink-0 bg-zinc-100 rounded-2xl">
          <div className="sticky top-24 p-6">
            <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-6">Filtri</p>
            <FilterPanel
              selectedColors={selectedColors} toggleColor={toggleColor}
              minPrice={minPrice} setMinPrice={setMinPrice}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              priceInvalid={priceInvalid}
              activeCount={activeCount} onReset={resetFilters}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 h-6">
            <p className="text-xs text-zinc-400 tracking-wide">
              {filtered.length} {filtered.length === 1 ? "prodotto" : "prodotti"}
            </p>
            {activeCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-zinc-400 hover:text-zinc-800 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Azzera filtri
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-32 text-center">
              <p className="text-zinc-400 text-sm mb-4">Nessun prodotto corrisponde alla selezione.</p>
              <button
                onClick={resetFilters}
                className="text-xs text-zinc-400 hover:text-zinc-800 underline underline-offset-2 cursor-pointer"
              >
                Azzera filtri
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => {
                const defaultVariant  = p.variants[0];
                const allOutOfStock   = p.variants.every(v => !v.inStock);
                return (
                  <Link
                    key={p.id}
                    href={`/shop/${p.id}`}
                    className="group rounded-2xl overflow-hidden bg-white border border-zinc-100 shadow-sm hover:ring-2 hover:ring-accent/40 transition-all duration-200 block"
                  >
                    {/* Immagine fronte / retro — crossfade su hover */}
                    <div className="aspect-square relative overflow-hidden bg-zinc-100">
                      {allOutOfStock && (
                        <span className="absolute top-2.5 right-2.5 z-10 bg-black/75 text-white text-[9px] tracking-widest uppercase px-2 py-1 rounded-full">
                          Esaurito
                        </span>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${defaultVariant.images[0]}/400/400`}
                        alt={p.name}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://picsum.photos/seed/${defaultVariant.images[1]}/400/400`}
                        alt={`${p.name} retro`}
                        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                      />
                    </div>

                    <div className="p-4">
                      <p className="text-sm font-medium tracking-wide text-zinc-900 leading-snug">{p.name}</p>

                      {/* Swatches colori disponibili */}
                      <div className="flex items-center gap-1.5 mt-2">
                        {p.variants.map(v => (
                          <span
                            key={v.colorName}
                            title={v.colorName}
                            className="w-3 h-3 rounded-full inline-block flex-shrink-0"
                            style={{
                              backgroundColor: v.colorHex,
                              boxShadow: v.colorName === "Bianco"
                                ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                                : undefined,
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-2.5">
                        <p className="text-sm font-bold text-accent">€{p.price}</p>
                        {p.originalPrice && (
                          <p className="text-xs text-zinc-400 line-through">€{p.originalPrice}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal filtri — solo mobile ───────────────────────────────────────── */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92%] max-w-sm">
            <div className="bg-zinc-950 border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] tracking-widest uppercase text-white/40">Filtri</p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="text-white/30 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
              <FilterPanel
                selectedColors={selectedColors} toggleColor={toggleColor}
                minPrice={minPrice} setMinPrice={setMinPrice}
                maxPrice={maxPrice} setMaxPrice={setMaxPrice}
                priceInvalid={priceInvalid}
                activeCount={activeCount} onReset={resetFilters}
                dark={true}
              />
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-white text-black text-xs tracking-widest uppercase font-medium px-5 py-2.5 rounded-full hover:bg-accent hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Chiudi
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
