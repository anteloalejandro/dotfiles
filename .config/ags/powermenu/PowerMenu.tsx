import { Binding, execAsync } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"

function cmdButton(icon: string, ...commands: string[]) {
  return <button onClicked={() => commands.forEach(execAsync)} >
    <icon icon={icon} />
  </button>
}
export default function PowerMenu(monitor: Gdk.Monitor, app: Gtk.Application) {
  return <window
    name="powermenu" application={app}
    className="PowerMenu"
    gdkmonitor={monitor}
    anchor={Astal.WindowAnchor.TOP}
    exclusivity={Astal.Exclusivity.IGNORE}
    keymode={Astal.Keymode.EXCLUSIVE}
    widthRequest={monitor.geometry.width}
    heightRequest={monitor.geometry.height}
  >
    <box valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
      {cmdButton("system-shutdown-symbolic", "poweroff")}
      {cmdButton("system-reboot-symbolic", "reboot")}
      {cmdButton("system-suspend-symbolic", "ags quit -i powermenu", "systemctl suspend")}
      {cmdButton("application-exit-symbolic", "hyprct dispatch exit")}
      {cmdButton("window-close-symbolic", "ags toggle powermenu -i powermenu")}
    </box>
  </window>
}
