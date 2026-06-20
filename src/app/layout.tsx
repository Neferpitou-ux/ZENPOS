import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ZENPOS - FEE Massage Group",
  description: "Cloud-Based POS & Inventory Management System for FEE Massage Group.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
