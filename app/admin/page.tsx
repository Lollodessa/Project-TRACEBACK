import type { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin — Project: Traceback",
  robots: { index: false, follow: false }, // non indicizzare il pannello admin
};

export default function AdminPage() {
  // Nessun <Nav> pubblico — AdminDashboard ha il proprio header gestionale
  return <AdminDashboard />;
}
