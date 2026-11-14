import { useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { baiDangApi } from "../../api/baiDang";
import { baoCaoApi } from "../../api/baoCao";
import { tinNhanApi } from "../../api/tinNhan";
import Icon from "../../components/common/Icon";
import { ErrorBox, Spinner } from "../../components/common/State";
import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import { getErrorMessage } from "../../utils/error";
import { formatDate, formatPrice, timeAgo, TRANG_THAI_BAI_DANG } from "../../utils/format";
import { imgSrc, onImgError } from "../../utils/image";

export default function PostDetail() {
  const { id } = useParams();
  const postId = Number(id);
  const navigate = useNavigate();
  const { user, isStaff } = useAuth();
  const fav = useFavorites();
  const toast = useToast();
  const { data: post, loading, error, reload } = useFetch(() => baiDangApi.chiTiet(postId), [postId]);
  useDocumentTitle(post?.tieuDe);

  const [active, setActive] = useState(0);
  const [panel, setPanel] = useState<"none" | "message" | "report">("none");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return <Spinner />;
  if (error || !post) return <ErrorBox message={error ?? "Không tìm thấy tin đăng."} onRetry={reload} />;

  const isOwner = user?.idNguoiDung === post.idNguoiDung;
  const images = post.anhs.length ? post.anhs : [""];
  const saved = fav.has(post.id);
  const requireLogin = () => {
    if (user) return true;
    toast("Đăng nhập để tiếp tục.", "info");
    navigate("/dang-nhap", { state: { from: `/bai-dang/${post.id}` } });
    return false;
  };
  const openPanel = (name: "message" | "report") => {
    if (!requireLogin()) return;
    setText("");
    setPanel(panel === name ? "none" : name);
  };
  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      const msg = await tinNhanApi.gui(post.idNguoiDung, text.trim());
      toast("Đã gửi tin nhắn cho người bán.", "ok");
      navigate(`/tin-nhan/${msg.idHoiThoai}`);
    } catch (err) { toast(getErrorMessage(err), "error"); }
    finally { setBusy(false); }
  };
  const sendReport = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try {
      await baoCaoApi.tao({ idBaiDang: post.id, noiDung: text.trim() });
      toast("Đã gửi báo cáo. Cảm ơn bạn đã giúp chợ sạch hơn.", "ok");
      setPanel("none"); setText("");
    } catch (err) { toast(getErrorMessage(err), "error"); }
    finally { setBusy(false); }
  };
  const review = async (action: "duyet" | "tuChoi") => {
    setBusy(true);
    try {
      await (action === "duyet" ? baiDangApi.duyet(post.id) : baiDangApi.tuChoi(post.id));
      toast(action === "duyet" ? "Đã duyệt tin." : "Đã từ chối tin.", "ok"); reload();
    } catch (err) { toast(getErrorMessage(err), "error"); }
    finally { setBusy(false); }
  };

  return (
    <main className="post-detail-page">
      {isStaff && post.trangThai === "ChoDuyet" && <div className="staff-bar" role="region" aria-label="Duyệt tin">
        <strong>Tin đang chờ duyệt.</strong>
        <button className="btn btn-ok btn-sm" disabled={busy} onClick={() => void review("duyet")}><Icon name="check" size={16} /> Duyệt</button>
        <button className="btn btn-danger btn-sm" disabled={busy} onClick={() => void review("tuChoi")}><Icon name="x" size={16} /> Từ chối</button>
      </div>}
      {post.trangThai !== "DaDuyet" && <div className="alert" style={{ marginBottom: 16 }}>
        Tin này đang ở trạng thái “{TRANG_THAI_BAI_DANG[post.trangThai] ?? post.trangThai}” nên chưa hiện ở trang chủ và kết quả tìm kiếm.
      </div>}

      <nav className="post-detail-breadcrumb" aria-label="Đường dẫn">
        <Link to="/">Chợ Đồ Cũ</Link><span>/</span><Link to="/tim-kiem">Tìm kiếm</Link><span>/</span>
        <span>{post.tenDanhMuc}</span><span>/</span><strong>{post.tieuDe}</strong>
      </nav>

      <section className="post-detail-card">
        <header className="post-detail-heading">
          <div className="post-detail-meta">
            <span className="post-status"><Icon name="check" size={14} /> Đã duyệt</span>
            <span>Mã tin: {post.id}</span><span>•</span><span>{timeAgo(post.ngayDang)}</span><span>•</span><span>{post.diaChi}</span>
          </div>
          <h1>{post.tieuDe}</h1>
        </header>

        <div className="post-detail-grid">
          <div className="post-detail-main">
            <section className="post-gallery" aria-label="Ảnh sản phẩm">
              <div className="gallery-main">
                <img src={imgSrc(images[active])} alt={post.tieuDe} onError={onImgError} />
                {images.length > 1 && <>
                  <button className="gallery-arrow gallery-prev" aria-label="Ảnh trước" onClick={() => setActive((active - 1 + images.length) % images.length)}><Icon name="left" size={20} /></button>
                  <button className="gallery-arrow gallery-next" aria-label="Ảnh tiếp theo" onClick={() => setActive((active + 1) % images.length)}><Icon name="right" size={20} /></button>
                </>}
                <span className="gallery-count">{active + 1} / {images.length}</span>
              </div>
              {images.length > 1 && <div className="thumbs" role="tablist" aria-label="Chọn ảnh sản phẩm">
                {images.map((url, i) => <button key={url + i} type="button" className={i === active ? "is-on" : ""} aria-label={`Ảnh ${i + 1}`} aria-selected={i === active} role="tab" onClick={() => setActive(i)}>
                  <img src={imgSrc(url)} alt="" onError={onImgError} />
                </button>)}
              </div>}
            </section>

            <div className="post-engagement" aria-label="Thông tin bài đăng">
              <div><span className="engagement-icon"><Icon name="search" size={18} /></span><strong>—</strong><small>Lượt xem</small></div>
              <div><span className="engagement-icon"><Icon name="heart" size={18} /></span><strong>{saved ? 1 : 0}</strong><small>Lượt yêu thích</small></div>
              <div><span className="engagement-icon"><Icon name="check" size={18} /></span><strong>{timeAgo(post.ngayDang)}</strong><small>Đã đăng</small></div>
            </div>

            <section className="post-detail-section post-description">
              <h2><Icon name="edit" size={18} /> Mô tả chi tiết từ người bán</h2>
              <p className="prose">{post.noiDung || "Người bán chưa thêm mô tả cho sản phẩm này."}</p>
            </section>
          </div>

          <aside className="post-detail-side">
            <section className="post-price-card">
              <span>Giá bán mong muốn</span>
              <div><strong>{formatPrice(post.giaTien)}</strong><span className="price-negotiable">Có thương lượng</span></div>
              <small><Icon name="shield" size={13} /> Hỗ trợ người mua, liên hệ người bán để biết thêm.</small>
            </section>

            <section className="post-detail-section post-specs">
              <h2><Icon name="tag" size={17} /> Thông tin sản phẩm</h2>
              <dl className="facts">
                <div><dt>Sản phẩm</dt><dd>{post.tenSanPham}</dd></div>
                <div><dt>Danh mục</dt><dd>{post.tenDanhMuc}</dd></div>
                <div><dt>Khu vực</dt><dd>{post.tenThanhPho}</dd></div>
                <div><dt>Địa chỉ</dt><dd>{post.diaChiChiTiet || post.diaChi}</dd></div>
                <div><dt>Ngày đăng</dt><dd title={formatDate(post.ngayDang)}>{timeAgo(post.ngayDang)}</dd></div>
                <div><dt>Mã tin</dt><dd>#{post.id}</dd></div>
              </dl>
            </section>

            <section className="post-detail-section post-seller">
              <div className="post-seller-title"><h2>Thông tin người bán</h2>{!isOwner && <button type="button" className="post-report-link" onClick={() => openPanel("report")}>Báo cáo tin này</button>}</div>
              <div className="seller-summary">
                <span className="seller-avatar">{post.tenNguoiDang.trim().charAt(0).toUpperCase()}</span>
                <div><strong>{post.tenNguoiDang}</strong><span><Icon name="shield" size={14} /> Người bán trên Chợ Đồ Cũ</span></div>
              </div>
              <div className="seller-contact"><Icon name="chat" size={16} /><span>{isOwner ? "Đây là tin đăng của bạn" : "Nhắn tin trực tiếp với người bán"}</span></div>
              {!isOwner && <button type="button" className="btn btn-sticker seller-message-btn" onClick={() => openPanel("message")}><Icon name="chat" size={17} /> Nhắn cho người bán</button>}
              {panel === "message" && <form className="stack post-inline-form" onSubmit={sendMessage}>
                <div className="field"><label htmlFor="msg">Tin nhắn gửi {post.tenNguoiDang}</label><textarea id="msg" required maxLength={2000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ví dụ: Món này còn không bạn?" /></div>
                <button className="btn" disabled={busy}><Icon name="send" size={16} /> {busy ? "Đang gửi…" : "Gửi tin nhắn"}</button>
              </form>}
              {panel === "report" && <form className="stack post-inline-form" onSubmit={sendReport}>
                <div className="field"><label htmlFor="rp">Lý do báo cáo</label><textarea id="rp" required maxLength={1000} value={text} onChange={(e) => setText(e.target.value)} placeholder="Tin có dấu hiệu lừa đảo, sai danh mục, hàng cấm…" /></div>
                <button className="btn btn-danger" disabled={busy}>{busy ? "Đang gửi…" : "Gửi báo cáo"}</button>
              </form>}
            </section>
          </aside>
        </div>

        <footer className="post-detail-actions">
          <Link to="/tim-kiem" className="btn btn-ghost btn-sm"><Icon name="left" size={16} /> Quay lại danh sách</Link>
          <div>
            <button type="button" className={`btn btn-ghost btn-sm ${saved ? "is-saved" : ""}`} aria-pressed={saved} onClick={() => void fav.toggle(post.id)}><Icon name="heart" size={16} filled={saved} /> {saved ? "Đã lưu" : "Lưu tin"}</button>
            {!isOwner && <button type="button" className="btn btn-sticker btn-sm" onClick={() => openPanel("message")}><Icon name="chat" size={16} /> Nhắn tin</button>}
          </div>
        </footer>
      </section>
    </main>
  );
}
