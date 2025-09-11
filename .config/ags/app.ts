import app from "ags/gtk4/app"
import style from "./style.scss"
import TopBar from "./widget/BorderTop"
import BottomBar from "./widget/BottomBar"
import LeftBar from "./widget/LeftBar"
import RightBar from "./widget/RightBar"
import { CornerWindow, CornerOrientation } from "./widget/corners"
import { createState } from "gnim"
import Runner from "./widget/Runner"
import { NotificationPopup } from "./widget/NotificationPopup"
import Osd from "./widget/Osd"
import Panel from "./widget/Panel"
import PowerMenu from "./widget/PowerMenu"
import UiState from './UiState'
import System from "./widget/System"
import { Alerts } from "./widget/Alerts"

const { show_top, show_runner, show_panel, show_power, show_system } = UiState;

app.start({
  css: style,
  main() {
    app.get_monitors().map((monitor, index) => {
      TopBar(monitor);
      BottomBar(monitor);
      LeftBar(monitor);
      RightBar(monitor);

      const { BOTTOM_LEFT, BOTTOM_RIGHT, TOP_LEFT, TOP_RIGHT } = CornerOrientation;
      CornerWindow(monitor, {orientation: TOP_LEFT});
      CornerWindow(monitor, {orientation: TOP_RIGHT});
      CornerWindow(monitor, {orientation: BOTTOM_LEFT});
      CornerWindow(monitor, {orientation: BOTTOM_RIGHT});


      NotificationPopup(monitor);
      Panel(monitor);
      Osd(monitor, createState(false));
      if (index == 0) Runner(monitor);

      PowerMenu(monitor);
      System(monitor);

      Alerts(monitor);
    })
  },

  requestHandler(req, res) {
    switch (req) {
      case "show_panel":
        show_panel[1](b => !b);
        res(show_panel[0].get());
        break;
      case "show_top":
        show_top[1](b => !b);
        res(show_top[0].get());
        break;
      case "show_power":
        show_power[1](b => !b);
        res(show_power[0].get())
        break;
      case "show_runner":
        show_runner[1](b => !b);
        res(show_runner[0].get())
        break;
      case "show_system":
        show_system[1](b => !b);
        res(show_system[0].get())
        break;
      default: res("request not found");
    }
  },
})
