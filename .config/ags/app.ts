import app from "ags/gtk4/app"
import style from "./style.scss"
import TopBar from "./widget/TopBar"
import BottomBar from "./widget/BottomBar"
import LeftBar from "./widget/LeftBar"
import RightBar from "./widget/RightBar"
import { CornerWindow, CornerOrientation } from "./widget/corners"
import { createState } from "gnim"
import TestWindow from "./widget/TestWindow"
import { NotificationPopup } from "./widget/NotificationPopup"
import Osd from "./widget/Osd"

const bottom_popup = createState(false);

app.start({
  css: style,
  main() {
    app.get_monitors().map((monitor, index) => {
      TopBar(monitor);
      BottomBar(monitor, bottom_popup);
      LeftBar(monitor);
      RightBar(monitor);

      const { BOTTOM_LEFT, BOTTOM_RIGHT, TOP_LEFT, TOP_RIGHT } = CornerOrientation;
      const radius = 8;
      CornerWindow(monitor, {orientation: TOP_LEFT, radius});
      CornerWindow(monitor, {orientation: TOP_RIGHT, radius});
      CornerWindow(monitor, {orientation: BOTTOM_LEFT, radius});
      CornerWindow(monitor, {orientation: BOTTOM_RIGHT, radius});


      NotificationPopup(monitor);
      Osd(monitor, createState(false));
      if (index == 0) TestWindow(monitor, bottom_popup);
    })
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
