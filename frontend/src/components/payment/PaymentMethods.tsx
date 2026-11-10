import MaterialIcon from "../common/MaterialIcon";

export type PaymentMethod = "MoMo" | "VNPay";

interface Props {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethods({ value, onChange }: Props) {
  return (
    <fieldset className="pay-methods">
      <legend>Phương thức thanh toán</legend>
      <label className={`pay-method${value === "MoMo" ? " is-selected" : ""}`}>
        <input
          type="radio"
          name="payment-method"
          checked={value === "MoMo"}
          onChange={() => onChange("MoMo")}
        />
        <span className="pay-radio" />
        <span className="pay-method-copy">
          <strong>
            <span className="momo-mark">M</span>
            Ví điện tử MoMo
            <small>KHUYÊN DÙNG</small>
          </strong>
          <span>Thanh toán siêu tốc qua ứng dụng MoMo</span>
        </span>
        <span className="pay-method-tag momo-tag">MoMo</span>
      </label>
      <label className={`pay-method${value === "VNPay" ? " is-selected" : ""}`}>
        <input
          type="radio"
          name="payment-method"
          checked={value === "VNPay"}
          onChange={() => onChange("VNPay")}
        />
        <span className="pay-radio" />
        <span className="pay-method-copy">
          <strong>Cổng VNPAY / VNPAY-QR</strong>
          <span>Quét mã VNPAY-QR hoặc ứng dụng ngân hàng</span>
        </span>
        <span className="pay-method-tag vnpay-tag">VNPAY</span>
      </label>
      <span className="pay-method-secure">
        <MaterialIcon name="lock" size={14} />
        Giao dịch được mã hóa và bảo vệ an toàn
      </span>
    </fieldset>
  );
}
