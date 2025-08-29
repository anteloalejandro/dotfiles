import app from "ags/gtk4/app"
import style from "./style.scss"
import TopBar from "./widget/BorderTop"
import BottomBar from "./widget/BottomBar"
import LeftBar from "./widget/LeftBar"
import RightBar from "./widget/RightBar"
import { CornerWindow, CornerOrientation } from "./widget/corners"
import { createState } from "gnim"
import TestWindow from "./widget/TestWindow"
import { NotificationPopup } from "./widget/NotificationPopup"
import Osd from "./widget/Osd"
import Panel from "./widget/Panel"
import PowerMenu from "./widget/PowerMenu"

const show_top = createState(true)
const bottom_popup = createState(false);
const show_panel = createState(false);
const show_power = createState(false);

app.start({
  css: style,
  main() {
    app.get_monitors().map((monitor, index) => {
      TopBar(monitor, show_top);
      BottomBar(monitor, bottom_popup);
      LeftBar(monitor);
      RightBar(monitor);

      const { BOTTOM_LEFT, BOTTOM_RIGHT, TOP_LEFT, TOP_RIGHT } = CornerOrientation;
      CornerWindow(monitor, {orientation: TOP_LEFT});
      CornerWindow(monitor, {orientation: TOP_RIGHT});
      CornerWindow(monitor, {orientation: BOTTOM_LEFT});
      CornerWindow(monitor, {orientation: BOTTOM_RIGHT});


      NotificationPopup(monitor);
      Panel(monitor, show_panel);
      Osd(monitor, createState(false));
      if (index == 0) TestWindow(monitor, bottom_popup);

      PowerMenu(monitor, show_power);
    })
  },

  requestHandler(req, res) {
    switch (req) {
      case "bottom_popup":
        bottom_popup[1](b => !b);
        res(bottom_popup[0].get());
        break;
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
      default: res("request not found");
    }
  },
})
