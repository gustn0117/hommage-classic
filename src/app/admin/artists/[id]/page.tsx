"use client";

import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../../AdminShell";
import type { ArtistRow, FilmographyRow } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  diffuser: "디퓨저",
  candle: "캔들",
  soap: "솝",
  giftset: "기프트세트",
};

export default function ProductEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<ArtistRow | null>(null);
  const [specs, setSpecs] = useState<FilmographyRow[]>([]);
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const load = async () => {
    const res = await fetch(`/api/artists/${id}`);
    if (!res.ok) return router.push("/admin/artists");
    const data = await res.json();
    const { filmography, ...rest } = data;
    setProduct(rest);
    setSpecs(filmography || []);
  };

  useEffect(() => { load(); }, [id]);

  const saveProduct = async () => {
    if (!product) return;
    setSaving(true);
    await fetch(`/api/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
    setSaving(false);
    showToast("저장되었습니다");
  };

  const uploadImage = async (file: File, type: "profile" | "photo") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("artistId", id);
    formData.append("type", type);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) return null;
    const { url } = await res.json();
    return url as string;
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !product) return;
    const url = await uploadImage(file, "profile");
    if (url) {
      const updated = { ...product, profile_image: url };
      setProduct(updated);
      await fetch(`/api/artists/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_image: url }),
      });
      showToast("대표 이미지가 업로드되었습니다");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !product) return;
    for (const file of Array.from(files)) {
      const url = await uploadImage(file, "photo");
      if (url) {
        const newPhotos = [...(product.photos || []), url];
        setProduct({ ...product, photos: newPhotos });
        await fetch(`/api/artists/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photos: newPhotos }),
        });
      }
    }
    showToast("사진이 업로드되었습니다");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = async (index: number) => {
    if (!product) return;
    const newPhotos = product.photos.filter((_, i) => i !== index);
    setProduct({ ...product, photos: newPhotos });
    await fetch(`/api/artists/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ photos: newPhotos }),
    });
    showToast("사진이 삭제되었습니다");
  };

  // Specs (using filmography table)
  const [newSpec, setNewSpec] = useState({ year: "", category: "", title: "", role: "" });

  const addSpec = async () => {
    if (!newSpec.category || !newSpec.title) return;
    const res = await fetch("/api/filmography", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newSpec, artist_id: id, sort_order: specs.length }),
    });
    if (res.ok) {
      const data = await res.json();
      setSpecs([...specs, data]);
      setNewSpec({ year: "", category: "", title: "", role: "" });
      showToast("스펙이 추가되었습니다");
    }
  };

  const deleteSpec = async (specId: number) => {
    await fetch(`/api/filmography/${specId}`, { method: "DELETE" });
    setSpecs(specs.filter((s) => s.id !== specId));
    showToast("스펙이 삭제되었습니다");
  };

  if (!product) return <AdminShell><p>로딩 중...</p></AdminShell>;

  const update = (key: keyof ArtistRow, value: string) => {
    setProduct({ ...product, [key]: value });
  };

  return (
    <AdminShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: "4px" }}>
            {product.name_ko}
          </h1>
          <span style={{ fontSize: "12px", padding: "2px 10px", borderRadius: "4px", background: "rgba(26,46,36,0.08)", color: "var(--color-green)" }}>
            {CATEGORY_LABELS[product.birth_date] || product.birth_date}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => router.push("/admin/artists")}>
            목록으로
          </button>
          <button className="admin-btn admin-btn-primary" onClick={saveProduct} disabled={saving}>
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>

      {/* 대표 이미지 */}
      <div className="admin-card">
        <div className="admin-card-header">대표 이미지</div>
        <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
          <div style={{ width: "150px", aspectRatio: "1/1", borderRadius: "6px", overflow: "hidden", background: "var(--color-bg-card)", border: "1px solid var(--color-border)", flexShrink: 0 }}>
            {product.profile_image ? (
              <img src={product.profile_image} alt="product" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-muted)", fontSize: "12px" }}>
                NO IMAGE
              </div>
            )}
          </div>
          <div>
            <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileUpload} style={{ display: "none" }} />
            <button className="admin-btn admin-btn-secondary" onClick={() => profileInputRef.current?.click()}>
              이미지 업로드
            </button>
            <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "8px" }}>
              JPG, PNG, WebP / 최대 5MB
            </p>
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="admin-card">
        <div className="admin-card-header">상품 정보</div>
        <div className="admin-form-grid">
          <div className="admin-form-group">
            <label className="admin-label">상품명 (한글)</label>
            <input className="admin-input" value={product.name_ko} onChange={(e) => update("name_ko", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">상품명 (영문)</label>
            <input className="admin-input" value={product.name_en} onChange={(e) => update("name_en", e.target.value.toUpperCase())} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">카테고리</label>
            <select className="admin-input" value={product.birth_date} onChange={(e) => update("birth_date", e.target.value)}>
              <option value="diffuser">디퓨저</option>
              <option value="candle">캔들</option>
              <option value="soap">솝</option>
              <option value="giftset">기프트세트</option>
            </select>
          </div>
          <div className="admin-form-group">
            <label className="admin-label">가격 / 용량</label>
            <input className="admin-input" placeholder="200ml / 38,000원" value={product.height} onChange={(e) => update("height", e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">한줄 요약</label>
            <input className="admin-input" placeholder="간단한 상품 설명" value={product.weight} onChange={(e) => update("weight", e.target.value)} />
          </div>
        </div>
        <div className="admin-form-group" style={{ marginTop: "16px" }}>
          <label className="admin-label">상세 설명</label>
          <textarea
            className="admin-input"
            rows={5}
            placeholder="상품에 대한 상세한 설명을 입력하세요.&#10;줄바꿈이 그대로 반영됩니다."
            value={product.specialty}
            onChange={(e) => update("specialty", e.target.value)}
            style={{ resize: "vertical" }}
          />
        </div>
      </div>

      {/* 상품 스펙 */}
      <div className="admin-card">
        <div className="admin-card-header">상품 스펙</div>

        {specs.length > 0 && (
          <table className="admin-table" style={{ marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>항목</th>
                <th>구분</th>
                <th>설명</th>
                <th>비고</th>
                <th style={{ width: "60px" }}></th>
              </tr>
            </thead>
            <tbody>
              {specs.map((s) => (
                <tr key={s.id}>
                  <td>{s.year}</td>
                  <td>{s.category}</td>
                  <td style={{ color: "var(--color-text-primary)" }}>{s.title}</td>
                  <td>{s.role}</td>
                  <td>
                    <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => deleteSpec(s.id)}>
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="admin-form-grid" style={{ alignItems: "flex-end" }}>
          <div className="admin-form-group">
            <label className="admin-label">항목</label>
            <input className="admin-input" placeholder="용량, 성분, 향..." value={newSpec.year} onChange={(e) => setNewSpec({ ...newSpec, year: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">구분</label>
            <input className="admin-input" placeholder="기본정보, 원료..." value={newSpec.category} onChange={(e) => setNewSpec({ ...newSpec, category: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">설명</label>
            <input className="admin-input" placeholder="상세 내용" value={newSpec.title} onChange={(e) => setNewSpec({ ...newSpec, title: e.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-label">비고</label>
            <input className="admin-input" placeholder="Vegan, Natural..." value={newSpec.role} onChange={(e) => setNewSpec({ ...newSpec, role: e.target.value })} />
          </div>
        </div>
        <button className="admin-btn admin-btn-secondary" onClick={addSpec} style={{ marginTop: "8px" }}>
          + 스펙 추가
        </button>
      </div>

      {/* 갤러리 사진 */}
      <div className="admin-card">
        <div className="admin-card-header">상품 갤러리</div>
        <div className="admin-photo-grid">
          {(product.photos || []).map((url, idx) => (
            <div key={idx} className="admin-photo-item">
              <img src={url} alt={`photo ${idx + 1}`} />
              <button className="admin-photo-remove" onClick={() => removePhoto(idx)}>
                ✕
              </button>
            </div>
          ))}
          <label className="admin-photo-add" onClick={() => fileInputRef.current?.click()}>
            + 사진 추가
          </label>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: "none" }} />
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </AdminShell>
  );
}
