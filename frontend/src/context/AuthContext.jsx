import { createContext, useState, useMemo, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Instant localStorage load (no flicker)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userInfo");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // ✅ Stable login function
  const login = useCallback((data) => {
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
  }, []);

  // ✅ Stable logout function
  const logout = useCallback(() => {
    localStorage.removeItem("userInfo");
    setUser(null);
  }, []);

  // ✅ Memoized context value (prevents unnecessary re-renders)
  const value = useMemo(() => {
    return { user, login, logout };
  }, [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
