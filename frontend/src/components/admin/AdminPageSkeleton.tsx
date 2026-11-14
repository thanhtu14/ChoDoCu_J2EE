interface Props { variant?: "dashboard" | "table" | "form"; }

/** Skeleton dùng trong lúc trang quản trị và dữ liệu đang tải. */
export default function AdminPageSkeleton({ variant = "dashboard" }: Props) {
  if (variant === "table") return <div className="admin-skeleton admin-skeleton-page" aria-label="Đang tải dữ liệu">
    <div className="admin-skel-title" />
    <div className="admin-skel-toolbar"><i /><i /><i /></div>
    <div className="admin-skel-table">{Array.from({ length: 7 }, (_, i) => <div key={i}><i /><i /><i /><i /></div>)}</div>
  </div>;
  if (variant === "form") return <div className="admin-skeleton admin-skeleton-page" aria-label="Đang tải dữ liệu">
    <div className="admin-skel-title" />
    <div className="admin-skel-form"><i /><i /><i /><i /><i /><i /></div>
  </div>;
  return <div className="admin-skeleton admin-skeleton-page" aria-label="Đang tải dashboard">
    <div className="admin-skel-dashboard-head"><div><i /><i /></div><b /></div>
    <div className="admin-skel-kpis">{Array.from({ length: 4 }, (_, i) => <div key={i}><i /><b /><small /></div>)}</div>
    <div className="admin-skel-panels"><div><i /><b /><div /></div><div><i /><b /><div /></div></div>
    <div className="admin-skel-panels admin-skel-bottom"><div><i /><b /><div /></div><div><i /><b /><div /></div></div>
  </div>;
}
