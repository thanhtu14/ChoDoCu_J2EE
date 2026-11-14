import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "../api/auth";
import { AUTH_EXPIRED_EVENT, TOKEN_KEY, USER_KEY } from "../api/client";
import type { AuthResponse, DangKyRequest, DangNhapRequest } from "../types";
import { useToast } from "./ToastContext";

interface AuthContextValue {
  user: AuthResponse | null;
  isStaff: boolean; // Admin hoặc Moderator
  isAdmin: boolean;
  login: (data: DangNhapRequest) => Promise<void>;
  loginAdmin: (data: DangNhapRequest) => Promise<void>;
  register: (data: DangKyRequest) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
  /** Cập nhật thông tin hiển thị (vd. họ tên sau khi sửa hồ sơ) mà không đổi token. */
  updateUser: (patch: Partial<AuthResponse>) => void;
  hasRole: (...roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthResponse | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw && localStorage.getItem(TOKEN_KEY)
      ? (JSON.parse(raw) as AuthResponse)
      : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [user, setUser] = useState<AuthResponse | null>(readStoredUser);

  const save = useCallback((data: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data));
    setUser(data);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthResponse>) => {
    setUser((cur) => {
      if (!cur) return cur;
      const next = { ...cur, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const login = useCallback(
    async (data: DangNhapRequest) => save(await authApi.dangNhapClient(data)),
    [save],
  );
  const loginAdmin = useCallback(
    async (data: DangNhapRequest) => save(await authApi.dangNhapQuanTri(data)),
    [save],
  );
  const loginWithGoogle = useCallback(
    async (idToken: string) => {
      const data = await authApi.dangNhapGoogle(idToken);
      if (data.role !== "User") throw new Error("Bạn không thể đăng nhập bằng tài khoản quản trị. Vui lòng dùng cổng quản trị.");
      save(data);
    },
    [save],
  );
  const register = useCallback(
    async (data: DangKyRequest) => save(await authApi.dangKy(data)),
    [save],
  );

  // Token hết hạn: interceptor phát sự kiện, ở đây đăng xuất và báo cho người dùng.
  useEffect(() => {
    const onExpired = () => {
      logout();
      toast("Phiên đăng nhập đã hết hạn, hãy đăng nhập lại.", "info");
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [logout, toast]);

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role ?? "";
    return {
      user,
      isAdmin: role === "Admin",
      isStaff: role === "Admin" || role === "Moderator",
      login,
      loginAdmin,
      register,
      loginWithGoogle,
      logout,
      updateUser,
      hasRole: (...roles: string[]) => roles.includes(role),
    };
  }, [user, login, loginAdmin, register, loginWithGoogle, logout, updateUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải nằm trong AuthProvider");
  return ctx;
}
