import { getSiteData } from "@/lib/data";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { brandInfo } = await getSiteData();
  return <HomeClient brandInfo={brandInfo} />;
}
