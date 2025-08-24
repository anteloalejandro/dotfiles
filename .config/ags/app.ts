import app from "ags/gtk4/app"
import style from "./style.scss"
import TopBar from "./widget/TopBar"
import BottomBar from "./widget/BottomBar"
import LeftBar from "./widget/LeftBar"
import RightBar from "./widget/RightBar"
import { CornerWindow, CornerOrientation } from "./widget/corners"

app.start({
  css: style,
  main() {
    app.get_monitors().map(TopBar)
    app.get_monitors().map(BottomBar)
    app.get_monitors().map(LeftBar)
    app.get_monitors().map(RightBar)

    const { BOTTOM_LEFT, BOTTOM_RIGHT, TOP_LEFT, TOP_RIGHT } = CornerOrientation;
    const radius = 8;
    app.get_monitors().map(m => CornerWindow(m, {orientation: TOP_LEFT, radius}))
    app.get_monitors().map(m => CornerWindow(m, {orientation: TOP_RIGHT, radius}))
    app.get_monitors().map(m => CornerWindow(m, {orientation: BOTTOM_LEFT, radius}))
    app.get_monitors().map(m => CornerWindow(m, {orientation: BOTTOM_RIGHT, radius}))
  },
})
