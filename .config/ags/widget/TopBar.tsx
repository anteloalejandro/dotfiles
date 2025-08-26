import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createBinding, For, State } from "gnim"
import { EventBox, setup_window_resizable } from "./utils"
import Tray from "gi://AstalTray"
import Hyprland from "gi://AstalHyprland?version=0.1"
import Apps from "gi://AstalApps?version=0.1"
import Pango from "gi://Pango?version=1.0"
import Battery from "gi://AstalBattery?version=0.1"

function SysTray() {
  const tray = Tray.get_default();
  const items = createBinding(tray, "items");

  return (
    <box>
      <For each={items(xs => xs.sort((a, b) => b.id.localeCompare(a.id)))}>
        {(item: Tray.TrayItem, _) => {
          return <menubutton
            $={self => self.insert_action_group("dbusmenu", item.actionGroup)}
            tooltip_markup={createBinding(item, "tooltipMarkup")}
            menu_model={createBinding(item, "menuModel")}>
            <image gicon={createBinding(item, "gicon")} />
          </menubutton>
        }}
      </For>
    </box>
  )
}

function FocusedClient() {
  const hyprland = Hyprland.get_default();
  const apps = new Apps.Apps();
  const focused = createBinding(hyprland, "focused_client");

  function parse_class_name(s: string) {
    return s.substring(s.lastIndexOf(".")+1);
  }

  return (
    <box>
      <image icon_name={focused(client => {
        if (!client) return "";
        const class_name = parse_class_name(client.class);
        const query = apps.fuzzy_query(class_name);
        for (const q of query) {
          if (q && q.icon_name != "") return q.icon_name;
        }
        return "";
      })} />
      <label
        label={focused.as(client =>
          client ? `${parse_class_name(client.class)} - ${client.title}` : "Desktop"
        ) }
        max_width_chars={20}
        ellipsize={Pango.EllipsizeMode.END}
      />
    </box>
  )
}

function Workspaces() {
  const hyprland = Hyprland.get_default();
  const workspaces = createBinding(hyprland, "workspaces");
  const focused = createBinding(hyprland, "focused_workspace");

  return (
    <box>
      <For each={workspaces(wss => wss
        .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special wss
        .sort((a, b) => a.id - b.id)
      )}>
        {(ws: Hyprland.Workspace, i) => {
          return (
            <button
              class={
                "workspace-indicator"
                  + (ws.clients.length == 0 ? " empty" : " ")
                  + (ws.id == focused.get().id ? " focused" : "")
              }
              onClicked={() => ws.focus()}
              label={i(i => i+1).as(String)}
            />
          )
        }}
      </For>
    </box>
  )
}

function BatteryIndicator() {
  const bat = Battery.get_default();
  return (
    <box>
      <label label={
        createBinding(bat, "percentage")
          .as(p => `${Math.floor(p * 100)}%`)
      } />
      <image icon_name={createBinding(bat, "icon_name")} />
    </box>
  )
}

export default function Bar(gdkmonitor: Gdk.Monitor, show_top: State<boolean>) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const [ reveal_top, set_reveal_top ] = show_top;

  return (
    <window
      visible
      name="border-top"
      class="BorderTop"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
      $={self => {
        setup_window_resizable(self, reveal_top, Gtk.Orientation.VERTICAL);
      }}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <revealer
          transition_type={Gtk.RevealerTransitionType.SLIDE_DOWN}
          reveal_child={reveal_top}
          onNotifyChildRevealed={() => print(reveal_top.get())}
        >
          <centerbox class="border-top-bar" height_request={10} >
            <FocusedClient $type="start" />
            <Workspaces $type="center" />
            <box $type="end">
              <SysTray />
              <BatteryIndicator />
            </box>
          </centerbox>
        </revealer>
        <EventBox
          height_request={8}
          onClicked={() => set_reveal_top(b => !b)}
        >
          <box
            valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}
            height_request={3} width_request={20}
            css="border-radius: 8px; background-color: white;"
          />
        </EventBox>
      </box>
    </window>
  )
}
