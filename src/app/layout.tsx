import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { getSiteData } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://hommage-classic.hsweb.pics"),
  title: { default: "HOMMAGE CLASSIC", template: "%s | HOMMAGE CLASSIC" },
  description: "오마주클래식 - 정직한 마음으로 만든 향, 디퓨저 & 비누 & 기프트세트",
  openGraph: {
    title: "HOMMAGE CLASSIC",
    description: "Crafted with Sincere Hands, A Life Quietly Refined.",
    siteName: "HOMMAGE CLASSIC",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOMMAGE CLASSIC",
    description: "Crafted with Sincere Hands, A Life Quietly Refined.",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { companyInfo, snsLinks } = await getSiteData();

  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer companyInfo={companyInfo} snsLinks={snsLinks} />
      </body>
    </html>
  );
}
