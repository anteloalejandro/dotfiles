import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

export default function LeftBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT, TOP } = Astal.WindowAnchor
  let window_ref: Astal.Window;
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
      $={self => window_ref = self}
    >
      <menubutton>
        <box class="border-left-bar"></box>
        <popover
          onRealize={self => {
            self.set_offset(0, -window_ref.get_height()/2);
          }}
          position={Gtk.PositionType.RIGHT}
          has_arrow={false}
        >
          LEFT
        </popover>
      </menubutton>
    </window>
  )
}
