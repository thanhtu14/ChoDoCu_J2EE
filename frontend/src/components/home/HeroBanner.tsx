import MaterialIcon from "../common/MaterialIcon";

const TRUST = [
  { icon: "verified_user", text: "100% xác thực danh tính" },
  { icon: "fact_check", text: "Kiểm định bởi cộng đồng" },
  { icon: "handshake", text: "Giao dịch trực tiếp, an tâm" },
];

/** Banner cam đầu trang chủ. */
export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ff7a00] via-[#f9700a] to-[#e5610a] px-space-xl py-space-3xl text-white shadow-lg sm:px-space-3xl">
      <MaterialIcon
        name="recycling"
        size={220}
        className="absolute -right-8 -bottom-10 text-white/15 pointer-events-none"
      />
      <div className="relative z-10 max-w-3xl">
        <span className="inline-flex items-center gap-space-xs rounded-full bg-white/20 px-space-md py-space-2xs font-caption text-caption backdrop-blur">
          <span
            className="w-2 h-2 rounded-full bg-[#6bfe9c]"
            aria-hidden="true"
          />{" "}
          Sàn mua bán đồ cũ minh bạch hàng đầu Việt Nam
        </span>
        <h1 className="m-0 mt-space-lg text-3xl sm:text-5xl font-bold leading-tight tracking-tight">
          Chợ đồ cũ - Mua bán thông minh, tiết kiệm &amp; bền vững
        </h1>
        <p className="m-0 mt-space-md max-w-2xl font-body-1 text-body-1 text-white/90 leading-relaxed">
          Nền tảng mua bán đồ cũ minh bạch hàng đầu Việt Nam. Kiểm định chất lượng trực
          tiếp, định giá tự động và bảo đảm quyền lợi với hệ thống ký gửi &amp; bảo hiểm
          giao dịch.
        </p>
        <ul className="m-0 mt-space-xl p-0 pt-space-lg list-none flex flex-wrap gap-x-space-xl gap-y-space-sm border-t border-white/25">
          {TRUST.map((t) => (
            <li
              key={t.text}
              className="flex items-center gap-space-xs font-caption-bold text-caption-bold"
            >
              <MaterialIcon
                name={t.icon}
                size={18}
              />{" "}
              {t.text}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
