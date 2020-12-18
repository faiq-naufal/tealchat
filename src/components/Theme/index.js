import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// setup light/dark mode component defaults
const components = {
  Link: {
    baseStyle: (props) => ({
      color: mode("blue.500", "blue.300")(props),
    }),
  },
  Heading: {
    baseStyle: (props) => ({
      color: mode("blue.900", "blue.50")(props),
      fontWeight: 700,
    }),
  },
};

// setup light/dark mode global defaults
const styles = {
  global: (props) => ({
    "html, body, #__next, main": {
      display: "flex",
      flex: 1,
      flexDirection: "column",
      minHeight: "100%",
      minHeight: "calc(var(--vh, 1vh) * 100)",
      height: "auto",
      overflowX: "hidden",
    },
    body: {
      bg: mode("gray.50", "gray.700")(props),
    },
  }),
};

const additionalStyles = {
  fonts: {
    body: "Inter, sans-serif",
    heading: "Inter, sans-serif",
  },
};

export const theme = extendTheme({
  components,
  styles,
  ...additionalStyles,
});

export default function Theme({ children }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
