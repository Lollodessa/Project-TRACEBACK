"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// ─── Tipi ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  name: string;
  email: string;
  isAdmin: boolean;
}

// ⚠️ SOLO PER SVILUPPO — NON è sicurezza reale.
// Questo controllo va sostituito con un vero sistema di permessi (es. ruoli su
// database, JWT claims, o un provider come Clerk/NextAuth) quando ci sarà
// l'autenticazione reale. Chiunque può digitare questa email nel form e ottenere
// l'accesso admin finto.
const ADMIN_EMAIL = "admin@projecttraceback.com";

const FAKE_ADMIN: AuthUser = {
  name:    "Admin Traceback",
  email:   ADMIN_EMAIL,
  isAdmin: true,
};

const FAKE_USER: AuthUser = {
  name:    "Lorenzo De Santis",
  email:   "lorenzodesantis@coldynamics.it",
  isAdmin: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  // Firma attuale: accetta email opzionale per distinguere admin vs utente.
  // Auth vera: login(email: string, password: string) => Promise<void>
  login:  (email?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: user !== null,
        user,
        // ⚠️ Controllo finto — sostituire con auth reale
        login:  (email?: string) =>
          setUser(email?.toLowerCase() === ADMIN_EMAIL ? FAKE_ADMIN : FAKE_USER),
        logout: () => setUser(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve essere usato dentro AuthProvider");
  return ctx;
}
