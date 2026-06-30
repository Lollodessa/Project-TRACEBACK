"use client";

// ⚠️ SOLO IN MEMORIA — gli ordini qui sono finti e non persistenti.
// In produzione, sostituire con:
//   - GET  /api/orders          → lista ordini dal database
//   - PUT  /api/orders/:id/status → aggiorna stato (con webhook payment provider)
// Gli ordini reali arriveranno da Stripe/Paddle + tabella orders nel database.

import { useState, useEffect } from "react";
import { X, ChevronRight, Check, Package } from "lucide-react";
import { products } from "@/lib/products";
import type { Size } from "@/lib/products";

// ─── Tipi ─────────────────────────────────────────────────────────────────────

type OrderStatus = "In attesa" | "Spedito" | "Consegnato" | "Annullato";

interface OrderItem {
  productId: string;
  colorName: string;
  size:      Size;
  quantity:  number;
  price:     number;
}

interface OrderAddress {
  fullName:  string;
  street:    string;
  city:      string;
  zip:       string;
  province:  string;
  country:   string;
  phone?:    string;
}

interface Order {
  id:            string;
  customerName:  string;
  customerEmail: string;
  date:          string; // ISO — usato per ordinamento
  items:         OrderItem[];
  address:       OrderAddress;
  status:        OrderStatus;
}

// ─── Costanti ─────────────────────────────────────────────────────────────────

const ORDER_STATUSES: OrderStatus[] = ["In attesa", "Spedito", "Consegnato", "Annullato"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  "In attesa":  "bg-amber-50  text-amber-700  border-amber-100",
  "Spedito":    "bg-blue-50   text-blue-700   border-blue-100",
  "Consegnato": "bg-green-50  text-green-700  border-green-100",
  "Annullato":  "bg-zinc-100  text-zinc-500   border-zinc-200",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  "In attesa":  "bg-amber-400",
  "Spedito":    "bg-blue-500",
  "Consegnato": "bg-green-500",
  "Annullato":  "bg-zinc-400",
};

// ─── Dati finti ───────────────────────────────────────────────────────────────

const FAKE_ORDERS: Order[] = [
  {
    id: "TB-1024", customerName: "Marco Rossi", customerEmail: "marco.rossi@example.com",
    date: "2026-06-28T14:30:00", status: "In attesa",
    items: [{ productId: "tb-core-tee", colorName: "Nero", size: "M", quantity: 2, price: 49 }],
    address: { fullName: "Marco Rossi", street: "Via Garibaldi 12", city: "Roma", zip: "00100", province: "RM", country: "Italia", phone: "+39 333 1234567" },
  },
  {
    id: "TB-1023", customerName: "Sofia Bianchi", customerEmail: "sofia.bianchi@example.com",
    date: "2026-06-26T09:15:00", status: "In attesa",
    items: [
      { productId: "marble-logo-tee", colorName: "Bianco", size: "S",  quantity: 1, price: 49 },
      { productId: "origin-tee",      colorName: "Grigio", size: "L",  quantity: 1, price: 49 },
    ],
    address: { fullName: "Sofia Bianchi", street: "Via delle Rose 5", city: "Torino", zip: "10100", province: "TO", country: "Italia" },
  },
  {
    id: "TB-1022", customerName: "Luca Ferrari", customerEmail: "luca.ferrari@example.com",
    date: "2026-06-23T16:45:00", status: "Spedito",
    items: [{ productId: "crack-pattern-tee", colorName: "Beige", size: "M", quantity: 1, price: 49 }],
    address: { fullName: "Luca Ferrari", street: "Corso Vittorio 88", city: "Milano", zip: "20123", province: "MI", country: "Italia" },
  },
  {
    id: "TB-1021", customerName: "Giulia Conti", customerEmail: "giulia.conti@example.com",
    date: "2026-06-19T11:00:00", status: "Spedito",
    items: [{ productId: "archive-tee-vol1", colorName: "Nero", size: "L", quantity: 2, price: 49 }],
    address: { fullName: "Giulia Conti", street: "Via Nazionale 33", city: "Napoli", zip: "80100", province: "NA", country: "Italia", phone: "+39 340 9876543" },
  },
  {
    id: "TB-1020", customerName: "Andrea Marino", customerEmail: "andrea.marino@example.com",
    date: "2026-06-15T18:20:00", status: "Consegnato",
    items: [{ productId: "tb-core-tee", colorName: "Grigio", size: "XL", quantity: 1, price: 49 }],
    address: { fullName: "Andrea Marino", street: "Via XX Settembre 7", city: "Genova", zip: "16100", province: "GE", country: "Italia" },
  },
  {
    id: "TB-1019", customerName: "Elena Ricci", customerEmail: "elena.ricci@example.com",
    date: "2026-06-10T13:00:00", status: "Annullato",
    items: [{ productId: "origin-tee", colorName: "Nero", size: "S", quantity: 1, price: 49 }],
    address: { fullName: "Elena Ricci", street: "Piazza del Duomo 2", city: "Firenze", zip: "50100", province: "FI", country: "Italia" },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function computeTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    day:   "2-digit",
    month: "short",
    year:  "numeric",
  });
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
    hour:    "2-digit",
    minute:  "2-digit",
  });
}

// ─── Componente ───────────────────────────────────────────────────────────────

type FilterValue = OrderStatus | "Tutti";

export default function AdminOrdini() {
  const [orders,          setOrders]          = useState<Order[]>(
    // Dal più recente al più vecchio
    () => [...FAKE_ORDERS].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
  const [filter,          setFilter]          = useState<FilterValue>("Tutti");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Ordine selezionato derivato — si aggiorna automaticamente quando orders cambia
  const selectedOrder = selectedOrderId
    ? orders.find(o => o.id === selectedOrderId) ?? null
    : null;

  const filteredOrders = filter === "Tutti"
    ? orders
    : orders.filter(o => o.status === filter);

  const pendingCount = orders.filter(o => o.status === "In attesa").length;

  // ESC chiude il pannello
  useEffect(() => {
    if (!selectedOrderId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedOrderId(null); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [selectedOrderId]);

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      <div>
        {/* Intestazione */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-800">Ordini</h2>
          <span className="text-xs text-zinc-400">{orders.length} totali</span>
        </div>

        {/* ── Banner "cosa fare oggi" ─────────────────────────────────────── */}
        {pendingCount > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
            <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">{pendingCount}</span>{" "}
              {pendingCount === 1 ? "ordine in attesa" : "ordini in attesa"} di spedizione
            </p>
          </div>
        )}

        {/* ── Filtro stato ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {(["Tutti", ...ORDER_STATUSES] as FilterValue[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                filter === f
                  ? f === "Tutti"
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : STATUS_STYLES[f as OrderStatus]
                  : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"
              }`}
            >
              {f}
              {f !== "Tutti" && (
                <span className="ml-1.5 opacity-60">
                  {orders.filter(o => o.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tabella ordini ─────────────────────────────────────────────── */}
        <div className="bg-white border border-zinc-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/70">
                  <th className="text-left px-5 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Ordine</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Cliente</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Data</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Articoli</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Totale</th>
                  <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-zinc-400 font-medium">Stato</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-10 text-center text-zinc-400 text-sm">
                      Nessun ordine con stato "{filter}".
                    </td>
                  </tr>
                ) : filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    className={`hover:bg-zinc-50/60 transition-colors cursor-pointer ${
                      selectedOrderId === order.id ? "bg-accent/4" : ""
                    }`}
                    onClick={() => setSelectedOrderId(order.id)}
                  >
                    {/* ID */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-zinc-700">#{order.id}</span>
                    </td>

                    {/* Cliente */}
                    <td className="px-4 py-4">
                      <p className="font-medium text-zinc-900">{order.customerName}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{order.customerEmail}</p>
                    </td>

                    {/* Data */}
                    <td className="px-4 py-4 text-zinc-500 text-xs whitespace-nowrap">
                      {formatDate(order.date)}
                    </td>

                    {/* Articoli */}
                    <td className="px-4 py-4 text-zinc-500 text-sm">
                      {order.items.reduce((n, i) => n + i.quantity, 0)}
                    </td>

                    {/* Totale */}
                    <td className="px-4 py-4">
                      <span className="font-semibold text-zinc-900">€{computeTotal(order.items)}</span>
                    </td>

                    {/* Stato */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] px-2.5 py-1 rounded-full font-medium border ${STATUS_STYLES[order.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.status]}`} />
                        {order.status}
                      </span>
                    </td>

                    {/* Chevron */}
                    <td className="px-4 py-4">
                      <ChevronRight size={14} className="text-zinc-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Pannello dettaglio ─────────────────────────────────────────────── */}

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          selectedOrder ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSelectedOrderId(null)}
      />

      {/* Pannello */}
      <div
        className={`fixed inset-y-0 right-0 z-[65] w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-[cubic-bezier(.32,.72,0,1)] ${
          selectedOrder ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedOrder && (
          <>
            {/* Header pannello */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 flex-shrink-0">
              <div>
                <p className="font-mono text-xs text-zinc-400 mb-0.5">#{selectedOrder.id}</p>
                <p className="font-semibold text-zinc-900">{selectedOrder.customerName}</p>
              </div>
              <button
                onClick={() => setSelectedOrderId(null)}
                className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Contenuto scrollabile */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Data e ora */}
              <p className="text-xs text-zinc-400 capitalize">{formatDateLong(selectedOrder.date)}</p>

              {/* ── Cambio stato ──────────────────────────────────────────── */}
              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Stato ordine</p>
                <div className="flex flex-wrap gap-2">
                  {ORDER_STATUSES.map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selectedOrder.id, s)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        selectedOrder.status === s
                          ? STATUS_STYLES[s]
                          : "bg-white text-zinc-400 border-zinc-100 hover:border-zinc-300"
                      }`}
                    >
                      {selectedOrder.status === s && <Check size={10} />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Cliente e indirizzo ───────────────────────────────────── */}
              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Cliente</p>
                <div className="bg-zinc-50 rounded-xl p-4 space-y-1">
                  <p className="text-sm font-medium text-zinc-900">{selectedOrder.customerName}</p>
                  <p className="text-xs text-zinc-400">{selectedOrder.customerEmail}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Indirizzo di spedizione</p>
                <div className="bg-zinc-50 rounded-xl p-4 space-y-0.5">
                  <p className="text-sm font-medium text-zinc-900">{selectedOrder.address.fullName}</p>
                  <p className="text-xs text-zinc-500">{selectedOrder.address.street}</p>
                  <p className="text-xs text-zinc-500">
                    {selectedOrder.address.zip} {selectedOrder.address.city} ({selectedOrder.address.province})
                  </p>
                  <p className="text-xs text-zinc-500">{selectedOrder.address.country}</p>
                  {selectedOrder.address.phone && (
                    <p className="text-xs text-zinc-400 pt-1">{selectedOrder.address.phone}</p>
                  )}
                </div>
              </div>

              {/* ── Articoli ordinati ─────────────────────────────────────── */}
              <div>
                <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-2">Articoli</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => {
                    const product = products.find(p => p.id === item.productId);
                    const variant = product?.variants.find(v => v.colorName === item.colorName);
                    const seed    = variant?.images[0] ?? item.productId;

                    return (
                      <div key={i} className="flex items-center gap-3 bg-zinc-50 rounded-xl p-3">
                        {/* Foto */}
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-200 flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={`https://picsum.photos/seed/${seed}/112/112`}
                            alt={product?.name ?? item.productId}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-zinc-900 truncate">
                            {product?.name ?? item.productId}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {item.colorName} · {item.size} · x{item.quantity}
                          </p>
                        </div>

                        {/* Prezzo */}
                        <p className="text-sm font-semibold text-zinc-900 flex-shrink-0">
                          €{item.price * item.quantity}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer totale */}
            <div className="flex-shrink-0 border-t border-zinc-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-400">
                    {selectedOrder.items.reduce((n, i) => n + i.quantity, 0)} articoli
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] tracking-widest uppercase text-zinc-400 mb-0.5">Totale</p>
                  <p className="text-2xl font-bold text-accent">
                    €{computeTotal(selectedOrder.items)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
