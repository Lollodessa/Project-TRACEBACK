"use client";

// ⚠️ SOLO IN MEMORIA — i clienti qui sono finti.
// In produzione, sostituire con:
//   - GET /api/customers     → lista dal database (tabella users con ruolo "customer")
//   - GET /api/customers/:id → dettaglio + ordini associati
// I clienti reali arriveranno quando ci sarà l'autenticazione vera (es. Clerk/NextAuth).

import { useState } from "react";
import { X, Search, ChevronRight } from "lucide-react";

// ─── Tipi ─────────────────────────────────────────────────────────────────────

interface CustomerOrder {
  id:     string;
  date:   string;
  total:  number;
  status: "In attesa" | "Spedito" | "Consegnato" | "Annullato";
}

interface Customer {
  id:           string;
  name:         string;
  email:        string;
  registeredAt: string;
  orders:       CustomerOrder[];
}

// ─── Dati finti ───────────────────────────────────────────────────────────────

const FAKE_CUSTOMERS: Customer[] = [
  {
    id: "c-001", name: "Marco Rossi", email: "marco.rossi@example.com",
    registeredAt: "2025-11-03T10:00:00",
    orders: [
      { id: "TB-1024", date: "2026-06-28", total: 98,  status: "In attesa"  },
      { id: "TB-1017", date: "2026-04-12", total: 49,  status: "Consegnato" },
      { id: "TB-1009", date: "2026-01-20", total: 49,  status: "Consegnato" },
    ],
  },
  {
    id: "c-002", name: "Sofia Bianchi", email: "sofia.bianchi@example.com",
    registeredAt: "2026-01-15T09:30:00",
    orders: [
      { id: "TB-1023", date: "2026-06-26", total: 98, status: "In attesa" },
    ],
  },
  {
    id: "c-003", name: "Luca Ferrari", email: "luca.ferrari@example.com",
    registeredAt: "2025-09-22T14:00:00",
    orders: [
      { id: "TB-1022", date: "2026-06-23", total: 49,  status: "Spedito"    },
      { id: "TB-1011", date: "2026-02-08", total: 49,  status: "Consegnato" },
    ],
  },
  {
    id: "c-004", name: "Giulia Conti", email: "giulia.conti@example.com",
    registeredAt: "2026-03-07T11:45:00",
    orders: [
      { id: "TB-1021", date: "2026-06-19", total: 98, status: "Spedito" },
    ],
  },
  {
    id: "c-005", name: "Andrea Marino", email: "andrea.marino@example.com",
    registeredAt: "2025-06-18T16:20:00",
    orders: [
      { id: "TB-1020", date: "2026-06-15", total: 49,  status: "Consegnato" },
      { id: "TB-1015", date: "2026-03-30", total: 98,  status: "Consegnato" },
      { id: "TB-1008", date: "2025-12-24", total: 49,  status: "Consegnato" },
      { id: "TB-1003", date: "2025-09-05", total: 49,  status: "Consegnato" },
    ],
  },
  {
    id: "c-006", name: "Elena Ricci", email: "elena.ricci@example.com",
    registeredAt: "2026-05-02T08:00:00",
    orders: [
      { id: "TB-1019", date: "2026-06-10", total: 49, status: "Annullato" },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

const STATUS_STYLE: Record<CustomerOrder["status"], string> = {
  "In attesa":  "bg-amber-50 text-amber-700 border-amber-100",
  "Spedito":    "bg-blue-50 text-blue-700 border-blue-100",
  "Consegnato": "bg-green-50 text-green-700 border-green-100",
  "Annullato":  "bg-zinc-100 text-zinc-500 border-zinc-200",
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function AdminClienti() {
  const [query,      setQuery]      = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCustomer = selectedId
    ? FAKE_CUSTOMERS.find(c => c.id === selectedId) ?? null
    : null;

  const filtered = FAKE_CUSTOMERS.filter(c => {
    const q = query.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <>
      <div>
        {/* Intestazione */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-800">Clienti</h2>
          <span className="text-xs text-zinc-400">{FAKE_CUSTOMERS.length} registrati</span>
        </div>

        {/* Ricerca */}
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-300 pointer-events-none" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Cerca per nome o email…"
            className="w-full border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-300 focus:outline-none focus:border-accent transition-colors bg-white"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-zinc-500 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Tabella */}
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/70">
                  <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Registrato</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Ordini</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widests uppercase text-zinc-400 font-medium">Totale speso</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-zinc-400 text-sm">
                      Nessun cliente trovato per "{query}".
                    </td>
                  </tr>
                ) : filtered.map(c => {
                  const totalSpent  = c.orders.reduce((s, o) => s + o.total, 0);
                  const activeOrders = c.orders.filter(o => o.status !== "Annullato").length;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`hover:bg-zinc-50/60 transition-colors cursor-pointer ${
                        selectedId === c.id ? "bg-accent/4" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-zinc-900">{c.name}</p>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{c.email}</p>
                      </td>
                      <td className="px-4 py-4 text-xs text-zinc-500 whitespace-nowrap">
                        {formatDate(c.registeredAt)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-zinc-900">{activeOrders}</span>
                        {c.orders.length !== activeOrders && (
                          <span className="text-xs text-zinc-300 ml-1">
                            ({c.orders.length} totali)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-semibold text-zinc-900">€{totalSpent}</span>
                      </td>
                      <td className="px-4 py-4">
                        <ChevronRight size={14} className="text-zinc-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Pannello dettaglio ─────────────────────────────────────────────── */}

      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          selectedCustomer ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSelectedId(null)}
      />

      <div
        className={`fixed inset-y-0 right-0 z-[65] w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${
          selectedCustomer ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedCustomer && (() => {
          const totalSpent = selectedCustomer.orders.reduce((s, o) => s + o.total, 0);
          return (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
                <div>
                  <p className="text-xs text-zinc-400 mb-0.5">Cliente</p>
                  <p className="font-semibold text-zinc-900">{selectedCustomer.name}</p>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Contenuto */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Riepilogo */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Ordini",       value: String(selectedCustomer.orders.length) },
                    { label: "Totale speso", value: `€${totalSpent}`                        },
                    { label: "Registrato",   value: formatDate(selectedCustomer.registeredAt) },
                  ].map(s => (
                    <div key={s.label} className="bg-zinc-50 rounded-xl p-3 text-center">
                      <p className="text-[10px] tracking-widests uppercase text-zinc-400 mb-1">{s.label}</p>
                      <p className="text-sm font-semibold text-zinc-900">{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Email */}
                <div>
                  <p className="text-[10px] tracking-widests uppercase text-zinc-400 mb-2">Email</p>
                  <p className="text-sm text-zinc-700">{selectedCustomer.email}</p>
                </div>

                {/* Lista ordini */}
                <div>
                  <p className="text-[10px] tracking-widests uppercase text-zinc-400 mb-3">Storico ordini</p>
                  <div className="space-y-2">
                    {selectedCustomer.orders.map(o => (
                      <div key={o.id} className="flex items-center justify-between bg-zinc-50 rounded-xl px-4 py-3">
                        <div>
                          <p className="font-mono text-xs font-semibold text-zinc-700">#{o.id}</p>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{formatDate(o.date)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${STATUS_STYLE[o.status]}`}>
                            {o.status}
                          </span>
                          <span className="text-sm font-semibold text-zinc-900">€{o.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          );
        })()}
      </div>
    </>
  );
}
