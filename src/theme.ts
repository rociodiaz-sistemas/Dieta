import { extendTheme } from "@chakra-ui/react";

export const appTheme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#eef7f1",
      100: "#d4eadb",
      200: "#b7dcc3",
      300: "#96ceaa",
      400: "#72c192",
      500: "#58a777",
      600: "#3f835a",
      700: "#2c5d40",
      800: "#193726",
      900: "#08140d",
    },
  },
  fonts: {
    heading: "'Segoe UI', sans-serif",
    body: "'Segoe UI', sans-serif",
  },
});
