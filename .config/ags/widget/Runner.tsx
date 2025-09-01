import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { CornerOrientation, RoundedCorner } from "./corners";
import { setup_fix_hidden_window, setup_hide_on_escape, setup_window_resizable } from "./utils";
import UiState from "../UiState";
import { timeout } from "ags/time";
import Apps from "gi://AstalApps?version=0.1";
import { createState, For, onCleanup } from "gnim";

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
      keymode={Astal.Keymode.ON_DEMAND}
      resizable
      $={self => {
        setup_window_resizable(self, reveal, Gtk.Orientation.VERTICAL);
        setup_fix_hidden_window(self, reveal);
        setup_hide_on_escape(self, set_reveal);
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
          >
            <box
              class="matches app-matches"
              orientation={Gtk.Orientation.VERTICAL}
              valign={Gtk.Align.END}
            >
              <For each={app_list} >
                {(app, i) => 
                  <label
                    $={self => {
                    }}
                    label={app.name}
                    class={selected.as(n => {
                      const list = app_list.get();
                      const idx = i.get();
                      const match = list.length-1 - n;
                      return match == idx ? "item selected" : "item"
                    })}
                  />
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
                if (self.text.length < 2) return;
                set_app_list(apps.fuzzy_query(self.text).reverse().slice(0, 10));
              }}
            />
          </box>
          <box valign={Gtk.Align.END}><RoundedCorner orientation={CornerOrientation.BOTTOM_LEFT} /></box>
        </box>
      </revealer>
    </window>
  )
}
