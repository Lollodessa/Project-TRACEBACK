import type { Metadata } from "next";
import Nav from "@/components/Nav";
import ProfileDashboard from "@/components/ProfileDashboard";

export const metadata: Metadata = {
  title: "Il mio profilo — Project: Traceback",
};

export default function ProfiloPage() {
  return (
    <>
      <Nav />
      <ProfileDashboard />
    </>
  );
}
