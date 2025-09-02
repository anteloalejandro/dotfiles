import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { cpu_usage, mem, setup_fix_hidden_window, setup_window_resizable } from "./utils";
import UiState from "../UiState";
import { CornerOrientation, RoundedCorner } from "./corners";
import { execAsync } from "ags/process";
import Vars from "../Vars";

export default function Resources(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT } = Astal.WindowAnchor;
  const [ reveal, set_reveal ] = UiState.show_resources;

  return (
    <window
      visible 
      application={app}
      name="resources"
      class="Resources"
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={TOP | LEFT}
      $={self => {
        setup_window_resizable(self, reveal, Gtk.Orientation.VERTICAL);
        setup_fix_hidden_window(self, reveal);
      }}
    >
      <revealer
        reveal_child={reveal}
        transition_type={Gtk.RevealerTransitionType.SLIDE_DOWN}
        height_request={1}
      >
        <box>
          <box orientation={Gtk.Orientation.VERTICAL}>
            <box
              class="resources-container"
              orientation={Gtk.Orientation.VERTICAL}
            >
              <box orientation={Gtk.Orientation.VERTICAL}>
                <slider
                  sensitive={false}
                  value={cpu_usage}
                  min={0} max={1}
                />
                <label label={cpu_usage.as(String)} />
              </box>
              <box orientation={Gtk.Orientation.VERTICAL}>
                <slider
                  sensitive={false}
                  value={mem.as(m => m.used)}
                  min={0} max={mem.as(m => m.total)}
                />
                <label label={mem.as(mem =>
                  `${(mem.used/1000).toFixed(2)}/${(mem.total/1000).toFixed(2)} GB`
                )} />
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
      </revealer>
    </window>
  )
}
