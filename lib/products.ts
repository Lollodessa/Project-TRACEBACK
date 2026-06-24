export type Size = "S" | "M" | "L" | "XL";
export type ProductColor = "Nero" | "Bianco" | "Grigio" | "Beige";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;  // se presente, il prezzo è in sconto
  image: string;
  sizes: Size[];
  color: ProductColor;
  inStock: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: "tb-core-tee-nero",
    name: "TB Core Tee",
    price: 49,
    originalPrice: 59,
    image: "/products/tb-core-tee-nero.jpg",
    sizes: ["S", "M", "L", "XL"],
    color: "Nero",
    inStock: true,
    description: "La maglia fondamentale del brand. Cotone pesante 240gsm, vestibilità oversize.",
  },
  {
    id: "tb-core-tee-bianco",
    name: "TB Core Tee",
    price: 49,
    originalPrice: 59,
    image: "/products/tb-core-tee-bianco.jpg",
    sizes: ["M", "L"],
    color: "Bianco",
    inStock: true,
    description: "La maglia fondamentale del brand. Cotone pesante 240gsm, vestibilità oversize.",
  },
  {
    id: "origin-tee-grigio",
    name: "Origin Tee",
    price: 49,
    originalPrice: 59,
    image: "/products/origin-tee-grigio.jpg",
    sizes: ["S", "M", "L", "XL"],
    color: "Grigio",
    inStock: true,
    description: "Silhouette pulita, grafica minimal. Cotone pettinato 180gsm.",
  },
  {
    id: "marble-logo-tee-bianco",
    name: "Marble Logo Tee",
    price: 49,
    originalPrice: 59,
    image: "/products/marble-logo-tee-bianco.jpg",
    sizes: ["L", "XL"],
    color: "Bianco",
    inStock: false,
    description: "Tee iconica con logo marble in rilievo. Edizione limitata, esaurita.",
  },
  {
    id: "traceback-vintage-tee-beige",
    name: "Traceback Vintage Tee",
    price: 49,
    originalPrice: 59,
    image: "/products/traceback-vintage-tee-beige.jpg",
    sizes: ["S", "M"],
    color: "Beige",
    inStock: true,
    description: "Stampa distressed vintage su cotone lavato. Taglio boxy.",
  },
  {
    id: "archive-tee-nero",
    name: "Archive Tee Vol.1",
    price: 49,
    originalPrice: 59,
    image: "/products/archive-tee-nero.jpg",
    sizes: ["S", "M", "L"],
    color: "Nero",
    inStock: true,
    description: "Prima uscita dell'archivio Traceback. Grafica a 3 colori su base nera.",
  },
  {
    id: "crack-pattern-tee-grigio",
    name: "Crack Pattern Tee",
    price: 49,
    originalPrice: 59,
    image: "/products/crack-pattern-tee-grigio.jpg",
    sizes: ["M", "L", "XL"],
    color: "Grigio",
    inStock: true,
    description: "Pattern crack all-over su jersey pesante. Drop fit.",
  },
  {
    id: "tb-statement-tee-beige",
    name: "TB Statement Tee",
    price: 49,
    originalPrice: 59,
    image: "/products/tb-statement-tee-beige.jpg",
    sizes: ["S", "M", "L", "XL"],
    color: "Beige",
    inStock: false,
    description: "Statement piece della stagione. Testo bold su fronte e retro.",
  },
];
