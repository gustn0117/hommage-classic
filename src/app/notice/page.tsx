import type { Metadata } from "next";
import { createPublicClient } from "@/lib/supabase";
import NoticeClient from "./NoticeClient";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Notice" };
export const dynamic = "force-dynamic";

export default async function NoticePage() {
  const supabase = createPublicClient();
  const { data: notices } = await supabase
    .from("notices")
    .select("*")
    .order("id", { ascending: false });

  return (
    <>
      <PageHero title="NOTICE" subtitle="오마주클래식 소식" image="/images/detail3.jpg" />
      <section style={{ padding: "100px 0", background: "var(--color-bg-primary)" }}>
        <div className="section-container">
          <NoticeClient notices={notices || []} />
        </div>
      </section>
    </>
  );
}
