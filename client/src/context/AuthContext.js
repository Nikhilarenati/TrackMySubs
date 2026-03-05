import { createContext, useCallback, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

const parseStoredUser = () => {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
};

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(parseStoredUser);

  const isAuthenticated = Boolean(token);

  const handleAuthSuccess = useCallback((nextToken, nextUser) => {
    localStorage.setItem("token", nextToken);
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
    } else {
      localStorage.removeItem("user");
    }

    setToken(nextToken);
    setUser(nextUser || null);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      handleAuthSuccess,
      logout,
    }),
    [token, user, isAuthenticated, handleAuthSuccess, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};

export { AuthProvider, useAuth };
