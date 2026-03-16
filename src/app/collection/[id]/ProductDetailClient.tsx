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

const CATEGORY_KO: Record<string, string> = {
  diffuser: "디퓨저",
  candle: "캔들",
  soap: "비누",
  giftset: "기프트세트",
};

function getScentCount(category: string): number {
  if (category === "diffuser" || category === "giftset") return 2;
  if (category === "candle") return 1;
  return 0;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const maxScents = getScentCount(product.birth_date);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const scentRef = useRef<HTMLDivElement>(null);

  const hasScents = maxScents > 0;
  const allImages = [product.profile_image, ...product.photos].filter(Boolean);

  const related = DEFAULT_PRODUCTS.filter(
    (p) => p.birth_date === product.birth_date && p.id !== product.id
  ).slice(0, 3);

  useEffect(() => { setLoaded(true); }, []);

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
      { threshold: 0.08 }
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
                <img src={allImages[activeImg]} alt={product.name_ko} key={activeImg} />
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
            <div className="pd-info-top">
              <span className="pd-category">{CATEGORY_LABELS[product.birth_date]}</span>
              <span className="pd-category-ko">{CATEGORY_KO[product.birth_date]}</span>
            </div>
            <h2 className="pd-title">{product.name_en}</h2>
            <p className="pd-title-ko">{product.name_ko}</p>

            <div className="pd-price-block">
              {price && <p className="pd-price">{price}</p>}
              {spec && <p className="pd-spec">{spec}</p>}
            </div>

            <div className="pd-divider" />

            {product.weight && (
              <p className="pd-summary">{product.weight}</p>
            )}

            {product.specialty && (
              <div className="pd-desc">{renderLines(product.specialty)}</div>
            )}

            {/* Features */}
            <div className="pd-features">
              <h3 className="pd-features-label">FEATURES</h3>
              <div className="pd-features-grid">
                {product.birth_date === "diffuser" && (
                  <>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4M4.93 19.07l4.24-4.24M14.83 9.17l4.24-4.24" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">14가지 향</span>
                        <span className="pd-feature-desc">취향에 맞는 향 선택</span>
                      </div>
                    </div>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">핸드메이드</span>
                        <span className="pd-feature-desc">직접 디자인 & 제작</span>
                      </div>
                    </div>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">리필 오일 2개</span>
                        <span className="pd-feature-desc">오래도록 향을 즐기세요</span>
                      </div>
                    </div>
                  </>
                )}
                {product.birth_date === "candle" && (
                  <>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">14가지 향</span>
                        <span className="pd-feature-desc">취향에 맞는 향 선택</span>
                      </div>
                    </div>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">핸드메이드</span>
                        <span className="pd-feature-desc">세상에 하나뿐인 오브제</span>
                      </div>
                    </div>
                  </>
                )}
                {product.birth_date === "soap" && (
                  <>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">향료 무첨가</span>
                        <span className="pd-feature-desc">순수한 비누 사용감</span>
                      </div>
                    </div>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="12" r="10" /><path d="M8 12l2 2 4-4" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">천연 성분</span>
                        <span className="pd-feature-desc">붉나무 유래 + 콜라겐</span>
                      </div>
                    </div>
                  </>
                )}
                {product.birth_date === "giftset" && (
                  <>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="8" width="18" height="13" rx="2" /><path d="M12 8V3M7 8c0-2.5 2.2-5 5-5s5 2.5 5 5" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">프리미엄 패키지</span>
                        <span className="pd-feature-desc">선물용 쇼핑백 포함</span>
                      </div>
                    </div>
                    <div className="pd-feature">
                      <div className="pd-feature-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2v6M12 18v4M4.93 4.93l4.24 4.24M14.83 14.83l4.24 4.24M2 12h6M18 12h4" /></svg>
                      </div>
                      <div>
                        <span className="pd-feature-title">캔들 + 디퓨저</span>
                        <span className="pd-feature-desc">향 3가지 선택</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Details */}
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

              {/* Progress */}
              <div className="pd-scent-progress">
                <div className="pd-scent-progress-bar">
                  <div
                    className="pd-scent-progress-fill"
                    style={{ width: `${(selectedScents.length / maxScents) * 100}%` }}
                  />
                </div>
                <span className="pd-scent-progress-text">
                  {selectedScents.length} / {maxScents}
                  {selectedScents.length === maxScents && " — 선택 완료"}
                </span>
              </div>
            </div>

            <div className="pd-scent-grid">
              {SCENTS.map((scent, idx) => {
                const isSelected = selectedScents.includes(scent.id);
                const orderNum = isSelected ? selectedScents.indexOf(scent.id) + 1 : 0;
                return (
                  <div
                    key={scent.id}
                    className={`pd-scent-card ${isSelected ? "selected" : ""}`}
                    style={{ transitionDelay: `${idx * 0.03}s` }}
                    onClick={() => toggleScent(scent.id)}
                  >
                    {/* Selection indicator */}
                    <div className={`pd-scent-indicator ${isSelected ? "active" : ""}`}>
                      {isSelected ? <span className="pd-scent-indicator-num">{orderNum}</span> : <span className="pd-scent-indicator-plus">+</span>}
                    </div>

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

                    <p className="pd-scent-desc">{scent.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Selected summary - always visible when scents selected */}
            {selectedScents.length > 0 && (
              <div className="pd-scent-summary">
                <div className="pd-scent-summary-left">
                  <span className="pd-scent-summary-label">선택한 향</span>
                  <div className="pd-scent-summary-tags">
                    {selectedScents.map((id, idx) => {
                      const s = SCENTS.find((sc) => sc.id === id)!;
                      return (
                        <span key={id} className="pd-scent-tag">
                          <span className="pd-scent-tag-num">{idx + 1}</span>
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
                  <div className="pd-scent-summary-complete">선택 완료</div>
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

      {/* Back */}
      <div className="pd-back-section">
        <Link href="/collection" className="view-all-btn">
          BACK TO COLLECTION
        </Link>
      </div>
    </>
  );
}
