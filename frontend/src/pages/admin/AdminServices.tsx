import { useEffect, useMemo, useState, type FormEvent } from "react";
import Icon from "../../components/common/Icon";
import { adminServicePlansSample, adminServiceRevenueSample, type AdminServicePlanSample } from "../../data/adminServicesSample";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import AdminRefreshButton from "../../components/admin/AdminRefreshButton";

const money = (amount: number) => `${amount.toLocaleString("vi-VN")} đ`;
type PlanDraft = Pick<AdminServicePlanSample, "name" | "tier" | "description" | "durationDays" | "boosts" | "price" | "active" | "color">;
const emptyDraft: PlanDraft = { name: "", tier: "Phổ biến", description: "", durationDays: 30, boosts: 10, price: 200000, active: true, color: "orange" };

export default function AdminServices() {
  useDocumentTitle("Quản lý gói dịch vụ");
  const [plans, setPlans] = useState(adminServicePlansSample);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<number[]>([]);
  const [planDialog, setPlanDialog] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<PlanDraft>(emptyDraft);
  useEffect(() => {
    if (!planDialog) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [planDialog]);
  const filteredPlans = useMemo(() => plans.filter((plan) => {
    const matches = `${plan.name} ${plan.tier} ${plan.description}`.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi"));
    return matches && (filter === "all" || (filter === "active" ? plan.active : !plan.active));
  }), [plans, search, filter]);
  const totalRevenue = plans.reduce((sum, plan) => sum + plan.revenue, 0);
  const totalPurchases = plans.reduce((sum, plan) => sum + plan.purchases, 0);
  const toggleSelected = (id: number) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const openCreate = () => { setEditingId(null); setDraft({ ...emptyDraft }); setPlanDialog(true); };
  const openEdit = (plan: AdminServicePlanSample) => { const { name, tier, description, durationDays, boosts, price, active, color } = plan; setEditingId(plan.id); setDraft({ name, tier, description, durationDays, boosts, price, active, color }); setPlanDialog(true); };
  const savePlan = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    if (editingId !== null) setPlans((current) => current.map((plan) => plan.id === editingId ? { ...plan, ...draft, name: draft.name.trim(), description: draft.description.trim() } : plan));
    else setPlans((current) => [...current, { ...draft, id: Math.max(0, ...current.map((plan) => plan.id)) + 1, name: draft.name.trim(), description: draft.description.trim(), purchases: 0, revenue: 0 }]);
    setPlanDialog(false);
  };
  const cancelPlan = () => {
    setDraft({ ...emptyDraft });
    setEditingId(null);
    setPlanDialog(false);
  };

  const PlanCard = ({ plan }: { plan: AdminServicePlanSample }) => <article className={`admin-plan-card plan-${plan.color}`} key={plan.id}>
    <header><span>{plan.tier}</span><b>{plan.active ? "Đang hiển thị" : "Tạm ẩn"}</b></header>
    <h3>{plan.name}</h3><p>{plan.description}</p>
    <strong>{money(plan.price)}<small> / gói</small></strong>
    <ul><li>{plan.durationDays} ngày sử dụng</li><li>{plan.boosts} lượt đẩy tin</li><li>Hỗ trợ khách hàng</li></ul>
    <button onClick={() => openEdit(plan)}>Chỉnh sửa gói</button>
  </article>;

  return <div className="admin-services-page">
    <header className="admin-services-heading"><div><div className="admin-version"><span>QUẢN LÝ KINH DOANH DỊCH VỤ</span><i /> Doanh thu &amp; gói dịch vụ</div><h1>Quản lý gói dịch vụ</h1><p>Quản lý danh sách gói, giá bán, lượt sử dụng và theo dõi doanh thu dịch vụ trên hệ thống.</p><b className="admin-sample-badge">DỮ LIỆU MẪU · PREVIEW</b></div><div className="admin-services-actions"><AdminRefreshButton/><button className="admin-service-export" onClick={() => window.alert("Đã chuẩn bị báo cáo gói dịch vụ mẫu.")}>↓ Xuất báo cáo</button><button className="admin-service-add" onClick={openCreate}>＋ Tạo gói dịch vụ</button></div></header>

    <section className="admin-service-section"><div className="admin-service-section-title"><div><span>01</span><div><h2>Quản lý gói dịch vụ</h2><p>Tổng quan danh mục và tình trạng các gói hiện hành</p></div></div><span className="admin-service-period">Cập nhật hôm nay · 11/11/2026</span></div>
      <div className="admin-service-kpis plan-kpis">
        <article className="service-kpi service-kpi-orange"><div><span>TỔNG SỐ GÓI DỊCH VỤ</span><i>▤</i></div><strong>{plans.length.toString().padStart(2, "0")}</strong><footer><b>↗ Danh mục dịch vụ</b><span>Tất cả gói hiện có</span></footer></article>
        <article className="service-kpi service-kpi-green"><div><span>GÓI ĐANG HOẠT ĐỘNG</span><i>✓</i></div><strong>{plans.filter((plan) => plan.active).length.toString().padStart(2, "0")}</strong><footer><b>● Đang hiển thị</b><span>cho khách hàng</span></footer></article>
        <article className="service-kpi service-kpi-blue"><div><span>LƯỢT MUA GÓI</span><i>♧</i></div><strong>{totalPurchases.toLocaleString("vi-VN")}</strong><footer><b>↗ +12,6%</b><span>so với kỳ trước</span></footer></article>
        <article className="service-kpi service-kpi-violet"><div><span>GÓI ĐƯỢC ƯA CHUỘNG</span><i>♛</i></div><strong className="service-kpi-name">Gói Tiêu Chuẩn</strong><footer><b>{plans.find((plan) => plan.name.includes("Tiêu Chuẩn"))?.purchases.toLocaleString("vi-VN")} lượt mua</b><span>phổ biến nhất</span></footer></article>
      </div>
      <div className="admin-service-toolbar"><label><Icon name="search" size={17} /><input placeholder="Tìm tên gói dịch vụ, mô tả..." value={search} onChange={(event) => setSearch(event.target.value)} /></label><select value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="active">Đang hoạt động</option><option value="inactive">Đang tạm ẩn</option></select><span>{filteredPlans.length} gói dịch vụ</span></div>
      <div className="admin-service-table-wrap"><table className="admin-service-table"><thead><tr><th><input type="checkbox" aria-label="Chọn tất cả gói" checked={filteredPlans.length > 0 && filteredPlans.every((plan) => selected.includes(plan.id))} onChange={() => setSelected((current) => filteredPlans.every((plan) => current.includes(plan.id)) ? current.filter((id) => !filteredPlans.some((plan) => plan.id === id)) : [...new Set([...current, ...filteredPlans.map((plan) => plan.id)])])} /></th><th>TÊN GÓI DỊCH VỤ</th><th>QUYỀN LỢI / MÔ TẢ</th><th>CHU KỲ</th><th>LƯỢT MUA</th><th>GIÁ BÁN</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead><tbody>{filteredPlans.map((plan) => <tr key={plan.id}><td><input type="checkbox" aria-label={`Chọn ${plan.name}`} checked={selected.includes(plan.id)} onChange={() => toggleSelected(plan.id)} /></td><td><div className="service-plan-name"><i className={`plan-icon plan-icon-${plan.color}`}><Icon name="tag" size={16} /></i><span><strong>{plan.name}</strong><small>{plan.tier} · Dịch vụ dành cho người bán</small></span></div></td><td><span className="service-benefit">＋{plan.boosts} lượt đẩy tin</span><small className="service-desc">{plan.description}</small></td><td><strong>{plan.durationDays} ngày</strong><small>mỗi chu kỳ</small></td><td><strong>{plan.purchases.toLocaleString("vi-VN")}</strong><small>lượt mua</small></td><td><strong className="service-price">{money(plan.price)}</strong><small>đã gồm thuế</small></td><td><span className={`service-state ${plan.active ? "is-active" : "is-paused"}`}><i />{plan.active ? "Đang hoạt động" : "Đang tạm ẩn"}</span></td><td><button className="service-edit-button" onClick={() => openEdit(plan)}><Icon name="edit" size={15} /> Chỉnh sửa</button></td></tr>)}</tbody></table></div>
      <div className="admin-service-table-footer"><span>Hiển thị <b>{filteredPlans.length}</b> trên <b>{plans.length}</b> gói dịch vụ{selected.length > 0 && ` · Đã chọn ${selected.length}`}</span><button onClick={() => window.alert("Điều chỉnh số dòng hiển thị (bản xem trước).")}>Số dòng mỗi trang　10⌄</button></div>
    </section>

    <section className="admin-service-section revenue-section"><div className="admin-service-section-title"><div><span>02</span><div><h2>Doanh thu gói</h2><p>Thống kê doanh thu và hiệu quả kinh doanh dịch vụ</p></div></div><div className="admin-service-revenue-filters"><button>11/2026　▦</button><button>Tất cả các gói dịch vụ　⌄</button></div></div>
      <div className="admin-service-kpis revenue-kpis">
        <article className="service-kpi service-kpi-orange"><div><span>TỔNG DOANH THU GÓI</span><i>₫</i></div><strong>{money(adminServiceRevenueSample.totalRevenue)}</strong><footer><b>↗ +14,8%</b><span>so với cùng kỳ năm trước</span></footer></article>
        <article className="service-kpi service-kpi-blue"><div><span>DOANH THU THÁNG NÀY</span><i>▥</i></div><strong>{money(adminServiceRevenueSample.monthRevenue)}</strong><footer><b>▰ Đang ghi nhận</b><span>tháng 11 năm 2026</span></footer></article>
        <article className="service-kpi service-kpi-violet"><div><span>GIÁ TRỊ ĐƠN TRUNG BÌNH</span><i>◉</i></div><strong>{money(adminServiceRevenueSample.averageOrder)}</strong><footer><b>↗ +6,4%</b><span>so với tháng trước</span></footer></article>
        <article className="service-kpi service-kpi-green"><div><span>NGƯỜI DÙNG ĐANG ĐĂNG KÝ</span><i>♧</i></div><strong>{adminServiceRevenueSample.activeSubscribers.toLocaleString("vi-VN")}</strong><footer><b>↗ +8,2%</b><span>tài khoản sử dụng gói</span></footer></article>
      </div>
      <div className="admin-revenue-table-wrap"><table className="admin-revenue-table"><thead><tr><th>THÁNG / KỲ ĐỐI SOÁT</th><th>DOANH THU THỰC TẾ</th><th>LƯỢT MUA</th><th>GÓI ĐƯỢC ƯA CHUỘNG</th><th>TĂNG TRƯỞNG</th><th>TỶ TRỌNG</th></tr></thead><tbody>{adminServiceRevenueSample.monthly.map((item) => <tr key={item.month}><td><strong>● {item.month}</strong></td><td className="service-price">{money(item.revenue)}</td><td>{item.purchases.toLocaleString("vi-VN")} lượt</td><td><span className="service-best-plan">✦ {item.bestSeller}</span></td><td className={item.growth < 0 ? "growth-down" : "growth-up"}>{item.growth > 0 ? "+" : ""}{item.growth.toFixed(1)}%</td><td><div className="service-share"><i style={{ width: `${Math.min(100, item.revenue / 4700000)}%` }} /><span>{Math.round(item.revenue / totalRevenue * 100)}%</span></div></td></tr>)}</tbody><tfoot><tr><th>TỔNG DOANH THU GHI NHẬN</th><th>{money(totalRevenue)}</th><th>{totalPurchases.toLocaleString("vi-VN")} lượt</th><th>Toàn bộ gói dịch vụ</th><th className="growth-up">+14,8%</th><th>100%</th></tr></tfoot></table></div>
    </section>

    <section className="admin-service-section admin-plan-preview"><div className="admin-service-section-title"><div><span>03</span><div><h2>Xem trước gói dịch vụ</h2><p>Các gói đang được hiển thị cho khách hàng trên website</p></div></div><a href="/dich-vu" target="_blank" rel="noreferrer">Mở trang dịch vụ ↗</a></div><div className="admin-plan-grid">{plans.slice(0, 4).map((plan) => <PlanCard key={plan.id} plan={plan} />)}</div></section>
    <p className="admin-service-caption">Dữ liệu mẫu phục vụ thiết kế giao diện · Thay nguồn tại <code>src/data/adminServicesSample.ts</code> khi kết nối API.</p>
    {planDialog && <div className="admin-plan-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) cancelPlan(); }}><form className="admin-plan-dialog" onSubmit={savePlan}><header className="admin-plan-dialog-header"><div><div className="admin-version"><span>GÓI DỊCH VỤ</span><i /> {editingId === null ? "Tạo mới" : "Chỉnh sửa"}</div><h2>{editingId === null ? "Thêm mới gói dịch vụ" : "Chỉnh sửa gói dịch vụ"}</h2><p>Thiết lập thông tin, quyền lợi và giá bán cho gói dịch vụ.</p></div><button type="button" aria-label="Đóng" onClick={cancelPlan}>×</button></header><div className="admin-plan-dialog-body"><div className="admin-plan-form-column">
      <section className="plan-form-section"><header><span>1</span><div><h3>Thông tin cơ bản &amp; Định danh</h3><p>Thông tin nhận diện giúp khách hàng hiểu rõ gói dịch vụ</p></div><b>BẮT BUỘC</b></header><label className="plan-form-field">Tên gói dịch vụ <em>*</em><input required maxLength={80} placeholder="Ví dụ: Gói Siêu Đẩy Doanh Nghiệp" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label><label className="plan-form-field">Phân nhóm hiển thị<label className="plan-select-wrap"><select value={draft.tier} onChange={(event) => setDraft({ ...draft, tier: event.target.value })}><option>Phổ biến</option><option>Cơ bản</option><option>Tiết kiệm</option><option>VIP Pro</option><option>Doanh nghiệp</option><option>Linh hoạt</option></select></label></label><label className="plan-form-field">Mô tả ngắn gọn gói dịch vụ <small>Tối đa 160 ký tự</small><textarea required maxLength={160} rows={3} placeholder="Mô tả ưu điểm và lợi ích của gói dịch vụ..." value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label><fieldset className="plan-form-field"><legend>Huy hiệu ưu tiên (icon)</legend><div className="plan-icon-choices">{["✦", "♛", "⚡", "◉", "★"].map((icon, index) => <button type="button" className={draft.color === (["orange", "gold", "blue", "green", "gray"] as const)[index] ? "is-selected" : ""} key={icon} onClick={() => setDraft({ ...draft, color: (["orange", "gold", "blue", "green", "gray"] as const)[index] })}>{icon}</button>)}</div></fieldset></section>
      <section className="plan-form-section"><header><span>2</span><div><h3>Cơ chế cộng dồn quyền lợi</h3><p>Hãy lựa chọn các tiện ích hiển thị cho khách hàng</p></div><b className="plan-form-success">ĐÃ CÓ HIỆU LỰC</b></header><div className="plan-benefit-grid"><label><input type="checkbox" defaultChecked /> Lượt đăng bài cộng thêm<input type="number" min="0" value={draft.boosts} onChange={(event) => setDraft({ ...draft, boosts: Number(event.target.value) })} /><small>Số lượt đẩy tin tự động trong thời hạn gói.</small></label><label><input type="checkbox" defaultChecked /> Lượt đẩy tin tự động<input type="number" min="0" value={draft.boosts} onChange={(event) => setDraft({ ...draft, boosts: Number(event.target.value) })} /><small>Quyền lợi áp dụng cho từng chu kỳ.</small></label></div></section>
      <section className="plan-form-section"><header><span>3</span><div><h3>Thiết lập thời hạn &amp; Giá bán</h3><p>Cấu hình chu kỳ thanh toán, giá niêm yết và ưu đãi.</p></div><label className="plan-free-toggle"><input type="checkbox" checked={draft.price === 0} onChange={(event) => setDraft({ ...draft, price: event.target.checked ? 0 : 200000 })} /> Gói miễn phí</label></header><div className="plan-duration-options">{[7, 14, 30, 60, 90, 365].map((days) => <button type="button" className={draft.durationDays === days ? "is-selected" : ""} key={days} onClick={() => setDraft({ ...draft, durationDays: days })}>{days === 365 ? "1 năm" : `${days} ngày`}</button>)}</div><div className="plan-price-grid"><label className="plan-form-field">Giá niêm yết (VND)<input type="number" min="0" step="1000" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /></label><label className="plan-form-field">Giá khuyến mãi / thực thu<input type="number" min="0" step="1000" value={draft.price} onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })} /></label></div></section>
      <section className="plan-form-section"><header><span>4</span><div><h3>Trạng thái &amp; Đối tượng người bán</h3><p>Phân quyền người mua và trạng thái hiển thị gói.</p></div></header><div className="plan-audience-row"><label>Đối tượng được phép mua<select><option>Tất cả người bán trên sàn</option><option>Gian hàng doanh nghiệp</option></select></label><label>Giới hạn số lần mua / tài khoản<select><option>Không giới hạn</option><option>1 lần mỗi tài khoản</option><option>3 lần mỗi tài khoản</option></select></label></div><label className="plan-publish-toggle">Phát hành công khai đến sàn ngay sau khi bấm Tạo gói<input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} /><i /></label></section>
      <div className="plan-form-submit-actions"><button type="button" onClick={cancelPlan}>Hủy gói</button><button type="submit">＋ {editingId === null ? "Tạo gói dịch vụ" : "Lưu thay đổi"}</button></div>
      </div><aside className="admin-plan-preview-column"><div className="admin-plan-live-preview"><header><strong>◉ Phong cách hiển thị trên App &amp; Web</strong><span>Web Card</span></header><article className={`admin-plan-card plan-${draft.color}`}><header><span>{draft.tier || "Phổ biến"}</span><b>{draft.active ? "ĐANG HIỂN THỊ" : "TẠM ẨN"}</b></header><h3>{draft.name || "Tên gói dịch vụ"}</h3><p>{draft.description || "Mô tả những lợi ích nổi bật của gói dịch vụ."}</p><strong>{money(draft.price)}<small> / {draft.durationDays} ngày</small></strong><ul><li>{draft.boosts} lượt đẩy tin</li><li>Hiển thị ưu tiên</li><li>Hỗ trợ khách hàng</li></ul><button type="button">Chọn gói dịch vụ này　›</button><small>Giá đã bao gồm thuế theo quy định</small></article><div className="admin-plan-preview-checks"><h3>Kiểm tra tính hợp lệ của gói</h3><p>✓　Tên gói dịch vụ đã được nhập</p><p>✓　Mức giá phù hợp với hệ thống</p><p>✓　Quyền lợi và thời hạn đã cấu hình</p></div></div></aside></div><footer className="admin-plan-dialog-footer"><span>ⓘ Thông tin gói dịch vụ sẽ được đồng bộ ngay khi lưu.</span><div><button type="button" onClick={cancelPlan}>Đóng</button></div></footer></form></div>}
  </div>;
}
