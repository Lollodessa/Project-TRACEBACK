"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, Plus, Minus, Trash2, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function CartPanel() {
  const {
    items, isOpen, closeCart,
    removeItem, updateQuantity,
    toggleSelect, toggleAll,
    selectedTotal, selectedCount, totalQuantity,
  } = useCart();

  // ESC + scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const allSelected = items.length > 0 && items.every(i => i.selected);

  return (
    // Contenitore fisso che copre tutto — pointer-events-none quando chiuso
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}>

      {/* Backdrop semitrasparente */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Pannello laterale — scivola da destra */}
      <div
        className={`absolute right-0 top-0 h-full w-full max-w-[22rem] sm:max-w-[24rem] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <div>
            <h2 className="font-display text-2xl tracking-widest uppercase leading-none">
              Carrello
            </h2>
            {items.length > 0 && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {totalQuantity} {totalQuantity === 1 ? "pezzo" : "pezzi"}
              </p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            aria-label="Chiudi carrello"
          >
            <X size={20} />
          </button>
        </div>

        {/* ── Contenuto ─────────────────────────────────────────────────────── */}
        {items.length === 0 ? (

          // Stato vuoto
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <ShoppingBag size={44} strokeWidth={1} className="text-zinc-200" />
            <div>
              <p className="text-zinc-900 font-medium mb-1">Il carrello è vuoto</p>
              <p className="text-zinc-400 text-sm">Aggiungi qualcosa dallo shop!</p>
            </div>
            <Link
              href="/shop"
              onClick={closeCart}
              className="text-xs tracking-widest uppercase text-accent underline underline-offset-4 hover:no-underline transition-all mt-1"
            >
              Vai allo shop
            </Link>
          </div>

        ) : (

          // Lista voci
          <ul className="flex-1 overflow-y-auto px-5 divide-y divide-zinc-50">
            {items.map(item => (
              <li key={item.key} className="flex items-start gap-3 py-4">

                {/* Checkbox custom */}
                <button
                  onClick={() => toggleSelect(item.key)}
                  aria-label={item.selected ? "Deseleziona" : "Seleziona"}
                  className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer ${
                    item.selected
                      ? "bg-accent border-accent"
                      : "border-zinc-300 bg-white hover:border-accent"
                  }`}
                >
                  {item.selected && <Check size={11} strokeWidth={3} className="text-white" />}
                </button>

                {/* Miniatura */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${item.imageSeed}/120/120`}
                  alt={item.productName}
                  className="w-14 h-14 rounded-xl object-cover bg-zinc-100 flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-900 leading-snug truncate">
                    {item.productName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {item.colorName} · {item.size}
                  </p>
                  <p className="text-sm font-bold text-accent mt-1">
                    €{item.price * item.quantity}
                  </p>
                </div>

                {/* Quantità + rimuovi */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={() => removeItem(item.key)}
                    aria-label="Rimuovi"
                    className="text-zinc-300 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateQuantity(item.key, -1)}
                      className="w-6 h-6 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                      <Minus size={9} />
                    </button>
                    <span className="text-xs w-4 text-center text-zinc-800 font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.key, 1)}
                      className="w-6 h-6 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 transition-colors cursor-pointer"
                    >
                      <Plus size={9} />
                    </button>
                  </div>
                </div>

              </li>
            ))}
          </ul>
        )}

        {/* ── Footer — solo se ci sono voci ─────────────────────────────────── */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-5 py-5 space-y-4">

            {/* Conteggio selezione + toggle all */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                <span className="font-medium text-zinc-700">{selectedCount}</span>
                {" "}di{" "}
                <span className="font-medium text-zinc-700">{items.length}</span>
                {" "}{items.length === 1 ? "voce" : "voci"} selezionate
              </p>
              <button
                onClick={toggleAll}
                className="text-xs text-accent underline underline-offset-2 hover:no-underline cursor-pointer transition-all"
              >
                {allSelected ? "Deseleziona tutte" : "Seleziona tutte"}
              </button>
            </div>

            {/* Totale */}
            <div className="flex items-baseline justify-between">
              <p className="text-sm text-zinc-500">Totale selezionate</p>
              <p className="text-2xl font-bold text-accent">€{selectedTotal}</p>
            </div>

            {/* CTA */}
            <button
              disabled={selectedCount === 0}
              className={`w-full py-4 rounded-full text-sm tracking-widest uppercase font-medium transition-colors duration-200 ${
                selectedCount === 0
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                  : "bg-accent text-white hover:bg-[#8300e0] cursor-pointer"
              }`}
            >
              Procedi all&apos;acquisto
              {selectedCount > 0 && ` (${selectedCount})`}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}
