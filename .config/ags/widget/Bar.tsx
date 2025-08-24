import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { RoundedCorner, CornerOrientation, DynRoundedCorner } from "./corners"
import { createState } from "gnim"
import { timeout } from "ags/time"
import { Empty, EventBox } from "./utils"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  const [ reveal_top, set_reveal_top ] = createState(false);

  return (
    <window
      visible
      name="border-top"
      class="BorderTop"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
      $={self => {
        reveal_top.subscribe(() => {
          if (reveal_top.get() == true) return;

          self.set_resizable(true);
          self.set_size_request(self.get_width(), 0);
          self.set_resizable(false);
        })
      }}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <revealer
          transition_type={Gtk.RevealerTransitionType.SLIDE_DOWN}
          reveal_child={reveal_top}
          onNotifyChildRevealed={() => print(reveal_top.get())}
        >
          <box class="border-top-bar" >
            hello!
          </box>
        </revealer>
        <EventBox
          onClicked={() => set_reveal_top(b => !b)}
        />
      </box>
    </window>
  )
}
