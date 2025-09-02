import { FaInstagram, FaFacebook } from "react-icons/fa";

/**
 * Footer Component
 *
 * Purpose
 * -------
 * Display a simple site footer with copyright text
 * and social media links.
 *
 * Behavior
 * --------
 * - Shows a copyright line.
 * - Displays Instagram and Facebook icons with hover colors.
 * - Links open in a new tab with proper `rel` attributes for security.
 *
 * Returns
 * -------
 * JSX.Element
 *   A responsive footer with centered text and social links.
 */
export default function Footer() {
  return (
    <footer className="bg-black text-white p-6 text-center">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Left: copyright */}
        <p className="text-sm">© 2025 MrK. All rights reserved.</p>

        {/* Right: social links */}
        <div className="flex gap-4 text-lg">
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-pink-500 transition"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-500 transition"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}
