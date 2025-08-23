import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import { RoundedCorner, CornerOrientation } from "./corners"

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const time = createPoll("", 1000, "date")
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const { TOP_LEFT, TOP_RIGHT } = CornerOrientation;

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
      <centerbox cssName="centerbox">
        <box $type="start">
          <RoundedCorner padding={20} radius={8} orientation={TOP_LEFT} />
        </box>
        <box $type="center" class="border-top-bar" hexpand vexpand>
          <label>Hello world</label>
        </box>
        <box $type="end">
          <RoundedCorner padding={20} radius={8} orientation={TOP_RIGHT} />
        </box>
      </centerbox>
    </window>
  )
}
