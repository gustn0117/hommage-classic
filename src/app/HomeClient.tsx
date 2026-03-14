"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import type { CompanyInfo, BrandInfo, HeroVideo, SnsLinks } from "@/lib/types";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=))([^?&#]+)/);
  return m ? m[1] : null;
}

function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
  ));
}

interface Product {
  id: string;
  name_ko: string;
  name_en: string;
  birth_date: string; // used as category (e.g. "Reed Diffuser")
  height: string;
  weight: string;
  specialty: string; // used as short description
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
  products: Product[];
  notices: Notice[];
  companyInfo: CompanyInfo;
  brandInfo: BrandInfo;
  heroVideo: HeroVideo;
  snsLinks: SnsLinks;
}

const NAV_ITEMS = [
  { id: "home", label: "HOME" },
  { id: "collection", label: "COLLECTION" },
  { id: "about", label: "ABOUT" },
  { id: "notice", label: "NOTICE" },
  { id: "contact", label: "CONTACT" },
];

const SECTION_IDS = ["home", "collection", "about", "notice", "contact"];

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

export default function HomeClient({ products, notices, companyInfo, brandInfo, heroVideo, snsLinks }: Props) {
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
              HOMMAGE
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
        {(() => {
          const ytId = heroVideo?.type === "youtube" && heroVideo?.url ? getYouTubeId(heroVideo.url) : null;
          if (ytId) {
            return (
              <div className="hero-video hero-youtube-wrap">
                <iframe
                  className="hero-youtube-bg"
                  src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&playlist=${ytId}&modestbranding=1&iv_load_policy=3&disablekb=1`}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Hero background"
                />
              </div>
            );
          }
          if (heroVideo?.type === "local" && heroVideo?.url) {
            return <video className="hero-video hero-video-bg" autoPlay muted loop playsInline src={heroVideo.url} />;
          }
          return null;
        })()}
        <div className="hero-bg-grain" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">HOMMAGE</span>
            <br />
            <span className="hero-title-sub">CLASSIC</span>
          </h1>
          <p className="hero-tagline">Crafted with Sincere Hands</p>
          <div className="hero-divider" />
          <p className="hero-description">
            정직한 손으로 만들어진 향,
            <br />
            조용히 삶을 정돈하는 시간
          </p>
          <p className="hero-description hero-description-sub">
            가장 중요한 것, 나 자신에게
            <br />
            돌아가게 하는 향
          </p>
        </div>
        <button className="scroll-indicator" onClick={() => scrollTo("collection")} aria-label="Scroll down">
          <span className="scroll-indicator-text">SCROLL</span>
          <span className="scroll-indicator-line" />
          <svg className="scroll-indicator-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </section>

      {/* Collection Section */}
      <section id="collection" className="section-glow" style={{ padding: "140px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">01</span>
              <h2 className="section-title">Collection</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-block">
                <div className="reveal-left">
                  <div className="product-name-wrap">
                    <div className="product-name-en">{product.name_en}</div>
                    <div className="product-name-ko">{product.name_ko}</div>
                  </div>
                </div>

                <div className="product-profile-grid">
                  <div className="reveal-scale">
                    {product.profile_image ? (
                      <img
                        className="product-main-photo"
                        src={product.profile_image}
                        alt={product.name_ko}
                      />
                    ) : (
                      <div className="product-main-photo img-placeholder">
                        PRODUCT PHOTO
                      </div>
                    )}
                  </div>

                  <div className="reveal-right reveal-delay-1">
                    <div className="product-info-single">
                      <div className="product-info-cell">
                        <div className="product-info-label">Category</div>
                        <div className="product-info-value">{product.birth_date}</div>
                      </div>
                    </div>

                    {product.specialty && (
                      <div className="product-description-text">
                        {renderLines(product.specialty)}
                      </div>
                    )}

                    {product.filmography.length > 0 && (
                      <div>
                        <h3 className="product-detail-header">Details</h3>
                        <table className="product-detail-table">
                          <thead>
                            <tr>
                              <th style={{ width: "100px" }}>Type</th>
                              <th>Description</th>
                              <th style={{ width: "100px" }}>Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.filmography.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.category}</td>
                                <td style={{ color: "var(--color-text-primary)" }}>{item.title}</td>
                                <td>{item.role}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                {product.photos.length > 0 && (
                  <div className="product-photo-grid">
                    {product.photos.map((url, idx) => (
                      <div key={idx} className={`product-photo-thumb reveal-scale reveal-delay-${Math.min(idx + 1, 3)}`}>
                        <img src={url} alt={`${product.name_ko} photo ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            /* Default static collection when no DB products */
            <div className="collection-showcase">
              {[
                {
                  name: "REED DIFFUSER",
                  nameKo: "리드 디퓨저",
                  desc: "자연에서 영감을 받은 섬세한 향이\n공간을 조용히 채워갑니다.\n정직한 원료만을 담아 만든\n오마주클래식의 시그니처 디퓨저.",
                },
                {
                  name: "NATURAL SOAP",
                  nameKo: "내추럴 솝",
                  desc: "피부에 닿는 순간부터 다른 것을 느낄 수 있도록.\n식물성 오일과 천연 향료로 완성한\n부드럽고 깊은 세정의 경험.",
                },
                {
                  name: "GIFT SET",
                  nameKo: "기프트 세트",
                  desc: "소중한 사람에게 전하는 경의.\n정성스럽게 큐레이션한 향과 케어 아이템을\n하나의 세트로 담았습니다.",
                },
              ].map((item, idx) => (
                <div key={idx} className={`collection-card reveal-scale reveal-delay-${idx + 1}`}>
                  <div className="collection-card-image img-placeholder">
                    <span>{item.name}</span>
                  </div>
                  <div className="collection-card-info">
                    <div className="collection-card-name">{item.name}</div>
                    <div className="collection-card-name-ko">{item.nameKo}</div>
                    <p className="collection-card-desc">{renderLines(item.desc)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* About Section */}
      <section id="about" className="section-glow" style={{ padding: "140px 0", background: "var(--color-bg-secondary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">02</span>
              <h2 className="section-title">About</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          <div className="brand-story reveal">
            <p className="brand-story-text">
              {renderLines(brandInfo.introText1)}
            </p>
            <p className="brand-story-text brand-story-sub">
              {renderLines(brandInfo.introText2)}
            </p>
          </div>

          <div className="brand-philosophy reveal reveal-delay-1">
            <div className="brand-philosophy-grid">
              {brandInfo.values.map((value, i) => (
                <div key={i} className="brand-value-card">
                  <div className="brand-value-number">0{i + 1}</div>
                  <div className="brand-value-text">{value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="brand-slogan reveal reveal-delay-2">
            <blockquote className="brand-slogan-text">
              {renderLines(brandInfo.slogan)}
            </blockquote>
          </div>

          {brandInfo.email && (
            <a href={`mailto:${brandInfo.email}`} className="brand-email-block reveal-scale">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 4L12 13 2 4" />
              </svg>
              <span>{brandInfo.email}</span>
            </a>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* Notice Section */}
      <section id="notice" style={{ padding: "140px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">03</span>
              <h2 className="section-title">Notice</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          <div className="reveal">
            {notices.length > 0 ? (
              notices.map((notice) => (
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
                    <div className="notice-content-inner" style={{ whiteSpace: "pre-line" }}>{notice.content}</div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "14px", fontWeight: 300 }}>
                등록된 공지사항이 없습니다.
              </p>
            )}
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
                <div className="contact-info-label">Brand</div>
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
              <div className="contact-map-wrap">
                <iframe
                  className="contact-map"
                  src="https://maps.google.com/maps?q=%EA%B0%95%EB%82%A8%EA%B5%AC+%EB%85%BC%ED%98%84%EB%A1%9C+164%EA%B8%B8+6+%ED%9D%AC%EB%B4%89%EB%B9%8C%EB%94%A9&t=&z=17&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                  title="HOMMAGE CLASSIC 위치"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-divider" />
          {(snsLinks.instagram || snsLinks.x || snsLinks.youtube) && (
            <div className="footer-sns">
              {snsLinks.instagram && (
                <a href={snsLinks.instagram} target="_blank" rel="noopener noreferrer" className="footer-sns-link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              )}
              {snsLinks.x && (
                <a href={snsLinks.x} target="_blank" rel="noopener noreferrer" className="footer-sns-link" aria-label="X">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {snsLinks.youtube && (
                <a href={snsLinks.youtube} target="_blank" rel="noopener noreferrer" className="footer-sns-link" aria-label="YouTube">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
                  </svg>
                </a>
              )}
            </div>
          )}
          <p className="footer-text">
            &copy; 2026 {companyInfo.name}. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
