import { App } from "astal/gtk3"
import bar_style from "./widget/bar/style.scss"
import Bar from "./widget/bar/Bar"

import osd_style from "./widget/osd/OSD.scss"
import OSD from "./widget/osd/OSD"

import notification_style from "./widget/notifications/Notification.scss"
import NotificationPopups from "./widget/notifications/NotificationPopups"

import PowerMenu from "./widget/powermenu/PowerMenu";
import powermenu_style from "./widget/powermenu/PowerMenu.scss";
import { Variable } from "astal"

const show_popups = Variable(true)

App.start({
  css: bar_style,
  main() {
    App.get_monitors().map(
      monitor => Bar(monitor, show_popups)
    )
  },
})

App.start({
  css: osd_style,
  main() {
    App.get_monitors().map(OSD)
  },
})

App.start({
  css: notification_style,
  main() {
    App.get_monitors().map(
      monitor => NotificationPopups(monitor, App, show_popups)
    )
  }
})

App.start({
  css: powermenu_style,
  main() {
    App.get_monitors().map(
      monitor => PowerMenu(monitor, App)
    )
  },
})
