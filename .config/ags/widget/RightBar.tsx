import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { createState, onMount } from "gnim";
import { Empty, EventBox } from "./utils";

export default function LeftBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, RIGHT, TOP } = Astal.WindowAnchor
  return (
    <window
      visible
      name="border-right"
      class="BorderRight"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | RIGHT | BOTTOM}
      application={app}
      width_request={8}
    >
      <menubutton>
        <box class="border-right-bar"></box>
          <popover
            position={Gtk.PositionType.LEFT}
            has_arrow={false}
          >
            <Gtk.Calendar></Gtk.Calendar>
          </popover>
      </menubutton>
    </window>
  )
}
