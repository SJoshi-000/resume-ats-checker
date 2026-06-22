/**
 * App footer with branding button, name, and email.
 * Responsive layout that stacks cleanly on mobile.
 */
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.04] mt-16" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex flex-col items-center gap-5 sm:gap-6">
        {/* Branding button */}
        <a
          id="hero-link"
          href="https://digitalheroesco.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all duration-300"
          aria-label="Visit Digital Heroes website (opens in new tab)"
        >
          <span className="text-sm font-semibold text-gradient group-hover:opacity-90 transition-opacity">
            Built for Digital Heroes
          </span>
          <svg
            className="w-4 h-4 text-violet-400 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-4.5-6H18m0 0v4.5m0-4.5L10.5 13.5" />
          </svg>
        </a>

        {/* Attribution */}
        <div className="flex flex-col items-center gap-1 sm:gap-1.5 text-center">
          <p className="text-sm font-medium text-gray-300">
            Shaurya Joshi
          </p>
          <p className="text-xs text-gray-500 break-all sm:break-normal">
            Joshishaurya000@gmail.com
          </p>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-600 text-center">
          © {new Date().getFullYear()} Resume ATS Checker. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
