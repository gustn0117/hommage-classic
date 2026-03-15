"use client";

import { useState } from "react";

interface Notice {
  id: number;
  title: string;
  date: string;
  content: string;
}

export default function NoticeClient({ notices }: { notices: Notice[] }) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div>
      {notices.length > 0 ? notices.map((notice) => (
        <div key={notice.id} className="notice-item" onClick={() => setOpenId(openId === notice.id ? null : notice.id)}>
          <div className="notice-date">{notice.date}</div>
          <div className="notice-title-text">{notice.title}</div>
          <svg className={`notice-chevron ${openId === notice.id ? "open" : ""}`} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 6l4 4 4-4" />
          </svg>
          <div className={`notice-content ${openId === notice.id ? "open" : ""}`}>
            <div className="notice-content-inner" style={{ whiteSpace: "pre-line" }}>{notice.content}</div>
          </div>
        </div>
      )) : (
        <p style={{ color: "var(--color-text-muted)", fontSize: "14px", fontWeight: 300, textAlign: "center", padding: "60px 0" }}>
          등록된 공지사항이 없습니다.
        </p>
      )}
    </div>
  );
}
