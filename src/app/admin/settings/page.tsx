"use client";

import { useState, useEffect } from "react";
import AdminShell from "../AdminShell";
import type { CompanyInfo, BrandInfo, HeroVideo, SnsLinks } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizeBrandInfo(raw: any): BrandInfo {
  if (raw?.values) return raw as BrandInfo;
  return {
    email: raw?.email || "hommageclassic@gmail.com",
    introText1: "HOMMAGE CLASSIC은\n좋은 마음, 정직한 마음을 향기에 담아\n존경과 경의를 표현하는 브랜드입니다.",
    introText2: "한국적 감성과 클래식한 아름다움의 조화 속에서\n사람을 가장 본질적인 순간으로 돌려보내는 향을 만듭니다.",
    values: [
      "정직한 원료, 진심을 담은 제조",
      "한국적 감성과 클래식한 아름다움의 조화",
      "삶을 조용히 정돈하는 향의 경험",
    ],
    slogan: "CRAFTED WITH SINCERE HANDS,\nA LIFE QUIETLY REFINED.\nIT LEADS YOU BACK\nTO WHAT MATTERS MOST — WITHIN.",
    privacyNote: "",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default function SettingsPage() {
  const [company, setCompany] = useState<CompanyInfo | null>(null);
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [hero, setHero] = useState<HeroVideo | null>(null);
  const [sns, setSns] = useState<SnsLinks | null>(null);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  useEffect(() => {
    fetch("/api/settings/company_info").then((r) => r.json()).then(setCompany);
    fetch("/api/settings/audition_info").then((r) => r.json()).then((data) => setBrand(normalizeBrandInfo(data)));
    fetch("/api/settings/hero_video").then((r) => r.json()).then(setHero);
    fetch("/api/settings/sns_links").then((r) => r.json()).then((data) =>
      setSns({ instagram: data?.instagram || "", x: data?.x || "", youtube: data?.youtube || "" })
    );
  }, []);

  const saveSection = async (key: string, data: unknown) => {
    setSaving(key);
    await fetch(`/api/settings/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving("");
    showToast("저장되었습니다");
  };

  if (!company || !brand || !hero || !sns) {
    return <AdminShell><p>로딩 중...</p></AdminShell>;
  }

  return (
    <AdminShell>
      <h1 className="admin-page-title">Settings</h1>

      {/* Hero Video */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div className="admin-card-header" style={{ marginBottom: 0 }}>Hero Video</div>
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => saveSection("hero_video", hero)}
            disabled={saving === "hero_video"}
          >
            {saving === "hero_video" ? "저장 중..." : "저장"}
          </button>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-label">타입</label>
            <select
              className="admin-input"
              value={hero.type}
              onChange={(e) => setHero({ ...hero, type: e.target.value as "youtube" | "local" })}
            >
              <option value="youtube">YouTube</option>
              <option value="local">로컬 비디오</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">URL</label>
            <input
              className="admin-input"
              placeholder={hero.type === "youtube" ? "https://www.youtube.com/embed/..." : "/videos/hero.mp4"}
              value={hero.url}
              onChange={(e) => setHero({ ...hero, url: e.target.value })}
            />
          </div>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>
          비워두면 그라데이션 배경이 표시됩니다.
        </p>
      </div>

      {/* SNS Links */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div className="admin-card-header" style={{ marginBottom: 0 }}>SNS Links</div>
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => saveSection("sns_links", sns)}
            disabled={saving === "sns_links"}
          >
            {saving === "sns_links" ? "저장 중..." : "저장"}
          </button>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-label">Instagram URL</label>
            <input
              className="admin-input"
              placeholder="https://www.instagram.com/..."
              value={sns.instagram}
              onChange={(e) => setSns({ ...sns, instagram: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">X (Twitter) URL</label>
            <input
              className="admin-input"
              placeholder="https://x.com/..."
              value={sns.x}
              onChange={(e) => setSns({ ...sns, x: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">YouTube URL</label>
            <input
              className="admin-input"
              placeholder="https://www.youtube.com/@..."
              value={sns.youtube}
              onChange={(e) => setSns({ ...sns, youtube: e.target.value })}
            />
          </div>
        </div>
        <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "4px" }}>
          비워두면 해당 SNS 아이콘이 사이트에 표시되지 않습니다.
        </p>
      </div>

      {/* Company Info */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div className="admin-card-header" style={{ marginBottom: 0 }}>Company Info</div>
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => saveSection("company_info", company)}
            disabled={saving === "company_info"}
          >
            {saving === "company_info" ? "저장 중..." : "저장"}
          </button>
        </div>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-label">브랜드명 (영문)</label>
            <input className="admin-input" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">브랜드명 (한글)</label>
            <input className="admin-input" value={company.nameKo} onChange={(e) => setCompany({ ...company, nameKo: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">대표</label>
            <input className="admin-input" value={company.ceo} onChange={(e) => setCompany({ ...company, ceo: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">전화번호</label>
            <input className="admin-input" value={company.phone} onChange={(e) => setCompany({ ...company, phone: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">이메일</label>
            <input className="admin-input" value={company.email} onChange={(e) => setCompany({ ...company, email: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">사업자번호</label>
            <input className="admin-input" value={company.businessNumber} onChange={(e) => setCompany({ ...company, businessNumber: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">주소</label>
            <input className="admin-input" value={company.address} onChange={(e) => setCompany({ ...company, address: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">상세 주소</label>
            <input className="admin-input" value={company.addressDetail} onChange={(e) => setCompany({ ...company, addressDetail: e.target.value })} />
          </div>
          <div className="admin-form-group admin-form-full">
            <label className="admin-label">브랜드 소개</label>
            <textarea
              className="admin-input admin-textarea"
              value={company.description}
              onChange={(e) => setCompany({ ...company, description: e.target.value })}
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Brand Info (About Section) */}
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div className="admin-card-header" style={{ marginBottom: 0 }}>Brand Story (About 섹션)</div>
          <button
            className="admin-btn admin-btn-primary admin-btn-sm"
            onClick={() => saveSection("audition_info", brand)}
            disabled={saving === "audition_info"}
          >
            {saving === "audition_info" ? "저장 중..." : "저장"}
          </button>
        </div>

        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-label">문의 이메일</label>
            <input className="admin-input" value={brand.email} onChange={(e) => setBrand({ ...brand, email: e.target.value })} />
          </div>
          <div className="admin-form-group admin-form-full">
            <label className="admin-label">브랜드 소개 텍스트 1 (줄바꿈 지원)</label>
            <textarea
              className="admin-input admin-textarea"
              value={brand.introText1}
              onChange={(e) => setBrand({ ...brand, introText1: e.target.value })}
              rows={3}
            />
          </div>
          <div className="admin-form-group admin-form-full">
            <label className="admin-label">브랜드 소개 텍스트 2 (줄바꿈 지원)</label>
            <textarea
              className="admin-input admin-textarea"
              value={brand.introText2}
              onChange={(e) => setBrand({ ...brand, introText2: e.target.value })}
              rows={3}
            />
          </div>
          <div className="admin-form-group admin-form-full">
            <label className="admin-label">브랜드 가치 (줄바꿈으로 구분)</label>
            <textarea
              className="admin-input admin-textarea"
              value={brand.values.join("\n")}
              onChange={(e) => setBrand({ ...brand, values: e.target.value.split("\n").filter(Boolean) })}
              rows={4}
            />
          </div>
          <div className="admin-form-group admin-form-full">
            <label className="admin-label">브랜드 슬로건 (줄바꿈 지원)</label>
            <textarea
              className="admin-input admin-textarea"
              value={brand.slogan}
              onChange={(e) => setBrand({ ...brand, slogan: e.target.value })}
              rows={4}
            />
          </div>
        </div>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </AdminShell>
  );
}
