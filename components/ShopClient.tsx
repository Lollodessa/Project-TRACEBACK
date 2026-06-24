"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products, type ProductColor } from "@/lib/products";

// ─── Costanti ─────────────────────────────────────────────────────────────────

const ALL_COLORS: ProductColor[] = ["Nero", "Bianco", "Grigio", "Beige"];

const COLOR_HEX: Record<ProductColor, string> = {
  Nero:   "#111111",
  Bianco: "#eeeeee",
  Grigio: "#999999",
  Beige:  "#d4c5a9",
};

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ─── Pannello filtri ──────────────────────────────────────────────────────────

interface FilterPanelProps {
  selectedColors: ProductColor[];
  toggleColor: (c: ProductColor) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
  activeCount: number;
  onReset: () => void;
  dark?: boolean;
}

function FilterPanel({
  selectedColors, toggleColor,
  minPrice, setMinPrice,
  maxPrice, setMaxPrice,
  activeCount, onReset,
  dark = false,
}: FilterPanelProps) {
  const label   = dark ? "text-white/40"  : "text-zinc-400";
  const inputCl = dark
    ? "bg-white/5 border-white/10 text-white placeholder:text-white/20"
    : "bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-300";
  const symbol  = dark ? "text-white/25"  : "text-zinc-300";
  const dash    = dark ? "text-white/20"  : "text-zinc-300";
  const resetCl = dark ? "text-white/35 hover:text-white" : "text-zinc-400 hover:text-zinc-800";

  return (
    <div className="space-y-8">

      {/* Colore */}
      <div>
        <p className={`text-[10px] tracking-widest uppercase mb-4 ${label}`}>Colore</p>
        <div className="flex items-center gap-3 flex-wrap">
          {ALL_COLORS.map(c => {
            const active = selectedColors.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleColor(c)}
                title={c}
                aria-label={c}
                className={`p-[3px] rounded-full transition-all duration-150 cursor-pointer ${
                  active ? "bg-accent" : "bg-transparent"
                }`}
              >
                <div
                  className="w-8 h-8 rounded-full"
                  style={{
                    backgroundColor: COLOR_HEX[c],
                    boxShadow: c === "Bianco"
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
            <div className={`flex items-center gap-1.5 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors duration-150 ${inputCl}`}>
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
            <div className={`flex items-center gap-1.5 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors duration-150 ${inputCl}`}>
              <span className={`text-sm flex-shrink-0 ${symbol}`}>€</span>
              <input
                type="text"
                inputMode="numeric"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="999"
                className="bg-transparent text-sm w-full focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Azzera */}
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
  const [selectedColors, setSelectedColors] = useState<ProductColor[]>([]);
  const [minPrice,       setMinPrice]       = useState("");
  const [maxPrice,       setMaxPrice]       = useState("");
  const [modalOpen,      setModalOpen]      = useState(false);

  const priceActive = minPrice !== "" || maxPrice !== "";
  const activeCount = selectedColors.length + (priceActive ? 1 : 0);

  const toggleColor = (c: ProductColor) => setSelectedColors(prev => toggle(prev, c));

  const resetFilters = () => {
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
  };

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    document.documentElement.style.overflow = modalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [modalOpen]);

  const filtered = useMemo(() => {
    const rawMin = minPrice !== "" ? parseInt(minPrice, 10) : null;
    const rawMax = maxPrice !== "" ? parseInt(maxPrice, 10) : null;
    const lo = rawMin !== null && rawMax !== null && rawMin > rawMax ? rawMax : rawMin;
    const hi = rawMin !== null && rawMax !== null && rawMin > rawMax ? rawMin : rawMax;

    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedColors.length > 0 && !selectedColors.includes(p.color)) return false;
      if (lo !== null && p.price < lo) return false;
      if (hi !== null && p.price > hi) return false;
      return true;
    });
  }, [search, selectedColors, minPrice, maxPrice]);

  // ─── Render ───────────────────────────────────────────────────────────────────
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

            {/* Tasto filtri — solo mobile */}
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

        {/* SIDEBAR — colonna grigia che si estende per tutta l'altezza del layout */}
        <aside className="hidden md:flex flex-col w-52 flex-shrink-0 bg-zinc-100 rounded-2xl">
          <div className="sticky top-24 p-6">
            <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-6">Filtri</p>
            <FilterPanel
              selectedColors={selectedColors} toggleColor={toggleColor}
              minPrice={minPrice} setMinPrice={setMinPrice}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
              activeCount={activeCount} onReset={resetFilters}
              dark={false}
            />
          </div>
        </aside>

        {/* GRIGLIA */}
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
              <p className="text-zinc-400 text-sm mb-4">
                Nessun prodotto corrisponde alla selezione.
              </p>
              <button
                onClick={resetFilters}
                className="text-xs text-zinc-400 hover:text-zinc-800 underline underline-offset-2 cursor-pointer"
              >
                Azzera filtri
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(p => (
                <div
                  key={p.id}
                  className="group rounded-2xl overflow-hidden bg-white border border-zinc-100 shadow-sm hover:ring-2 hover:ring-accent/40 transition-all duration-200 cursor-pointer"
                >
                  {/* Fronte / retro — crossfade CSS su hover */}
                  <div className="aspect-square relative overflow-hidden bg-zinc-100">
                    {!p.inStock && (
                      <span className="absolute top-2.5 right-2.5 z-10 bg-black/75 text-white text-[9px] tracking-widest uppercase px-2 py-1 rounded-full">
                        Esaurito
                      </span>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${p.id}/400/400`}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${p.id}-back/400/400`}
                      alt={`${p.name} retro`}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    />
                  </div>

                  <div className="p-4">
                    <p className="text-sm font-medium tracking-wide text-zinc-900 leading-snug">
                      {p.name}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">{p.color}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <p className="text-sm font-bold text-accent">€{p.price}</p>
                      {p.originalPrice && (
                        <p className="text-xs text-zinc-400 line-through">€{p.originalPrice}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Modal filtri — solo mobile ───────────────────────────────────────── */}
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setModalOpen(false)}
          />
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
