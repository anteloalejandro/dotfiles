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
  const [ caffeine, set_caffeine ] = createState(true);
  reveal.subscribe(() => {
    execAsync(["bash", "-c", "pidof vigiland"])
      .then(() => set_caffeine(true))
      .catch(() => set_caffeine(false))
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
              valign={Gtk.Align.CENTER}
            >
              <button
                icon_name="process-stop-symbolic"
                onClicked={() => {
                  execAsync(["hyprctl", "kill"]);
                  set_reveal(false);
                }}
              />
              <button
                icon_name={caffeine.as(b => b ? "caffeine-cup-full" : "caffeine-cup-empty")}
                onClicked={() => {
                  execAsync(["bash", "-c", "pidof vigiland"])
                    .then(out => {
                      execAsync(["kill", out]).catch(() => {});
                      set_caffeine(false);
                    })
                    .catch(() => {
                      execAsync(["bash", "-c", "vigiland & disown"]).catch(() => {});
                      set_caffeine(true);
                    })
                }}
              />
            </box>
            <box
              class="resources"
              spacing={2 * Vars.spacing}
              orientation={Gtk.Orientation.VERTICAL}
            >
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
          </box>
          <box valign={Gtk.Align.START}><RoundedCorner orientation={CornerOrientation.TOP_LEFT} /></box>
        </box>
        <box halign={Gtk.Align.START}><RoundedCorner orientation={CornerOrientation.TOP_LEFT} /></box>
      </box>
    </window>
  )
}
