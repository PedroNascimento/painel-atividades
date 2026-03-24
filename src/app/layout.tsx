import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Painel de Atividades",
  description: "Painel de planejamento de atividades do Quórum",
  metadataBase: new URL("https://dashboard-quorum.vercel.app/"),
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Atividades",
  },
  openGraph: {
    title: "Painel de Atividades do Quórum",
    description: "Acompanhamento, estatísticas e planejamento para atividades do Quórum.",
    url: "https://dashboard-quorum.vercel.app/",
    siteName: "Painel de Atividades",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "Ícone do Painel de Atividades",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Painel de Atividades do Quórum",
    description: "Acompanhamento, estatísticas e planejamento para atividades do Quórum.",
    images: ["/icon-512.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
