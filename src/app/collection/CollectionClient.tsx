"use client";

import { useState } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";

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

const CATEGORIES = [
  { value: "", label: "ALL" },
  { value: "diffuser", label: "DIFFUSER" },
  { value: "candle", label: "CANDLE" },
  { value: "soap", label: "SOAP" },
  { value: "giftset", label: "GIFT SET" },
];

const CATEGORY_LABELS: Record<string, string> = {
  diffuser: "DIFFUSER",
  candle: "CANDLE",
  soap: "SOAP",
  giftset: "GIFT SET",
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

      <section className="coll-section">
        <div className="section-container">
          <div className="coll-count">
            {filtered.length}개의 제품
          </div>

          <div className="coll-grid">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/collection/${product.id}`}
                className="coll-card"
              >
                <div className="coll-card-img-wrap">
                  {product.profile_image ? (
                    <img src={product.profile_image} alt={product.name_ko} className="coll-card-img" />
                  ) : (
                    <div className="coll-card-img img-placeholder">
                      {CATEGORY_LABELS[product.birth_date] || "PRODUCT"}
                    </div>
                  )}
                  <div className="coll-card-badge">
                    {CATEGORY_LABELS[product.birth_date]}
                  </div>
                  <div className="coll-card-overlay">
                    <span className="coll-card-view">VIEW DETAIL →</span>
                  </div>
                </div>
                <div className="coll-card-info">
                  <h3 className="coll-card-name">{product.name_en}</h3>
                  <p className="coll-card-nameKo">{product.name_ko}</p>
                  {product.height && (
                    <p className="coll-card-price">{product.height}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="coll-empty">
              해당 카테고리에 등록된 상품이 없습니다.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
