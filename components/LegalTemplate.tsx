"use client";

import { useState, useEffect } from "react";

export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

interface Props {
  title: string;
  sections: LegalSection[];
}

export default function LegalTemplate({ title, sections }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const ANCHOR = 130;

    const onScroll = () => {
      let active = sections[0].id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= ANCHOR) active = id;
      }
      setActiveId(active);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 pt-28 pb-24">

      {/* Banner placeholder */}
      <div className="mb-10 border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-zinc-600">
        ⚠ Testo placeholder — da sostituire con la versione legale definitiva prima del lancio.
      </div>

      <h1 className="font-display text-6xl md:text-8xl text-black tracking-wide uppercase mb-16">
        {title}
      </h1>

      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">

        {/* SIDEBAR */}
        <aside className="w-full md:w-52 flex-shrink-0 md:sticky md:top-28">
          <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-4">Indice</p>
          <ul className="flex flex-col gap-0.5">
            {sections.map(({ id, title }) => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className={`text-left w-full text-sm py-1.5 pl-3 border-l-2 transition-all duration-200 ${
                    activeId === id
                      ? "border-accent text-accent font-medium"
                      : "border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  {title}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col gap-14">
          {sections.map(({ id, title, content }) => (
            <section key={id} id={id} className="scroll-mt-32">
              <h2 className="font-display text-3xl md:text-4xl text-black tracking-wide uppercase mb-5">
                {title}
              </h2>
              <div className="flex flex-col gap-4">
                {content.map((para, i) => (
                  <p key={i} className="text-zinc-600 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

      </div>
    </div>
  );
}
