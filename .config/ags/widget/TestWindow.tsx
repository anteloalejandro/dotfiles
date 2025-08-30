import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { State } from "gnim";
import { CornerOrientation, RoundedCorner } from "./corners";
import { setup_fix_hidden_window, setup_window_resizable } from "./utils";
import UiState from "../UiState";

export default function TestWindow(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
  const { BOTTOM_LEFT, BOTTOM_RIGHT } = CornerOrientation;
  const [ reveal ] = UiState.bottom_popup;
  return (
    <window
      visible
      name="test-window"
      class="TestWindow"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      // keymode={Astal.Keymode.ON_DEMAND}
      $={self => {
        setup_window_resizable(self, reveal, Gtk.Orientation.VERTICAL);
        setup_fix_hidden_window(self, reveal);
      }}
    >
      <revealer
        reveal_child={reveal}
        transition_type={Gtk.RevealerTransitionType.SLIDE_UP}
        height_request={1}
      >
        <box>
          <box valign={Gtk.Align.END}><RoundedCorner color="#181818" orientation={BOTTOM_RIGHT} radius={8} /></box>
          <box hexpand css="background-color: #181818; padding: 8px; border-radius: 8px 8px 0px 0px;">HELLO</box>
          <box valign={Gtk.Align.END}><RoundedCorner color="#181818" orientation={BOTTOM_LEFT} radius={8} /></box>
        </box>
      </revealer>
    </window>
  )
}
