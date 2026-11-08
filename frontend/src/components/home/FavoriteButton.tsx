import { useFavorites } from "../../contexts/FavoritesContext";
import MaterialIcon from "../common/MaterialIcon";

export default function FavoriteButton({ id, className = "" }: { id: number; className?: string }) {
  const fav = useFavorites();
  const saved = fav.has(id);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Bỏ khỏi yêu thích" : "Lưu vào yêu thích"}
      onClick={() => void fav.toggle(id)}
      className={`w-8 h-8 rounded-full border-0 cursor-pointer bg-white/90 hover:bg-white flex items-center justify-center ${saved ? "text-error" : "text-on-surface-variant"} ${className}`}
    >
      <MaterialIcon name="favorite" size={18} filled={saved} />
    </button>
  );
}
