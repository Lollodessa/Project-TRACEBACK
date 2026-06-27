"use client";

import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { Size } from "./products";

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  key: string;          // `${productId}::${colorName}::${size}` — identifica univocamente la voce
  productId: string;
  productName: string;
  colorName: string;
  colorHex: string;
  imageSeed: string;    // seed picsum per la miniatura in carrello
  size: Size;
  price: number;
  quantity: number;
  selected: boolean;    // spunta per l'acquisto selettivo
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM";        payload: Omit<CartItem, "quantity" | "selected"> }
  | { type: "REMOVE_ITEM";     key: string }
  | { type: "UPDATE_QTY";      key: string; delta: number }
  | { type: "TOGGLE_SELECT";   key: string }
  | { type: "TOGGLE_ALL" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find(i => i.key === action.payload.key);
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.key === action.payload.key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1, selected: true }],
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter(i => i.key !== action.key) };
    case "UPDATE_QTY":
      return {
        ...state,
        items: state.items
          .map(i => i.key === action.key ? { ...i, quantity: i.quantity + action.delta } : i)
          .filter(i => i.quantity > 0),
      };
    case "TOGGLE_SELECT":
      return {
        ...state,
        items: state.items.map(i =>
          i.key === action.key ? { ...i, selected: !i.selected } : i
        ),
      };
    case "TOGGLE_ALL": {
      const allSelected = state.items.every(i => i.selected);
      return {
        ...state,
        items: state.items.map(i => ({ ...i, selected: !allSelected })),
      };
    }
    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  openCart:        () => void;
  closeCart:       () => void;
  addItem:         (item: Omit<CartItem, "quantity" | "selected">) => void;
  removeItem:      (key: string) => void;
  updateQuantity:  (key: string, delta: number) => void;
  toggleSelect:    (key: string) => void;
  toggleAll:       () => void;
  selectedTotal:   number;
  selectedCount:   number;  // n. voci (righe) selezionate
  totalQuantity:   number;  // n. pezzi totali (per il badge)
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  // Valori derivati — ricalcolati ad ogni render, mai stored
  const selectedTotal  = state.items
    .filter(i => i.selected)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);
  const selectedCount  = state.items.filter(i => i.selected).length;
  const totalQuantity  = state.items.reduce((sum, i) => sum + i.quantity, 0);

  const value: CartContextValue = {
    items:           state.items,
    isOpen:          state.isOpen,
    openCart:        () => dispatch({ type: "OPEN_CART" }),
    closeCart:       () => dispatch({ type: "CLOSE_CART" }),
    addItem:         (item) => dispatch({ type: "ADD_ITEM", payload: item }),
    removeItem:      (key)  => dispatch({ type: "REMOVE_ITEM", key }),
    updateQuantity:  (key, delta) => dispatch({ type: "UPDATE_QTY", key, delta }),
    toggleSelect:    (key)  => dispatch({ type: "TOGGLE_SELECT", key }),
    toggleAll:       ()     => dispatch({ type: "TOGGLE_ALL" }),
    selectedTotal,
    selectedCount,
    totalQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve essere usato dentro CartProvider");
  return ctx;
}
