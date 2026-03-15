import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase";
import CollectionClient from "./CollectionClient";

export const metadata: Metadata = { title: "Collection" };
export const dynamic = "force-dynamic";

export default async function CollectionPage() {
  const supabase = createPublicClient();
  const [{ data: artists }, { data: filmography }] = await Promise.all([
    supabase.from("artists").select("*").order("sort_order", { ascending: true }),
    supabase.from("filmography").select("*").order("sort_order", { ascending: true }),
  ]);

  const products = (artists || []).map((a) => ({
    ...a,
    filmography: (filmography || []).filter((f) => f.artist_id === a.id),
  }));

  return <CollectionClient products={products} />;
}
