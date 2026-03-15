interface Props {
  title: string;
  subtitle?: string;
  image?: string;
}

export default function PageHero({ title, subtitle, image }: Props) {
  return (
    <section className="page-hero">
      {image && <img src={image} alt="" className="page-hero-img" />}
      <div className="page-hero-overlay" />
      <div className="page-hero-content">
        <h1 className="page-hero-title">{title}</h1>
        {subtitle && <p className="page-hero-subtitle">{subtitle}</p>}
      </div>
    </section>
  );
}
