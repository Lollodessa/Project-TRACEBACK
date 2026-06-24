"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";
import { products } from "@/lib/products";

export default function Slideshow() {
  const ref = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    ref.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="py-16 relative">

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="snap-start flex-shrink-0 w-[72vw] md:w-64 bg-white/80 border border-white/50 shadow-lg shadow-black/10"
          >
            <div className="aspect-square bg-zinc-100/80" />
            <div className="p-4">
              <span className="text-sm font-medium tracking-wide">{p.name}</span>
              <p className="text-xs text-zinc-500 mt-0.5">{p.color}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-full hover:bg-accent transition-colors duration-200 cursor-pointer"
        aria-label="Scorri prodotti"
      >
        <ChevronRight size={20} />
      </button>

    </section>
  );
}
