export default function About() {
  return (
    <section className="bg-[#f4f2ee] py-24 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">

        {/* Foto placeholder quadrata */}
        <div className="w-full md:w-1/2 aspect-square bg-zinc-300 flex-shrink-0" />

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
    </section>
  );
}
