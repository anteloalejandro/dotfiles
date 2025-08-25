import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { onMount } from "gnim";

export default function LeftBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, RIGHT, TOP } = Astal.WindowAnchor
  let window_ref: Astal.Window;
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
      $={self => window_ref = self}
    >
      <Gtk.PopoverMenu>

      </Gtk.PopoverMenu>
      <menubutton>
        <box class="border-right-bar"></box>
        <popover
          onRealize={self => {
            self.set_offset(0, -window_ref.get_height()/2);
          }}
          position={Gtk.PositionType.LEFT}
          has_arrow={false}
        >
          RIGHT
        </popover>
      </menubutton>
    </window>
  )
}
