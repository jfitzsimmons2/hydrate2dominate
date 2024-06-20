import { createApp } from "vue";
import "./style.css";
import "./icons.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Button, { ButtonProps } from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import Tooltip from "primevue/tooltip";
import { router } from "./router";
import { ProvideAppPlugin } from "./plugins/get-current-instance";
import Aura from "@primevue/themes/aura";
import { definePreset } from "@primevue/themes";

import "uno.css";

const app = createApp(App);

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}",
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
  },
});

app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: MyPreset,
    options: {
      darkModeSelector: ".dark",
      cssLayer: true,
    },
  },
});

app.use(router);

app.use(ConfirmationService);
app.use(DialogService);
app.use(ProvideAppPlugin);

app.directive("tooltip", Tooltip);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("InputNumber", InputNumber);

app.mount("#app");
