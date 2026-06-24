"use client";

import { useRef, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}

export default function RevealOnScroll({ children, className = "", delay = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 } // scatta quando il 20% della sezione è visibile, non all'ombra del bordo
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${delay} ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-16"   // 64px + durata 1s = movimento chiaramente percepibile
      } ${className}`}
    >
      {children}
    </div>
  );
}
