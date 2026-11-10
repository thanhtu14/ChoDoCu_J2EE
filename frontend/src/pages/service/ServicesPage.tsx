import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dichVuApi } from "../../api/dichVu";
import MaterialIcon from "../../components/common/MaterialIcon";
import { Empty, ErrorBox, Spinner } from "../../components/common/State";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useFetch } from "../../hooks/useFetch";
import type { MuaDichVuResponse } from "../../types";
import { getErrorMessage } from "../../utils/error";
import { formatPrice } from "../../utils/format";

const METHODS = ["MoMo", "VNPay", "ChuyenKhoan"];
const PLAN_DETAILS = [
  { tag: "Khởi đầu", subtitle: "Dành cho tin bán lẻ", button: "Chọn gói này" },
  { tag: "Gói linh hoạt", subtitle: "Tiếp cận nhiều khách hàng", button: "Mua gói này" },
  { tag: "Cửa hàng", subtitle: "Dành cho shop / cửa hàng", button: "Mua gói này" },
  { tag: "Bổ sung", subtitle: "Đẩy tin linh hoạt", button: "Mua gói này" },
];

export default function ServicesPage() {
  useDocumentTitle("Dịch vụ đẩy tin");
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => dichVuApi.danhSach(), []);
  const [method, setMethod] = useState(METHODS[0]);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [order, setOrder] = useState<MuaDichVuResponse | null>(null);
  const [historyFilter, setHistoryFilter] = useState("Tất cả");
  const [period, setPeriod] = useState("all");
  const visiblePlans = (data ?? []).filter(
    (plan) =>
      period === "all" ||
      (period === "week"
        ? plan.thoiGianDichVu <= 14
        : period === "month"
          ? plan.thoiGianDichVu > 14 && plan.thoiGianDichVu <= 45
          : plan.thoiGianDichVu > 45),
  );

  const buy = async (id: number) => {
    if (!user) {
      toast("Đăng nhập để mua dịch vụ.", "info");
      return navigate("/dang-nhap", { state: { from: "/dich-vu" } });
    }
    setBusyId(id);
    try {
      setOrder(await dichVuApi.mua(id, method));
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setBusyId(null);
    }
  };

  const confirm = async (ok: boolean) => {
    if (!order) return;
    try {
      await dichVuApi.xacNhan(order.idThanhToan, ok);
      toast(
        ok ? "Thanh toán thành công." : "Đã ghi nhận thanh toán thất bại.",
        ok ? "ok" : "info",
      );
      setOrder(null);
    } catch (err) {
      toast(getErrorMessage(err), "error");
    }
  };

  return (
    <div className="service-page">
      <section className="service-hero">
        <div className="service-hero-content">
          <span className="service-pill">
            <MaterialIcon
              name="verified"
              size={14}
              filled
            />{" "}
            Gói công nghệ đẩy tin tự động tối ưu nhất
          </span>
          <h1>
            Nâng Tầm Bán Hàng - Tiếp Cận
            <br className="service-break" /> Triệu Khách Hàng
          </h1>
          <p>
            Công cụ đắc lực giúp tăng tỷ lệ đăng bài lên Top 1 tìm kiếm. Chốt đơn và
            <br className="service-break" /> thanh lý đồ nhanh hơn gấp 5 lần so với tài
            khoản thông thường.
          </p>
          <div className="service-proof">
            <span>
              <MaterialIcon
                name="bolt"
                size={15}
                filled
              />{" "}
              +150.000 lượt xem mỗi ngày
            </span>
            <span>
              <MaterialIcon
                name="verified_user"
                size={15}
              />{" "}
              Ưu tiên trên bảng tin đầu phố
            </span>
            <span>
              <MaterialIcon
                name="support_agent"
                size={15}
              />{" "}
              Hoàn tiền nếu không hiệu quả
            </span>
          </div>
        </div>
        <MaterialIcon
          name="rocket_launch"
          size={190}
          className="service-rocket"
        />
        <MaterialIcon
          name="auto_awesome"
          size={42}
          className="service-spark"
        />
      </section>

      <section
        className="service-plans-section"
        aria-labelledby="service-plans-title"
      >
        <div className="service-heading">
          <h2 id="service-plans-title">
            Chọn gói giải pháp phù hợp với mục tiêu bán lẻ của bạn
          </h2>
          <p>
            Linh hoạt tuỳ chỉnh thời gian, số lượt đẩy tin và chính sách bảo vệ quyền lợi
          </p>
        </div>
        <div className="service-periods">
          <button
            className={period === "all" ? "is-active" : ""}
            type="button"
            onClick={() => setPeriod("all")}
          >
            Tất cả gói
          </button>
          <button
            className={period === "week" ? "is-active" : ""}
            type="button"
            onClick={() => setPeriod("week")}
          >
            Gói Tuần (7-14 ngày) <span>Tiết kiệm 20%</span>
          </button>
          <button
            className={period === "month" ? "is-active" : ""}
            type="button"
            onClick={() => setPeriod("month")}
          >
            Gói Tháng (30 ngày) <span className="hot">Bán chạy nhất</span>
          </button>
          <button
            className={period === "long" ? "is-active" : ""}
            type="button"
            onClick={() => setPeriod("long")}
          >
            Gói dài hạn (90 ngày) <span>−30%</span>
          </button>
        </div>

        {order && (
          <div
            className="service-order"
            role="status"
          >
            <strong>
              Đơn #{order.idMuaDichVu}: {order.tenDichVu} — {formatPrice(order.tongTien)}
            </strong>
            <p>Thanh toán đang ở chế độ thử nghiệm.</p>
            <div>
              <button
                type="button"
                onClick={() => void confirm(true)}
              >
                Giả lập thanh toán thành công
              </button>
              <button
                type="button"
                onClick={() => void confirm(false)}
              >
                Giả lập thất bại
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorBox
            message={error}
            onRetry={reload}
          />
        ) : !visiblePlans.length ? (
          <Empty title="Chưa có gói trong thời hạn này" />
        ) : (
          <div
            className="service-plans-viewport"
            aria-label="Danh sách gói dịch vụ"
            tabIndex={0}
          >
            <div
              className={`service-plans${visiblePlans.length <= 3 ? ` service-plans-count-${visiblePlans.length}` : ""}`}
            >
              {visiblePlans.map((plan, index) => {
                const detail = PLAN_DETAILS[index % PLAN_DETAILS.length];
                return (
                  <article
                    key={plan.id}
                    className="service-plan-card"
                  >
                    <div className="service-plan-top">
                      <span>{detail.tag}</span>
                      <small>{detail.subtitle}</small>
                    </div>
                    <div className="service-plan-title">
                      <h3>{plan.tenDichVu}</h3>
                    </div>
                    <p className="service-plan-summary">
                      Nâng cao hiệu quả bán hàng, giúp tin tiếp cận đúng khách hàng.
                    </p>
                    <div className="service-price">
                      {formatPrice(plan.gia)}
                      <small> / {plan.thoiGianDichVu} ngày</small>
                    </div>
                    <ul>
                      <li>
                        <MaterialIcon
                          name="check_circle"
                          size={15}
                        />
                        {plan.luotDay} lượt đẩy tin
                      </li>
                      <li>
                        <MaterialIcon
                          name="check_circle"
                          size={15}
                        />
                        {plan.luotDang} lượt đăng tin
                      </li>
                      <li>
                        <MaterialIcon
                          name="check_circle"
                          size={15}
                        />
                        Hiệu lực {plan.thoiGianDichVu} ngày
                      </li>
                    </ul>
                    <div className="service-plan-actions">
                      <button
                        className="service-buy"
                        type="button"
                        disabled={busyId === plan.id}
                        onClick={() => void buy(plan.id)}
                      >
                        {busyId === plan.id ? "Đang tạo đơn…" : detail.button}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </section>

      <section
        className="service-history"
        aria-labelledby="service-history-title"
      >
        <div className="service-history-head">
          <div>
            <h2 id="service-history-title">Lịch sử giao dịch trước đây</h2>
            <p>
              Theo dõi chi tiết các gói dịch vụ đã mua, trạng thái kích hoạt và thời hạn
              sử dụng
            </p>
          </div>
          <span>Đã chi 0đ (tích lũy)</span>
          <div className="service-history-tabs">
            {["Tất cả", "Đang hoạt động", "Hết hạn"].map((f) => (
              <button
                type="button"
                className={historyFilter === f ? "active" : ""}
                onClick={() => setHistoryFilter(f)}
                key={f}
              >
                {f}
              </button>
            ))}
            <button
              type="button"
              className="service-export"
            >
              Xem tất cả lịch sử ›
            </button>
          </div>
        </div>
        <div className="service-table-wrap">
          <table className="service-table">
            <thead>
              <tr>
                {[
                  "Mã giao dịch",
                  "Tên gói dịch vụ",
                  "Thời gian & hạn dùng",
                  "Quyền lợi gói",
                  "Số tiền",
                  "Phương thức",
                  "Hành động",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={7}>
                  {user
                    ? "Lịch sử giao dịch sẽ hiển thị sau khi API lịch sử mua dịch vụ được triển khai."
                    : "Đăng nhập để xem lịch sử giao dịch của bạn."}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
