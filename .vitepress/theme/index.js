import DefaultTheme from "vitepress/theme";
import "./custom.css";
import VisitorCounter from "./components/visitorCounter.vue";

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component("VisitorCounter", VisitorCounter);
  },
};
