"use client";

import { useState, useEffect, useRef, Fragment } from "react";
import Link from "next/link";
import type { BrandInfo } from "@/lib/types";

function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
  ));
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur");
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);
  return ref;
}

const PRODUCTS = [
  {
    name: "TIMELESS ONE DIFFUSER",
    nameKo: "시그니처 디퓨저",
    image: "/images/timeless-diffuser.jpeg",
    subImage: "/images/timeless-diffuser-2.png",
    desc: "핸드메이드 텍스처와 클래식한 디자인이 돋보이는 오마주클래식 시그니처 디퓨저. 대표가 직접 디자인하고 제작한 보틀.",
  },
  {
    name: "TIMELESS ONE CANDLE",
    nameKo: "핸드메이드 캔들",
    image: "/images/timeless-candle-9oz.jpeg",
    subImage: "/images/timeless-candle-3oz.jpeg",
    desc: "클래식한 텍스처와 현대적 감각이 만나 탄생한 핸드메이드 캔들. 세상에 단 하나뿐인 오브제.",
  },
  {
    name: "RED SUMAC SOAP",
    nameKo: "붉나무 콜라겐 비누",
    image: "/images/red-sumac-soap.jpeg",
    subImage: "/images/soap1.jpg",
    desc: "붉나무 유래 성분과 콜라겐이 함유된 부드러운 클렌징 비누. 향료 무첨가, 순수한 사용감.",
  },
  {
    name: "TIMELESS ONE SET",
    nameKo: "캔들 & 디퓨저 세트",
    image: "/images/timeless-set.jpg",
    subImage: "/images/timeless-diffuser.jpeg",
    desc: "타임리스 원 캔들과 디퓨저의 프리미엄 세트. 소중한 사람에게 전하는 경의.",
  },
];

interface Props {
  brandInfo: BrandInfo;
}

export default function HomeClient({ brandInfo }: Props) {
  const [featuredIdx, setFeaturedIdx] = useState(0);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const revealRef = useScrollReveal();

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
    <div ref={revealRef}>
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
      <section className="featured-split reveal-scale">
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
      <section className="brand-band reveal">
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
          <span className="section-number reveal">COLLECTION</span>
          <h2 className="section-title reveal reveal-delay-1" style={{ marginBottom: "64px" }}>Our Products</h2>
          <div className="collection-grid">
            {PRODUCTS.map((item, idx) => (
              <Link href="/collection" key={idx} className={`collection-item reveal reveal-delay-${Math.min(idx + 1, 4)}`} style={{ textDecoration: "none" }}>
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
    </div>
  );
}
