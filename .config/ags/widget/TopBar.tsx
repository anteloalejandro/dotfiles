import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createState, onCleanup } from "gnim"
import { EventBox } from "./utils"

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
        const handle = reveal_top.subscribe(() => {
          if (reveal_top.get() == true) return;

          self.set_resizable(true);
          self.set_size_request(self.get_width(), 0);
          self.set_resizable(false);
        })
        onCleanup(handle);
      }}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <revealer
          transition_type={Gtk.RevealerTransitionType.SLIDE_DOWN}
          reveal_child={reveal_top}
          onNotifyChildRevealed={() => print(reveal_top.get())}
        >
          <box class="border-top-bar" height_request={10} >
            hello, world!
          </box>
        </revealer>
        <EventBox
          height_request={8}
          onClicked={() => set_reveal_top(b => !b)}
        >
          <box
            valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}
            height_request={2} width_request={20}
            css="border-radius: 8px; background-color: white;"
          />
        </EventBox>
      </box>
    </window>
  )
}
