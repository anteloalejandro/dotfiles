import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { setup_fix_hidden_window, setup_window_resizable } from "./utils";
import { Accessor, createState, State } from "gnim";
import Brightness from "../service/brightness";
import Wp from "gi://AstalWp?version=0.1";
import { CornerOrientation, RoundedCorner } from "./corners";
import { timeout } from "ags/time";

function OsdSlider(props: {visible: State<boolean>}) {
  const [, set_reveal] = props.visible;

  const brightness = Brightness.get_default();
  const speaker = Wp.get_default()?.get_default_speaker();
  // const microphone = Wp.get_default()?.get_default_microphone();

  const [value, set_value] = createState(0);
  const [icon, set_icon] = createState("");

  let count = -1
  function show(v: number, icon: string) {
    if (count < 0) {
      count = 0;
      return;
    }
    set_reveal(true);
    set_value(v);
    set_icon(icon);
    count++;
    timeout(2000, () => {
      count--;
      if (count === 0) set_reveal(false);
    })
  }

  brightness.connect("notify::kbd", () => {
    show(brightness.kbd, "display-brightness-symbolic");
  });
  brightness.connect("notify::screen", () => {
    show(brightness.screen, "keyboard-brightness-symbolic");
  });
  speaker?.connect("notify::mute", () => {
    show(speaker.volume, speaker.volume_icon);
  });
  speaker?.connect("notify::volume", () => {
    show(speaker.volume, speaker.volume_icon);
  });

  return (
    <box class="Osd-slide" orientation={Gtk.Orientation.VERTICAL}>
      <image icon_name={icon} />
      <box halign={Gtk.Align.CENTER}>
        <overlay>
          <levelbar
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}
            heightRequest={100}
            inverted
            value={value(v => Math.min(v, 1))}
          />
          <levelbar
            $type="overlay"
            class="danger"
            orientation={Gtk.Orientation.VERTICAL}
            valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}
            heightRequest={100}
            inverted
            visible={value(v => v > 1)}
            value={value(v => Math.min(Math.max(v-1, 0), 1))} 
          />
        </overlay>
      </box>
      <label
        halign={Gtk.Align.CENTER}
        width_chars={3}
        label={value(v => String(Math.floor(v * 100)))}
      />
    </box>
  )
}

export default function Osd(gdkmonitor: Gdk.Monitor, show_osd: State<boolean>) {
  const [reveal, set_reveal] = show_osd;
  return (
    <window
      visible
      name="osd"
      class="Osd"
      application={app}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.LEFT}
      $={self => {
        setup_window_resizable(self, reveal, Gtk.Orientation.HORIZONTAL);
        setup_fix_hidden_window(self, reveal);
      }}
    >
      <revealer
        reveal_child={reveal}
        transition_type={Gtk.RevealerTransitionType.SLIDE_RIGHT}
        width_request={1}
      >
        <box orientation={Gtk.Orientation.VERTICAL}>
          <box valign={Gtk.Align.START}>
            <RoundedCorner color="#181818" radius={8} orientation={CornerOrientation.BOTTOM_LEFT} />
          </box>
          <box
            height_request={100}
            width_request={20}
            css="background-color: #181818; border-radius: 0px 8px 8px 0px; padding: 1rem;"
            $={self => {
              const controller = new Gtk.GestureClick();
              self.add_controller(controller);
              controller.connect('pressed', () => {
                set_reveal(false);
              });
            }}
          >
            <OsdSlider visible={show_osd} />
          </box>
          <box valign={Gtk.Align.START}>
            <RoundedCorner color="#181818" radius={8} orientation={CornerOrientation.TOP_LEFT} />
          </box>
        </box>
      </revealer>
    </window>
  )
}
