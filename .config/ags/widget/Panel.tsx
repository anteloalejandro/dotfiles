import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { createBinding, For, State } from "gnim";
import { setup_fix_hidden_window, setup_window_resizable } from "./utils";
import { CornerOrientation, RoundedCorner } from "./corners";
import Notifd from "gi://AstalNotifd?version=0.1";
import { Notification } from "./notifications";
import Vars from "../Vars";

export default function Panel(gdkmonitor: Gdk.Monitor, show_panel: State<boolean>) {
  const {RIGHT, BOTTOM, TOP} = Astal.WindowAnchor;
  const [ reveal ] = show_panel;
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
      anchor={RIGHT | BOTTOM | TOP}
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
          <centerbox orientation={Gtk.Orientation.VERTICAL}>
            <RoundedCorner $type="start" orientation={CornerOrientation.TOP_RIGHT} />
            <RoundedCorner $type="end" orientation={CornerOrientation.BOTTOM_RIGHT} />
          </centerbox>
          <box
            class="panel-container"
            spacing={2*Vars.spacing} 
            orientation={Gtk.Orientation.VERTICAL}
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
              class="notifications-wrapper"
              // height_request={gdkmonitor.geometry.height*0.6}
              vexpand
            >
              <box
                class="notifications"
                spacing={Vars.spacing}
                orientation={Gtk.Orientation.VERTICAL}
              >
                <For each={notifications(ns =>
                  ns.toSorted((a, b) => b.time - a.time)
                )}>
                  {(n: Notifd.Notification) => <Notification notification={n} show_date /> }
                </For>
              </box>
            </scrolledwindow>
          </box>
        </box>
      </revealer>
    </window>
  )
}
