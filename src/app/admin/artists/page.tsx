"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminShell from "../AdminShell";
import type { ArtistRow } from "@/lib/types";

const CATEGORIES = [
  { value: "", label: "전체" },
  { value: "diffuser", label: "디퓨저" },
  { value: "candle", label: "캔들" },
  { value: "soap", label: "솝" },
  { value: "giftset", label: "기프트세트" },
];

const CATEGORY_LABELS: Record<string, string> = {
  diffuser: "디퓨저",
  candle: "캔들",
  soap: "솝",
  giftset: "기프트세트",
};

export default function ProductsPage() {
  const [products, setProducts] = useState<(ArtistRow & { filmography: unknown[] })[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [filterCat, setFilterCat] = useState("");
  const [form, setForm] = useState({ id: "", name_ko: "", name_en: "", birth_date: "diffuser" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const load = () => {
    fetch("/api/artists")
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setProducts(d));
  };

  useEffect(load, []);

  const filtered = filterCat ? products.filter((p) => p.birth_date === filterCat) : products;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/artists", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, sort_order: products.length }),
    });
    if (res.ok) {
      setForm({ id: "", name_ko: "", name_en: "", birth_date: "diffuser" });
      setShowAdd(false);
      load();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 상품을 삭제하시겠습니까?`)) return;
    await fetch(`/api/artists/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <AdminShell>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 className="admin-page-title" style={{ marginBottom: 0 }}>상품 관리</h1>
        <button className="admin-btn admin-btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "취소" : "+ 상품 추가"}
        </button>
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilterCat(cat.value)}
            className={`admin-btn admin-btn-sm ${filterCat === cat.value ? "admin-btn-primary" : "admin-btn-secondary"}`}
          >
            {cat.label}
            {cat.value && ` (${products.filter((p) => p.birth_date === cat.value).length})`}
            {!cat.value && ` (${products.length})`}
          </button>
        ))}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="admin-card" style={{ marginBottom: "24px" }}>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">상품 ID (영문, 하이픈)</label>
              <input
                className="admin-input"
                placeholder="lavender-diffuser"
                value={form.id}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                required
                pattern="[a-z0-9\-]+"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">카테고리</label>
              <select
                className="admin-input"
                value={form.birth_date}
                onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              >
                <option value="diffuser">디퓨저</option>
                <option value="candle">캔들</option>
                <option value="soap">솝</option>
                <option value="giftset">기프트세트</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">상품명 (한글)</label>
              <input
                className="admin-input"
                placeholder="라벤더 디퓨저"
                value={form.name_ko}
                onChange={(e) => setForm({ ...form, name_ko: e.target.value })}
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">상품명 (영문)</label>
              <input
                className="admin-input"
                placeholder="LAVENDER DIFFUSER"
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value.toUpperCase() })}
                required
              />
            </div>
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" disabled={loading} style={{ marginTop: "12px" }}>
            {loading ? "추가 중..." : "상품 추가"}
          </button>
        </form>
      )}

      <table className="admin-table">
        <thead>
          <tr>
            <th style={{ width: "60px" }}>이미지</th>
            <th>상품명</th>
            <th>영문명</th>
            <th>카테고리</th>
            <th style={{ width: "140px" }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td>
                {p.profile_image ? (
                  <img src={p.profile_image} alt="" style={{ width: "48px", height: "48px", objectFit: "cover", borderRadius: "4px" }} />
                ) : (
                  <div style={{ width: "48px", height: "48px", background: "var(--color-bg-card)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "var(--color-text-muted)" }}>
                    NO IMG
                  </div>
                )}
              </td>
              <td style={{ color: "var(--color-text-primary)" }}>{p.name_ko}</td>
              <td>{p.name_en}</td>
              <td>
                <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "11px", background: "rgba(26,46,36,0.08)", color: "var(--color-green)" }}>
                  {CATEGORY_LABELS[p.birth_date] || p.birth_date}
                </span>
              </td>
              <td>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => router.push(`/admin/artists/${p.id}`)}>
                    편집
                  </button>
                  <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => handleDelete(p.id, p.name_ko)}>
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", color: "var(--color-text-muted)", padding: "40px" }}>
                {filterCat ? `등록된 ${CATEGORY_LABELS[filterCat]} 상품이 없습니다.` : "등록된 상품이 없습니다."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </AdminShell>
  );
}
