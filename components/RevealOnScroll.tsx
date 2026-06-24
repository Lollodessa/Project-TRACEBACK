"use client";

import { useRef, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delay?: string; // es. "delay-150" per staggerare elementi vicini
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
          observer.disconnect(); // anima una sola volta, non ri-triggera uscendo
        }
      },
      { threshold: 0.1 } // entra in animazione appena il 10% è visibile
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out will-change-transform ${delay} ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}
