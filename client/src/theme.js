import { createTheme } from "@mui/material";

const createAppTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      background: {
        default: mode === "dark" ? "#020617" : "#f1f5f9",
        paper: mode === "dark" ? "#0f172a" : "#ffffff",
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
    },
  });

export default createAppTheme;
