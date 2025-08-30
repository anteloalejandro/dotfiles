import app from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";
import Notifd from "gi://AstalNotifd?version=0.1";
import Gdk from "gi://Gdk?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import { createState, For } from "gnim";
import { CornerOrientation, RoundedCorner } from "./corners";
import { Notification } from "./notifications";
import { setup_window_resizable, setup_fix_hidden_window } from "./utils";
import { timeout } from "ags/time";
import { execAsync } from "ags/process";
import UiState from "../UiState";


const notifd = Notifd.get_default();
const [notifications, set_notifications] = createState<Notifd.Notification[]>([]);
const reveal = notifications.as(ns => ns.length > 0);

notifd.connect('notified', (_, id) => {
  if (notifd.dont_disturb || UiState.show_panel[0].get()) return;
  const notification = notifd.get_notification(id);
  set_notifications(ns => ns.concat(notification));

  if (notification.urgency != Notifd.Urgency.CRITICAL) {
    timeout(Math.max(notification.expire_timeout, 5000), () => {
      set_notifications(ns => ns.filter(n => n.id != id));
    });
  }
})
notifd.connect('resolved', (_, id) => {
  set_notifications(ns => ns.filter(n => n.id != id));
})


export function NotificationPopup(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      name="notification-popup"
      class="NotificationPopup"
      application={app}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={BOTTOM | RIGHT}
      $={self => {
        setup_window_resizable(self, reveal, Gtk.Orientation.HORIZONTAL);
        setup_fix_hidden_window(self, reveal);
      }}
    >
      <revealer
        reveal_child={reveal}
        transition_type={Gtk.RevealerTransitionType.SLIDE_LEFT}
        width_request={1}
      >
        <box>
          <box valign={Gtk.Align.END}>
            <RoundedCorner orientation={CornerOrientation.BOTTOM_RIGHT} />
          </box>
          <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.END}>
            <box halign={Gtk.Align.END}>
              <RoundedCorner orientation={CornerOrientation.BOTTOM_RIGHT} />
            </box>
            <box
              class="popup-container"
              orientation={Gtk.Orientation.VERTICAL}
              height_request={100} width_request={200}
              valign={Gtk.Align.END}
              vexpand
            >
              <box
                orientation={Gtk.Orientation.VERTICAL}
              >
                <For each={notifications.as(ns => ns.sort((a, b) => a.time - b.time).slice(0, 3))}>
                  {(n: Notifd.Notification, _) => <Notification notification={n} />}
                </For>
              </box>
              <button
                visible={notifications.as(ns => ns.length > 3)}
                onClicked={() => { execAsync('ags request show_panel') }}
                halign={Gtk.Align.CENTER}
                label="..."
              />
            </box>
          </box>
        </box>
      </revealer>
    </window>
  );
}

