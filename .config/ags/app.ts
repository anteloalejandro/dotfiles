import { App } from "astal/gtk3"
import bar_style from "./widget/bar/style.scss"
import Bar from "./widget/bar/Bar"

import osd_style from "./widget/osd/OSD.scss"
import OSD from "./widget/osd/OSD"

import notification_style from "./widget/notifications/Notification.scss"
import NotificationPopups from "./widget/notifications/NotificationPopups"

App.start({
    css: bar_style,
    main() {
        App.get_monitors().map(Bar)
    },
})

App.start({
    instanceName: "osd",
    css: osd_style,
    main() {
        App.get_monitors().map(OSD)
    },
})

App.start({
    instanceName: "notification_popups",
    css: notification_style,
    main() {
        App.get_monitors().map(NotificationPopups)
    }
})
