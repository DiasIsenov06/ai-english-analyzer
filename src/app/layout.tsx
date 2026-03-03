import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Nav from "@/components/Nav";

const manrope = Manrope({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: "AI English Learning Personal Analyzer",
  description: "AI-анализ английского языка в реальном времени",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.className} antialiased bg-bg-light min-h-screen`}>
        <AuthProvider>
          <Nav />
          <main className="pt-20">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
