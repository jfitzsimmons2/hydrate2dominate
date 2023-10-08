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
      icon: ({ props }: { props: ButtonProps }) => (props.icon ? "" : "hidden"),
    },
    knob: {
      label: "dark:fill-slate-50",
    },
    tooltip: {
      text: "text-slate-800",
    },
  },
  {
    mergeSections: true,
    mergeProps: true,
  }
);
app.use(ConfirmationService);
app.use(DialogService);
app.use(ProvideAppPlugin);

app.directive("tooltip", Tooltip);
app.component("Button", Button);
app.component("InputText", InputText);
app.component("InputNumber", InputNumber);

app.use(PrimeVue, {
  unstyled: true,
  pt: CustomTailwind,
});
app.mount("#app");
