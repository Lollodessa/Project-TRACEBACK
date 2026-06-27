"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { products, type Product, type Size } from "@/lib/products";
import { useCart } from "@/lib/cartContext";

const ALL_SIZES: Size[] = ["S", "M", "L", "XL"];

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();

  const [variantIdx,    setVariantIdx]    = useState(0);
  const [imageIdx,      setImageIdx]      = useState(0);
  const [selectedSize,  setSelectedSize]  = useState<Size | null>(null);
  const [showSizeError, setShowSizeError] = useState(false);

  const variant     = product.variants[variantIdx];
  const inStock     = variant.inStock;
  const activeImage = variant.images[imageIdx] ?? variant.images[0];

  const selectVariant = (idx: number) => {
    setVariantIdx(idx);
    setImageIdx(0);
    setSelectedSize(null);
    setShowSizeError(false);
  };

  const handleAddToCart = () => {
    if (!selectedSize) { setShowSizeError(true); return; }
    setShowSizeError(false);
    addItem({
      key:         `${product.id}::${variant.colorName}::${selectedSize}`,
      productId:   product.id,
      productName: product.name,
      colorName:   variant.colorName,
      colorHex:    variant.colorHex,
      imageSeed:   variant.images[0],
      size:        selectedSize,
      price:       product.price,
    });
    openCart();
  };

  const related = products.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 pt-28 pb-24">

      {/* Breadcrumb */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1 text-zinc-400 hover:text-zinc-900 text-[11px] tracking-widest uppercase mb-10 transition-colors duration-200"
      >
        <ChevronLeft size={13} strokeWidth={2} />
        Shop
      </Link>

      {/* ─── Layout principale ───────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-14">

        {/* SINISTRA — galleria */}
        <div className="w-full md:w-[44%] flex-shrink-0">

          {/* Immagine principale */}
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={activeImage}
              src={`https://picsum.photos/seed/${activeImage}/600/800`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Miniature */}
          <div className="flex gap-2 mt-3">
            {variant.images.map((seed, i) => (
              <button
                key={seed}
                onClick={() => setImageIdx(i)}
                className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-150 cursor-pointer ${
                  imageIdx === i
                    ? "border-zinc-900"
                    : "border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://picsum.photos/seed/${seed}/150/150`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* DESTRA — info prodotto */}
        <div className="flex-1 flex flex-col gap-7">

          {/* Nome e prezzo */}
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-zinc-900 tracking-wide uppercase leading-none">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl font-bold text-accent">€{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-zinc-400 line-through">€{product.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Separatore */}
          <div className="h-px bg-zinc-100" />

          {/* Selettore colore */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] tracking-widest uppercase text-zinc-400">Colore</p>
              <p className="text-[11px] text-zinc-600 font-medium">{variant.colorName}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              {product.variants.map((v, i) => {
                const isSelected = variantIdx === i;
                const isBianco   = v.colorName === "Bianco";
                return (
                  <button
                    key={v.colorName}
                    onClick={() => selectVariant(i)}
                    title={v.colorName}
                    className={`w-8 h-8 rounded-full transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-zinc-900"
                        : "ring-1 ring-offset-1 ring-transparent hover:ring-zinc-400"
                    }`}
                    style={{
                      backgroundColor: v.colorHex,
                      boxShadow: isBianco ? "inset 0 0 0 1px rgba(0,0,0,0.12)" : undefined,
                    }}
                  />
                );
              })}
            </div>

            {/* Badge esaurito per il colore corrente */}
            {!inStock && (
              <p className="text-xs text-zinc-400 mt-3 italic">
                Questo colore non è al momento disponibile.
              </p>
            )}
          </div>

          {/* Separatore */}
          <div className="h-px bg-zinc-100" />

          {/* Selettore taglia */}
          <div>
            <p className="text-[11px] tracking-widest uppercase text-zinc-400 mb-3">Taglia</p>
            <div className="flex gap-2 flex-wrap">
              {ALL_SIZES.map(size => {
                const available = inStock && variant.sizes.includes(size);
                const selected  = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      if (!available) return;
                      setSelectedSize(selected ? null : size);
                      setShowSizeError(false);
                    }}
                    disabled={!available}
                    className={`w-12 h-12 rounded-xl border text-sm font-medium transition-all duration-150 ${
                      !available
                        ? "border-zinc-100 text-zinc-300 line-through cursor-not-allowed bg-zinc-50"
                        : selected
                        ? "border-zinc-900 bg-zinc-900 text-white cursor-pointer"
                        : "border-zinc-200 text-zinc-700 hover:border-zinc-900 hover:text-zinc-900 cursor-pointer"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {showSizeError && (
              <p className="text-red-500 text-xs mt-2">Seleziona una taglia prima di procedere.</p>
            )}
          </div>

          {/* CTA */}
          {inStock ? (
            <button
              onClick={handleAddToCart}
              className="w-full py-4 rounded-full text-sm tracking-widest uppercase font-medium bg-zinc-900 text-white hover:bg-accent transition-colors duration-300 cursor-pointer"
            >
              Aggiungi al carrello
            </button>
          ) : (
            <button
              disabled
              className="w-full py-4 rounded-full text-sm tracking-widest uppercase font-medium bg-zinc-100 text-zinc-400 cursor-not-allowed"
            >
              Esaurito
            </button>
          )}

          {/* Descrizione */}
          <div className="border-t border-zinc-100 pt-6">
            <p className="text-zinc-500 text-sm leading-relaxed">{product.description}</p>
          </div>

        </div>
      </div>

      {/* ─── Prodotti correlati ───────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="mt-24 border-t border-zinc-100 pt-16">
          <h2 className="text-[11px] tracking-widest uppercase text-zinc-400 mb-8">Potrebbe piacerti</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {related.map(p => {
              const dv = p.variants[0];
              return (
                <Link
                  key={p.id}
                  href={`/shop/${p.id}`}
                  className="group rounded-2xl overflow-hidden bg-white border border-zinc-100 shadow-sm hover:ring-2 hover:ring-accent/40 transition-all duration-200 block"
                >
                  <div className="aspect-square relative overflow-hidden bg-zinc-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${dv.images[0]}/400/400`}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://picsum.photos/seed/${dv.images[1]}/400/400`}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-medium tracking-wide text-zinc-900 leading-snug">{p.name}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {p.variants.map(v => (
                        <span
                          key={v.colorName}
                          title={v.colorName}
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{
                            backgroundColor: v.colorHex,
                            boxShadow: v.colorName === "Bianco"
                              ? "inset 0 0 0 1px rgba(0,0,0,0.1)"
                              : undefined,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
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
        </div>
      )}

    </div>
  );
}
