import Link from "next/link";
import { Lock, Shield, Github, Twitter, Mail, KeyRound } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-20 border-t border-white/10 bg-[#0a0a0f]">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <KeyRound className="w-5 h-5 text-purple-400" />
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                My-Passwords
              </span>
            </div>
            <p className="text-sm text-gray-400 max-w-sm">
              Your passwords and cards are encrypted client-side with your
              master password. We never see your data — not even we can
              access your vault.
            </p>
            <div className="flex gap-2 mt-4">
              <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Lock className="w-3 h-3" /> AES-256
              </span>
              <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                <Shield className="w-3 h-3" /> Zero-Knowledge
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-purple-400 transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-purple-400 transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-purple-400 transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal + socials */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400 mb-5">
              <li>
                <Link href="/privacy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-purple-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
            <div className="flex gap-3">
              <a
                href="https://github.com/junaids79/Password-Manager"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@my-passwords.app"
                className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-300 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-500">
            © {year} My-Passwords. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Lock className="w-3 h-3 text-purple-400" />
            Built with client-side encryption. Your data, your key, always.
          </p>
        </div>
      </div>
    </footer>
  );
}