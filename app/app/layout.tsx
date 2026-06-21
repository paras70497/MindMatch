import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "MindMatch — Discover Your Compatibility",
    template: "%s | MindMatch",
  },
  description:
    "MindMatch is a real-time compatibility game for two people. Answer questions separately, compare thinking styles, and discover your Mind Match Score.",
  keywords: ["compatibility", "personality", "game", "quiz", "relationship", "friends"],
  openGraph: {
    title: "MindMatch — Discover Your Compatibility",
    description: "Real-time compatibility game. Answer questions, compare minds, reveal your score.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-inter antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
