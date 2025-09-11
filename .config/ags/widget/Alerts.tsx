import app from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { monitorFile, readFileAsync } from "ags/file";
import { createBinding, createComputed, createExternal, createState } from "gnim";
import { timeout } from "ags/time";
import AstalIO from "gi://AstalIO?version=0.1";
import { Gtk } from "ags/gtk4";
import Vars from "../Vars";
import Battery from "gi://AstalBattery?version=0.1";
import { time_fmt } from "../utils";

const power_profile = createExternal("", set => {
  const fm = monitorFile("/sys/class/platform-profile/platform-profile-0/profile", async (f) => {
    const content = (await readFileAsync(f)).trim();
    if (power_profile.get() != content) set(content);
  });

  return () => { fm.cancel() }
})
const [show_power_profile, set_show_power_profile] = createState(false);
let timeout_handle: AstalIO.Time | undefined = undefined;
power_profile.subscribe(() => {
  timeout_handle?.cancel();
  set_show_power_profile(true);
  timeout_handle = timeout(2000, () => {
    set_show_power_profile(false);
  })
})

const battery = Battery.get_default();
const battery_charging = createBinding(battery, "charging");
const battery_percentage = createBinding(battery, "percentage");
const [battery_dismissed, set_battery_dismissed] = createState(false);
battery_charging.subscribe(() => {
  if (!battery_charging.get()) set_battery_dismissed(false);
})
const low_battery = createComputed(get => 
  get(battery_percentage) < 0.15
  && !get(battery_charging)
  && !get(battery_dismissed)
);


export function Alerts(gdkmonitor: Gdk.Monitor) {
  const { TOP } = Astal.WindowAnchor;
  const reveal = createComputed(get => get(low_battery) || get(show_power_profile))

  return (
    <window
      // visible={reveal} // does not work, reveal is undefined at this point
      namespace="alerts"
      name="alerts"
      class="Alerts"
      application={app}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={TOP}
      $={self => {
        reveal.subscribe(() => {
          self.set_visible(reveal.get())
        })
      }}
    >
      <box
        class="alerts-container"
        orientation={Gtk.Orientation.VERTICAL}
      >
        <button
          class="low-battery"
          visible={false}
          onClicked={() => set_battery_dismissed(true)}
          $={self => low_battery.subscribe(() => self.set_visible(low_battery.get()))}
        >
          <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={Vars.spacing}
          >
            <centerbox>
              <label $type="start" label="LOW BATTERY!" />    
              <box $type="end">
                <label label={battery_percentage.as(p => (p * 100).toFixed(0) + "%")} />    
                <image icon_name={createBinding(battery, "battery_icon_name")} />
              </box>
            </centerbox>
            <Gtk.Separator />
            <label label={createBinding(battery, "time_to_empty").as(t => 
              `Time remaining: ${time_fmt(t, "%H:%M")}`
            )} />    
          </box>
        </button>
        <button
          class="power-profile"
          onClicked={() => set_show_power_profile(false)}
          visible={show_power_profile}
        >
          <box
            orientation={Gtk.Orientation.VERTICAL}
            spacing={Vars.spacing}
          >
            <label label="Power Profile" />    
            <Gtk.Separator />
            <label label={power_profile.as(s => s.substring(0, 1).toUpperCase() + s.substring(1))} />    
          </box>
        </button>
      </box>
    </window>
  );
}

