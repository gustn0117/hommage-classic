import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase";
import { DEFAULT_PRODUCTS } from "@/data/products";
import ProductDetailClient from "./ProductDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = DEFAULT_PRODUCTS.find((p) => p.id === id);
  return { title: product ? product.name_en : "Product" };
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  // Try DB first, fall back to static data
  const supabase = createPublicClient();
  const { data: artist } = await supabase.from("artists").select("*").eq("id", id).single();

  let product;
  if (artist) {
    const { data: filmography } = await supabase
      .from("filmography")
      .select("*")
      .eq("artist_id", id)
      .order("sort_order", { ascending: true });
    product = { ...artist, filmography: filmography || [] };
  } else {
    const found = DEFAULT_PRODUCTS.find((p) => p.id === id);
    if (!found) {
      const { notFound } = await import("next/navigation");
      notFound();
    }
    product = found;
  }

  return <ProductDetailClient product={product!} />;
}
