"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Josefin_Sans } from "next/font/google";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // choose weights you need
  display: "swap",
});
function LayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <main className={`flex h-screen `}>
      {!loading && user && <Navbar />}

      <div className="main-container flex-1 p-6 overflow-auto">{children}</div>
    </main>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={josefin.className}>
      <body>
        <AuthProvider>
          <LayoutInner>{children}</LayoutInner>
        </AuthProvider>
      </body>
    </html>
  );
}
