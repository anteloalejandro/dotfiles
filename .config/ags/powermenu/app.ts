import { App } from "astal/gtk3";
import PowerMenu from "./PowerMenu";
import css from "./PowerMenu.scss";

App.start({
  css,
  instanceName: "powermenu",
  main() {
    App.get_monitors().map(PowerMenu)
  }
})
