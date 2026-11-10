import type { QuyenItem } from "../../types";

interface Props {
  quyen: QuyenItem[];
  selected: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
  /** Quyền đã có sẵn từ vai trò: hiện dấu "từ vai trò" và khóa ô chọn. */
  inherited?: string[];
}

/** Danh sách quyền gom theo nhóm, mỗi nhóm có ô chọn tất cả. */
export default function PermissionPicker({
  quyen,
  selected,
  onChange,
  disabled,
  inherited = [],
}: Props) {
  const groups = quyen.reduce<Record<string, QuyenItem[]>>((acc, q) => {
    (acc[q.nhom] ??= []).push(q);
    return acc;
  }, {});

  const toggle = (ma: string) =>
    onChange(
      selected.includes(ma) ? selected.filter((x) => x !== ma) : [...selected, ma],
    );
  const toggleGroup = (items: QuyenItem[], all: boolean) => {
    const codes = items.map((i) => i.ma);
    onChange(
      all
        ? selected.filter((x) => !codes.includes(x))
        : Array.from(new Set([...selected, ...codes])),
    );
  };

  if (quyen.length === 0)
    return (
      <p className="m-0 font-body-2 text-body-2 text-on-surface-variant">
        Hệ thống chưa khai báo quyền nào.
      </p>
    );

  return (
    <div className="flex flex-col gap-space-md">
      {Object.entries(groups).map(([nhom, items]) => {
        const all = items.every((i) => selected.includes(i.ma));
        return (
          <fieldset
            key={nhom}
            className="m-0 border-0 p-space-md rounded-xl bg-surface-container-low"
          >
            <legend className="sr-only">{nhom}</legend>
            <label className="flex items-center gap-space-xs mb-space-sm font-caption-bold text-caption-bold text-on-surface cursor-pointer">
              <input
                type="checkbox"
                disabled={disabled}
                checked={all}
                onChange={() => toggleGroup(items, all)}
              />
              {nhom}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-space-lg gap-y-space-xs">
              {items.map((q) => {
                const tuVaiTro = inherited.includes(q.ma);
                return (
                  <label
                    key={q.ma}
                    className="flex items-center gap-space-xs font-body-2 text-body-2 text-on-surface cursor-pointer break-all"
                  >
                    <input
                      type="checkbox"
                      disabled={disabled || tuVaiTro}
                      checked={tuVaiTro || selected.includes(q.ma)}
                      onChange={() => toggle(q.ma)}
                    />
                    <span>{q.ma}</span>
                    {tuVaiTro && (
                      <span className="shrink-0 font-caption text-caption text-on-surface-variant">
                        (từ vai trò)
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
