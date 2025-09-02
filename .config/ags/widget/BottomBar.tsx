import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Vars from "../Vars";
import UiState from "../UiState";

export default function BottomBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
  const set_reveal_runner = UiState.show_runner[1];

  return (
    <window
      visible
      name="border-bottom"
      class="BorderBottom border"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      height_request={Vars.spacing}
      $={self => {
        const click_gesture = new Gtk.GestureClick();
        self.add_controller(click_gesture);
        click_gesture.connect('pressed', () => {
          set_reveal_runner(b => !b)
        })
      }}
    >
      <box class="border-bottom-bar"></box>
    </window>
  )
}
