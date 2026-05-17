import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import InstalarApp from "@/components/InstalarApp";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const BASE_URL = "https://bicoai.com.br";

export const metadata: Metadata = {
  title: "Bico AI — Resolve rápido, sempre perto de você",
  description:
    "Encontre prestadores de serviço perto de você ou ofereça seus serviços. Contrato digital, pagamento seguro via Pix.",
  manifest: "/manifest.json",
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: BASE_URL,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Bico AI",
  },
  icons: {
    apple: "/logo.png",
  },
  openGraph: {
    title: "Bico AI",
    description: "Resolve rápido, sempre perto de você.",
    url: BASE_URL,
    type: "website",
    images: [{ url: "/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bico AI",
    description: "Resolve rápido, sempre perto de você.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD11A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegistrar />
        <InstalarApp />
      </body>
    </html>
  );
}
