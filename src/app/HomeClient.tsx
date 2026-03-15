"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import type { CompanyInfo, BrandInfo, HeroVideo, SnsLinks } from "@/lib/types";

function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
  ));
}

interface Product {
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

const DEFAULT_PRODUCTS = [
  {
    name: "REED DIFFUSER",
    nameKo: "리드 디퓨저",
    image: "/images/diffuser1.jpg",
    subImage: "/images/diffuser2.jpg",
    desc: "자연에서 영감을 받은 섬세한 향이 공간을 조용히 채워갑니다. 정직한 원료만을 담아 만든 오마주클래식의 시그니처 디퓨저.",
  },
  {
    name: "NATURAL SOAP",
    nameKo: "내추럴 솝",
    image: "/images/soap1.jpg",
    subImage: "/images/soap2.jpg",
    desc: "피부에 닿는 순간부터 다른 것을 느낄 수 있도록. 식물성 오일과 천연 향료로 완성한 부드럽고 깊은 세정의 경험.",
  },
  {
    name: "GIFT SET",
    nameKo: "기프트 세트",
    image: "/images/giftset1.jpg",
    subImage: "/images/candle1.jpg",
    desc: "소중한 사람에게 전하는 경의. 정성스럽게 큐레이션한 향과 케어 아이템을 하나의 세트로 담았습니다.",
  },
];

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.15 }
    );
    el.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur")
      .forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, []);
  return ref;
}

function useScrollSpy() {
  const [activeSection, setActiveSection] = useState("home");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.3, rootMargin: "-80px 0px -40% 0px" }
    );
    SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  return activeSection;
}

export default function HomeClient({ products, notices, companyInfo, brandInfo, snsLinks }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openNotice, setOpenNotice] = useState<number | null>(null);
  const [featuredIdx, setFeaturedIdx] = useState(0);
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

  const featured = DEFAULT_PRODUCTS[featuredIdx];

  return (
    <div ref={revealRef}>
      {/* Navigation */}
      <nav className={`nav-fixed ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="section-container">
          <div className="nav-inner">
            <button onClick={() => scrollTo("home")} className="nav-logo">
              HOMMAGE CLASSIC
            </button>
            <div style={{ display: "flex", gap: "40px", alignItems: "center" }} className="desktop-nav">
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
              style={{ background: "none", border: "none", cursor: "pointer", display: "none", flexDirection: "column", gap: "5px", padding: "8px" }}
            >
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: "20px", height: "1px", background: scrolled ? "var(--color-text-primary)" : "#f0ebe3", display: "block" }} />
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
            <a key={item.id} href={`#${item.id}`} onClick={(e) => { e.preventDefault(); scrollTo(item.id); }}>
              {item.label}
            </a>
          ))}
        </div>
      )}

      {/* ===== HERO — Full-screen image with centered text ===== */}
      <section id="home" className="hero-section">
        <img src="/images/hero.jpg" alt="" className="hero-video hero-video-bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div className="hero-bg-grain" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main" style={{ fontSize: "clamp(28px, 6vw, 56px)", fontWeight: 300, letterSpacing: "clamp(8px, 3vw, 28px)" }}>
              CRAFTED WITH SINCERE HANDS
            </span>
          </h1>
          <div className="hero-divider" />
          <p className="hero-description" style={{ letterSpacing: "2px", lineHeight: 2 }}>
            정직한 마음으로 만든 향으로,
            <br />
            사람을 가장 본질적인 순간으로 돌려보내는 브랜드.
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

      {/* ===== FEATURED SPLIT — Left: large image + text overlay, Right: product card ===== */}
      <section className="featured-split">
        {/* Left: large image with text overlay */}
        <div className="featured-left">
          <img src={featured.image} alt={featured.nameKo} className="featured-left-img" />
          <div className="featured-left-overlay">
            <h2 className="featured-left-title">
              HOMMAGE CLASSIC
              <br />
              {featured.name}
            </h2>
            <p className="featured-left-desc">{featured.desc}</p>
          </div>
        </div>
        {/* Right: product card with image */}
        <div className="featured-right">
          <div className="featured-right-img-wrap">
            <img src={featured.subImage} alt={featured.nameKo} className="featured-right-img" />
          </div>
          <div className="featured-right-info">
            <h3 className="featured-right-name">HOMMAGE CLASSIC {featured.name}</h3>
            <p className="featured-right-nameKo">{featured.nameKo}</p>
          </div>
          {/* Dots */}
          <div className="featured-dots">
            {DEFAULT_PRODUCTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setFeaturedIdx(i)}
                className={`featured-dot ${i === featuredIdx ? "active" : ""}`}
                aria-label={`Product ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== COLLECTION — Products from DB or default grid ===== */}
      <section id="collection" style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}>
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
                      <img className="product-main-photo" src={product.profile_image} alt={product.name_ko} />
                    ) : (
                      <div className="product-main-photo img-placeholder">PRODUCT</div>
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
                      <div className="product-description-text">{renderLines(product.specialty)}</div>
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
            <div className="collection-grid">
              {DEFAULT_PRODUCTS.map((item, idx) => (
                <div key={idx} className={`collection-item reveal-scale reveal-delay-${idx + 1}`}>
                  <div className="collection-item-img-wrap">
                    <img src={item.image} alt={item.nameKo} className="collection-item-img" />
                    <div className="collection-item-hover">
                      <span>{item.name}</span>
                    </div>
                  </div>
                  <div className="collection-item-info">
                    <h3 className="collection-item-name">{item.name}</h3>
                    <p className="collection-item-nameKo">{item.nameKo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== BRAND STORY — Full-width image band ===== */}
      <section className="brand-band">
        <img src="/images/candle2.jpg" alt="" className="brand-band-img" />
        <div className="brand-band-overlay">
          <blockquote className="brand-band-text">
            {renderLines(brandInfo.slogan)}
          </blockquote>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">02</span>
              <h2 className="section-title">About</h2>
              <span className="section-title-bar" />
            </div>
          </div>

          <div className="about-split reveal">
            <div className="about-split-img">
              <img src="/images/about.jpg" alt="HOMMAGE CLASSIC" />
            </div>
            <div className="about-split-text">
              <p className="brand-story-text">{renderLines(brandInfo.introText1)}</p>
              <p className="brand-story-text brand-story-sub">{renderLines(brandInfo.introText2)}</p>
              <div className="about-values">
                {brandInfo.values.map((value, i) => (
                  <div key={i} className="about-value-item">
                    <span className="about-value-num">0{i + 1}</span>
                    <span className="about-value-text">{value}</span>
                  </div>
                ))}
              </div>
              {brandInfo.email && (
                <a href={`mailto:${brandInfo.email}`} className="brand-email-block">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M22 4L12 13 2 4" />
                  </svg>
                  <span>{brandInfo.email}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== NOTICE ===== */}
      <section id="notice" style={{ padding: "120px 0", background: "var(--color-bg-secondary)" }}>
        <div className="section-container">
          <div className="reveal-blur">
            <div className="section-title-wrap">
              <span className="section-number">03</span>
              <h2 className="section-title">Notice</h2>
              <span className="section-title-bar" />
            </div>
          </div>
          <div className="reveal">
            {notices.length > 0 ? notices.map((notice) => (
              <div key={notice.id} className="notice-item" onClick={() => setOpenNotice(openNotice === notice.id ? null : notice.id)}>
                <div className="notice-date">{notice.date}</div>
                <div className="notice-title-text">{notice.title}</div>
                <svg className={`notice-chevron ${openNotice === notice.id ? "open" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 6l4 4 4-4" />
                </svg>
                <div className={`notice-content ${openNotice === notice.id ? "open" : ""}`}>
                  <div className="notice-content-inner" style={{ whiteSpace: "pre-line" }}>{notice.content}</div>
                </div>
              </div>
            )) : (
              <p style={{ color: "var(--color-text-muted)", fontSize: "14px", fontWeight: 300 }}>등록된 공지사항이 없습니다.</p>
            )}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== CONTACT ===== */}
      <section id="contact" style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}>
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
                  <div style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>{companyInfo.addressDetail}</div>
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
                    <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
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
          <p className="footer-text">&copy; 2026 {companyInfo.name}. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
