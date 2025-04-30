import { Variable, GLib, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import Hyprland from "gi://AstalHyprland"
import Battery from "gi://AstalBattery"
import Tray from "gi://AstalTray"

const Separator = () => <label className="Separator" label="|" />

function SysTray() {
  const tray = Tray.get_default()

  return <box className="SysTray">
    {bind(tray, "items").as(items => items.map(item => (
      <menubutton
        tooltipMarkup={bind(item, "tooltipMarkup")}
        usePopover={false}
        actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
        menuModel={bind(item, "menuModel")}>
        <icon gicon={bind(item, "gicon")} />
      </menubutton>
    )))}
  </box>
}

function BatteryLevel() {
  const bat = Battery.get_default()

  return <box className="Battery"
    visible={bind(bat, "isPresent")}>
    <label label={bind(bat, "percentage").as(p =>
      `${Math.floor(p * 100)}%`
    )} />
    <icon icon={bind(bat, "batteryIconName")} />
  </box>
}

function Workspaces() {
  const hypr = Hyprland.get_default()

  return <box className="Workspaces">
    {bind(hypr, "workspaces").as(wss => wss
      .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special workspaces
      .sort((a, b) => a.id - b.id)
      .map(ws => (
        <button
          valign={Gtk.Align.CENTER}
          className={bind(hypr, "focusedWorkspace").as(
            fw => ws === fw ? "focused" : ""
          )}
          onClicked={() => ws.focus()}
        />
      ))
    )}
  </box>
}

function FocusedClient() {
  const hypr = Hyprland.get_default()
  const focused = bind(hypr, "focusedClient")
  const max_chars = 20;

  return <box className="Focused">
    {focused.as(client => {
      const ret = (
        <label label={client ? bind(client, "title") : "Desktop"} maxWidthChars={max_chars} truncate />
      )
      return ret
    })}
  </box>
}

function Time({ format = "%H:%M" }) {
  const time = Variable<string>("").poll(1000, () =>
    GLib.DateTime.new_now_local().format(format)!)

  return <label
    className="Time"
    onDestroy={() => time.drop()}
    label={time()}
  />
}

export default function Bar(monitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return <window
    className="Bar"
    gdkmonitor={monitor}
    exclusivity={Astal.Exclusivity.EXCLUSIVE}
    anchor={TOP | LEFT | RIGHT}>
    <centerbox>
      <box hexpand halign={Gtk.Align.START}>
        <FocusedClient />
      </box>
      <box hexpand halign={Gtk.Align.CENTER}>
        <Workspaces />
      </box>
      <box hexpand halign={Gtk.Align.END} >
        {/* <SysTray /> */}
        {/* <label label="|" /> */}
        <BatteryLevel />
        <Separator />
        <Time />
      </box>
    </centerbox>
  </window>
}
