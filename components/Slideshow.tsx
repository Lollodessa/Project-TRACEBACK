"use client";

import { useRef } from "react";
import { ChevronRight } from "lucide-react";

const products = [
  { id: 1, name: "TB Core Hoodie",      price: "€89"  },
  { id: 2, name: "Traceback Tee Vol.1", price: "€45"  },
  { id: 3, name: "Origin Crewneck",     price: "€75"  },
  { id: 4, name: "TB Cargo Pants",      price: "€120" },
  { id: 5, name: "Marble Zip-Up",       price: "€95"  },
  { id: 6, name: "Archive Cap",         price: "€35"  },
];

export default function Slideshow() {
  const ref = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    ref.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <section className="py-16 relative">

      {/* Track orizzontale */}
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-6 pb-4"
        style={{ scrollbarWidth: "none" }}
      >
        {products.map((p) => (
          /* Pannello vetrata per ogni card — stesso trattamento di About */
          <div
            key={p.id}
            className="snap-start flex-shrink-0 w-[72vw] md:w-64 bg-white/80 border border-white/50 shadow-lg shadow-black/10"
          >
            <div className="aspect-square bg-zinc-100/80" />
            <div className="p-4 flex justify-between items-center">
              <span className="text-sm font-medium tracking-wide">{p.name}</span>
              <span className="text-sm font-bold text-accent">{p.price}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Freccia destra — solo desktop */}
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
