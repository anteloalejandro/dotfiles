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
      <box class="border-right-bar"></box>
    </window>
  )
}
