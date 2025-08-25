import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

export default function BottomBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  return (
    <window
      visible
      name="border-bottom"
      class="BorderBottom"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      height_request={8}
    >
      <menubutton>
        <box class="border-bottom-bar"></box>
          <popover
            position={Gtk.PositionType.TOP}
            autohide={false}
            has_arrow={false}
          >
            BOTTOM
          </popover>
      </menubutton>
    </window>
  )
}
