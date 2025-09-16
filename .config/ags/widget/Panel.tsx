import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { createBinding, For, State } from "gnim";
import { setup_hide_on_escape, setup_listen_fullscreen, } from "../utils";
import { CornerOrientation, RoundedCorner } from "./corners";
import Notifd from "gi://AstalNotifd?version=0.1";
import { Notification } from "./notifications";
import Vars from "../Vars";
import UiState from "../UiState";

export default function Panel(gdkmonitor: Gdk.Monitor) {
  const {RIGHT, BOTTOM, TOP} = Astal.WindowAnchor;
  const [ reveal, set_reveal ] = UiState.show_panel;
  const notifd = Notifd.get_default();
  const notifications = createBinding(notifd, "notifications");
  const dnd = createBinding(notifd, "dont_disturb");

  return (
    <window
      visible={reveal}
      application={app}
      namespace="panel"
      name="panel"
      class="Panel"
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.EXCLUSIVE}
      anchor={RIGHT | BOTTOM | TOP}
      can_focus={false}
      $={self => {
        setup_listen_fullscreen(self);
        const key_controller = new Gtk.EventControllerKey();
        self.add_controller(key_controller);
        key_controller.connect('key-pressed', (_, keyval, _keycode, _state) => {
          keyval = Gdk.keyval_to_upper(keyval);
          if (keyval == Gdk.KEY_Escape) set_reveal(false);
          if (keyval == Gdk.KEY_D) notifd.dont_disturb = !notifd.dont_disturb;
          if (keyval == Gdk.KEY_C) for (const n of notifd.notifications) {
            n.dismiss();
          }
        })
      }}
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
              class={dnd.as(b => b ? "active" : "inactive")}
              onNotifyActive={({active}) => {
                notifd.set_dont_disturb(active);
              }}
            />
          </centerbox>
          <button class="clear-all" label="Clear All" onClicked={() => {
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
    </window>
  )
}
