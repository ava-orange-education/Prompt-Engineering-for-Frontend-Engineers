import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "React server components + Actions example",
  description: "From the book, Chapter 2 — React's Server Components and Actions API",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
