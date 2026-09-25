import Link from "next/link";
import { Compass, Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-background px-4 py-20">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Decorative Badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-inner">
          <Compass className="w-12 h-12 text-secondary animate-pulse" />
        </div>

        <div className="space-y-3">
          <span className="text-secondary font-bold text-sm tracking-widest uppercase">
            Error 404
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading text-primary tracking-tight">
            Page Not Found
          </h1>
          <p className="text-foreground/70 text-lg leading-relaxed max-w-md mx-auto">
            The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
          >
            <Home className="w-5 h-5 text-secondary" />
            Back to Home
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-primary/20 bg-background text-primary font-semibold hover:bg-primary/5 transition-all"
          >
            <Mail className="w-5 h-5 text-secondary" />
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
