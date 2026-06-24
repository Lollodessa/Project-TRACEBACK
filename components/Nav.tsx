import { ShoppingCart, User } from "lucide-react";

export default function Nav() {
  return (
    <nav className="fixed top-4 left-4 right-4 z-50">
      <div className="flex items-center justify-between px-6 py-3 bg-black/80 backdrop-blur-md rounded-full">

        {/* Link sinistra — visibili anche su mobile, niente hamburger */}
        <div className="flex items-center gap-5">
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

        {/* Icone destra */}
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
