import Image from "next/image";
import { ChevronDown } from "lucide-react";

interface HeroProps {
  onDismiss: () => void;
}

export default function Hero({ onDismiss }: HeroProps) {
  return (
    <section className="relative h-svh w-full overflow-hidden isolate">

      {/* Marmo sfocato — vive SOLO qui dentro la hero */}
      <Image
        src="/marble.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center scale-[1.05] blur-[8px]"
        priority
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center justify-center h-full">

        <Image
          src="/logo.png"
          alt="Project: Traceback"
          width={460}
          height={460}
          className="w-72 md:w-[440px] h-auto"
          style={{ mixBlendMode: "multiply" }}
          priority
        />

        {/* Freccia: click → dismiss della hero */}
        <button
          onClick={onDismiss}
          aria-label="Continua"
          className="mt-1 cursor-pointer bg-transparent border-0 p-0"
        >
          <ChevronDown
            size={28}
            strokeWidth={1.5}
            className="text-accent animate-blink"
          />
        </button>

      </div>
    </section>
  );
}
