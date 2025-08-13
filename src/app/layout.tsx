"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Josefin_Sans } from "next/font/google";
import { useState } from "react";
import { HiMenuAlt3 } from "react-icons/hi";

const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <main className={`flex h-screen`}>
      {!loading && user && (
        <>
          {/* Mobile Menu Button */}
          <button
            onClick={() => setNavOpen(true)}
            className="lg:hidden p-4 absolute top-2 right-2 z-50 bg-gray-800 text-white rounded-lg shadow-md"
          >
            <HiMenuAlt3 size={24} />
          </button>

          <Navbar isOpen={navOpen} onClose={() => setNavOpen(false)} />
        </>
      )}

      <div className="main-container flex-1 p-6 overflow-auto w-full">
        {children}
      </div>
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
