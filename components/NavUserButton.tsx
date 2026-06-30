"use client";

import Link from "next/link";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/authContext";

export default function NavUserButton() {
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  return (
    <div className="flex items-center gap-3">
      {/* Link Admin — visibile SOLO se loggato come admin.
          Nasconderlo non è sicurezza: la rotta /admin ha la propria protezione. */}
      {isLoggedIn && user?.isAdmin && (
        <Link
          href="/admin"
          className="text-[10px] tracking-widest uppercase text-accent hover:text-white transition-colors duration-200 font-medium"
        >
          Admin
        </Link>
      )}

      <button
        onClick={() => router.push(isLoggedIn ? "/profilo" : "/login")}
        className="relative text-white hover:text-accent transition-colors duration-200 cursor-pointer"
        aria-label={isLoggedIn ? "Il mio profilo" : "Accedi"}
      >
        <User size={18} strokeWidth={1.5} />
        {isLoggedIn && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full" />
        )}
      </button>
    </div>
  );
}
