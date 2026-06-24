import { Crosshair, ShoppingCart, User } from "lucide-react";

export default function Nav() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="flex items-center justify-between px-5 py-3 bg-black/80 backdrop-blur-md rounded-full">

        {/* SINISTRA — mirino + logo piccolo */}
        <div className="flex items-center gap-2">
          <Crosshair size={16} strokeWidth={1.5} className="text-white" />
          <span className="font-display text-white text-xl leading-none tracking-wider">TB</span>
        </div>

        {/* CENTRO — link di navigazione */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-white text-[11px] tracking-widest uppercase font-medium hover:text-accent transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="#"
            className="text-white text-[11px] tracking-widest uppercase font-medium hover:text-accent transition-colors duration-200"
          >
            Shop
          </a>
        </div>

        {/* DESTRA — icone */}
        <div className="flex items-center gap-4">
          <button
            className="text-white hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Carrello"
          >
            <ShoppingCart size={18} strokeWidth={1.5} />
          </button>
          <button
            className="text-white hover:text-accent transition-colors duration-200 cursor-pointer"
            aria-label="Account"
          >
            <User size={18} strokeWidth={1.5} />
          </button>
        </div>

      </div>
    </nav>
  );
}
