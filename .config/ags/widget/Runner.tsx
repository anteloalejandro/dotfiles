import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { CornerOrientation, RoundedCorner } from "./corners";
import { fileExists, setup_fix_hidden_window, setup_hide_on_escape, setup_window_resizable } from "./utils";
import UiState from "../UiState";
import { timeout } from "ags/time";
import Apps from "gi://AstalApps?version=0.1";
import { createState, For, onCleanup } from "gnim";
import Vars from "../Vars";
import Pango from "gi://Pango?version=1.0";

export default function Runner(gdkmonitor: Gdk.Monitor) {
  const [ reveal, set_reveal ] = UiState.show_runner;
  const apps  = new Apps.Apps();
  const [ app_list, set_app_list ] = createState<Apps.Application[]>([])
  const [ selected, set_selected ] = createState(0);

  return (
    <window
      visible
      name="runner"
      class="Runner"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.BOTTOM}
      application={app}
      keymode={Astal.Keymode.EXCLUSIVE}
      resizable
      $={self => {
        setup_window_resizable(self, reveal, Gtk.Orientation.VERTICAL);
        setup_fix_hidden_window(self, reveal);

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
      <revealer
        reveal_child={reveal}
        transition_type={Gtk.RevealerTransitionType.SLIDE_UP}
        height_request={1}
      >
        <box>
          <box valign={Gtk.Align.END}><RoundedCorner orientation={CornerOrientation.BOTTOM_RIGHT} /></box>
          <box
            width_request={500}
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
              }}
              hexpand
              valign={Gtk.Align.END}
              placeholder_text={"Search..."} text=""
              onNotifyText={self => {
                if (self.text.length < 2) {
                  set_app_list([]);
                  return;
                }
                set_app_list(apps.fuzzy_query(self.text).slice(0, 5));
                set_selected(-1); // reset
                set_selected(0);
              }}
              onActivate={() => {
                const list = app_list.get();
                if (list.length) list[selected.get()].launch();
                set_reveal(false);
              }}
            />
          </box>
          <box valign={Gtk.Align.END}><RoundedCorner orientation={CornerOrientation.BOTTOM_LEFT} /></box>
        </box>
      </revealer>
    </window>
  )
}
