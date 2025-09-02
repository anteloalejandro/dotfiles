import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Vars from "../Vars";
import UiState from "../UiState";

export default function LeftBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, RIGHT, TOP } = Astal.WindowAnchor
  const set_reveal_panel = UiState.show_panel[1];
  return (
    <window
      visible
      name="border-right"
      class="BorderRight border"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | RIGHT | BOTTOM}
      application={app}
      width_request={Vars.spacing}
      $={self => {
        const click_gesture = new Gtk.GestureClick();
        self.add_controller(click_gesture);
        click_gesture.connect('pressed', () => {
          set_reveal_panel(b => !b)
        })
      }}
    >
      <box class="border-right-bar"></box>
    </window>
  )
}
