import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { cpu_usage, gpu_data, mem } from "../utils";
import UiState from "../UiState";
import { CornerOrientation, RoundedCorner } from "./corners";
import { execAsync } from "ags/process";
import Vars from "../Vars";
import { createState, For } from "gnim";
import { CircularLevel } from "./circular_level";

export default function System(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT } = Astal.WindowAnchor;
  const [ reveal, set_reveal ] = UiState.show_system;
  const [ hypridle, set_hypridle ] = createState(true);
  reveal.subscribe(() => {
    execAsync(["bash", "-c", "pidof hypridle"])
      .then(() => set_hypridle(true))
      .catch(() => set_hypridle(false))
  })

  return (
    <window
      visible={reveal}
      namespace="system"
      name="system"
      class="System"
      application={app}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={TOP | LEFT}
      can_focus={false}
    >
      <box>
        <box orientation={Gtk.Orientation.VERTICAL}>
          <box
            class="system-container"
            spacing={2 * Vars.spacing}
          >
            <box
              class="buttons"
              orientation={Gtk.Orientation.VERTICAL}
              valign={Gtk.Align.START}
            >
              <button
                icon_name="process-stop-symbolic"
                onClicked={() => {
                  execAsync(["hyprctl", "kill"]);
                  set_reveal(false);
                }}
              />
              <button
                icon_name={hypridle.as(b => b ? "caffeine-cup-empty" : "caffeine-cup-full")}
                onClicked={() => {
                  execAsync(["bash", "-c", "pidof hypridle"])
                    .then(out => {
                      execAsync(["kill", out]).catch(() => {});
                      set_hypridle(false);
                    })
                    .catch(() => {
                      execAsync("hypridle").catch(() => {});
                      set_hypridle(true);
                    })
                }}
              />
            </box>
            <box
              class="resources"
              spacing={2 * Vars.spacing}
              orientation={Gtk.Orientation.VERTICAL}
            >
              <box orientation={Gtk.Orientation.VERTICAL} spacing={Vars.spacing / 2}>
                <label halign={Gtk.Align.START} label="System" />
                <box>
                  <CircularLevel
                    label="CPU"
                    value={cpu_usage}
                    max={100}
                  />
                  <CircularLevel
                    label="MEM"
                    value={mem.as(mem => mem.used / mem.total)}
                    transform={() => (mem.get().used / 1000).toFixed(1) + "GB"}
                  />
                </box>
              </box>
              <box orientation={Gtk.Orientation.VERTICAL} spacing={Vars.spacing / 2}>
                <label halign={Gtk.Align.START} label="GPUs" />
                <box height_request={60} width_request={60}>
                  <For each={gpu_data} >
                    {(gpu) => 
                      <CircularLevel label={gpu.device_name.split(" ")[0]} value={parseFloat(gpu.gpu_util)} max={100} />
                    }
                  </For>
                </box>
              </box>
            </box>
          </box>
          <box valign={Gtk.Align.START}><RoundedCorner orientation={CornerOrientation.TOP_LEFT} /></box>
        </box>
        <box halign={Gtk.Align.START}><RoundedCorner orientation={CornerOrientation.TOP_LEFT} /></box>
      </box>
    </window>
  )
}
