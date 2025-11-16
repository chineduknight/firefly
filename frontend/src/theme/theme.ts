// src/theme/theme.ts
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    "html, body": {
      backgroundColor: "#E0F2F1",
      margin: 0,
      padding: 0,
      fontFamily:
        "Ubuntu, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: {
          value:
            "Ubuntu, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        body: {
          value:
            "Ubuntu, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
      },
      colors: {
        primary: { value: "#ffdd00" },
        secondary: { value: "#2FA07224" },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
