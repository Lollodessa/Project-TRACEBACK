import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import ProductDetail from "@/components/ProductDetail";
import { products } from "@/lib/products";

export function generateStaticParams() {
  return products.map(p => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  return {
    title: product
      ? `${product.name} — Project: Traceback`
      : "Prodotto non trovato — Project: Traceback",
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find(p => p.id === id);
  if (!product) notFound();

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-white">
        <ProductDetail product={product} />
      </div>
    </>
  );
}
