import type { CompanyInfo, SnsLinks } from "@/lib/types";

interface Props {
  companyInfo: CompanyInfo;
  snsLinks: SnsLinks;
}

export default function Footer({ companyInfo, snsLinks }: Props) {
  return (
    <footer className="footer">
      <div className="section-container">
        <div className="footer-divider" />
        {(snsLinks.instagram || snsLinks.x || snsLinks.youtube) && (
          <div className="footer-sns">
            {snsLinks.instagram && (
              <a href={snsLinks.instagram} target="_blank" rel="noopener noreferrer" className="footer-sns-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
            )}
            {snsLinks.x && (
              <a href={snsLinks.x} target="_blank" rel="noopener noreferrer" className="footer-sns-link" aria-label="X">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            )}
            {snsLinks.youtube && (
              <a href={snsLinks.youtube} target="_blank" rel="noopener noreferrer" className="footer-sns-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12z" />
                </svg>
              </a>
            )}
          </div>
        )}
        <p className="footer-text">&copy; 2026 {companyInfo.name}. All Rights Reserved.</p>
      </div>
    </footer>
  );
}
