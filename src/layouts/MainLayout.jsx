"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AccessGate from "@/components/AccessGate";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-blush-50">
      <Navbar />
      <main className="flex-1">
        <AccessGate>{children}</AccessGate>
      </main>
      <Footer />
    </div>
  );
}
