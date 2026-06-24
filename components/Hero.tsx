import Image from "next/image";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">

      {/* Marmo sfocato — scale(1.05) copre i bordi bianchi che il blur genera ai lati */}
      <Image
        src="/marble.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center scale-[1.05] blur-[6px]"
        priority
        aria-hidden="true"
      />

      {/* Contenuto */}
      <div className="relative flex flex-col items-center justify-center h-full">

        {/* Logo nero originale.
            mix-blend-mode: multiply rimuove solo il bianco dello sfondo del PNG
            (bianco × qualsiasi colore = quel colore, quindi sparisce),
            il nero del logo resta nero. Nessun filtro applicato al logo. */}
        <Image
          src="/logo.png"
          alt="Project: Traceback"
          width={460}
          height={460}
          className="w-72 md:w-[440px] h-auto"
          style={{ mixBlendMode: "multiply" }}
          priority
        />

        {/* Freccia viola subito sotto il logo */}
        <ChevronDown
          size={28}
          strokeWidth={1.5}
          className="mt-1 text-accent animate-blink"
        />

      </div>
    </section>
  );
}
