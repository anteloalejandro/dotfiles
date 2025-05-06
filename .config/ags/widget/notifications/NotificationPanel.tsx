import { bind, execAsync, timeout, Variable } from "astal"
import { Astal, Gtk, Gdk, App, Widget } from "astal/gtk3"
import Notifd from "gi://AstalNotifd"
import Notification from "./Notification";

const notifd = Notifd.get_default();

export default function NotificationPanel(monitor: Gdk.Monitor, show_panel: Variable<boolean>, show_popups: Variable<boolean>, bar: Widget.Window) {
  const {TOP, RIGHT} = Astal.WindowAnchor
  return <window
    visible={bind(show_panel)}
    name="notification_panel" application={App}
    className="NotificationPanel"
    gdkmonitor={monitor}
    anchor={TOP | RIGHT}
    keymode={Astal.Keymode.ON_DEMAND}
    heightRequest={monitor.geometry.height}
    setup={self => {
      bar.connect_after('size-allocate', () => {
        const [, barHeight] = bar.get_size()
        const [width] = self.get_size()
        self.set_size_request(width, monitor.geometry.height-barHeight)
      })
    }}
  >
    <box vertical className="container">
      <centerbox>
        <label label="Notifications" className="title" halign={Gtk.Align.START} />
        <Gtk.Separator />
        <button halign={Gtk.Align.END}
          onClick={() => notifd.notifications.map(n => { n.dismiss() })}
        >
          <label label="Clear All" />
        </button>
      </centerbox>

      <centerbox>
        <label label="Do Not Disturb" halign={Gtk.Align.START} />
        <Gtk.Separator />
        <switch halign={Gtk.Align.END}
          active={bind(show_popups).as(b => !b)}
          onNotifyActivate={() => console.log('hello!')}
        />
      </centerbox>

      <scrollable
        heightRequest={monitor.geometry.height * 0.5}
        propagate_natural_width={true}
        hscroll={Gtk.PolicyType.NEVER}
        vscroll={Gtk.PolicyType.AUTOMATIC}
        visible={bind(notifd, 'notifications').as(n => n.length > 0)}
      >
        <box orientation={Gtk.Orientation.VERTICAL} className="notifications_container">
          {bind(notifd, 'notifications').as(ns => ns.map(n => {
            return <Notification
              setup={() => {}}
              onHoverLost={() => {}}
              notification={n}
            />
          }))}
        </box>
      </scrollable>
      <box
        heightRequest={monitor.geometry.height * 0.5}
        className="notifications_container empty"
        visible={bind(notifd, 'notifications').as(n => n.length == 0)}
      >
        <icon
          valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} hexpand
          icon="preferences-system-notifications-symbolic" 
        />
      </box>
      <box>
        <label label="hello, world!" />
      </box>
    </box>
  </window>
}
