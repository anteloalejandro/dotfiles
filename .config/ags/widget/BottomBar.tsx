import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import { createState, onMount, State } from "gnim";
import Vars from "../Vars";

export default function BottomBar(gdkmonitor: Gdk.Monitor, bottom_popup: State<boolean>) {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const [ popup_visible, set_popup_visible ] = bottom_popup;
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
      // keymode={Astal.Keymode.ON_DEMAND}
    >
      <box class="border-bottom-bar"></box>
    </window>
  )
}
