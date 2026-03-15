import "./admin.css";

export const metadata = {
  title: "관리자 - HOMMAGE CLASSIC",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-root">{children}</div>;
}
