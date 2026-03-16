import type { Metadata } from "next";
import { Fragment } from "react";
import { getSiteData } from "@/lib/data";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "About" };
export const dynamic = "force-dynamic";

function renderLines(text: string) {
  return text.split("\n").map((line, i) => (
    <Fragment key={i}>{i > 0 && <br />}{line}</Fragment>
  ));
}

export default async function AboutPage() {
  const { brandInfo } = await getSiteData();

  return (
    <>
      <PageHero title="ABOUT" subtitle="오마주클래식의 브랜드 이야기" image="/images/about.jpg" />

      {/* Brand Story */}
      <section style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="about-split">
            <div className="about-split-img">
              <img src="/images/candle2.jpg" alt="HOMMAGE CLASSIC" />
            </div>
            <div className="about-split-text">
              <span className="about-label">Brand Story</span>
              <h2 className="about-heading">정직한 마음으로<br />만든 향의 경의</h2>
              <div className="about-heading-line" />
              <p className="brand-story-text">{renderLines(brandInfo.introText1)}</p>
              <p className="brand-story-text brand-story-sub">{renderLines(brandInfo.introText2)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: "100px 0", background: "var(--color-bg-secondary)" }}>
        <div className="section-container">
          <div style={{ textAlign: "center", marginBottom: "64px" }}>
            <span className="about-label" style={{ display: "block" }}>Our Values</span>
            <h2 className="section-title" style={{ display: "inline-block" }}>What We Believe</h2>
          </div>
          <div className="about-values-grid">
            {brandInfo.values.map((value, i) => (
              <div key={i} className="about-value-card">
                <span className="about-value-card-num">0{i + 1}</span>
                <p className="about-value-card-text">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Slogan Band */}
      <section className="brand-band">
        <img src="/images/perfume1.jpg" alt="" className="brand-band-img" />
        <div className="brand-band-overlay">
          <blockquote className="brand-band-text">
            {renderLines(brandInfo.slogan)}
          </blockquote>
        </div>
      </section>

      {/* Brand Meaning */}
      <section style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container" style={{ maxWidth: "720px", textAlign: "center" }}>
          <span className="about-label" style={{ display: "block" }}>The Meaning of Hommage</span>
          <h2 className="section-title" style={{ display: "inline-block", marginBottom: "48px" }}>경의를 담다</h2>
          <p className="brand-story-text" style={{ textAlign: "center" }}>
            Hommage는 프랑스어로 &lsquo;존경&rsquo;, &lsquo;경의&rsquo;, &lsquo;헌정&rsquo;을 의미합니다.
            <br /><br />
            좋은 마음, 정직한 마음을 향기에 담아
            <br />
            존경과 경의를 표현하는 브랜드.
            <br /><br />
            한국적 감성과 클래식한 아름다움의 조화 속에서,
            <br />
            당신을 가장 본질적인 순간으로 돌려보냅니다.
          </p>
          {brandInfo.email && (
            <div style={{ marginTop: "56px" }}>
              <a href={`mailto:${brandInfo.email}`} className="brand-email-block">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
                <span>{brandInfo.email}</span>
              </a>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
