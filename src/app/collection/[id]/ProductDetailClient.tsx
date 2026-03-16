"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { SCENTS } from "@/data/scents";

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

// How many scents can be selected per category
function getScentCount(category: string): number {
  if (category === "diffuser" || category === "giftset") return 2;
  if (category === "candle") return 1;
  return 0;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const maxScents = getScentCount(product.birth_date);
  const [selectedScents, setSelectedScents] = useState<string[]>([]);
  const [expandedScent, setExpandedScent] = useState<string | null>(null);

  const hasScents = maxScents > 0;

  function toggleScent(id: string) {
    setSelectedScents((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= maxScents) return [...prev.slice(1), id];
      return [...prev, id];
    });
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <Link href="/collection">COLLECTION</Link>
        <span className="pd-breadcrumb-sep">/</span>
        <span>{product.name_en}</span>
      </div>

      {/* Main section */}
      <section className="pd-main">
        <div className="pd-main-grid">
          {/* Left: Image */}
          <div className="pd-gallery">
            <div className="pd-gallery-main">
              {product.profile_image ? (
                <img src={product.profile_image} alt={product.name_ko} />
              ) : (
                <div className="img-placeholder" style={{ width: "100%", aspectRatio: "4/5" }}>
                  {product.birth_date.toUpperCase()}
                </div>
              )}
            </div>
            {product.photos.length > 0 && (
              <div className="pd-gallery-thumbs">
                {product.photos.map((url, i) => (
                  <div key={i} className="pd-gallery-thumb">
                    <img src={url} alt={`${product.name_ko} ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="pd-info">
            <span className="pd-category">
              {product.birth_date === "diffuser" && "DIFFUSER"}
              {product.birth_date === "candle" && "CANDLE"}
              {product.birth_date === "soap" && "SOAP"}
              {product.birth_date === "giftset" && "GIFT SET"}
            </span>
            <h1 className="pd-title">{product.name_en}</h1>
            <p className="pd-title-ko">{product.name_ko}</p>

            {product.height && (
              <p className="pd-price">{product.height}</p>
            )}

            <div className="pd-divider" />

            {product.specialty && (
              <div className="pd-desc">{renderLines(product.specialty)}</div>
            )}

            {/* Details table */}
            {product.filmography.length > 0 && (
              <div className="pd-details">
                <h3 className="pd-details-label">DETAILS</h3>
                <table className="product-detail-table">
                  <tbody>
                    {product.filmography.map((item, i) => (
                      <tr key={i}>
                        <td style={{ width: "90px", fontWeight: 500, fontSize: "12px", letterSpacing: "1px", color: "var(--color-text-muted)" }}>
                          {item.year}
                        </td>
                        <td style={{ color: "var(--color-text-primary)" }}>{item.title}</td>
                        {item.role && <td style={{ width: "80px" }}>{item.role}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Scent Selection */}
      {hasScents && (
        <section className="pd-scent-section">
          <div className="section-container">
            <div className="pd-scent-header">
              <span className="section-number">SCENT MENU</span>
              <h2 className="section-title">향을 선택해 주세요</h2>
              <p className="pd-scent-subtitle">
                14가지 향 중 {maxScents}가지를 선택할 수 있습니다.
                {selectedScents.length > 0 && (
                  <span className="pd-scent-count">
                    {" "}{selectedScents.length} / {maxScents} 선택됨
                  </span>
                )}
              </p>
            </div>

            <div className="pd-scent-grid">
              {SCENTS.map((scent) => {
                const isSelected = selectedScents.includes(scent.id);
                const isExpanded = expandedScent === scent.id;
                return (
                  <div
                    key={scent.id}
                    className={`pd-scent-card ${isSelected ? "selected" : ""} ${isExpanded ? "expanded" : ""}`}
                    onClick={() => setExpandedScent(isExpanded ? null : scent.id)}
                  >
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
                      {isSelected ? "선택됨 ✓" : "선택"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selected scents summary */}
            {selectedScents.length > 0 && (
              <div className="pd-scent-summary">
                <span className="pd-scent-summary-label">선택한 향</span>
                <div className="pd-scent-summary-tags">
                  {selectedScents.map((id) => {
                    const s = SCENTS.find((sc) => sc.id === id)!;
                    return (
                      <span key={id} className="pd-scent-tag">
                        {s.name}
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
            )}
          </div>
        </section>
      )}

      {/* Back link */}
      <div style={{ textAlign: "center", padding: "80px 0", background: "var(--color-bg-primary)" }}>
        <Link href="/collection" className="view-all-btn">
          BACK TO COLLECTION
        </Link>
      </div>
    </>
  );
}
