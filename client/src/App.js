import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import SignIn from "./pages/SignIn.js";
import SignUp from "./pages/SignUp.js";
import Home from "./pages/Home.js";
import { useAuth } from "./context/AuthContext.js";
import createAppTheme from "./theme.js";
import "./App.css";

function App() {
  const { isAuthenticated, handleAuthSuccess, logout } = useAuth();
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem("theme-mode") === "dark" ? "dark" : "light";
  });

  const appTheme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", themeMode === "dark");
    localStorage.setItem("theme-mode", themeMode);
  }, [themeMode]);

  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <Routes>
        <Route
          path="/signin"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <SignIn
                onAuthSuccess={handleAuthSuccess}
                themeMode={themeMode}
                onToggleTheme={toggleTheme}
              />
            )
          }
        />
        <Route path="/login" element={<Navigate to="/signin" replace />} />
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <SignUp
                onAuthSuccess={handleAuthSuccess}
                themeMode={themeMode}
                onToggleTheme={toggleTheme}
              />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Home onLogout={logout} themeMode={themeMode} onToggleTheme={toggleTheme} />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/" : "/signin"} replace />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
