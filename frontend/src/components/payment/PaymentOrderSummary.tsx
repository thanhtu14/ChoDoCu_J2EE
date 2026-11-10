import type { DichVu } from "../../types";
import { formatPrice } from "../../utils/format";
import MaterialIcon from "../common/MaterialIcon";

interface Props {
  plan: DichVu;
  coupon: string;
  onCouponChange: (value: string) => void;
  onApplyCoupon: () => void;
  discount: number;
}

export default function PaymentOrderSummary({
  plan,
  coupon,
  onCouponChange,
  onApplyCoupon,
  discount,
}: Props) {
  return (
    <section className="pay-card pay-summary" aria-labelledby="pay-summary-title">
      <div className="pay-section-heading">
        <div>
          <h2 id="pay-summary-title">Thông tin thanh toán</h2>
          <p>Kiểm tra số tiền của bạn</p>
        </div>
        <span className="pay-safe">
          <MaterialIcon name="verified_user" size={14} />
          Bảo mật 100%
        </span>
      </div>
      <div className="pay-account">
        <span className="pay-avatar">NH</span>
        <div>
          <strong>Gói {plan.tenDichVu}</strong>
          <small>
            {plan.thoiGianDichVu} ngày · {plan.luotDay} lượt đẩy tin
          </small>
        </div>
        <span className="pay-verified">Đã xác thực</span>
      </div>
      <div className="pay-plan-label">
        <strong>{plan.tenDichVu}</strong>
        <span>{plan.thoiGianDichVu} ngày</span>
      </div>
      <div className="pay-coupon">
        <MaterialIcon name="sell" size={17} />
        <input
          aria-label="Mã ưu đãi"
          value={coupon}
          onChange={(event) => onCouponChange(event.target.value)}
          placeholder="Nhập mã ưu đãi"
        />
        <button type="button" onClick={onApplyCoupon}>
          Áp dụng
        </button>
      </div>
      <p className="pay-coupon-hint">
        <MaterialIcon name="check_circle" size={13} />
        {discount
          ? `Đã áp dụng ưu đãi ${formatPrice(discount)}`
          : "Ưu đãi dành riêng cho bạn sẽ được áp dụng tại đây"}
      </p>
      <div className="pay-totals">
        <div>
          <span>Giá niêm yết:</span>
          <span>{formatPrice(plan.gia)}</span>
        </div>
        <div className="pay-saving">
          <span>Ưu đãi:</span>
          <span>-{formatPrice(discount)}</span>
        </div>
        <div>
          <span>Phí giao dịch:</span>
          <span>0 đ</span>
        </div>
        <div className="pay-total">
          <strong>TỔNG CỘNG:</strong>
          <strong>{formatPrice(Math.max(0, plan.gia - discount))}</strong>
        </div>
        <small>Đã gồm thuế và phí dịch vụ</small>
      </div>
    </section>
  );
}
