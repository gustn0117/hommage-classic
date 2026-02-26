"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  artists,
  notices,
  companyInfo,
  auditionInfo,
  heroVideo,
} from "@/data/siteData";

const NAV_ITEMS = [
  { id: "home", label: "HOME" },
  { id: "artists", label: "ARTISTS" },
  { id: "notice", label: "NOTICE" },
  { id: "audition", label: "AUDITION" },
  { id: "contact", label: "CONTACT" },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    const children = el.querySelectorAll(".reveal");
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState<number | null>(null);
  const revealRef = useReveal();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const y = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: id === "home" ? 0 : y, behavior: "smooth" });
    }
  }, []);

  return (
    <div ref={revealRef}>
      {/* Navigation */}
      <nav className={`nav-fixed ${scrolled ? "nav-scrolled" : ""}`}>
        <div
          className="section-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "72px",
          }}
        >
          <button
            onClick={() => scrollTo("home")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-primary)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "4px",
            }}
          >
            MOOD K
          </button>

          {/* Desktop nav */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              alignItems: "center",
            }}
            className="desktop-nav"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="nav-link"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="mobile-hamburger"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "none",
              flexDirection: "column",
              gap: "5px",
              padding: "8px",
            }}
          >
            <span
              style={{
                width: "20px",
                height: "1px",
                background: "var(--color-text-secondary)",
                display: "block",
              }}
            />
            <span
              style={{
                width: "20px",
                height: "1px",
                background: "var(--color-text-secondary)",
                display: "block",
              }}
            />
            <span
              style={{
                width: "20px",
                height: "1px",
                background: "var(--color-text-secondary)",
                display: "block",
              }}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: "absolute",
              top: "24px",
              right: "24px",
              background: "none",
              border: "none",
              color: "var(--color-text-secondary)",
              fontSize: "24px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="hero-section">
        {heroVideo.url ? (
          heroVideo.type === "youtube" ? (
            <iframe
              className="hero-video"
              src={`${heroVideo.url}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              style={{ border: "none", pointerEvents: "none" }}
            />
          ) : (
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              src={heroVideo.url}
            />
          )
        ) : (
          <div
            className="hero-video"
            style={{
              background:
                "linear-gradient(135deg, #1a1410 0%, #2a2118 30%, #3a2e22 60%, #1a1410 100%)",
            }}
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">MOOD K</h1>
          <h2 className="hero-subtitle-en">ENTERTAINMENT</h2>
          <div className="hero-divider" />
          <p className="hero-description">
            배우의 가능성을 발굴하고, 진정성 있는 연기로
            <br />
            감동을 전하는 매니지먼트 회사입니다.
            <br />
            한 사람 한 사람의 개성과 이야기를 존중하며,
            <br />
            함께 성장하는 파트너가 되겠습니다.
          </p>
        </div>
        <div className="scroll-indicator">
          <svg
            width="20"
            height="30"
            viewBox="0 0 20 30"
            fill="none"
            stroke="var(--color-text-muted)"
            strokeWidth="1.5"
          >
            <rect x="1" y="1" width="18" height="28" rx="9" />
            <line x1="10" y1="6" x2="10" y2="12">
              <animate
                attributeName="opacity"
                values="1;0;1"
                dur="2s"
                repeatCount="indefinite"
              />
            </line>
          </svg>
        </div>
      </section>

      {/* Artists Section */}
      <section
        id="artists"
        style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}
      >
        <div className="section-container">
          <div className="reveal">
            <h2 className="section-title">Artists</h2>
          </div>

          {artists.map((artist) => (
            <div key={artist.id}>
              {/* Artist Name */}
              <div className="reveal" style={{ marginBottom: "56px" }}>
                <div className="artist-name-en">{artist.nameEn}</div>
                <div className="artist-name-ko">{artist.nameKo}</div>
              </div>

              {/* Profile Grid */}
              <div className="artist-profile-grid">
                {/* Main Photo */}
                <div className="reveal">
                  <div
                    className="artist-main-photo img-placeholder"
                    style={{ borderRadius: "4px" }}
                  >
                    PROFILE PHOTO
                  </div>
                </div>

                {/* Info */}
                <div className="reveal reveal-delay-1">
                  <div className="artist-info-grid">
                    <div className="artist-info-cell">
                      <div className="artist-info-label">Birth</div>
                      <div className="artist-info-value">
                        {artist.birthDate}
                      </div>
                    </div>
                    <div className="artist-info-cell">
                      <div className="artist-info-label">Height</div>
                      <div className="artist-info-value">{artist.height}</div>
                    </div>
                    <div className="artist-info-cell">
                      <div className="artist-info-label">Weight</div>
                      <div className="artist-info-value">{artist.weight}</div>
                    </div>
                    <div className="artist-info-cell">
                      <div className="artist-info-label">Specialty</div>
                      <div className="artist-info-value">
                        {artist.specialty}
                      </div>
                    </div>
                  </div>

                  {/* Filmography */}
                  <div>
                    <h3 className="filmography-header">Filmography</h3>
                    <table className="filmography-table">
                      <thead>
                        <tr>
                          <th style={{ width: "60px" }}>Year</th>
                          <th style={{ width: "80px" }}>Type</th>
                          <th>Title</th>
                          <th style={{ width: "120px" }}>Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {artist.filmography.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.year}</td>
                            <td>{item.category}</td>
                            <td style={{ color: "var(--color-text-primary)" }}>
                              {item.title}
                            </td>
                            <td>{item.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Photo Gallery */}
              <div className="artist-photo-grid">
                {artist.photos.map((_, idx) => (
                  <div
                    key={idx}
                    className={`artist-photo-thumb img-placeholder reveal reveal-delay-${Math.min(idx + 1, 3)}`}
                  >
                    PHOTO {idx + 1}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Notice Section */}
      <section
        id="notice"
        style={{ padding: "120px 0", background: "var(--color-bg-secondary)" }}
      >
        <div className="section-container">
          <div className="reveal">
            <h2 className="section-title">Notice</h2>
          </div>

          <div className="reveal">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="notice-item"
                onClick={() =>
                  setOpenNotice(openNotice === notice.id ? null : notice.id)
                }
              >
                <div className="notice-date">{notice.date}</div>
                <div className="notice-title-text">{notice.title}</div>
                <svg
                  className={`notice-chevron ${openNotice === notice.id ? "open" : ""}`}
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
                <div
                  className={`notice-content ${openNotice === notice.id ? "open" : ""}`}
                >
                  <div className="notice-content-inner">{notice.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Audition Section */}
      <section
        id="audition"
        style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}
      >
        <div className="section-container">
          <div className="reveal">
            <h2 className="section-title">Audition</h2>
          </div>

          <div className="audition-grid">
            {/* Online */}
            <div className="audition-card reveal">
              <h3 className="audition-card-title">
                {auditionInfo.online.title}
              </h3>
              <p className="audition-card-desc">
                {auditionInfo.online.description}
              </p>
              <div className="audition-email">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
                {auditionInfo.online.email}
              </div>
              <ul className="audition-req-list">
                {auditionInfo.online.requirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>

            {/* Offline */}
            <div className="audition-card reveal reveal-delay-1">
              <h3 className="audition-card-title">
                {auditionInfo.offline.title}
              </h3>
              <p className="audition-card-desc">
                {auditionInfo.offline.description}
              </p>
              <p
                style={{
                  marginTop: "24px",
                  fontSize: "13px",
                  color: "var(--color-accent)",
                  fontStyle: "italic",
                }}
              >
                {auditionInfo.offline.note}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Contact Section */}
      <section
        id="contact"
        style={{ padding: "120px 0", background: "var(--color-bg-secondary)" }}
      >
        <div className="section-container">
          <div className="reveal">
            <h2 className="section-title">Contact</h2>
          </div>

          <div className="contact-grid">
            <div className="reveal">
              <div className="contact-info-item">
                <div className="contact-info-label">Company</div>
                <div className="contact-info-value">
                  {companyInfo.nameKo}
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Address</div>
                <div className="contact-info-value">{companyInfo.address}</div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-muted)",
                    marginTop: "4px",
                  }}
                >
                  {companyInfo.addressDetail}
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Phone</div>
                <div className="contact-info-value">{companyInfo.phone}</div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">{companyInfo.email}</div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Business No.</div>
                <div className="contact-info-value">
                  {companyInfo.businessNumber}
                </div>
              </div>
            </div>

            <div className="reveal reveal-delay-1">
              <div className="contact-map-placeholder">
                지도 영역 (추후 Google Maps 삽입)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <p className="footer-text">
            &copy; 2026 {companyInfo.name}. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
