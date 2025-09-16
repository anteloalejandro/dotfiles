import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { CornerOrientation, RoundedCorner } from "./corners";
import { fileExists, setup_hide_on_escape, setup_listen_fullscreen } from "../utils";
import UiState from "../UiState";
import { timeout } from "ags/time";
import Apps from "gi://AstalApps?version=0.1";
import { Accessor, createState, For, onCleanup } from "gnim";
import Vars from "../Vars";
import Pango from "gi://Pango?version=1.0";
import { execAsync } from "ags/process";
import fetch, { URL } from "gnim/fetch";
import GLib from "gi://GLib?version=2.0";

type Mode = {
  name: string,
  bang: string
  icon_name?: string,
  label?: string,
}

const modes: Mode[] = [
  { name: "application", bang: "", label: "󱓞" },
  { name: "command", bang: ">", icon_name: "utilities-terminal-symbolic" },
  { name: "search", bang: "?", icon_name: "applications-internet-symbolic" },
  // { bang: "=", icon_name: "accessories-calculator-symbolic" },
  // { bang: "games", label: " " }
];

class Debouncer {
  private timeout_handle?: GLib.Source;
  private timer;
  constructor(timer = 500) {
    this.timer = timer;
  }

  debounce(fn: () => void) {
    if (this.timeout_handle) {
      clearTimeout(this.timeout_handle);
    }
    this.timeout_handle = setTimeout(fn, this.timer);
  }

  async debounce_promise(promise: Promise<any>) {
    if (this.timeout_handle) {
      clearTimeout(this.timeout_handle);
    }

    this.timeout_handle = setTimeout(async () => await promise, this.timer)
  }
}

function parse_text(text: string, mode: Mode) {
  return text.substring(mode.bang.length).trim();
}

async function search_suggestions(str: string) {
  const url = new URL("https://duckduckgo.com/ac/");
  url.searchParams.set("q", str);
  const res = await fetch(url.toString());
  const json = await res.json() as {phrase: string}[];
  return json.map(o => o.phrase);
}

export default function Runner(gdkmonitor: Gdk.Monitor) {
  const [ reveal, set_reveal ] = UiState.show_runner;
  const apps  = new Apps.Apps();
  const [ app_list, set_app_list ] = createState<Apps.Application[]>([])
  const [ suggestion_list, set_suggestion_list ] = createState<string[]>([]);
  const [ selected, set_selected ] = createState(0);
  const [ mode, set_mode ] = createState(modes[0].name);

  const debouncer = new Debouncer();

  return (
    <window
      visible={reveal}
      namespace="runner"
      name="runner"
      class="Runner"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.BOTTOM}
      layer={Astal.Layer.OVERLAY}
      application={app}
      keymode={Astal.Keymode.EXCLUSIVE}
      resizable
      $={self => {
        setup_listen_fullscreen(self)
        const key_controller = new Gtk.EventControllerKey();
        setup_hide_on_escape(self, set_reveal, key_controller);
        key_controller.connect('key-pressed', (_, keyval, _keycode, state) => {
          let list = [];
          if (app_list.get().length) list = app_list.get();
          else if (suggestion_list.get().length) list = suggestion_list.get();

          const len = list.length;
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
            class="matches search-matches"
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.END}
            spacing={Vars.spacing}
            visible={suggestion_list.as(xs => xs.length > 0)}
          >
            <For each={suggestion_list.as(xs => xs.toReversed())} >
              {(suggestion: string, i) => 
                <box
                  class={selected.as(n => {
                    const idx = i.get();
                    const pos = suggestion_list.get().length-1 - n;
                    return pos == idx ? "item selected" : "item"
                  })}
                  spacing={Vars.spacing}
                >
                  <box
                    class="search-data data"
                    orientation={Gtk.Orientation.VERTICAL}
                    homogeneous
                  >
                    <label
                      class="title"
                      label={suggestion}
                      halign={Gtk.Align.START}
                      max_width_chars={60}
                      ellipsize={Pango.EllipsizeMode.END}
                    />
                  </box>
                </box>
              }
            </For>
          </box>
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
                    class="app-data data"
                    orientation={Gtk.Orientation.VERTICAL}
                    homogeneous
                  >
                    <label
                      class="title"
                      label={app.name}
                      halign={Gtk.Align.START}
                    />
                    <label
                      class="description"
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
                  set_suggestion_list([]);
                  set_mode(modes[0].name);
                  return;
                }

                const m = modes.slice(1).find(m => self.text.startsWith(m.bang)) ?? modes[0];
                set_mode(m.name);

                switch (m.name) {
                  case "application":
                    set_app_list(apps.fuzzy_query(self.text).slice(0, 5));
                    break;
                  case "search":
                    set_app_list([]);
                    const text = parse_text(self.text, modes.find(m => mode.get() == m.name)!);
                    debouncer.debounce_promise(search_suggestions(text).then(data => {
                      if (text != "" && data[0] != text) {
                        data = [text].concat(data.filter(s => s != text))
                      }
                      set_suggestion_list(data.slice(0,5));
                      set_selected(-1); // reset
                      set_selected(0);
                    }));
                    break;
                }

                set_selected(-1); // reset
                set_selected(0);
              }}
              onActivate={self => {
                const m = modes.find(m => mode.get() == m.name)!;
                switch (mode.get()) {
                  case "application": {
                    const list = app_list.get();
                    list.length && list[selected.get()].launch();
                  } break;

                  case "search": {
                    const list = suggestion_list.get();
                    if (!list.length) break;
                    const sel = selected.get();
                    const text = sel == 0 ? self.text : list[sel];
                    const search = "https://duckduckgo.com/?q=" + text;
                    execAsync(["zen-browser", search]);
                    } break;
                  case "command":
                    const text = parse_text(self.text, m);
                    const cmd = text.split(' ');
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
                  class={mode.as(mode => mode == m.name ? "selected" : "")}
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

