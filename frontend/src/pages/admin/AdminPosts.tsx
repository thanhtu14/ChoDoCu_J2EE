import { useEffect, useMemo, useState } from "react";
import Icon from "../../components/common/Icon";
import { adminPosts as seedPosts, type AdminPost } from "../../data/adminPosts";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";

type StatusFilter = "Tất cả" | "Chờ duyệt" | "Đã duyệt" | "Bị từ chối";
const statusLabels: Record<AdminPost["status"], string> = { ChoDuyet: "Chờ duyệt", DaDuyet: "Đã duyệt", TuChoi: "Bị từ chối", DaAn: "Đã ẩn" };
const statusClasses: Record<AdminPost["status"], string> = { ChoDuyet: "pending", DaDuyet: "approved", TuChoi: "rejected", DaAn: "hidden" };
const filters: StatusFilter[] = ["Tất cả", "Chờ duyệt", "Đã duyệt", "Bị từ chối"];
const money = (value: number) => value ? `${new Intl.NumberFormat("vi-VN").format(value)} đ` : "Thỏa thuận";

export default function AdminPosts() {
  useDocumentTitle("Quản lý bài đăng");
  const [posts, setPosts] = useState(seedPosts);
  const [filter, setFilter] = useState<StatusFilter>("Tất cả");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả danh mục");
  const [selected, setSelected] = useState<number | null>(null);
  const [editing, setEditing] = useState<AdminPost | null>(null);
  const [page, setPage] = useState(1);
  const [tableLoading, setTableLoading] = useState(false);
  useEffect(() => {
    if (!tableLoading) return;
    const timer = window.setTimeout(() => setTableLoading(false), 480);
    return () => window.clearTimeout(timer);
  }, [tableLoading]);
  const categories = useMemo(() => ["Tất cả danh mục", ...new Set(posts.map(post => post.category))], [posts]);
  const counts = useMemo(() => ({ all: posts.length, pending: posts.filter(p => p.status === "ChoDuyet").length, approved: posts.filter(p => p.status === "DaDuyet").length, rejected: posts.filter(p => p.status === "TuChoi").length }), [posts]);
  const visible = useMemo(() => posts.filter(post => {
    const matchesStatus = filter === "Tất cả" || statusLabels[post.status] === filter;
    const text = `${post.title} ${post.id} ${post.seller} ${post.phone}`.toLocaleLowerCase("vi");
    return matchesStatus && (category === "Tất cả danh mục" || post.category === category) && text.includes(query.toLocaleLowerCase("vi"));
  }), [posts, filter, category, query]);
  const activePost = posts.find(post => post.id === selected) ?? null;
  const saveStatus = (id: number, status: AdminPost["status"]) => { setPosts(current => current.map(post => post.id === id ? { ...post, status } : post)); setEditing(null); };

  return <section className="admin-posts-page">
    <header className="admin-posts-heading">
      <div><span className="admin-posts-eyebrow">QUẢN TRỊ NỘI DUNG</span><h1>Quản lý bài đăng</h1><p>Theo dõi, kiểm duyệt và cập nhật trạng thái bài đăng trên hệ thống.</p></div>
      <div className="admin-posts-heading-actions"><AdminRefreshButton/><button className="admin-posts-export" onClick={() => window.print()}><Icon name="image" size={17}/> Xuất danh sách</button></div>
    </header>

    <section className="admin-posts-stats" aria-label="Thống kê bài đăng">
      <article className="admin-post-stat stat-total"><span>Tổng bài đăng</span><i><Icon name="image" size={19}/></i><strong>{counts.all.toLocaleString("vi-VN")}</strong><small>Trong hệ thống</small></article>
      <article className="admin-post-stat stat-pending"><span>Chờ duyệt</span><i><Icon name="edit" size={19}/></i><strong>{counts.pending.toLocaleString("vi-VN")}</strong><small>Cần xử lý</small></article>
      <article className="admin-post-stat stat-approved"><span>Đã duyệt</span><i><Icon name="check" size={19}/></i><strong>{counts.approved.toLocaleString("vi-VN")}</strong><small>Đang hiển thị</small></article>
      <article className="admin-post-stat stat-rejected"><span>Bị từ chối / ẩn</span><i><Icon name="flag" size={19}/></i><strong>{(counts.rejected + posts.filter(p => p.status === "DaAn").length).toLocaleString("vi-VN")}</strong><small>Cần kiểm tra</small></article>
    </section>

    <section className="admin-posts-panel">
      <nav className="admin-post-tabs" aria-label="Lọc theo trạng thái">{filters.map((item, index) => <button key={item} className={filter === item ? "is-active" : ""} onClick={() => { setFilter(item); setPage(1); setTableLoading(true); }}>{item}{index === 0 ? <small>{counts.all.toLocaleString("vi-VN")}</small> : <small>{[counts.pending, counts.approved, counts.rejected][index - 1]}</small>}</button>)}</nav>
      <div className="admin-posts-bulk"><label><input type="checkbox" aria-label="Chọn tất cả bài đăng"/> Đã chọn: 0 tin</label><button onClick={() => setPosts(current => current.map(post => post.status === "ChoDuyet" ? { ...post, status: "DaDuyet" } : post))}><Icon name="check" size={15}/> Duyệt bài đã chọn</button><button className="bulk-reject" onClick={() => setPosts(current => current.map(post => post.status === "ChoDuyet" ? { ...post, status: "TuChoi" } : post))}><Icon name="x" size={15}/> Từ chối đã chọn</button></div>
      <div className="admin-post-filters"><label className="admin-post-search"><Icon name="search" size={17}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tiêu đề, mã tin hoặc người đăng…" /></label><label className="admin-post-select"><select value={category} onChange={event => setCategory(event.target.value)}>{categories.map(item => <option key={item}>{item}</option>)}</select></label><label className="admin-post-select"><select defaultValue=""><option value="">Khu vực: Toàn quốc</option><option>TP. Hồ Chí Minh</option></select></label><label className="admin-post-select"><select defaultValue="newest"><option value="newest">Hôm nay (mới nhất)</option><option>Cũ nhất</option></select></label><button className="admin-post-refresh" aria-label="Đặt lại bộ lọc" onClick={() => { setQuery(""); setCategory("Tất cả danh mục"); setFilter("Tất cả"); }}><Icon name="image" size={16}/></button></div>
      <div className="admin-post-table-wrap" aria-busy={tableLoading}><table className={`admin-post-table${tableLoading ? " is-loading" : ""}`}><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả"/></th><th>MÃ TIN &amp; ẢNH</th><th>TIÊU ĐỀ &amp; DANH MỤC</th><th>NGƯỜI ĐĂNG</th><th>GIÁ NIÊM YẾT</th><th>THỜI GIAN TẠO</th><th>TRẠNG THÁI</th><th>HÀNH ĐỘNG</th></tr></thead><tbody>{tableLoading ? Array.from({ length: 5 }, (_, index) => <tr className="admin-post-skeleton-row" key={`skeleton-${index}`} aria-hidden="true">{Array.from({ length: 8 }, (_, cell) => <td key={cell}><i /></td>)}</tr>) : visible.length ? visible.map(post => <tr key={post.id}><td><input type="checkbox" aria-label={`Chọn tin ${post.id}`}/></td><td><div className="admin-post-product"><img src={post.image} alt=""/><span>#{post.id}</span></div></td><td><strong className="admin-post-title">{post.title}</strong><small className="admin-post-category">{post.category}</small></td><td><strong>{post.seller}</strong><small>{post.phone}</small></td><td><strong className="admin-post-price">{money(post.price)}</strong></td><td>{post.postedAt}</td><td><span className={`admin-post-status status-${statusClasses[post.status]}`}><i/>{statusLabels[post.status]}</span></td><td><div className="admin-post-actions"><button title="Xem chi tiết" aria-label={`Xem chi tiết tin ${post.id}`} onClick={() => setSelected(post.id)}><Icon name="search" size={16}/></button><button title="Sửa trạng thái" aria-label={`Sửa trạng thái tin ${post.id}`} onClick={() => setEditing(post)}><Icon name="edit" size={16}/></button></div></td></tr>) : <tr><td colSpan={8} className="admin-post-empty">Không tìm thấy bài đăng phù hợp.</td></tr>}</tbody></table></div>
      <footer className="admin-post-footer"><span>Hiển thị <b>{visible.length ? 1 : 0}–{visible.length}</b> trên tổng số <b>{visible.length}</b> bài đăng</span><label>Xem <select defaultValue="10"><option>10 dòng</option><option>20 dòng</option><option>50 dòng</option></select></label><nav aria-label="Phân trang"><button disabled={page === 1} onClick={() => setPage(1)}>‹</button><button className="is-current">{page}</button><button onClick={() => setPage(page + 1)}>{page + 1}</button><button onClick={() => setPage(page + 1)}>›</button></nav></footer>
    </section>

    {activePost && <div className="admin-post-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setSelected(null); }}><section className="admin-post-modal" role="dialog" aria-modal="true" aria-labelledby="admin-post-detail-title"><header><div><span>CHI TIẾT BÀI ĐĂNG · #{activePost.id}</span><h2 id="admin-post-detail-title">{activePost.title}</h2></div><button onClick={() => setSelected(null)} aria-label="Đóng"><Icon name="x"/></button></header><div className="admin-post-detail"><img src={activePost.image} alt={activePost.title}/><div><span className={`admin-post-status status-${statusClasses[activePost.status]}`}><i/>{statusLabels[activePost.status]}</span><h3>{money(activePost.price)}</h3><p>{activePost.description}</p><dl><div><dt>Người đăng</dt><dd>{activePost.seller}</dd></div><div><dt>Điện thoại</dt><dd>{activePost.phone}</dd></div><div><dt>Danh mục</dt><dd>{activePost.category}</dd></div><div><dt>Khu vực</dt><dd>{activePost.location}</dd></div><div><dt>Ngày tạo</dt><dd>{activePost.postedAt}</dd></div></dl></div></div><footer><button className="detail-secondary" onClick={() => { setSelected(null); setEditing(activePost); }}><Icon name="edit" size={16}/> Sửa trạng thái</button><button className="detail-primary" onClick={() => setSelected(null)}>Đóng chi tiết</button></footer></section></div>}
    {editing && <div className="admin-post-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setEditing(null); }}><section className="admin-post-status-modal" role="dialog" aria-modal="true" aria-labelledby="admin-post-status-title"><header><div><span>CẬP NHẬT NỘI DUNG</span><h2 id="admin-post-status-title">Sửa trạng thái bài đăng</h2></div><button onClick={() => setEditing(null)} aria-label="Đóng"><Icon name="x"/></button></header><p><strong>#{editing.id}</strong> · {editing.title}</p><label>Trạng thái mới<select value={editing.status} onChange={event => setEditing({ ...editing, status: event.target.value as AdminPost["status"] })}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><footer><button className="detail-secondary" onClick={() => setEditing(null)}>Hủy</button><button className="detail-primary" onClick={() => saveStatus(editing.id, editing.status)}>Lưu trạng thái</button></footer></section></div>}
  </section>;
}
