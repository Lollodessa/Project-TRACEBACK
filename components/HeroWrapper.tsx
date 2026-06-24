"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Hero from "@/components/Hero";

export default function HeroWrapper() {
  const [dismissed, setDismissed] = useState(false);
  const [exiting, setExiting]     = useState(false);
  // ref per evitare doppio trigger (wheel + touchmove possono sparare insieme)
  const exitingRef = useRef(false);

  const startDismiss = useCallback(() => {
    if (exitingRef.current) return;
    exitingRef.current = true;
    document.body.style.overflow = ""; // sblocca subito il contenuto sotto
    setExiting(true);                  // avvia lo slide-up CSS
  }, []);

  useEffect(() => {
    // Blocca lo scroll del body mentre la hero è in primo piano
    document.body.style.overflow = "hidden";

    // Desktop: wheel verso il basso
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) startDismiss(); };

    // Mobile: swipe verso l'alto con soglia di 30px
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      if (touchStartY - e.touches[0].clientY > 30) startDismiss();
    };

    window.addEventListener("wheel",      onWheel,      { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });

    return () => {
      // Cleanup: garantisce che il blocco venga rimosso anche se l'utente
      // naviga via prima di fare il dismiss
      document.body.style.overflow = "";
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, [startDismiss]);

  // Smonta la hero SOLO a transizione completata (onTransitionEnd è più preciso
  // di un setTimeout fisso: si adatta a qualsiasi durata della transizione CSS)
  const handleTransitionEnd = () => {
    if (exiting) setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-0 z-40 transition-transform duration-500 ease-in-out ${
        exiting ? "-translate-y-full" : "translate-y-0"
      }`}
      onTransitionEnd={handleTransitionEnd}
    >
      <Hero onDismiss={startDismiss} />
    </div>
  );
}
