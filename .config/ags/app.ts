import app from "ags/gtk4/app"
import style from "./style.scss"
import TopBar from "./widget/TopBar"
import BottomBar from "./widget/BottomBar"
import LeftBar from "./widget/LeftBar"
import RightBar from "./widget/RightBar"
import { CornerWindow, CornerOrientation } from "./widget/corners"
import { createState } from "gnim"
import { Astal } from "ags/gtk4"
import TestWindow from "./widget/TestWindow"

const bottom_popup = createState(false);
let bottom_bar: Astal.Window;

app.start({
  css: style,
  main() {
    app.get_monitors().map(TopBar)
    app.get_monitors().map(m =>
      bottom_bar = BottomBar(m, bottom_popup) as Astal.Window
    )
    app.get_monitors().map(LeftBar)
    app.get_monitors().map(RightBar)

    const { BOTTOM_LEFT, BOTTOM_RIGHT, TOP_LEFT, TOP_RIGHT } = CornerOrientation;
    const radius = 8;
    app.get_monitors().map(m => CornerWindow(m, {orientation: TOP_LEFT, radius}))
    app.get_monitors().map(m => CornerWindow(m, {orientation: TOP_RIGHT, radius}))
    app.get_monitors().map(m => CornerWindow(m, {orientation: BOTTOM_LEFT, radius}))
    app.get_monitors().map(m => CornerWindow(m, {orientation: BOTTOM_RIGHT, radius}))

    TestWindow(bottom_popup)
  },

  requestHandler(req, res) {
    switch (req) {
      case "bottom_popup":
        bottom_popup[1](b => !b);
        res(bottom_popup[0].get());
        break;
      default: res("request not found");
    }
  },
})
