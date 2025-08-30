import { Astal, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Vars from "../Vars";
import UiState from "../UiState";

export default function BottomBar(gdkmonitor: Gdk.Monitor) {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;
  return (
    <window
      visible
      name="border-bottom"
      class="BorderBottom border"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      height_request={Vars.spacing}
    >
      <box class="border-bottom-bar"></box>
    </window>
  )
}
