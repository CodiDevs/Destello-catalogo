import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Great_Vibes,
  Outfit,
} from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const script = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Destello · Everyday Essentials",
  description:
    "Catálogo boutique de carteras y termos. Destello Everyday Essentials.",
  icons: {
    icon: "/logo-destello.png",
  },
};

const themeBootScript = `
(function(){
  try {
    var t = localStorage.getItem('destello-theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      suppressHydrationWarning
      className={`${body.variable} ${display.variable} ${script.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
