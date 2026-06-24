import Nav from "@/components/Nav";

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      {/* bg-white copre il marble fisso del root layout */}
      <div className="min-h-screen bg-white relative">
        {/* Alone viola chiarissimo — dettaglio decorativo, non invade il testo */}
        <div
          className="fixed inset-0 pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse 60% 45% at 8% 0%, rgba(157,0,255,0.07) 0%, transparent 60%)",
            zIndex: 0,
          }}
        />
        <div className="relative" style={{ zIndex: 1 }}>
          {children}
        </div>
      </div>
    </>
  );
}
