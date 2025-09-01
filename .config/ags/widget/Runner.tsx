import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { State } from "gnim";
import { CornerOrientation, RoundedCorner } from "./corners";
import { setup_fix_hidden_window, setup_hide_on_escape, setup_window_resizable } from "./utils";
import UiState from "../UiState";

export default function Runner(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM } = Astal.WindowAnchor;
  const { BOTTOM_LEFT, BOTTOM_RIGHT } = CornerOrientation;
  const [ reveal, set_reveal ] = UiState.show_runner;
  return (
    <window
      visible
      name="runner"
      class="Runner"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={BOTTOM}
      application={app}
      keymode={Astal.Keymode.EXCLUSIVE}
      $={self => {
        setup_window_resizable(self, reveal, Gtk.Orientation.VERTICAL);
        setup_fix_hidden_window(self, reveal);
        setup_hide_on_escape(self, set_reveal);
      }}
    >
      <revealer
        reveal_child={reveal}
        transition_type={Gtk.RevealerTransitionType.SLIDE_UP}
        height_request={1}
      >
        <box>
          <box valign={Gtk.Align.END}><RoundedCorner color="#181818" orientation={BOTTOM_RIGHT} radius={8} /></box>
          <box
            width_request={500}
            class="runner-container"
          >
            <entry
              $={self => {
                const key_controller = new Gtk.EventControllerKey();
                self.add_controller(key_controller);
                key_controller.connect('key-pressed', (_, keyval, keycode, state) => {
                  if (keyval == Gdk.KEY_Escape) self.set_text("");
                })
              }}
              placeholder_text={"Search..."} text=""
              onNotifyText={self => print(self.text)}
            />
            <button label="x" onClicked={() => set_reveal(false)} />
          </box>
          <box valign={Gtk.Align.END}><RoundedCorner color="#181818" orientation={BOTTOM_LEFT} radius={8} /></box>
        </box>
      </revealer>
    </window>
  )
}
