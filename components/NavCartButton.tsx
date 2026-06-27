"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cartContext";

export default function NavCartButton() {
  const { openCart, totalQuantity } = useCart();

  return (
    <button
      onClick={openCart}
      className="relative text-white hover:text-accent transition-colors duration-200 cursor-pointer"
      aria-label="Apri carrello"
    >
      <ShoppingCart size={18} strokeWidth={1.5} />
      {totalQuantity > 0 && (
        <span className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
          {totalQuantity > 9 ? "9+" : totalQuantity}
        </span>
      )}
    </button>
  );
}
