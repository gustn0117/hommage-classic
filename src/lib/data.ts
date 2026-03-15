import { createPublicClient } from "@/lib/supabase";
import type { BrandInfo, SnsLinks, CompanyInfo } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function normalizeBrandInfo(raw: any): BrandInfo {
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

export function normalizeSnsLinks(raw: any): SnsLinks {
  return {
    instagram: raw?.instagram || "",
    x: raw?.x || "",
    youtube: raw?.youtube || "",
  };
}

export function normalizeCompanyInfo(raw: any): CompanyInfo {
  return {
    name: raw?.name || "HOMMAGE CLASSIC",
    nameKo: raw?.nameKo || "오마주클래식",
    ceo: raw?.ceo || "",
    address: raw?.address || "",
    addressDetail: raw?.addressDetail || "",
    phone: raw?.phone || "",
    email: raw?.email || "hommageclassic@gmail.com",
    businessNumber: raw?.businessNumber || "",
    description: raw?.description || "",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function getSiteData() {
  const supabase = createPublicClient();
  const [
    { data: companyInfoRow },
    { data: brandInfoRow },
    { data: snsLinksRow },
  ] = await Promise.all([
    supabase.from("site_settings").select("value").eq("key", "company_info").single(),
    supabase.from("site_settings").select("value").eq("key", "audition_info").single(),
    supabase.from("site_settings").select("value").eq("key", "sns_links").single(),
  ]);

  return {
    companyInfo: normalizeCompanyInfo(companyInfoRow?.value),
    brandInfo: normalizeBrandInfo(brandInfoRow?.value),
    snsLinks: normalizeSnsLinks(snsLinksRow?.value),
  };
}
