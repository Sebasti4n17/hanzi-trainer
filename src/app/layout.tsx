import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hanzi Trainer",
  description: "Plataforma de práctica de Hanzi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 🔹 Navbar */}
        <nav className="bg-blue-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">📖 Hanzi Trainer</h1>
            <div className="flex space-x-6">
              <Link href="/" className="hover:underline">🏠 Home</Link>
              <Link href="/resultados" className="hover:underline">📊 Resultados</Link>
              <Link href="/revisar-sesion" className="hover:underline">📂 Revisar Sesión</Link>
            </div>
          </div>
        </nav>

        {/* 🔹 Contenido de la Página */}
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
