import type { DichVu } from "../../types";
import MaterialIcon from "../common/MaterialIcon";

export default function PaymentPlanBenefits({ plan }: { plan: DichVu }) {
  const items = [
    {
      icon: "schedule",
      title: "Thời hạn",
      value: `${plan.thoiGianDichVu} ngày liên tục`,
      note: "Tự động gia hạn quyền lợi",
    },
    {
      icon: "post_add",
      title: "Đăng tin mới",
      value: `+${plan.luotDang} lượt đăng`,
      note: "Không giới hạn tin cơ bản",
    },
    {
      icon: "rocket_launch",
      title: "Đẩy top",
      value: `+${plan.luotDay} lượt đẩy`,
      note: "Tiếp cận khách hàng",
    },
    {
      icon: "verified_user",
      title: "Đặc quyền VIP",
      value: "Ưu tiên & uy tín",
      note: "Duyệt nhanh, hỗ trợ tốt",
    },
  ];

  return (
    <section className="pay-benefits" aria-label="Quyền lợi gói dịch vụ">
      {items.map((item) => (
        <article className="pay-benefit" key={item.title}>
          <span className="pay-benefit-icon">
            <MaterialIcon name={item.icon} size={19} />
          </span>
          <div>
            <small>{item.title}</small>
            <strong>{item.value}</strong>
            <span>{item.note}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
