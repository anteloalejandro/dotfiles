import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import { createState, onCleanup, onMount, State } from "gnim";
import { CornerOrientation, RoundedCorner } from "./corners";

export default function TestWindow(bottom_popup: State<boolean>) {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
  const { TOP_LEFT, BOTTOM_LEFT, BOTTOM_RIGHT, TOP_RIGHT } = CornerOrientation;
  const [ reveal, set_reveal ] = bottom_popup;
  return (
    <window
      visible
      name="test-window"
      class="TestWindow"
      monitor={0}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      height_request={1}
      // keymode={Astal.Keymode.ON_DEMAND}
      $={self => {
        const handle = reveal.subscribe(() => {
          if (reveal.get() == true) return;

          self.set_resizable(true);
          self.set_size_request(self.get_width(), 0);
          self.set_resizable(false);
        })
        onCleanup(handle);
      }}
    >
      <revealer
        reveal_child={reveal}
        transition_type={Gtk.RevealerTransitionType.SLIDE_UP}
      >
        <box>
          <box valign={Gtk.Align.END}><RoundedCorner orientation={BOTTOM_RIGHT} radius={8} /></box>
          <box hexpand css="background-color: #181818; padding: 8px; border-radius: 8px 8px 0px 0px;">HELLO</box>
          <box valign={Gtk.Align.END}><RoundedCorner orientation={BOTTOM_LEFT} radius={8} /></box>
        </box>
      </revealer>
    </window>
  )
}
