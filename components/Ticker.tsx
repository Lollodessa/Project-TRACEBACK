const TEXT = "RISALI ALL'ORIGINE";
const SEPARATOR = "◆";
// Ripeto abbastanza da riempire qualsiasi schermo, poi duplico per il loop seamless
const ITEM = `${TEXT}  ${SEPARATOR}  `;
const TRACK = ITEM.repeat(10);

export default function Ticker() {
  return (
    <div className="bg-black overflow-hidden py-5 select-none">
      {/* Flex con due copie identiche del testo.
          animate-marquee trasla di -50% → quando finisce è identico all'inizio: loop seamless. */}
      <div className="flex w-max animate-marquee">
        <span className="font-display text-white text-2xl md:text-3xl tracking-widest whitespace-nowrap pr-0">
          {TRACK}
        </span>
        <span className="font-display text-white text-2xl md:text-3xl tracking-widest whitespace-nowrap" aria-hidden="true">
          {TRACK}
        </span>
      </div>
    </div>
  );
}
