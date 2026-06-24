import Nav from "@/components/Nav";
import ShopClient from "@/components/ShopClient";

export const metadata = { title: "Shop — Project: Traceback" };

export default function ShopPage() {
  return (
    <>
      <Nav />
      {/* bg-white copre il marble fisso del root layout */}
      <div className="min-h-screen bg-white">
        <ShopClient />
      </div>
    </>
  );
}
