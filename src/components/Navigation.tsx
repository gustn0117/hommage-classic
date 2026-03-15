"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/collection", label: "COLLECTION" },
  { href: "/about", label: "ABOUT" },
  { href: "/notice", label: "NOTICE" },
  { href: "/contact", label: "CONTACT" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`nav-fixed ${scrolled || !isHome ? "nav-scrolled" : ""}`}>
        <div className="section-container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo">
              HOMMAGE CLASSIC
            </Link>
            <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href ? "nav-active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <button
              className="mobile-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px", padding: "8px" }}
              aria-label="Menu"
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: "20px", height: "1px", background: (scrolled || !isHome) ? "var(--color-text-primary)" : "#f0ebe3", display: "block" }} />
              ))}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button onClick={() => setMobileMenuOpen(false)} style={{ position: "absolute", top: "24px", right: "24px", background: "none", border: "none", color: "#f0ebe3", fontSize: "24px", cursor: "pointer" }}>
            ✕
          </button>
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
