// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetWind,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [
    presetWind({
      theme: {
        colors: {
          blue: "#1fb6ff",
          purple: "#7e5bef",
          pink: "#ff49db",
          orange: "#ff7849",
          green: "#13ce66",
          yellow: "#ffc82c",
          "gray-dark": "#273444",
          gray: "#8492a6",
          "gray-light": "#d3dce6",
        },
      },
    }),
    presetAttributify(),
    presetIcons(),
  ],
  content: {
    filesystem: [
      // the default
      // include js/ts files
      "src/**/*.{vue,js,ts}",
      "index.html",
      "node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}",
    ],
  },
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
