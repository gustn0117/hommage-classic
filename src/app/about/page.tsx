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

      <section style={{ padding: "100px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="about-split">
            <div className="about-split-img">
              <img src="/images/candle2.jpg" alt="HOMMAGE CLASSIC" />
            </div>
            <div className="about-split-text">
              <h2 style={{ fontSize: "11px", letterSpacing: "4px", color: "var(--color-accent)", fontWeight: 500, marginBottom: "24px", textTransform: "uppercase" as const }}>
                Brand Story
              </h2>
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
            </div>
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
      <section style={{ padding: "100px 0", background: "var(--color-bg-secondary)" }}>
        <div className="section-container" style={{ maxWidth: "720px", textAlign: "center" }}>
          <h2 style={{ fontSize: "11px", letterSpacing: "4px", color: "var(--color-accent)", fontWeight: 500, marginBottom: "32px", textTransform: "uppercase" as const }}>
            The Meaning of Hommage
          </h2>
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
            <div style={{ marginTop: "48px" }}>
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
