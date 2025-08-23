import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import { RoundedCorner, CornerOrientation, DynRoundedCorner } from "./corners"
import { createState } from "gnim"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const { TOP_LEFT, TOP_RIGHT } = CornerOrientation;

  const [ hspace, setHspace ] = createState(20);
  const [ vspace, setVspace ] = createState(20);

  let topBarOpened = false;

  return (
    <window
      visible
      name="border-top"
      class="BorderTop"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <button cssName="eventbox"

        onClicked={_ => {
          if (topBarOpened) {
            setVspace(v => v-10);
            console.log("unfocused");
          } else {
            setVspace(v => v+10);
            console.log("focused");
          }

          topBarOpened = !topBarOpened;
        }}
      >
        <centerbox cssName="centerbox">
          <box $type="start">
            <DynRoundedCorner vspace={vspace} hspace={hspace} radius={8} orientation={TOP_LEFT} />
          </box>
          <box $type="center" class="border-top-bar" hexpand vexpand valign={Gtk.Align.START}
            height_request={vspace.get() + 8}
            $={self => {
              vspace.subscribe(() => {
                self.set_size_request(self.get_size_request()[0], vspace.get() + 8)
              })
            }}
          >
            <label>Hello world</label>
          </box>
          <box $type="end">
            <DynRoundedCorner vspace={vspace} hspace={hspace} radius={8} orientation={TOP_RIGHT} />
          </box>
        </centerbox>
      </button>
    </window>
  )
}
