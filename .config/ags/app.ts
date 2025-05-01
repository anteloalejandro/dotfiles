import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"

import osd_style from "./osd/OSD.scss"
import OSD from "./osd/OSD"

import notification_style from "./notifications/Notification.scss"
import NotificationPopups from "./notifications/NotificationPopups"

App.start({
    css: style,
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
