"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-20">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-50 text-red-600 border border-red-200 shadow-inner">
          <AlertCircle className="w-12 h-12" />
        </div>

        <div className="space-y-3">
          <span className="text-secondary font-bold text-sm tracking-widest uppercase">
            Unexpected Error
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-primary tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-foreground/70 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
            We encountered an unexpected issue while loading this page. Please try refreshing or return to the homepage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
          >
            <RefreshCw className="w-5 h-5 text-secondary" />
            Try Again
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-primary/20 bg-background text-primary font-semibold hover:bg-primary/5 transition-all"
          >
            <Home className="w-5 h-5 text-secondary" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
