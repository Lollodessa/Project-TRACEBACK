export type Size = "S" | "M" | "L" | "XL";

export interface ColorVariant {
  colorName: string;
  colorHex: string;
  images: string[];   // seed picsum per ora; diventeranno path /public con le foto vere
  sizes: Size[];
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  variants: ColorVariant[];
}

export const products: Product[] = [
  {
    id: "tb-core-tee",
    name: "TB Core Tee",
    description:
      "La maglia fondamentale del brand. Cotone pesante 240gsm, vestibilità oversize. Cuciture a contrasto e logo TB ricamato sul petto. Lavabile in lavatrice a 30°.",
    price: 49,
    originalPrice: 59,
    variants: [
      {
        colorName: "Nero",
        colorHex: "#111111",
        images: ["tb-core-tee-nero-a", "tb-core-tee-nero-b", "tb-core-tee-nero-c"],
        sizes: ["S", "M", "L", "XL"],
        inStock: true,
      },
      {
        colorName: "Bianco",
        colorHex: "#e8e8e8",
        images: ["tb-core-tee-bianco-a", "tb-core-tee-bianco-b", "tb-core-tee-bianco-c"],
        sizes: ["M", "L"],
        inStock: true,
      },
      {
        colorName: "Grigio",
        colorHex: "#888888",
        images: ["tb-core-tee-grigio-a", "tb-core-tee-grigio-b", "tb-core-tee-grigio-c"],
        sizes: ["S", "M", "L", "XL"],
        inStock: false,
      },
    ],
  },
  {
    id: "origin-tee",
    name: "Origin Tee",
    description:
      "Silhouette pulita, grafica minimal. Cotone pettinato 180gsm. Stampa serigrafata fronte e retro con inchiostri ad acqua. Drop fit leggermente allungato.",
    price: 49,
    originalPrice: 59,
    variants: [
      {
        colorName: "Grigio",
        colorHex: "#999999",
        images: ["origin-tee-grigio-a", "origin-tee-grigio-b", "origin-tee-grigio-c"],
        sizes: ["S", "M", "L", "XL"],
        inStock: true,
      },
      {
        colorName: "Beige",
        colorHex: "#d4c5a9",
        images: ["origin-tee-beige-a", "origin-tee-beige-b", "origin-tee-beige-c"],
        sizes: ["S", "M", "L"],
        inStock: true,
      },
    ],
  },
  {
    id: "marble-logo-tee",
    name: "Marble Logo Tee",
    description:
      "Tee iconica con grafica marble in rilievo stampata a serigrafia. Edizione limitata. Jersey pesante 220gsm preshrunk. Non è previsto un secondo drop.",
    price: 49,
    originalPrice: 59,
    variants: [
      {
        colorName: "Nero",
        colorHex: "#111111",
        images: ["marble-logo-tee-nero-a", "marble-logo-tee-nero-b", "marble-logo-tee-nero-c"],
        sizes: ["M", "L", "XL"],
        inStock: true,
      },
      {
        colorName: "Bianco",
        colorHex: "#e8e8e8",
        images: ["marble-logo-tee-bianco-a", "marble-logo-tee-bianco-b", "marble-logo-tee-bianco-c"],
        sizes: ["L", "XL"],
        inStock: false,
      },
    ],
  },
  {
    id: "archive-tee-vol1",
    name: "Archive Tee Vol.1",
    description:
      "Prima uscita dell'archivio Traceback. Grafica a 3 colori stampata su base scura. Edizione numerata, ogni pezzo è certificato. Taglio boxy oversize.",
    price: 49,
    originalPrice: 59,
    variants: [
      {
        colorName: "Nero",
        colorHex: "#111111",
        images: ["archive-tee-nero-a", "archive-tee-nero-b", "archive-tee-nero-c"],
        sizes: ["S", "M", "L"],
        inStock: true,
      },
      {
        colorName: "Beige",
        colorHex: "#d4c5a9",
        images: ["archive-tee-beige-a", "archive-tee-beige-b", "archive-tee-beige-c"],
        sizes: ["S", "M"],
        inStock: true,
      },
    ],
  },
  {
    id: "crack-pattern-tee",
    name: "Crack Pattern Tee",
    description:
      "Pattern crack all-over stampato in serigrafia con sovrapposizione di layer. Drop fit. Jersey 200gsm preshrunk. Effetto vissuto garantito dal processo di stampa.",
    price: 49,
    originalPrice: 59,
    variants: [
      {
        colorName: "Grigio",
        colorHex: "#999999",
        images: ["crack-pattern-tee-grigio-a", "crack-pattern-tee-grigio-b", "crack-pattern-tee-grigio-c"],
        sizes: ["M", "L", "XL"],
        inStock: true,
      },
      {
        colorName: "Beige",
        colorHex: "#d4c5a9",
        images: ["crack-pattern-tee-beige-a", "crack-pattern-tee-beige-b", "crack-pattern-tee-beige-c"],
        sizes: ["S", "M", "L"],
        inStock: true,
      },
      {
        colorName: "Nero",
        colorHex: "#111111",
        images: ["crack-pattern-tee-nero-a", "crack-pattern-tee-nero-b", "crack-pattern-tee-nero-c"],
        sizes: ["M", "L"],
        inStock: false,
      },
    ],
  },
];
