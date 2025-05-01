import { Astal, Gtk, Gdk } from "astal/gtk3"
import Notifd from "gi://AstalNotifd"
import Notification from "./Notification"
import { type Subscribable } from "astal/binding"
import { Variable, bind, timeout } from "astal"

// see comment below in constructor
const TIMEOUT_DELAY = 5000

const notifications = Variable<Notifd.Notification[]>([])
const notifd = Notifd.get_default();

function add(id: number) {
    const n = notifd.get_notification(id)
    notifications.set(notifications.get().concat(n))
}
function del(id: number) {
    notifications.set(
        notifications.get().filter(n => n.id != id)
    )
}

notifd.connect("notified", (_, id) => {
    add(id)
})

notifd.connect("resolved", (_, id) => {
    del(id)
})

export default function NotificationPopups(gdkmonitor: Gdk.Monitor) {
    const { TOP, RIGHT } = Astal.WindowAnchor

    return <window
        className="NotificationPopups"
        gdkmonitor={gdkmonitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        layer={Astal.Layer.OVERLAY}
        anchor={TOP | RIGHT}>
        <box vertical>
            {bind(notifications).as(ns => ns.map(n => {
                return <Notification
                    setup={() => {
                        if (n.urgency != Notifd.Urgency.CRITICAL)
                            timeout(TIMEOUT_DELAY, () => del(n.id))
                    }}
                    onHoverLost={() => {}}
                    notification={n}
                />
            }))}
        </box>
    </window>
}
