import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const mangoGrotesque = localFont({
  src: '../../public/fonts/MangoGrotesque-Bold.woff2',
  variable: '--font-mango',
  weight: '700',
});

const spaceMono = localFont({
  src: [
    {
      path: '../../public/fonts/space-mono-400-normal.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/space-mono-700-normal.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-space-mono',
});

const syne = localFont({
  src: '../../public/fonts/syne-variable.woff2',
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: "Javin Trivedi — Web Developer, Cloud & Design",
  description: "Portfolio of Javin Trivedi — full-stack developer, cloud architect, and designer based in Chennai, India.",
  keywords: ["Javin Trivedi", "portfolio", "web developer", "cloud architect", "React", "Next.js", "AWS"],
  authors: [{ name: "Javin Trivedi" }],
  openGraph: {
    title: "Javin Trivedi — Web Developer, Cloud & Design",
    description: "Portfolio of Javin Trivedi — full-stack developer, cloud architect, and designer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mangoGrotesque.variable} ${spaceMono.variable} ${syne.variable}`}
    >
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {children}
      </body>
    </html>
  );
}
