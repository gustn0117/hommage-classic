"use client";

import { useEffect, useState } from "react";

interface Props {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageHero({ title, subtitle, image }: Props) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  return (
    <section className="page-hero">
      {image && <img src={image} alt="" className="page-hero-img" />}
      <div className="page-hero-overlay" />
      <div className="page-hero-grain" />
      <div className={`page-hero-content ${loaded ? "loaded" : ""}`}>
        <span className="page-hero-label">HOMMAGE CLASSIC</span>
        <h1 className="page-hero-title">{title}</h1>
        <div className="page-hero-line" />
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
      <div className="page-hero-scroll-hint">
        <div className="page-hero-scroll-line" />
      </div>
    </section>
  );
}
