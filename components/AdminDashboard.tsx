"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Package, Users, LogOut, TrendingUp,
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { products } from "@/lib/products";
import AdminProdotti from "@/components/AdminProdotti";
import AdminOrdini   from "@/components/AdminOrdini";
import AdminClienti  from "@/components/AdminClienti";

// ─── Dati finti panoramica ────────────────────────────────────────────────────

const CHART_DATA = [
  { month: "Gen", revenue: 8200  },
  { month: "Feb", revenue: 9400  },
  { month: "Mar", revenue: 7600  },
  { month: "Apr", revenue: 11200 },
  { month: "Mag", revenue: 9800  },
  { month: "Giu", revenue: 12350 },
];

// ─── Tipi ─────────────────────────────────────────────────────────────────────

type AdminTab = "panoramica" | "ordini" | "prodotti" | "clienti";

const TABS: { key: AdminTab; label: string; icon: React.ElementType }[] = [
  { key: "panoramica", label: "Panoramica", icon: LayoutDashboard },
  { key: "ordini",     label: "Ordini",     icon: ShoppingBag     },
  { key: "prodotti",   label: "Prodotti",   icon: Package          },
  { key: "clienti",    label: "Clienti",    icon: Users            },
];

// ─── Sezione Panoramica ───────────────────────────────────────────────────────

function PanoramicaSection() {
  const maxRevenue = Math.max(...CHART_DATA.map(d => d.revenue));

  const stats = [
    {
      label: "Ordini totali",
      value: "847",
      sub:   "+12 questa settimana",
      icon:  ShoppingBag,
      color: "text-accent",
      bg:    "bg-accent/10",
    },
    {
      label: "Incasso mese",
      value: "€ 12.350",
      sub:   "Giugno 2026",
      icon:  TrendingUp,
      color: "text-emerald-600",
      bg:    "bg-emerald-50",
    },
    {
      label: "Prodotti attivi",
      value: String(products.length),
      sub:   "nel catalogo",
      icon:  Package,
      color: "text-blue-500",
      bg:    "bg-blue-50",
    },
    {
      label: "Clienti",
      value: "312",
      sub:   "+8 questo mese",
      icon:  Users,
      color: "text-amber-500",
      bg:    "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-base font-semibold text-zinc-800">Panoramica</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 leading-snug">{s.label}</p>
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0 ml-2`}>
                  <Icon size={14} className={s.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-zinc-900">{s.value}</p>
              <p className="text-xs text-zinc-400 mt-1">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Grafico vendite — CSS-only, nessuna libreria */}
      <div className="bg-white border border-zinc-100 rounded-2xl p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-zinc-800">Andamento vendite</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Ultimi 6 mesi · euro</p>
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-50 border border-zinc-100 px-2.5 py-1 rounded-full flex-shrink-0">
            2026
          </span>
        </div>

        <div className="flex items-end gap-2 h-40">
          {CHART_DATA.map(d => {
            const heightPct = (d.revenue / maxRevenue) * 100;
            return (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                {/* Valore visibile su hover */}
                <span className="text-[9px] text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  €{d.revenue.toLocaleString("it-IT")}
                </span>
                <div
                  className="w-full bg-accent/15 group-hover:bg-accent/60 rounded-t-lg transition-colors duration-200"
                  style={{ height: `${heightPct}%` }}
                />
                <span className="text-[10px] text-zinc-400 tracking-wide">{d.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Info ulteriori */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-zinc-100 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-zinc-700 tracking-widest uppercase mb-3">
            Prodotti più venduti
          </h3>
          <ol className="space-y-2.5">
            {products.slice(0, 3).map((p, i) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-medium text-zinc-300 w-4">{i + 1}.</span>
                  <span className="text-zinc-700">{p.name}</span>
                </div>
                <span className="text-zinc-400 text-xs">{[34, 27, 19][i]} pezzi</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-white border border-zinc-100 rounded-2xl p-5">
          <h3 className="text-xs font-semibold text-zinc-700 tracking-widest uppercase mb-3">
            Ultimi ordini
          </h3>
          <ul className="space-y-2.5">
            {["#TB-2024-003", "#TB-2024-002", "#TB-2024-001"].map((id, i) => (
              <li key={id} className="flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-mono text-xs">{id}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                  i === 0 ? "bg-amber-50 text-amber-600 border border-amber-100"
                  : i === 1 ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : "bg-green-50 text-green-600 border border-green-100"
                }`}>
                  {["In preparazione", "In transito", "Consegnato"][i]}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Admin ──────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { isLoggedIn, user, logout } = useAuth();
  const router    = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("panoramica");

  // Redirect se non loggato
  useEffect(() => {
    if (!isLoggedIn) router.replace("/login");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  // Loggato ma non admin — mostra 403 (es. qualcuno digita /admin a mano)
  // ⚠️ Questo check è finto — va sostituito con permessi reali lato server
  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-6">
        <p className="text-[11px] tracking-widest uppercase text-zinc-400 mb-4">Accesso riservato</p>
        <h1 className="font-display text-8xl text-zinc-900 tracking-wide uppercase mb-4">403</h1>
        <p className="text-zinc-500 text-sm mb-8">Non hai i permessi per accedere a questa area.</p>
        <Link
          href="/"
          className="text-xs tracking-widest uppercase text-zinc-400 hover:text-zinc-900 underline underline-offset-4 transition-colors"
        >
          Torna alla home
        </Link>
      </div>
    );
  }

  const handleLogout = () => { logout(); router.push("/"); };

  return (
    // h-screen: il pannello admin riempie esattamente il viewport
    <div className="h-screen bg-zinc-50 flex flex-col">

      {/* ── Header admin ───────────────────────────────────────────────────── */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-zinc-100 px-5 flex items-center justify-between z-40">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl tracking-widest uppercase text-zinc-900 leading-none">TB</span>
          <span className="text-[10px] tracking-widest uppercase text-zinc-400 border-l border-zinc-200 pl-3">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="text-[11px] text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            ← Sito pubblico
          </Link>
          <span className="text-xs text-zinc-300">{user.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            Esci
          </button>
        </div>
      </header>

      {/* ── Corpo: sidebar + contenuto ──────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        {/* Sidebar desktop */}
        <aside className="hidden md:block w-52 bg-white border-r border-zinc-100 overflow-y-auto flex-shrink-0">
          <nav className="p-3 space-y-0.5 pt-4">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                  activeTab === key
                    ? "bg-accent/8 text-accent font-medium"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Area contenuto */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">

          {/* Tab mobile */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4" style={{ scrollbarWidth: "none" }}>
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-xs tracking-widest uppercase font-medium transition-colors cursor-pointer ${
                  activeTab === key
                    ? "bg-accent text-white"
                    : "bg-white border border-zinc-200 text-zinc-500"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === "panoramica" && <PanoramicaSection />}
          {activeTab === "ordini"     && <AdminOrdini />}
          {activeTab === "prodotti"   && <AdminProdotti />}
          {activeTab === "clienti"    && <AdminClienti />}

        </main>
      </div>
    </div>
  );
}
