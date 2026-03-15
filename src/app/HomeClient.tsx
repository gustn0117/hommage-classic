"use client";

import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import type { BrandInfo } from "@/lib/types";

function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
  ));
}

const PRODUCTS = [
  {
    name: "REED DIFFUSER",
    nameKo: "디퓨저",
    image: "/images/diffuser1.jpg",
    subImage: "/images/diffuser2.jpg",
    desc: "자연에서 영감을 받은 섬세한 향이 공간을 조용히 채워갑니다. 정직한 원료만을 담아 만든 오마주클래식의 시그니처 디퓨저.",
  },
  {
    name: "AROMA CANDLE",
    nameKo: "캔들",
    image: "/images/candle1.jpg",
    subImage: "/images/giftset1.jpg",
    desc: "소이 왁스와 천연 에센셜 오일로 만든 은은하고 깊은 향의 캔들. 불을 켜는 순간, 공간이 달라집니다.",
  },
  {
    name: "NATURAL SOAP",
    nameKo: "솝",
    image: "/images/soap1.jpg",
    subImage: "/images/detail1.jpg",
    desc: "피부에 닿는 순간부터 다른 것을 느낄 수 있도록. 식물성 오일과 천연 향료로 완성한 부드럽고 깊은 세정의 경험.",
  },
  {
    name: "GIFT SET",
    nameKo: "기프트세트",
    image: "/images/giftset1.jpg",
    subImage: "/images/candle1.jpg",
    desc: "소중한 사람에게 전하는 경의. 정성스럽게 큐레이션한 향과 케어 아이템을 하나의 세트로 담았습니다.",
  },
];

interface Props {
  brandInfo: BrandInfo;
}

export default function HomeClient({ brandInfo }: Props) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);

  useEffect(() => {
    setHeroLoaded(true);
  }, []);

  // Auto-rotate featured products
  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIdx((prev) => (prev + 1) % PRODUCTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featured = PRODUCTS[featuredIdx];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="hero-section">
        <div className="hero-slides">
          {PRODUCTS.map((p, i) => (
            <img
              key={i}
              src={p.image}
              alt=""
              className={`hero-slide-img ${i === featuredIdx ? "active" : ""}`}
            />
          ))}
        </div>
        <div className="hero-bg-grain" />
        <div className="hero-overlay" />

        <div className={`hero-content ${heroLoaded ? "loaded" : ""}`}>
          <div className="hero-brand-label">HOMMAGE CLASSIC</div>
          <h1 className="hero-headline">
            CRAFTED WITH
            <br />
            SINCERE HANDS
          </h1>
          <div className="hero-divider-line" />
          <p className="hero-desc">
            정직한 마음으로 만든 향으로,
            <br />
            사람을 가장 본질적인 순간으로 돌려보내는 브랜드.
          </p>
          <Link href="/collection" className="hero-cta">
            EXPLORE COLLECTION
          </Link>
        </div>

        {/* Hero bottom bar */}
        <div className="hero-bottom">
          <div className="hero-bottom-left">
            <span className="hero-bottom-label">SCROLL TO DISCOVER</span>
          </div>
          <div className="hero-bottom-center">
            {PRODUCTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setFeaturedIdx(i)}
                className={`hero-dot ${i === featuredIdx ? "active" : ""}`}
              />
            ))}
          </div>
          <div className="hero-bottom-right">
            <span className="hero-bottom-label">{`0${featuredIdx + 1} / 0${PRODUCTS.length}`}</span>
          </div>
        </div>
      </section>

      {/* ===== FEATURED SPLIT ===== */}
      <section className="featured-split">
        <div className="featured-left">
          <img src={featured.image} alt={featured.nameKo} className="featured-left-img" />
          <div className="featured-left-overlay">
            <span className="featured-left-label">FEATURED</span>
            <h2 className="featured-left-title">{featured.name}</h2>
            <p className="featured-left-desc">{featured.desc}</p>
            <Link href="/collection" className="featured-left-btn">
              VIEW MORE
            </Link>
          </div>
        </div>
        <div className="featured-right">
          <div className="featured-right-img-wrap">
            <img src={featured.subImage} alt={featured.nameKo} className="featured-right-img" />
          </div>
          <div className="featured-right-info">
            <h3 className="featured-right-name">{featured.name}</h3>
            <p className="featured-right-nameKo">{featured.nameKo}</p>
          </div>
          <div className="featured-dots">
            {PRODUCTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setFeaturedIdx(i)}
                className={`featured-dot ${i === featuredIdx ? "active" : ""}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== BRAND BAND ===== */}
      <section className="brand-band">
        <img src="/images/candle2.jpg" alt="" className="brand-band-img" />
        <div className="brand-band-overlay">
          <blockquote className="brand-band-text">
            {renderLines(brandInfo.slogan)}
          </blockquote>
        </div>
      </section>

      {/* ===== QUICK COLLECTION PREVIEW ===== */}
      <section style={{ padding: "100px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container" style={{ textAlign: "center" }}>
          <span className="section-number">COLLECTION</span>
          <h2 className="section-title" style={{ marginBottom: "64px" }}>Our Products</h2>
          <div className="collection-grid">
            {PRODUCTS.map((item, idx) => (
              <Link href="/collection" key={idx} className="collection-item" style={{ textDecoration: "none" }}>
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
              </Link>
            ))}
          </div>
          <Link href="/collection" className="view-all-btn">
            VIEW ALL COLLECTION
          </Link>
        </div>
      </section>
    </>
  );
}
