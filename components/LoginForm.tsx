"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Crosshair } from "lucide-react";
import { useAuth } from "@/lib/authContext";

const ADMIN_EMAIL = "admin@projecttraceback.com";

export default function LoginForm() {
  const { login }  = useAuth();
  const router     = useRouter();
  const [email, setEmail] = useState("");

  const handleLogin = () => {
    login(email);
    // Redirect admin → /admin, utente normale → /profilo
    router.push(email.toLowerCase() === ADMIN_EMAIL ? "/admin" : "/profilo");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-sm">
        <div className="bg-zinc-950/92 backdrop-blur-md rounded-2xl p-8 border border-white/10 shadow-2xl">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Crosshair size={17} strokeWidth={1.5} className="text-white" />
            <span className="font-display text-white text-2xl leading-none tracking-wider">TB</span>
          </div>

          <h1 className="font-display text-4xl text-white tracking-widest uppercase leading-none mb-1">
            Accedi
          </h1>
          <p className="text-white/35 text-[11px] tracking-widest uppercase mb-8">
            Project: Traceback
          </p>

          {/* Campi */}
          <div className="space-y-3 mb-6">
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors duration-200"
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-accent text-white rounded-full text-sm tracking-widest uppercase font-medium hover:bg-[#8300e0] transition-colors duration-200 cursor-pointer mb-6"
          >
            Accedi
          </button>

          <p className="text-center text-xs text-white/35">
            Non hai un account?{" "}
            <Link href="#" className="text-accent underline underline-offset-2 hover:no-underline transition-all">
              Registrati
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
