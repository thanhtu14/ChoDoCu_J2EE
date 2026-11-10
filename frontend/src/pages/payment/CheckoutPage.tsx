import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { dichVuApi } from "../../api/dichVu";
import { ErrorBox, Spinner } from "../../components/common/State";
import MaterialIcon from "../../components/common/MaterialIcon";
import PaymentMethods, {
  type PaymentMethod,
} from "../../components/payment/PaymentMethods";
import PaymentOrderSummary from "../../components/payment/PaymentOrderSummary";
import PaymentPlanBenefits from "../../components/payment/PaymentPlanBenefits";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import type { DichVu, MuaDichVuResponse } from "../../types";
import { getErrorMessage } from "../../utils/error";
import { formatPrice } from "../../utils/format";

export default function CheckoutPage() {
  useDocumentTitle("Xác nhận & Thanh toán");

  const { idDichVu } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();
  const [plan, setPlan] = useState<DichVu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("MoMo");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [order, setOrder] = useState<MuaDichVuResponse | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    dichVuApi
      .danhSach()
      .then((plans) => {
        if (!active) return;
        const selected = plans.find((item) => String(item.id) === idDichVu);
        if (selected) setPlan(selected);
        else setError("Không tìm thấy gói dịch vụ này.");
      })
      .catch((err: unknown) => {
        if (active) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [idDichVu]);

  const total = useMemo(
    () => Math.max(0, (plan?.gia ?? 0) - discount),
    [plan, discount],
  );

  const applyCoupon = () => {
    if (!coupon.trim()) return toast("Vui lòng nhập mã ưu đãi.", "info");
    toast("Mã ưu đãi chưa được hỗ trợ cho giao dịch này.", "info");
    setDiscount(0);
  };

  const confirm = async () => {
    if (!plan) return;
    if (!user) {
      return navigate("/dang-nhap", {
        state: { from: `/thanh-toan/${idDichVu}` },
      });
    }

    setBusy(true);
    try {
      setOrder(await dichVuApi.mua(plan.id, method));
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  const finish = async (success: boolean) => {
    if (!order) return;

    setBusy(true);
    try {
      await dichVuApi.xacNhan(order.idThanhToan, success);
      toast(
        success
          ? "Thanh toán thành công."
          : "Đã ghi nhận thanh toán thất bại.",
        success ? "ok" : "info",
      );
      if (success) navigate("/dich-vu");
      else setOrder(null);
    } catch (err) {
      toast(getErrorMessage(err), "error");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="pay-loading">
        <Spinner />
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="pay-loading">
        <ErrorBox
          message={error || "Không tìm thấy gói dịch vụ."}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="pay-topline">
        <Link to="/dich-vu" className="pay-back">
          <MaterialIcon name="arrow_back" size={17} />
          Gói dịch vụ
        </Link>
        <div>
          <h1>Xác nhận &amp; Thanh toán gói {plan.tenDichVu}</h1>
          <span className="pay-live">
            <i />
            Kích hoạt tức thì
          </span>
        </div>
        <span className="pay-order-id">
          <MaterialIcon name="confirmation_number" size={14} />
          Mã đơn: PRO-{plan.id}
        </span>
      </div>

      <div className="pay-promo">
        <span>
          <MaterialIcon name="workspace_premium" size={18} />
          GÓI VIP PRO
        </span>
        <strong>{plan.tenDichVu}</strong>
        <small>
          <i />
          Kích hoạt trực tiếp 24/7
        </small>
      </div>

      <div className="pay-layout">
        <main className="pay-main">
          <PaymentPlanBenefits plan={plan} />
          <section className="pay-card pay-perks">
            <h2>
              <span />
              Bảng quyền lợi VIP Pro chi tiết
              <small className="pay-perks-audience">Cá nhân &amp; Cửa hàng</small>
            </h2>
            {[
              ["Số lượng tin hiển thị song song", "Không giới hạn (Quota 45)", "neutral"],
              ["Tự động đẩy top khung giờ vàng (11h-13h & 19h-21h)", "15 Lượt tự động", "green"],
              ["Huy hiệu VIP Pro & Khung viền nổi bật bài đăng", "Viền Cam toàn sàn", "orange"],
              ["Báo cáo phân tích tương tác người mua theo giờ", "Dashboard Real-time", "blue"],
              ["Chuyên viên sàn tư vấn & hotline ưu tiên 24/7", "Đường dây nóng VIP", "purple"],
            ].map(([label, value, tag]) => (
              <div className="pay-perk-row" key={label}>
                <span className="pay-perk-check">
                  <MaterialIcon name="check_circle" size={19} />
                </span>
                <span>{label}</span>
                <strong className={`pay-perk-tag pay-perk-tag-${tag}`}>{value}</strong>
              </div>
            ))}
          </section>
        </main>

        <aside className="pay-aside">
          <PaymentOrderSummary
            plan={plan}
            coupon={coupon}
            onCouponChange={setCoupon}
            onApplyCoupon={applyCoupon}
            discount={discount}
          />
          <PaymentMethods value={method} onChange={setMethod} />
          <button
            className="pay-submit"
            type="button"
            disabled={busy}
            onClick={() => void (order ? finish(true) : confirm())}
          >
            <MaterialIcon
              name={order ? "check_circle" : "verified_user"}
              size={17}
            />
            {busy
              ? "Đang xử lý…"
              : order
                ? `XÁC NHẬN THANH TOÁN · ${formatPrice(order.tongTien)}`
                : `XÁC NHẬN THANH TOÁN · ${formatPrice(total)}`}
            <MaterialIcon name="arrow_forward" size={17} />
          </button>

          {order && (
            <div className="pay-test-notice" role="status">
              <strong>Đơn #{order.idMuaDichVu} đã được tạo.</strong>
              <span>Chế độ thử nghiệm: xác nhận kết quả giao dịch.</span>
              <div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void finish(false)}
                >
                  Thanh toán thất bại
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void finish(true)}
                >
                  Thành công
                </button>
              </div>
            </div>
          )}

          <div className="pay-assurances">
            <span>
              <MaterialIcon name="local_fire_department" size={13} />
              Hoàn tiền nếu lỗi
            </span>
            <span>
              <MaterialIcon name="shield" size={13} />
              Chuẩn PCI DSS
            </span>
            <span>
              <MaterialIcon name="support_agent" size={13} />
              Hỗ trợ 24/7
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
