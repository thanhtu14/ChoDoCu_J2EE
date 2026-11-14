import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon";
import { ErrorBox } from "../../components/common/State";
import AdminPageSkeleton from "../../components/admin/AdminPageSkeleton";
import { useAuth } from "../../contexts/AuthContext";
import { AdminDashboardSampleData } from "../../data/adminDashboardSample";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";
import { formatDateTime, formatPrice, timeAgo } from "../../utils/format";

export default function AdminHome() {
  useDocumentTitle("Dashboard quản trị");
  const { user } = useAuth();
  const { data, loading, error, reload } = useFetch(
    () => new Promise<ReturnType<typeof AdminDashboardSampleData.create>>((resolve) => window.setTimeout(() => resolve(AdminDashboardSampleData.create()), 550)),
    [],
  );

  if (loading && !data) return <AdminPageSkeleton variant="dashboard" />;
  if (error || !data) return <ErrorBox message={error ?? "Không tải được dữ liệu dashboard."} onRetry={reload} />;

  const pendingReports = data.reports.items.filter((report) => report.trangThai === "ChoXuLy");
  const categoryCounts = new Map<string, number>();
  data.posts.items.forEach((post) => categoryCounts.set(post.tenDanhMuc, (categoryCounts.get(post.tenDanhMuc) ?? 0) + 1));
  const categories = [...categoryCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
  const recentReports = [...data.reports.items].sort((a, b) => Date.parse(b.ngayTao) - Date.parse(a.ngayTao)).slice(0, 4);
  const pending = pendingReports.length;
  const monthlyActivity = data.monthlyActivity;
  const chartMax = Math.ceil(Math.max(...monthlyActivity.flatMap((item) => [item.userRegistrations, item.posts])) / 300) * 300;
  const chartPlotHeight = 232;
  const chartY = (value: number) => chartPlotHeight * (1 - value / chartMax);
  // Each SVG series follows the center of its own bar in every month pair.
  const monthCenterX = (index: number) => ((index + 0.5) / monthlyActivity.length) * 1200;
  const userX = (index: number) => monthCenterX(index) - 9;
  const postX = (index: number) => monthCenterX(index) + 9;
  const userLine = monthlyActivity.map((item, index) => `${userX(index)},${chartY(item.userRegistrations)}`).join(" ");
  const postLine = monthlyActivity.map((item, index) => `${postX(index)},${chartY(item.posts)}`).join(" ");

  return <div className="admin-dashboard">
    <div className="admin-dashboard-heading">
      <div><div className="admin-version"><span>HỆ THỐNG V2.4</span><i /> <b className="admin-sample-badge">DỮ LIỆU MẪU · PREVIEW</b></div><h1>Dashboard Admin Chợ Đồ Cũ</h1><p>Theo dõi người dùng, bài đăng và hoạt động kiểm duyệt trên sàn.</p></div>
      <div className="admin-dashboard-tools"><span className="admin-date-filter">Hôm nay　 <b>Tuần này</b>　 Tháng này</span><AdminRefreshButton/></div>
    </div>

    <section className="admin-kpis" aria-label="Chỉ số tổng quan">
      <article className="admin-kpi kpi-orange"><div><span className="kpi-label">Tổng doanh thu</span><i><Icon name="tag" size={17} /></i></div><strong>1.248.000.000 đ</strong><small><b>↗ +12,8%</b> so với tuần trước</small></article>
      <article className="admin-kpi kpi-green"><div><span className="kpi-label">Bài đăng hoạt động</span><i><Icon name="image" size={17} /></i></div><strong>68.240</strong><small><b>↗ +9,4%</b> tin đăng được duyệt</small></article>
      <article className="admin-kpi kpi-gold"><div><span className="kpi-label">Người dùng hoạt động</span><i><Icon name="user" size={17} /></i></div><strong>14.320</strong><small><b>↗ +7,1%</b> trong tuần này</small></article>
      <article className="admin-kpi kpi-rose"><div><span className="kpi-label">Giao dịch thành công</span><i><Icon name="check" size={17} /></i></div><strong>3.240</strong><small><b>● 1.240</b> giao dịch hôm nay</small></article>
    </section>

    <section className="admin-dash-grid admin-dash-grid-top">
      <article className="admin-dash-card admin-trend-card">
        <header><div><h2>Người dùng đăng ký &amp; bài đăng theo tháng</h2><p>Số lượng phát sinh trong 12 tháng gần nhất · Đơn vị: lượt</p></div><div className="admin-chart-legends"><span><i className="legend-user" /> Người dùng đăng ký</span><span><i className="legend-post" /> Bài đăng</span></div></header>
        {monthlyActivity.length ? <div className="admin-post-chart admin-monthly-chart" aria-label="Biểu đồ số người dùng đăng ký và bài đăng theo 12 tháng">
          <div className="chart-y-labels">{Array.from({ length: Math.floor(chartMax / 300) + 1 }, (_, index) => chartMax - index * 300).map((tick) => <span key={tick}>{tick.toLocaleString("vi-VN")}</span>)}</div>
          <div className="chart-plot"><div className="chart-gridlines">{Array.from({ length: Math.floor(chartMax / 300) + 1 }, (_, index) => <i key={index} />)}</div><div className="chart-bars">{monthlyActivity.map((item) => <div className="chart-month" key={item.month} title={`${item.month}: ${item.userRegistrations} người dùng, ${item.posts} bài đăng`}><span className="chart-month-bars"><i className="chart-user-bar" style={{ height: `${item.userRegistrations / chartMax * 100}%` }} /><i className="chart-post-bar" style={{ height: `${item.posts / chartMax * 100}%` }} /></span><small>{item.month}</small></div>)}</div><svg className="chart-lines" viewBox={`0 0 1200 ${chartPlotHeight}`} preserveAspectRatio="none" aria-hidden="true"><polyline className="chart-line-user" points={userLine} /><polyline className="chart-line-post" points={postLine} />{monthlyActivity.map((item, index) => <g key={item.month}><circle className="chart-dot-user" cx={userX(index)} cy={chartY(item.userRegistrations)} r="3" /><circle className="chart-dot-post" cx={postX(index)} cy={chartY(item.posts)} r="3" /></g>)}</svg></div>
        </div> : <div className="admin-empty-chart">Chưa có dữ liệu theo tháng.</div>}
      </article>
      <article className="admin-dash-card admin-category-card">
        <header><div><h2>Phân bổ danh mục</h2><p>Tỷ trọng trong các tin gần đây</p></div><Icon name="grid" size={17} /></header>
        <div className="admin-donut-wrap"><div className="admin-donut" style={{ background: categories.length ? `conic-gradient(${categories.map(([, count], i) => `${["#ff681e", "#e8a000", "#0c8359", "#ffae85"][i]} ${i * 100 / categories.length}% ${(i + 1) * 100 / categories.length}%`).join(",")})` : "#e9edf1" }}><div><strong>{data.posts.totalCount.toLocaleString("vi-VN")}</strong><span>Tổng bài đăng</span></div></div></div>
        <ul className="admin-category-legend">{categories.map(([name, count], i) => <li key={name}><i style={{ background: ["#ff681e", "#e8a000", "#0c8359", "#ffae85"][i] }} /><span>{name}</span><b>{Math.round(count / Math.max(1, data.posts.items.length) * 100)}%</b></li>)}{!categories.length && <li>Chưa có dữ liệu danh mục.</li>}</ul>
        <Link className="admin-card-link" to="/quan-tri/danh-muc">Quản lý danh mục <Icon name="right" size={15} /></Link>
      </article>
    </section>

    <section className="admin-dash-grid admin-dash-grid-bottom">
      <article className="admin-dash-card admin-transactions-card"><header><div><h2>Bài đăng gần đây</h2><p>Các tin đăng mới nhất trên sàn</p></div><Link to="/quan-tri/duyet-bai">Mở kiểm duyệt</Link></header>
        <div className="admin-recent-list">{data.posts.items.slice(0, 4).map((post, i) => <div className="admin-recent-row" key={post.id}><span className={`admin-row-index row-index-${i}`}>{i + 1}</span><div className="admin-row-content"><strong>{post.tieuDe}</strong><small>{post.tenDanhMuc} · {post.tenNguoiDang} · {timeAgo(post.ngayDang)}</small></div><b>{formatPrice(post.giaTien)}</b></div>)}{!data.posts.items.length && <p className="admin-no-rows">Chưa có bài đăng.</p>}</div>
        <Link className="admin-card-link" to="/quan-tri/duyet-bai">Mở trang kiểm duyệt <Icon name="right" size={15} /></Link>
      </article>
      <article className="admin-dash-card admin-activity-card"><header><div><h2>Hoạt động kiểm duyệt</h2><p>Báo cáo mới nhất cần theo dõi</p></div><span className={pending ? "admin-live-dot" : "admin-no-pending"}>{pending ? `${pending} chờ xử lý` : "Đã cập nhật"}</span></header>
        <div className="admin-activity-list">{recentReports.map((report, i) => <Link to="/quan-tri/bao-cao" className="admin-activity-row" key={report.id}><span className={`activity-icon activity-${i}`}><Icon name={report.trangThai === "ChoXuLy" ? "flag" : "check"} size={16} /></span><span><strong>{report.tieuDeBaiDang || `Báo cáo tin #${report.idBaiDang}`}</strong><small>{report.tenNguoiBaoCao} · {timeAgo(report.ngayTao)}</small></span><b className={report.trangThai === "ChoXuLy" ? "activity-pending" : "activity-done"}>{report.trangThai === "ChoXuLy" ? "Chờ xử lý" : "Đã xử lý"}</b></Link>)}{!recentReports.length && <p className="admin-no-rows">Chưa có báo cáo vi phạm.</p>}</div>
        <div className="admin-activity-footer"><span>{pending} báo cáo đang chờ xử lý</span><Link to="/quan-tri/bao-cao">Xem báo cáo <Icon name="right" size={14} /></Link></div>
      </article>
    </section>
    <p className="admin-data-caption">Các số liệu trên là dữ liệu mẫu phục vụ xem trước giao diện · {formatDateTime(new Date().toISOString())}</p>
  </div>;
}
