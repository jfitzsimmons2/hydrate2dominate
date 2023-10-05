import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Button, { ButtonContext, ButtonProps } from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import DialogService from "primevue/dialogservice";
import Tooltip from "primevue/tooltip";
import { router } from "./router";
import { Icon } from "@iconify/vue";

import Tailwind from "primevue/passthrough/tailwind";
import { usePassThrough } from "primevue/passthrough";

const app = createApp(App);
app.use(router);

const CustomTailwind = usePassThrough(
  Tailwind,
  {
    selectbutton: {
      button: "focus:relative focus:z-[1]",
    },
    button: {
      root: ({ props }: { props: ButtonProps }) => (props.icon ? "!p-3" : ""),
      label: ({ props }: { props: ButtonProps }) =>
        props.icon ? "hidden" : "",
    },
  },
  {
    mergeSections: true,
    mergeProps: true,
  }
);

app.use(PrimeVue, {
  unstyled: true,
  pt: CustomTailwind,
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(DialogService);

app.directive("tooltip", Tooltip);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("InputNumber", InputNumber);
app.component("Icon", Icon);
app.mount("#app");
