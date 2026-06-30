import type { Metadata } from "next";
import Nav from "@/components/Nav";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Accedi — Project: Traceback",
};

export default function LoginPage() {
  return (
    <>
      <Nav />
      <LoginForm />
    </>
  );
}
