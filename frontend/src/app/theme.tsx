"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue for buttons, links
    },
    secondary: {
      main: "#2196f3", // Lighter blue for accents
    },
    background: {
      default: "#f5f7fa", // Light background for cards
    },
  },
  typography: {
    fontFamily: '"Roboto", sans-serif',
  },
  spacing: 8, // Default spacing unit in pixels (MUI uses this for theme.spacing)
});

export default function Theme({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}