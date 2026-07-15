"use client";

import { Heart, Home, Search } from "lucide-react";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 bg-blush-50">
      <span className="w-16 h-16 rounded-full bg-gradient-to-br from-maroon-500 to-rose-500 flex items-center justify-center text-white mb-6">
        <Heart size={26} fill="white" />
      </span>
      <p className="font-display text-6xl sm:text-7xl font-bold text-maroon-500 mb-2">404</p>
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 mb-3">
        Page Not Found
      </h1>
      <p className="text-ink-600 text-sm max-w-md mb-8">
        The page you're looking for doesn't exist or may have been moved.
        Let's get you back on track.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button to="/">
          <Home size={16} /> Back To Home
        </Button>
        <Button to="/search" variant="outline">
          <Search size={16} /> Search Profiles
        </Button>
      </div>
    </div>
  );
}
