import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { createState, onMount } from "gnim";
import { Empty, EventBox } from "./utils";

export default function LeftBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT, TOP } = Astal.WindowAnchor
  return (
    <window
      visible
      name="border-left"
      class="BorderLeft"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | BOTTOM}
      application={app}
      width_request={8}
    >
      <menubutton>
        <box class="border-left-bar"></box>
          <popover
            position={Gtk.PositionType.RIGHT}
            has_arrow={false}
          >
            <Gtk.Calendar></Gtk.Calendar>
          </popover>
      </menubutton>
    </window>
  )
}
