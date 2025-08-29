import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Vars from "../Vars";

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
      width_request={Vars.spacing}
      $={self => window_ref = self}
    >
      <box class="border-left-bar"></box>
    </window>
  )
}
