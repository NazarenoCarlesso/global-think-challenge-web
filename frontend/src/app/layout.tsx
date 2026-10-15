import type { Metadata } from "next";
import "./globals.css";
import "./design.css";
import { ProductsProvider } from "@/context/ProductsContext";

export const metadata: Metadata = {
  title: "Global Think Store",
  description: "Tienda de artículos de electrónica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </body>
    </html>
  );
}
