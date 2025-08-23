import { AstalIO, bind, monitorFile, readFileAsync, timeout, Variable } from "astal";
import { Astal, Gdk, Gtk } from "astal/gtk3";
import Charge from "../../services/charge";
import Battery from "gi://AstalBattery";

const showPowerProfile = Variable(false)
let powerProfile = Variable('quiet')
let timer: AstalIO.Time | undefined;
monitorFile('/sys/class/platform-profile/platform-profile-0/profile', async f => {
  const newProfile = await readFileAsync(f)
  if (newProfile == powerProfile.get()) return
  powerProfile.set(newProfile)
  showPowerProfile.set(true)
  timer?.cancel()
  timer = timeout(2000, () => {
    showPowerProfile.set(false)
  })
})

export default function Alerts(monitor: Gdk.Monitor) {
  const charge = Charge.get_default()
  const bat = Battery.get_default()

  const showLowBatteryAlert = Variable(charge.percentage <= 0.1 && !bat.charging)
  let cancelLowBatteryAlert = false;
  charge.connect('notify', () => {
    if (!bat.charging || charge.percentage > 0.1) cancelLowBatteryAlert = false;
    showLowBatteryAlert.set(charge.percentage <= 0.1 && !bat.charging && !cancelLowBatteryAlert)
  })

  return <window
    className="Alerts"
    gdkmonitor={monitor}
    layer={Astal.Layer.OVERLAY}
    anchor={Astal.WindowAnchor.BOTTOM}
  >
    <box vertical>
      <button
        clickThrough={true} halign={Gtk.Align.CENTER}
        className="PowerProfile" visible={bind(showPowerProfile)}
        onClick={() => showPowerProfile.set(false)}
      >
        <box vertical>
          <label
            className="title"
            label="Power Profile Changed"
          />
          <label
            className="profile"
            label={bind(powerProfile).as(
              s => `${s.at(0)!.toLocaleUpperCase()}${s.substring(1).trim()}`
            )}
          />
        </box>
      </button>
      <button
        clickThrough={true} halign={Gtk.Align.CENTER}
        className="LowBattery"
        visible={bind(showLowBatteryAlert)}
        onClick={() => {
          cancelLowBatteryAlert = true
          showLowBatteryAlert.set(false)
        }}
      >
        <box>
          <icon icon={bind(charge, "icon")} />
          <label
            label={bind(charge, 'percentage').as(p => ` LOW BATTERY: ${Math.floor(p*100)}%`)}
            valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} 
          />
        </box>
      </button>
    </box>
  </window>
}
