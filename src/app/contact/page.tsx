import type { Metadata } from "next";
import { getSiteData } from "@/lib/data";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const { companyInfo } = await getSiteData();

  return (
    <>
      <PageHero title="CONTACT" subtitle="오마주클래식에 문의하세요" image="/images/detail4.jpg" />

      <section style={{ padding: "120px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <div className="contact-grid">
            <div>
              <span className="about-label" style={{ display: "block", marginBottom: "32px" }}>Get in Touch</span>

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
                <div className="contact-info-value">
                  <a href={`mailto:${companyInfo.email}`} style={{ color: "inherit", textDecoration: "none", transition: "color 0.3s" }}>
                    {companyInfo.email}
                  </a>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-label">Business</div>
                <div className="contact-info-value">{companyInfo.businessNumber}</div>
              </div>

              <a href={`mailto:${companyInfo.email}`} className="brand-email-block" style={{ marginTop: "48px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="M22 4L12 13 2 4" />
                </svg>
                <span>이메일 문의하기</span>
              </a>
            </div>
            <div>
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
    </>
  );
}
