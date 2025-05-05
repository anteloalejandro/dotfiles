import { exec, monitorFile, readFile, readFileAsync, Variable } from "astal";
import Battery from "gi://AstalBattery"

export const limit = Variable(1);
export const batIconName = Variable('battery-100-symbolic');

const base_path = "/sys/class/power_supply/"
const battery_path = base_path + exec(`bash -c "ls ${base_path} | grep 'BAT' | head -1"`)
const bat = Battery.get_default()
bat.get_charging()

function setLimit(value: any) {
  const newLimit = isNaN(Number(value)) ? 1 : (Number(value)/100)
  limit.set(newLimit)
}

function setBatteryIcon() {
  const prefix = 'battery-level'
  const sufix = 'symbolic'
  const charge = Number((bat.get_energy()/bat.get_energy_full() * (1/limit.get())).toFixed(1)) * 100
  const isCharging = bat.get_charging()

  batIconName.set(`${prefix}-${charge}-${isCharging ? 'charging-' : ''}${sufix}`)
}

setLimit(readFile(battery_path + "/charge_control_end_threshold"))
monitorFile(battery_path + "/charge_control_end_threshold", async f => {
  setLimit(await readFileAsync(f))
})

setBatteryIcon()
bat.connect('notify', setBatteryIcon)
