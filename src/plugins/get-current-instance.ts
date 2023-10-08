import { Plugin, inject } from "vue";

// define a plugin
const key = "__CURRENT_APP__";
export const ProvideAppPlugin: Plugin = {
  install(app, options) {
    app.provide(key, app);
  },
};
export function useCurrentApp() {
  return inject(key);
}
