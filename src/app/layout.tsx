import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Campus360 — Toda tu universidad, en un lugar",
    template: "%s · Campus360",
  },
  description: "Plataforma de acompañamiento universitario — Universidad Fidélitas. Tutorías, eventos, TCU, tesis, agenda y asistente IA en un solo lugar.",
  applicationName: "Campus360",
  manifest: "/manifest.json",
  openGraph: {
    title: "Campus360 — Toda tu universidad, en un lugar",
    description: "Plataforma de acompañamiento universitario de la Universidad Fidélitas.",
    siteName: "Campus360",
    locale: "es_CR",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2B6477",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..600&family=Hanken+Grotesk:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
