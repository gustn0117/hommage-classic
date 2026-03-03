"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { CompanyInfo, AuditionInfo, HeroVideo } from "@/lib/types";

interface Artist {
  id: string;
  name_ko: string;
  name_en: string;
  birth_date: string;
  height: string;
  weight: string;
  specialty: string;
  profile_image: string;
  photos: string[];
  filmography: { year: string; category: string; title: string; role: string }[];
}

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface Props {
  artists: Artist[];
  notices: Notice[];
  companyInfo: CompanyInfo;
  auditionInfo: AuditionInfo;
  heroVideo: HeroVideo;
}

const NAV_ITEMS = [
  { id: "home", label: "HOME" },
  { id: "artists", label: "ARTISTS" },
  { id: "notice", label: "NOTICE" },
  { id: "audition", label: "AUDITION" },
  { id: "contact", label: "CONTACT" },
];

const SECTION_IDS = ["home", "artists", "notice", "audition", "contact"];

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

    const revealSelectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur";
    const children = el.querySelectorAll(revealSelectors);
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

function useScrollSpy() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

export default function HomeClient({ artists, notices, companyInfo, auditionInfo, heroVideo }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState<number | null>(null);
  const revealRef = useReveal();
  const activeSection = useScrollSpy();

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
        <div className="section-container">
          <div className="nav-inner">
            <button onClick={() => scrollTo("home")} className="nav-logo">
              MOOD K
            </button>

            <div
              style={{ display: "flex", gap: "40px", alignItems: "center" }}
              className="desktop-nav"
            >
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`nav-link ${activeSection === item.id ? "nav-active" : ""}`}
                >
                  {item.label}
                </button>
              ))}
            </div>

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
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: "20px",
                    height: "1px",
                    background: "var(--color-text-secondary)",
                    display: "block",
                  }}
                />
              ))}
            </button>
          </div>
        </div>
      </nav>

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
            <video className="hero-video" autoPlay muted loop playsInline src={heroVideo.url} />
          )
        ) : (
          <div className="hero-video hero-gradient-bg" />
        )}
        <div className="hero-bg-grain" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">MOOD K ENTERTAINMENT</h1>
          <p className="hero-tagline">Management with Intention.</p>
          <div className="hero-divider" />
          <p className="hero-description">
            MOOD K ENTERTAINMENT는
            <br />
            배우의 장기적 커리어를 설계합니다.
          </p>
          <p className="hero-description hero-description-sub">
            작품 선택과 이미지 방향성을 기반으로
            <br />
            지속 가능한 활동을 관리합니다.
          </p>
        </div>
        <button className="scroll-indicator" onClick={() => scrollTo("artists")} aria-label="Scroll down">
          <span className="scroll-indicator-text">SCROLL</span>
          <span className="scroll-indicator-line" />
          <svg className="scroll-indicator-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </section>

      {/* Artists Section */}
      <section id="artists" className="section-glow" style={{ padding: "140px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">01</span>
              <h2 className="section-title">Artists</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          {artists.map((artist) => (
            <div key={artist.id} className="artist-block">
              <div className="reveal-left">
                <div className="artist-name-wrap">
                  <div className="artist-name-en">{artist.name_en}</div>
                  <div className="artist-name-ko">{artist.name_ko}</div>
                </div>
              </div>

              <div className="artist-profile-grid">
                <div className="reveal-scale">
                  {artist.profile_image ? (
                    <img
                      className="artist-main-photo"
                      src={artist.profile_image}
                      alt={artist.name_ko}
                    />
                  ) : (
                    <div className="artist-main-photo img-placeholder">
                      PROFILE PHOTO
                    </div>
                  )}
                </div>

                <div className="reveal-right reveal-delay-1">
                  <div className="artist-info-single">
                    <div className="artist-info-cell">
                      <div className="artist-info-label">Birth</div>
                      <div className="artist-info-value">{artist.birth_date}</div>
                    </div>
                  </div>

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
                            <td style={{ color: "var(--color-text-primary)" }}>{item.title}</td>
                            <td>{item.role}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {artist.photos.length > 0 && (
                <div className="artist-photo-grid">
                  {artist.photos.map((url, idx) => (
                    <div key={idx} className={`artist-photo-thumb reveal-scale reveal-delay-${Math.min(idx + 1, 3)}`}>
                      <img src={url} alt={`${artist.name_ko} photo ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      {/* Notice Section */}
      <section id="notice" style={{ padding: "140px 0", background: "var(--color-bg-secondary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">02</span>
              <h2 className="section-title">Notice</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          <div className="reveal">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="notice-item"
                onClick={() => setOpenNotice(openNotice === notice.id ? null : notice.id)}
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
                <div className={`notice-content ${openNotice === notice.id ? "open" : ""}`}>
                  <div className="notice-content-inner">{notice.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Audition Section */}
      <section id="audition" className="section-glow" style={{ padding: "140px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">03</span>
              <h2 className="section-title">Audition</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          {/* Intro */}
          <div className="audition-intro reveal">
            <p className="audition-intro-text">
              MOOD K ENTERTAINMENT는
              <br />
              아티스트의 현재보다 앞으로의 여정을 더 중요하게 생각합니다.
            </p>
            <p className="audition-intro-text audition-intro-sub">
              우리는 가능성을 서두르지 않습니다.
              <br />
              한 사람의 방향과 시간을 충분히 바라본 후, 신중하게 결정합니다.
            </p>
          </div>

          {/* How to Apply */}
          <div className="audition-section-block reveal reveal-delay-1">
            <h3 className="audition-block-title">오디션 지원 방법</h3>

            <div className="audition-apply-grid">
              <div className="audition-apply-card">
                <div className="audition-apply-label">제출 자료</div>
                <ul className="audition-apply-list">
                  <li>일반 사진 (정면 및 측면 각 1장)</li>
                  <li>1분 이내 자기소개 영상</li>
                  <li>프로필 PDF 1부 또는 연기 영상 (경력자 해당)</li>
                  <li>활동 경력 사항 (경력자 해당)</li>
                </ul>
              </div>

              <div className="audition-apply-card">
                <div className="audition-apply-label">접수 방법</div>
                <ol className="audition-apply-steps">
                  <li>위 자료를 이메일로 제출</li>
                  <li>이메일 제목: <strong>MOOD K AUDITION / 이름 / 출생연도</strong></li>
                  <li>서류 검토 후, 합격자에 한해 2주 이내 개별 연락드립니다.</li>
                </ol>
              </div>
            </div>

            <a href={`mailto:${auditionInfo.online.email}`} className="audition-email-block reveal-scale">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
              <span>{auditionInfo.online.email}</span>
            </a>
          </div>

          {/* Privacy Note */}
          <div className="audition-privacy reveal reveal-delay-2">
            <p>
              제출된 모든 자료는 신중히 검토되며, 오디션 심사 목적 외 사용되지 않습니다.
              <br />
              심사 종료 후 안전하게 관리됩니다.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Contact Section */}
      <section id="contact" style={{ padding: "140px 0", background: "var(--color-bg-secondary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">04</span>
              <h2 className="section-title">Contact</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          <div className="contact-grid">
            <div className="reveal-left">
              <div className="contact-info-item">
                <div className="contact-info-label">Company</div>
                <div className="contact-info-value">{companyInfo.nameKo}</div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Address</div>
                <div>
                  <div className="contact-info-value">{companyInfo.address}</div>
                  <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
                    {companyInfo.addressDetail}
                  </div>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Email</div>
                <div className="contact-info-value">{companyInfo.email}</div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Business No.</div>
                <div className="contact-info-value">{companyInfo.businessNumber}</div>
              </div>
            </div>

            <div className="reveal-right reveal-delay-1">
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
          <div className="footer-divider" />
          <p className="footer-text">
            &copy; 2026 {companyInfo.name}. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
