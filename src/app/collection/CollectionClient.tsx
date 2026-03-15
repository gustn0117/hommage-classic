"use client";

import { Fragment } from "react";
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
  birth_date: string;
  specialty: string;
  profile_image: string;
  photos: string[];
  filmography: { year: string; category: string; title: string; role: string }[];
}

const DEFAULT_PRODUCTS = [
  {
    name: "REED DIFFUSER",
    nameKo: "리드 디퓨저",
    image: "/images/diffuser1.jpg",
    subImages: ["/images/diffuser2.jpg", "/images/detail1.jpg", "/images/detail2.jpg", "/images/detail3.jpg"],
    desc: "자연에서 영감을 받은 섬세한 향이 공간을 조용히 채워갑니다.\n정직한 원료만을 담아 만든 오마주클래식의 시그니처 디퓨저.\n\n은은하게 퍼지는 향이 일상에 고요한 여유를 선사합니다.",
    details: [
      { type: "용량", desc: "200ml", note: "" },
      { type: "향 지속", desc: "약 2~3개월", note: "" },
      { type: "원료", desc: "천연 에센셜 오일 블렌딩", note: "Vegan" },
    ],
  },
  {
    name: "NATURAL SOAP",
    nameKo: "내추럴 솝",
    image: "/images/soap1.jpg",
    subImages: ["/images/soap2.jpg", "/images/detail4.jpg", "/images/perfume1.jpg", "/images/perfume2.jpg"],
    desc: "피부에 닿는 순간부터 다른 것을 느낄 수 있도록.\n식물성 오일과 천연 향료로 완성한 부드럽고 깊은 세정의 경험.\n\n매일의 루틴 속에서 작은 사치를 경험하세요.",
    details: [
      { type: "중량", desc: "100g", note: "" },
      { type: "성분", desc: "코코넛오일, 올리브오일, 시어버터", note: "Natural" },
      { type: "특징", desc: "저온 숙성 (Cold Process)", note: "Handmade" },
    ],
  },
  {
    name: "GIFT SET",
    nameKo: "기프트 세트",
    image: "/images/giftset1.jpg",
    subImages: ["/images/candle1.jpg", "/images/candle2.jpg", "/images/about.jpg", "/images/detail1.jpg"],
    desc: "소중한 사람에게 전하는 경의.\n정성스럽게 큐레이션한 향과 케어 아이템을 하나의 세트로 담았습니다.\n\n특별한 날, 또는 아무 이유 없이 전하는 따뜻한 마음.",
    details: [
      { type: "구성", desc: "리드 디퓨저 + 내추럴 솝 + 캔들", note: "" },
      { type: "패키지", desc: "프리미엄 박스 패키징", note: "" },
      { type: "옵션", desc: "메시지 카드 포함 가능", note: "Gift" },
    ],
  },
];

export default function CollectionClient({ products }: { products: Product[] }) {
  return (
    <>
      <PageHero title="COLLECTION" subtitle="정직한 원료로 만든 오마주클래식의 컬렉션" image="/images/diffuser2.jpg" />

      <section style={{ padding: "100px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="product-block">
                <div className="product-name-wrap">
                  <div className="product-name-en">{product.name_en}</div>
                  <div className="product-name-ko">{product.name_ko}</div>
                </div>
                <div className="product-profile-grid">
                  <div>
                    {product.profile_image ? (
                      <img className="product-main-photo" src={product.profile_image} alt={product.name_ko} />
                    ) : (
                      <div className="product-main-photo img-placeholder">PRODUCT</div>
                    )}
                  </div>
                  <div>
                    <div className="product-info-single">
                      <div className="product-info-cell">
                        <div className="product-info-label">Category</div>
                        <div className="product-info-value">{product.birth_date}</div>
                      </div>
                    </div>
                    {product.specialty && (
                      <div className="product-description-text">{renderLines(product.specialty)}</div>
                    )}
                    {product.filmography.length > 0 && (
                      <div>
                        <h3 className="product-detail-header">Details</h3>
                        <table className="product-detail-table">
                          <thead>
                            <tr>
                              <th style={{ width: "100px" }}>Type</th>
                              <th>Description</th>
                              <th style={{ width: "100px" }}>Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            {product.filmography.map((item, idx) => (
                              <tr key={idx}>
                                <td>{item.category}</td>
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
                    {product.photos.map((url, idx) => (
                      <div key={idx} className="product-photo-thumb">
                        <img src={url} alt={`${product.name_ko} ${idx + 1}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            DEFAULT_PRODUCTS.map((item, idx) => (
              <div key={idx} className="product-block">
                <div className="product-name-wrap">
                  <div className="product-name-en">{item.name}</div>
                  <div className="product-name-ko">{item.nameKo}</div>
                </div>
                <div className="product-profile-grid">
                  <div>
                    <img className="product-main-photo" src={item.image} alt={item.nameKo} />
                  </div>
                  <div>
                    <div className="product-description-text">{renderLines(item.desc)}</div>
                    <h3 className="product-detail-header">Details</h3>
                    <table className="product-detail-table">
                      <thead>
                        <tr>
                          <th style={{ width: "100px" }}>항목</th>
                          <th>설명</th>
                          <th style={{ width: "80px" }}>비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.details.map((d, i) => (
                          <tr key={i}>
                            <td>{d.type}</td>
                            <td style={{ color: "var(--color-text-primary)" }}>{d.desc}</td>
                            <td>{d.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="product-photo-grid">
                  {item.subImages.map((url, i) => (
                    <div key={i} className="product-photo-thumb">
                      <img src={url} alt={`${item.nameKo} ${i + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
