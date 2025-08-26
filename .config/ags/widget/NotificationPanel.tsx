import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { createBinding, For, State } from "gnim";
import { setup_fix_hidden_window, setup_window_resizable } from "./utils";
import { CornerOrientation, RoundedCorner } from "./corners";
import Notifd from "gi://AstalNotifd?version=0.1";
import { Notification } from "./notifications";

export default function Panel(gdkmonitor: Gdk.Monitor, show_panel: State<boolean>) {
  const [reveal, set_reveal] = show_panel;
  const notifd = Notifd.get_default();
  const notifications = createBinding(notifd, "notifications");
  const dnd = createBinding(notifd, "dont_disturb");

  return (
    <window
      visible application={app}
      name="panel"
      class="Panel"
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.RIGHT | Astal.WindowAnchor.BOTTOM}
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
        <box orientation={Gtk.Orientation.VERTICAL}>
          <box halign={Gtk.Align.END}>
            <RoundedCorner color="#181818" radius={8} orientation={CornerOrientation.BOTTOM_RIGHT} />
          </box>
          <box>
            <box valign={Gtk.Align.END}>
              <RoundedCorner color="#181818" radius={8} orientation={CornerOrientation.BOTTOM_RIGHT} />
            </box>
            <box
              class="panel-content"
              orientation={Gtk.Orientation.VERTICAL}
              css="background-color: #181818; border-radius: 8px 0px 8px 0px; padding: 1rem;"
              height_request={gdkmonitor.geometry.height*0.8}
              width_request={400}
            >
              <centerbox>
                <label $type="start" label="Do not Disturb" />
                <switch $type="end" active={dnd}
                  onNotifyActive={({active}) => {
                    notifd.set_dont_disturb(active);
                  }}
                />
              </centerbox>
              <button label="Clear All" onClicked={() => {
                for (const n of notifd.notifications) {
                  n.dismiss();
                }
              }} />
              <scrolledwindow
                class="notification-wrapper"
                // height_request={gdkmonitor.geometry.height*0.6}
                vexpand
              >
                <box
                  orientation={Gtk.Orientation.VERTICAL}
                  css="padding: 8px; border-radius: 8px; background-color: #222;"
                >
                  <For each={notifications(ns =>
                    ns.toSorted((a, b) => b.time - a.time)
                  )}>
                    {(n: Notifd.Notification) => <Notification notification={n} /> }
                  </For>

                </box>
              </scrolledwindow>
            </box>
          </box>
        </box>
      </revealer>
    </window>
  )
}
