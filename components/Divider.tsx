export default function Divider() {
  return (
    <div className="flex items-center justify-center gap-4 py-14 px-8 bg-white">

      {/* Linea sinistra + rombo */}
      <div className="flex items-center gap-3 flex-1">
        <div className="flex-1 h-px bg-black/25" />
        <div className="w-2 h-2 rotate-45 bg-black/50" />
      </div>

      {/* Frase centrale */}
      <span className="font-display text-xl md:text-2xl tracking-widest uppercase whitespace-nowrap">
        Risali all&apos;origine.
      </span>

      {/* Rombo + linea destra */}
      <div className="flex items-center gap-3 flex-1">
        <div className="w-2 h-2 rotate-45 bg-black/50" />
        <div className="flex-1 h-px bg-black/25" />
      </div>

    </div>
  );
}
