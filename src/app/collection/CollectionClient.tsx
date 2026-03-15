"use client";

import { useState, Fragment } from "react";
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

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "default-diffuser", name_ko: "시그니처 디퓨저", name_en: "SIGNATURE DIFFUSER",
    birth_date: "diffuser", height: "200ml", weight: "공간을 조용히 채우는 향",
    specialty: "자연에서 영감을 받은 섬세한 향이 공간을 조용히 채워갑니다.\n정직한 원료만을 담아 만든 오마주클래식의 시그니처 디퓨저.\n\n은은하게 퍼지는 향이 일상에 고요한 여유를 선사합니다.",
    profile_image: "/images/diffuser1.jpg", photos: ["/images/diffuser2.jpg", "/images/detail2.jpg"],
    filmography: [
      { year: "용량", category: "기본정보", title: "200ml", role: "" },
      { year: "향 지속", category: "기본정보", title: "약 2~3개월", role: "" },
      { year: "원료", category: "성분", title: "천연 에센셜 오일 블렌딩", role: "Vegan" },
    ],
  },
  {
    id: "default-candle", name_ko: "아로마 캔들", name_en: "AROMA CANDLE",
    birth_date: "candle", height: "180g", weight: "따뜻한 불빛과 함께하는 향",
    specialty: "소이 왁스와 천연 에센셜 오일로 만든\n은은하고 깊은 향의 캔들.\n\n불을 켜는 순간, 공간이 달라집니다.",
    profile_image: "/images/candle1.jpg", photos: ["/images/giftset1.jpg"],
    filmography: [
      { year: "중량", category: "기본정보", title: "180g", role: "" },
      { year: "연소시간", category: "기본정보", title: "약 40시간", role: "" },
      { year: "원료", category: "성분", title: "소이 왁스, 천연 에센셜 오일", role: "Natural" },
    ],
  },
  {
    id: "default-soap", name_ko: "내추럴 솝", name_en: "NATURAL SOAP",
    birth_date: "soap", height: "100g", weight: "피부에 닿는 정직한 세정",
    specialty: "피부에 닿는 순간부터 다른 것을 느낄 수 있도록.\n식물성 오일과 천연 향료로 완성한\n부드럽고 깊은 세정의 경험.\n\n매일의 루틴 속에서 작은 사치를 경험하세요.",
    profile_image: "/images/soap1.jpg", photos: ["/images/detail1.jpg", "/images/soap2.jpg"],
    filmography: [
      { year: "중량", category: "기본정보", title: "100g", role: "" },
      { year: "성분", category: "원료", title: "코코넛오일, 올리브오일, 시어버터", role: "Natural" },
      { year: "특징", category: "제조", title: "저온 숙성 (Cold Process)", role: "Handmade" },
    ],
  },
  {
    id: "default-giftset", name_ko: "기프트 세트", name_en: "GIFT SET",
    birth_date: "giftset", height: "디퓨저 + 솝 + 캔들", weight: "소중한 사람에게 전하는 경의",
    specialty: "소중한 사람에게 전하는 경의.\n정성스럽게 큐레이션한 향과 케어 아이템을\n하나의 세트로 담았습니다.\n\n특별한 날, 또는 아무 이유 없이 전하는 따뜻한 마음.",
    profile_image: "/images/giftset1.jpg", photos: ["/images/candle1.jpg", "/images/about.jpg"],
    filmography: [
      { year: "구성", category: "기본정보", title: "리드 디퓨저 + 내추럴 솝 + 캔들", role: "" },
      { year: "패키지", category: "기본정보", title: "프리미엄 박스 패키징", role: "" },
      { year: "옵션", category: "추가", title: "메시지 카드 포함 가능", role: "Gift" },
    ],
  },
];

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
              <div className="product-name-wrap">
                <div className="product-name-en">{product.name_en}</div>
                <div className="product-name-ko">
                  {product.name_ko}
                  {product.height && <span style={{ marginLeft: "16px", color: "var(--color-accent)", fontSize: "12px" }}>{product.height}</span>}
                </div>
              </div>

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
