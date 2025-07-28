"use client";

import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function LayoutInner({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  return (
    <main className="flex h-screen">
      {!loading && user && <Navbar />}
      
      <div className="main-container flex-1 p-6 overflow-auto">
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
    <html lang="en">
      <body>
        <AuthProvider>
          <LayoutInner>{children}</LayoutInner>
        </AuthProvider>
      </body>
    </html>
  );
}
