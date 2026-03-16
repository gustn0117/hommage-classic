"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import { SCENTS } from "@/data/scents";
import { DEFAULT_PRODUCTS } from "@/data/products";

function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line}
    </Fragment>
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

const CATEGORY_LABELS: Record<string, string> = {
  diffuser: "DIFFUSER",
  candle: "CANDLE",
  soap: "SOAP",
  giftset: "GIFT SET",
};

function getScentCount(category: string): number {
  if (category === "diffuser" || category === "giftset") return 2;
  if (category === "candle") return 1;
  return 0;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const maxScents = getScentCount(product.birth_date);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [expandedScent, setExpandedScent] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const scentRef = useRef<HTMLDivElement>(null);

  const hasScents = maxScents > 0;
  const allImages = [product.profile_image, ...product.photos].filter(Boolean);

  // Related products (same category, excluding current)
  const related = DEFAULT_PRODUCTS.filter(
    (p) => p.birth_date === product.birth_date && p.id !== product.id
  ).slice(0, 3);

  useEffect(() => { setLoaded(true); }, []);

  // Scroll reveal for scent cards
  useEffect(() => {
    if (!scentRef.current) return;
    const targets = scentRef.current.querySelectorAll(".pd-scent-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  function toggleScent(id: string) {
    setSelectedScents((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= maxScents) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }

  // Extract price from height string (e.g. "100ml × 2 | ₩62,100")
  const priceParts = product.height ? product.height.split("|").map((s) => s.trim()) : [];
  const spec = priceParts[0] || "";
  const price = priceParts[1] || product.height || "";

  return (
    <>
      {/* Hero Banner */}
      <div className="pd-hero">
        <div className="pd-hero-bg">
          {product.profile_image && <img src={product.profile_image} alt="" />}
        </div>
        <div className="pd-hero-overlay" />
        <div className={`pd-hero-content ${loaded ? "loaded" : ""}`}>
          <span className="pd-hero-badge">{CATEGORY_LABELS[product.birth_date]}</span>
          <h1 className="pd-hero-title">{product.name_en}</h1>
          <p className="pd-hero-subtitle">{product.name_ko}</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link href="/">HOME</Link>
        <span className="pd-breadcrumb-sep">/</span>
        <Link href="/collection">COLLECTION</Link>
        <span className="pd-breadcrumb-sep">/</span>
        <span className="pd-breadcrumb-current">{product.name_en}</span>
      </div>

      {/* Main section */}
      <section className="pd-main">
        <div className="pd-main-grid">
          {/* Left: Gallery */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              {allImages[activeImg] ? (
                <img src={allImages[activeImg]} alt={product.name_ko} />
              ) : (
                <div className="img-placeholder" style={{ width: "100%", aspectRatio: "4/5" }}>
                  {CATEGORY_LABELS[product.birth_date]}
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="pd-gallery-thumbs">
                {allImages.map((url, i) => (
                  <button
                    key={i}
                    className={`pd-gallery-thumb ${i === activeImg ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={url} alt={`${product.name_ko} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="pd-info">
            <span className="pd-category">{CATEGORY_LABELS[product.birth_date]}</span>
            <h2 className="pd-title">{product.name_en}</h2>
            <p className="pd-title-ko">{product.name_ko}</p>

            {price && <p className="pd-price">{price}</p>}
            {spec && <p className="pd-spec">{spec}</p>}

            <div className="pd-divider" />

            {product.weight && (
              <p className="pd-summary">{product.weight}</p>
            )}

            {product.specialty && (
              <div className="pd-desc">{renderLines(product.specialty)}</div>
            )}

            {/* Highlights */}
            <div className="pd-highlights">
              {product.birth_date === "diffuser" && (
                <>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" /></svg>
                    <span>14가지 향 선택</span>
                  </div>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    <span>핸드메이드</span>
                  </div>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    <span>리필 오일 2개 구성</span>
                  </div>
                </>
              )}
              {product.birth_date === "candle" && (
                <>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" /></svg>
                    <span>14가지 향 선택</span>
                  </div>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    <span>핸드메이드 텍스처</span>
                  </div>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                    <span>오브제 디자인</span>
                  </div>
                </>
              )}
              {product.birth_date === "soap" && (
                <>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                    <span>향료 무첨가</span>
                  </div>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 17L17 7M7 7h10v10" /></svg>
                    <span>천연 성분</span>
                  </div>
                </>
              )}
              {product.birth_date === "giftset" && (
                <>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8V3M7 8c0-2.5 2.2-5 5-5s5 2.5 5 5" /></svg>
                    <span>프리미엄 패키지</span>
                  </div>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" /></svg>
                    <span>디퓨저 + 캔들</span>
                  </div>
                  <div className="pd-highlight-item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
                    <span>소중한 선물</span>
                  </div>
                </>
              )}
            </div>

            {/* Details table */}
            {product.filmography.length > 0 && (
              <div className="pd-details">
                <h3 className="pd-details-label">PRODUCT DETAILS</h3>
                <div className="pd-details-list">
                  {product.filmography.map((item, i) => (
                    <div key={i} className="pd-details-row">
                      <span className="pd-details-key">{item.year}</span>
                      <span className="pd-details-value">{item.title}</span>
                      {item.role && <span className="pd-details-note">{item.role}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scent anchor */}
            {hasScents && (
              <a href="#scent-menu" className="pd-scent-cta">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" /></svg>
                향 선택하기
                <span className="pd-scent-cta-arrow">↓</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Scent Selection */}
      {hasScents && (
        <section className="pd-scent-section" id="scent-menu" ref={scentRef}>
          <div className="section-container">
            <div className="pd-scent-header">
              <span className="section-number">SCENT MENU</span>
              <h2 className="section-title">향을 선택해 주세요</h2>
              <p className="pd-scent-subtitle">
                공간의 분위기를 완성하는 오마주클래식의 향 컬렉션.
                <br />
                14가지 향 중 <strong>{maxScents}가지</strong>를 선택할 수 있습니다.
              </p>
              {selectedScents.length > 0 && (
                <div className="pd-scent-progress">
                  <div className="pd-scent-progress-bar">
                    <div
                      className="pd-scent-progress-fill"
                      style={{ width: `${(selectedScents.length / maxScents) * 100}%` }}
                    />
                  </div>
                  <span className="pd-scent-progress-text">{selectedScents.length} / {maxScents}</span>
                </div>
              )}
            </div>

            <div className="pd-scent-grid">
              {SCENTS.map((scent, idx) => {
                const isSelected = selectedScents.includes(scent.id);
                const isExpanded = expandedScent === scent.id;
                return (
                  <div
                    key={scent.id}
                    className={`pd-scent-card ${isSelected ? "selected" : ""} ${isExpanded ? "expanded" : ""}`}
                    style={{ transitionDelay: `${idx * 0.03}s` }}
                    onClick={() => setExpandedScent(isExpanded ? null : scent.id)}
                  >
                    {isSelected && <div className="pd-scent-check">✓</div>}
                    <div className="pd-scent-card-top">
                      <h4 className="pd-scent-name">{scent.name}</h4>
                      <p className="pd-scent-name-ko">{scent.nameKo}</p>
                    </div>

                    <div className="pd-scent-notes">
                      <div className="pd-scent-note">
                        <span className="pd-scent-note-label">TOP</span>
                        <span className="pd-scent-note-value">{scent.top}</span>
                      </div>
                      <div className="pd-scent-note">
                        <span className="pd-scent-note-label">MIDDLE</span>
                        <span className="pd-scent-note-value">{scent.middle}</span>
                      </div>
                      <div className="pd-scent-note">
                        <span className="pd-scent-note-label">BASE</span>
                        <span className="pd-scent-note-value">{scent.base}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <p className="pd-scent-desc">{scent.desc}</p>
                    )}

                    <button
                      className={`pd-scent-select-btn ${isSelected ? "selected" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleScent(scent.id);
                      }}
                    >
                      {isSelected ? "선택 해제" : "선택하기"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selected scents summary — sticky bottom */}
            {selectedScents.length > 0 && (
              <div className="pd-scent-summary">
                <div className="pd-scent-summary-left">
                  <span className="pd-scent-summary-label">선택한 향</span>
                  <div className="pd-scent-summary-tags">
                    {selectedScents.map((id) => {
                      const s = SCENTS.find((sc) => sc.id === id)!;
                      return (
                        <span key={id} className="pd-scent-tag">
                          {s.name}
                          <span className="pd-scent-tag-ko">{s.nameKo}</span>
                          <button
                            className="pd-scent-tag-remove"
                            onClick={() => setSelectedScents((prev) => prev.filter((x) => x !== id))}
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                  </div>
                </div>
                {selectedScents.length === maxScents && (
                  <div className="pd-scent-summary-complete">향 선택 완료</div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Related Products */}
      {related.length > 0 && (
        <section className="pd-related">
          <div className="section-container">
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <span className="section-number">YOU MAY ALSO LIKE</span>
              <h2 className="section-title">관련 제품</h2>
            </div>
            <div className="pd-related-grid">
              {related.map((item) => (
                <Link key={item.id} href={`/collection/${item.id}`} className="coll-card">
                  <div className="coll-card-img-wrap">
                    <img src={item.profile_image} alt={item.name_ko} className="coll-card-img" />
                    <div className="coll-card-overlay">
                      <span className="coll-card-view">VIEW DETAIL →</span>
                    </div>
                  </div>
                  <div className="coll-card-info">
                    <h3 className="coll-card-name">{item.name_en}</h3>
                    <p className="coll-card-nameKo">{item.name_ko}</p>
                    {item.height && <p className="coll-card-price">{item.height}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="pd-back-section">
        <Link href="/collection" className="view-all-btn">
          BACK TO COLLECTION
        </Link>
      </div>
    </>
  );
}
