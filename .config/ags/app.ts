import app from "ags/gtk4/app"
import style from "./style.scss"
import TopBar from "./widget/TopBar"
import BottomBar from "./widget/BottomBar"

app.start({
  css: style,
  main() {
    app.get_monitors().map(TopBar)
    app.get_monitors().map(BottomBar)
  },
})
