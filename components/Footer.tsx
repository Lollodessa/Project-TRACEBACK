const PAYMENT_LABELS = ["Visa", "Mastercard", "PayPal", "Apple Pay"];

const LEGAL_LINKS = [
  { label: "Termini e Condizioni", href: "/termini" },
  { label: "Privacy Policy",       href: "/privacy"  },
  { label: "Resi e Rimborsi",      href: "/resi"     },
  { label: "Cookie Policy",        href: "/cookie"   },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white/70 px-6 pt-16 pb-8">
      <div className="max-w-6xl mx-auto">

        {/* Griglia 5 colonne — impilata su mobile, affiancata da md: */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b border-white/10">

          {/* 1. Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-2">
            <span className="font-display text-white text-4xl tracking-widest leading-none">TB</span>
            <p className="text-xs tracking-widest uppercase text-white/40">Risali all&apos;origine.</p>
          </div>

          {/* 2. Social */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-widest uppercase text-white/30">Seguici</h3>
            <div className="flex flex-col gap-3">
              <a href="#" aria-label="Instagram"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-200">
                {/* Instagram SVG — rounded square + circle + dot */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>
              <a href="#" aria-label="TikTok"
                className="flex items-center gap-2 text-sm hover:text-white transition-colors duration-200">
                {/* TikTok SVG — path ufficiale semplificato */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5
                    2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.3 6.3 0
                    0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0
                    6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.74a4.85 4.85 0 0 1-1-.05z" />
                </svg>
                TikTok
              </a>
            </div>
          </div>

          {/* 3. Link legali */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-widest uppercase text-white/30">Legale</h3>
            <ul className="flex flex-col gap-2">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a href={href}
                    className="text-sm hover:text-white transition-colors duration-200">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contatti */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-widest uppercase text-white/30">Contatti</h3>
            <a href="mailto:info@projecttraceback.com"
              className="text-sm hover:text-white transition-colors duration-200 break-all">
              info@projecttraceback.com
            </a>
          </div>

          {/* 5. Pagamenti */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] tracking-widest uppercase text-white/30">Pagamenti</h3>
            {/* Badge placeholder — sostituibili con SVG ufficiali quando disponibili */}
            <div className="flex flex-wrap gap-2">
              {PAYMENT_LABELS.map((label) => (
                <span key={label}
                  className="border border-white/20 rounded px-2 py-1 text-[10px] tracking-wide text-white/50">
                  {label}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright */}
        <p className="text-[11px] text-white/25 text-center mt-8 tracking-wider">
          © 2026 Project: Traceback. Tutti i diritti riservati.
        </p>

      </div>
    </footer>
  );
}
