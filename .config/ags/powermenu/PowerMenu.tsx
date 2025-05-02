import { execAsync } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"

export default function PowerMenu(monitor: Gdk.Monitor) {
  return <window
    className="PowerMenu"
    gdkmonitor={monitor}
    anchor={Astal.WindowAnchor.TOP}
    // anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
    exclusivity={Astal.Exclusivity.IGNORE}
    keymode={Astal.Keymode.EXCLUSIVE}
    widthRequest={monitor.geometry.width}
    heightRequest={monitor.geometry.height}
  >
    <box valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
      <button onClicked={() => execAsync("poweroff")}>
        <icon icon="system-shutdown-symbolic" />
      </button>
      <button onClicked={() => execAsync("reboot")}>
        <icon icon="system-reboot-symbolic" />
      </button>
      <button onClicked={() => {
        execAsync("ags quit -i powermenu")
        execAsync("systemctl suspend")
      }}>
        <icon icon="system-suspend-symbolic" />
      </button>
      <button onClicked={() => execAsync("hyprct dispatch exit")}>
        <icon icon="application-exit-symbolic" />
      </button>
      <button onClicked={() => execAsync('ags quit -i powermenu')}>
        <icon icon="window-close-symbolic" />
      </button>
    </box>
  </window>
}
