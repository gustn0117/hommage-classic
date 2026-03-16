"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";

function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
  ));
}

interface Product {
  id: string;
  name_ko: string;
  name_en: string;
  birth_date: string; // category
  height: string; // price/volume
  weight: string; // summary
  specialty: string; // description
  profile_image: string;
  photos: string[];
  filmography: { year: string; category: string; title: string; role: string }[];
}

const CATEGORIES = [
  { value: "", label: "ALL" },
  { value: "diffuser", label: "DIFFUSER", labelKo: "디퓨저" },
  { value: "candle", label: "CANDLE", labelKo: "캔들" },
  { value: "soap", label: "SOAP", labelKo: "솝" },
  { value: "giftset", label: "GIFT SET", labelKo: "기프트세트" },
];

const CATEGORY_LABELS: Record<string, string> = {
  diffuser: "디퓨저",
  candle: "캔들",
  soap: "솝",
  giftset: "기프트세트",
};

import { DEFAULT_PRODUCTS } from "@/data/products";

export default function CollectionClient({ products }: { products: Product[] }) {
  const [activeCat, setActiveCat] = useState("");
  const allProducts = products.length > 0 ? products : DEFAULT_PRODUCTS;
  const filtered = activeCat ? allProducts.filter((p) => p.birth_date === activeCat) : allProducts;

  return (
    <>
      <PageHero title="COLLECTION" subtitle="정직한 원료로 만든 오마주클래식의 컬렉션" image="/images/diffuser2.jpg" />

      {/* Category Tabs */}
      <div className="cat-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCat(cat.value)}
            className={`cat-tab ${activeCat === cat.value ? "active" : ""}`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <section style={{ padding: "80px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          {filtered.map((product, idx) => (
            <div key={product.id} className="product-block">
              <Link href={`/collection/${product.id}`} className="product-name-wrap" style={{ textDecoration: "none", display: "block" }}>
                <div className="product-name-en">{product.name_en}</div>
                <div className="product-name-ko">
                  {product.name_ko}
                  {product.height && <span style={{ marginLeft: "16px", color: "var(--color-accent)", fontSize: "12px" }}>{product.height}</span>}
                </div>
              </Link>

              <div className="product-profile-grid">
                <div>
                  {product.profile_image ? (
                    <img className="product-main-photo" src={product.profile_image} alt={product.name_ko} />
                  ) : (
                    <div className="product-main-photo img-placeholder">
                      {CATEGORY_LABELS[product.birth_date] || "PRODUCT"}
                    </div>
                  )}
                </div>
                <div>
                  {product.weight && (
                    <p style={{ fontSize: "13px", color: "var(--color-accent)", letterSpacing: "2px", fontWeight: 400, marginBottom: "16px", textTransform: "uppercase" }}>
                      {product.weight}
                    </p>
                  )}
                  {product.specialty && (
                    <div className="product-description-text">{renderLines(product.specialty)}</div>
                  )}
                  {product.filmography.length > 0 && (
                    <div>
                      <h3 className="product-detail-header">Details</h3>
                      <table className="product-detail-table">
                        <thead>
                          <tr>
                            <th style={{ width: "90px" }}>항목</th>
                            <th>설명</th>
                            <th style={{ width: "80px" }}>비고</th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.filmography.map((item, i) => (
                            <tr key={i}>
                              <td>{item.year}</td>
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
                  {product.photos.map((url, i) => (
                    <div key={i} className="product-photo-thumb">
                      <img src={url} alt={`${product.name_ko} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              )}

              {idx < filtered.length - 1 && <div className="section-divider" style={{ margin: "80px auto" }} />}
            </div>
          ))}

          {filtered.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "80px 0" }}>
              해당 카테고리에 등록된 상품이 없습니다.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
