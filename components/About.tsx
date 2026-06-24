export default function About() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Pannello vetrata: bg-white/80 → il marmo trasparisce al 20%,
            testo nero sempre leggibile. Border + shadow lo "sollevano" dal marmo. */}
        <div className="bg-white/80 border border-white/50 shadow-xl shadow-black/10 p-8 md:p-12 flex flex-col md:flex-row gap-10 items-center">

          {/* Foto placeholder quadrata */}
          <div className="w-full md:w-2/5 aspect-square bg-zinc-200 flex-shrink-0" />

          {/* Testo */}
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-5xl md:text-6xl tracking-wide uppercase">
              Chi siamo
            </h2>
            <p className="text-zinc-700 leading-relaxed">
              Project: Traceback nasce da un&apos;ossessione per le radici — risalire
              all&apos;origine di ogni cosa, trovare il filo che lega il passato al presente.
              Il brand è un archivio vivente: ogni pezzo è un&apos;impronta, un dato,
              una traccia lasciata nel tessuto della cultura.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              Non facciamo moda. Facciamo memoria.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
