import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { CornerOrientation, RoundedCorner } from "./corners";
import { fileExists, setup_hide_on_escape } from "./utils";
import UiState from "../UiState";
import { timeout } from "ags/time";
import Apps from "gi://AstalApps?version=0.1";
import { Accessor, createState, For, onCleanup, State } from "gnim";
import Vars from "../Vars";
import Pango from "gi://Pango?version=1.0";
import { execAsync } from "ags/process";


type Mode = {
  bang: string
  icon_name?: string,
  label?: string,
}

const modes: Mode[] = [
  { bang: "", label: "󱓞" },
  { bang: ">", icon_name: "utilities-terminal-symbolic" },
  // { bang: "=", icon_name: "accessories-calculator-symbolic" },
  { bang: "?", icon_name: "applications-internet-symbolic" },
  // { bang: "games", label: " " }
];

export default function Runner(gdkmonitor: Gdk.Monitor) {
  const [ reveal, set_reveal ] = UiState.show_runner;
  const apps  = new Apps.Apps();
  const [ app_list, set_app_list ] = createState<Apps.Application[]>([])
  const [ selected, set_selected ] = createState(0);
  const [ mode, set_mode ]: State<Mode> = createState(modes[0]);

  return (
    <window
      visible={reveal}
      namespace="runner"
      name="runner"
      class="Runner"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.BOTTOM}
      application={app}
      keymode={Astal.Keymode.EXCLUSIVE}
      resizable
      $={self => {
        const key_controller = new Gtk.EventControllerKey();
        setup_hide_on_escape(self, set_reveal, key_controller);
        key_controller.connect('key-pressed', (_, keyval, _keycode, state) => {
          const len = app_list.get().length;
          keyval = Gdk.keyval_to_upper(keyval); // Gdk.KEY_ enums are in uppercase

          if (
            keyval == Gdk.KEY_Up
              || (keyval == Gdk.KEY_K && state == Gdk.ModifierType.CONTROL_MASK)
          )
            set_selected(n => n+1 >= len ? n : n+1);

          if (
            keyval == Gdk.KEY_Down
              || (keyval == Gdk.KEY_J && state == Gdk.ModifierType.CONTROL_MASK)
          )
            set_selected(n => n-1 < 0 ? 0 : n-1);
        })
      }}
    >
      <box>
        <box valign={Gtk.Align.END}><RoundedCorner orientation={CornerOrientation.BOTTOM_RIGHT} /></box>
        <box
          width_request={550}
          class="runner-container"
          orientation={Gtk.Orientation.VERTICAL}
          valign={Gtk.Align.END}
          spacing={Vars.spacing}
        >
          <box
            class="matches app-matches"
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.END}
            spacing={Vars.spacing}
            visible={app_list.as(xs => xs.length > 0)}
          >
            <For each={app_list.as(xs => xs.toReversed())} >
              {(app: Apps.Application, i) => 
                <box
                  class={selected.as(n => {
                    const idx = i.get();
                    const pos = app_list.get().length-1 - n;
                    return pos == idx ? "item selected" : "item"
                  })}
                  spacing={Vars.spacing}
                >
                  <image
                    class="app-icon"
                    file={fileExists(app.icon_name) ? app.icon_name : undefined}
                    icon_name={!fileExists(app.icon_name) ? app.icon_name : undefined}
                    pixel_size={Vars.spacing * 4}
                  />
                  <box
                    class="app-data"
                    orientation={Gtk.Orientation.VERTICAL}
                    homogeneous
                  >
                    <label
                      class="app-name"
                      label={app.name}
                      halign={Gtk.Align.START}
                    />
                    <label
                      class="app-description"
                      visible={
                        Boolean(app.description)
                          && (app.description != "")
                          && (app.name != app.description)
                      }
                      label={app.description}
                      halign={Gtk.Align.START}
                      max_width_chars={60}
                      ellipsize={Pango.EllipsizeMode.END}
                    />
                  </box>
                </box>
              }
            </For>
          </box>
          <box spacing={Vars.spacing} class="search-box">
            <entry
              $={self => {
                const handle = reveal.subscribe(() => {
                  if (reveal.get()) {
                    self.grab_focus();
                  } else {
                    timeout(250, () => {
                      self.text = "";
                      set_selected(0);
                      set_app_list([]);
                    })
                  }
                })
                onCleanup(handle);

                const key_controller = new Gtk.EventControllerKey();
                self.add_controller(key_controller)
                key_controller.connect('key-pressed', (_, keyval) => {
                  if (keyval == Gdk.KEY_Tab) return true; // disable tab navigation
                })
              }}
              hexpand
              valign={Gtk.Align.END}
              placeholder_text={"Search..."}
              text=""
              primary_icon_name="search-symbolic"
              onNotifyText={self => {
                if (self.text.length < 2) {
                  set_app_list([]);
                  set_mode(modes.slice(1).find(m => self.text.startsWith(m.bang)) ?? modes[0]);
                  return;
                }

                if (mode.get().bang == "")
                  set_app_list(apps.fuzzy_query(self.text).slice(0, 5));

                set_selected(-1); // reset
                set_selected(0);
              }}
              onActivate={self => {
                const list = app_list.get();
                switch (mode.get().bang) {
                  case "": // case "games":
                    print(list);
                    list.length && list[selected.get()].launch();
                    break;
                  case "?":
                    const search = "https://duckduckgo.com/?q=" + self.text.substring(1).trim();
                    execAsync(["zen-browser", search]);
                    break;
                  case ">":
                    const cmd = self.text.substring(1).trim().split(' ');
                    execAsync([...cmd]);
                }
                set_reveal(false);
              }}
            />
            <box class="search-modes">
              {modes.map(m => 
                <button
                  label={m.label}
                  icon_name={m.icon_name}
                  class={mode.as(mode => mode.bang == m.bang ? "selected" : "")}
                />
              )}
            </box>
          </box>
        </box>
        <box valign={Gtk.Align.END}><RoundedCorner orientation={CornerOrientation.BOTTOM_LEFT} /></box>
      </box>
    </window>
  )
}

