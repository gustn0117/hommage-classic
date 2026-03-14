import { createPublicClient } from "@/lib/supabase";
import HomeClient from "./HomeClient";
import type { BrandInfo, HeroVideo, SnsLinks } from "@/lib/types";

export const dynamic = "force-dynamic";

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

function normalizeHeroVideo(raw: any): HeroVideo {
  if (raw?.url) return raw as HeroVideo;
  return {
    type: "local",
    url: "",
    fallbackText: "HOMMAGE CLASSIC",
  };
}

function normalizeSnsLinks(raw: any): SnsLinks {
  return {
    instagram: raw?.instagram || "",
    x: raw?.x || "",
    youtube: raw?.youtube || "",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export default async function Home() {
  const supabase = createPublicClient();

  const [
    { data: artists },
    { data: filmography },
    { data: notices },
    { data: companyInfoRow },
    { data: brandInfoRow },
    { data: heroVideoRow },
    { data: snsLinksRow },
  ] = await Promise.all([
    supabase.from("artists").select("*").order("sort_order", { ascending: true }),
    supabase.from("filmography").select("*").order("sort_order", { ascending: true }),
    supabase.from("notices").select("*").order("id", { ascending: false }),
    supabase.from("site_settings").select("value").eq("key", "company_info").single(),
    supabase.from("site_settings").select("value").eq("key", "audition_info").single(),
    supabase.from("site_settings").select("value").eq("key", "hero_video").single(),
    supabase.from("site_settings").select("value").eq("key", "sns_links").single(),
  ]);

  const productsWithDetails = (artists || []).map((artist) => ({
    ...artist,
    filmography: (filmography || []).filter((f) => f.artist_id === artist.id),
  }));

  return (
    <HomeClient
      products={productsWithDetails}
      notices={notices || []}
      companyInfo={companyInfoRow?.value as never}
      brandInfo={normalizeBrandInfo(brandInfoRow?.value)}
      heroVideo={normalizeHeroVideo(heroVideoRow?.value)}
      snsLinks={normalizeSnsLinks(snsLinksRow?.value)}
    />
  );
}
