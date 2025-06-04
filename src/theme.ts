// theme.ts
import { createTheme, ThemeOptions } from "@mui/material/styles";

// Define theme options with proper typing
const themeOptions: ThemeOptions = {
  palette: {
    mode: "light", // ✅ now correctly typed
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#000004",
      light: "#333333",
      dark: "#000000",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Manrope, Arial, sans-serif",
    h1: {
      color: "#141414",
      fontSize: "90px", // Customize size as needed
      fontWeight: 700, // Optional: make it bold
    },
    h5: {
      fontWeight: 700,
      marginBottom: "0.5em",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
          textTransform: "capitalize",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: "rgba(30, 31, 43, 0.16) 0px 4px 8px",
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
        },
      },
    },
  },
};

const theme = createTheme(themeOptions);
export default theme;
