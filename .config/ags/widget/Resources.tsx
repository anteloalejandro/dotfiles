import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { cpu_usage, mem } from "./utils";
import UiState from "../UiState";
import { CornerOrientation, RoundedCorner } from "./corners";
import { execAsync } from "ags/process";
import Vars from "../Vars";

export default function Resources(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT } = Astal.WindowAnchor;
  const [ reveal, set_reveal ] = UiState.show_resources;

  return (
    <window
      visible={reveal}
      namespace="resources"
      name="resources"
      class="Resources"
      application={app}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={TOP | LEFT}
    >
      <box>
        <box orientation={Gtk.Orientation.VERTICAL}>
          <box
            class="resources-container"
            orientation={Gtk.Orientation.VERTICAL}
            spacing={Vars.spacing}
          >
            <box spacing={Vars.spacing}>
              <image icon_name="memory-symbolic" />
              <levelbar
                orientation={Gtk.Orientation.HORIZONTAL}
                width_request={200}
                value={mem.as(m => m.used/m.total)}
              >
                <label label={mem.as(mem => `${(mem.used/1000).toFixed(2)}GB`)} />
              </levelbar>
            </box>
            <box spacing={Vars.spacing}>
              <image icon_name="cpu-symbolic" />
              <levelbar
                orientation={Gtk.Orientation.HORIZONTAL}
                width_request={200}
                value={cpu_usage(p => (p/100))}
              >
                <label label={cpu_usage.as(p => `${p}%`)} />
              </levelbar>
            </box>
            <button
              onClicked={() => {
                execAsync(["hyprctl", "kill"]);
                set_reveal(false);
              }}
            >
              <box spacing={Vars.spacing}>
                <image icon_name="process-stop-symbolic" />
                <label label="Kill" hexpand justify={Gtk.Justification.CENTER} />
              </box>
            </button>
          </box>
          <box valign={Gtk.Align.START}><RoundedCorner orientation={CornerOrientation.TOP_LEFT} /></box>
        </box>
        <box halign={Gtk.Align.START}><RoundedCorner orientation={CornerOrientation.TOP_LEFT} /></box>
      </box>
    </window>
  )
}
