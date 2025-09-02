import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import { Accessor, createBinding, createConnection, createState, For } from "gnim"
import { EventBox, setup_window_resizable } from "./utils"
import Tray from "gi://AstalTray"
import Hyprland from "gi://AstalHyprland?version=0.1"
import Apps from "gi://AstalApps?version=0.1"
import Pango from "gi://Pango?version=1.0"
import Battery from "gi://AstalBattery?version=0.1"
import Vars from '../Vars';
import { createPoll } from "ags/time"
import GLib from "gi://GLib?version=2.0"
import UiState from "../UiState"

const [hypr_event, set_hypr_event] = createState("");
Hyprland.get_default().connect('event', (_, field, value) => {
  // console.log({field, value})
  set_hypr_event(() => field + ";" + value);
})

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

  function parse_class_name(s: string) {
    return s.substring(s.lastIndexOf(".")+1);
  }

  const fullscreen = createConnection(
    false,
    [hyprland, "event", () => 
      hyprland && hyprland.focused_client && hyprland.focused_client.fullscreen > 0,
    ],
  )

  return (
    <box
      spacing={Vars.spacing/2}
      class={fullscreen.as(b => {
        const classes = ["focused-client"];
        if (b) classes.push("fullscreen");
        return classes.join(' ');
      })}
    >
      <image icon_name={hypr_event.as(() => {
        const client = hyprland.focused_client;
        if (!client) return "desktop-symbolic";
        if (!client.initial_class) return "";
        const class_name = parse_class_name(client.initial_class);
        const query = apps.fuzzy_query(class_name);
        for (const q of query) {
          if (q && q.icon_name != "") return q.icon_name;
        }
        return "";
      })}
      />
      <label
        label={hypr_event.as(() => {
          const client = hyprland.focused_client;
          if (!client) return "Desktop";
          if (!client.class) return "";
          return `${parse_class_name(client.class)} - ${client.title}`;
        })}
        max_width_chars={20}
        ellipsize={Pango.EllipsizeMode.END}
      />
    </box>
  )
}

function Workspaces() {
  const hyprland = Hyprland.get_default();
  const workspaces = createBinding(hyprland, "workspaces");

  return (
    <box
      spacing={5}
    >
      <For each={workspaces(wss => wss
        .filter(ws => !(ws.id >= -99 && ws.id <= -2)) // filter out special wss
        .sort((a, b) => a.id - b.id)
      )}>
        {(ws: Hyprland.Workspace) => {
          return (
            <button
              class={hypr_event.as(() =>
                "workspace-indicator"
                  + (ws.clients.length == 0 ? " empty" : " ")
                  + (ws.id == hyprland.focused_workspace.id ? " focused" : "")
              )}
              onClicked={() => ws.focus()}
              valign={Gtk.Align.CENTER}
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
    <box class={createBinding(bat, "percentage").as(p =>
      "battery-indicator" + (p < 0.15 ? " low-battery" : "")
    )}>
      <label label={
        createBinding(bat, "percentage")
          .as(p => `${Math.floor(p * 100)}%`)
      } />
      <image icon_name={createBinding(bat, "battery_icon_name")} />
    </box>
  )
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor
  const [ reveal_top, set_reveal_top ] = UiState.show_top;

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
        >
          <centerbox class="border-top-bar" height_request={10} >
            <box spacing={Vars.spacing} $type="start">
              <button
                icon_name="utilities-system-monitor-symbolic"
                onClicked={() => UiState.show_resources[1](b => !b)}
              />
              <FocusedClient />
            </box>
            <Workspaces $type="center" />
            <box $type="end" spacing={Vars.radius}>
              <SysTray />
              <BatteryIndicator />
              <label class="time" label={createPoll("", 1000,
                () => GLib.DateTime.new_now_local().format("%H:%M")!
              )} />
              <button class="powermenu-btn" icon_name="system-shutdown-symbolic"
                onClicked={() => UiState.show_power[1](b => !b)}
              />
            </box>
          </centerbox>
        </revealer>
        <EventBox
          height_request={Vars.spacing}
          onClicked={() => set_reveal_top(b => !b)}
        >
          <box
            class="reveal-trigger"
            valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}
            height_request={Vars.spacing/2} width_request={2*Vars.spacing}
          />
        </EventBox>
      </box>
    </window>
  )
}
