import Link from "next/link";
import Nav from "@/components/Nav";

export default function ProductNotFound() {
  return (
    <>
      <Nav />
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="text-[11px] tracking-widest uppercase text-white/30 mb-4">Prodotto non trovato</p>
        <h1 className="font-display text-9xl text-white tracking-wide uppercase mb-8">404</h1>
        <Link
          href="/shop"
          className="text-xs tracking-widest uppercase text-white/40 hover:text-white underline underline-offset-4 transition-colors duration-200"
        >
          Torna allo shop
        </Link>
      </div>
    </>
  );
}
