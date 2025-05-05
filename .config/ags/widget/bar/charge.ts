import { exec, GObject, monitorFile, property, readFile, readFileAsync, register, Variable } from "astal";
import Battery from "gi://AstalBattery"

@register({GTypeName: "Charge"})
export default class Charge extends GObject.Object {
  static instance: Charge
  static get_default() {
    if (!this.instance) this.instance = new Charge()
    return this.instance
  }

  #limit = 1
  #percentage = 0;
  #icon = 'battery-100-symbolic'
  readonly #base_path = "/sys/class/power_supply/"
  readonly #battery_path = this.#base_path + exec(`bash -c "ls ${this.#base_path} | grep 'BAT' | head -1"`)
  readonly #bat = Battery.get_default()


  @property(Number)
  get limit() {return this.#limit}

  @property(Number)
  get percentage() {return this.#percentage}

  @property(Number)
  get icon() {return this.#icon}


  #setLimit(value: any) {
    const newLimit = isNaN(Number(value)) ? 1 : (Number(value)/100)
    this.#limit = newLimit
    this.notify('limit')
    this.#bat.notify('percentage')
  }

  #setBatteryIcon() {
    const prefix = 'battery-level'
    const sufix = 'symbolic'
    const charge = Number(
      Math.min(
        this.#bat.get_energy()/this.#bat.get_energy_full()
          * (1/this.#limit),
          1
        ).toFixed(1)
    ) * 100
    const isCharging = this.#bat.get_charging()

    this.#icon = `${prefix}-${charge}-${isCharging ? 'charging-' : ''}${sufix}`
    this.notify('icon')
  }

  #setPercentage() {
    this.#percentage = this.#bat.percentage * (1/this.#limit)
    this.notify('percentage')
  }

  constructor() {
    super()

    this.#setLimit(readFile(this.#battery_path + "/charge_control_end_threshold"))
    monitorFile(this.#battery_path + "/charge_control_end_threshold", async f => {
      this.#setLimit(await readFileAsync(f))
    })

    this.#setBatteryIcon()
    this.#setPercentage()
    this.#bat.connect('notify', () => {
      this.#setBatteryIcon()
      this.#setPercentage()
    })
  }
}
