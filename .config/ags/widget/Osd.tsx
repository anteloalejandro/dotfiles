import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { setup_listen_fullscreen } from "../utils";
import { Accessor, createState, State } from "gnim";
import Brightness from "../service/brightness";
import Wp from "gi://AstalWp?version=0.1";
import { CornerOrientation, RoundedCorner } from "./corners";
import { timeout } from "ags/time";
import Vars from "../Vars";
import AstalIO from "gi://AstalIO?version=0.1";

function OsdSlider(props: {visible: State<boolean>}) {
  const [, set_reveal] = props.visible;

  const brightness = Brightness.get_default();
  const speaker = Wp.get_default()?.get_default_speaker();
  // const microphone = Wp.get_default()?.get_default_microphone();

  const [value, set_value] = createState(0);
  const [icon, set_icon] = createState("");

  let timeout_handle: AstalIO.Time | undefined = undefined;
  function show(v: number, icon: string) {
    timeout_handle?.cancel();
    set_reveal(true)
    set_value(v);
    set_icon(icon);
    timeout_handle = timeout(2000, () => {
      set_reveal(false);
    })
  }

  brightness.connect("notify::kbd", () => {
    show(brightness.kbd, "keyboard-brightness-symbolic");
  });
  brightness.connect("notify::screen", () => {
    show(brightness.screen, "display-brightness-symbolic");
  });
  speaker?.connect("notify::mute", () => {
    show(speaker.volume, speaker.volume_icon);
  });
  speaker?.connect("notify::volume", () => {
    show(speaker.volume, speaker.volume_icon);
  });

  return (
    <box class="Osd-slide" orientation={Gtk.Orientation.VERTICAL} spacing={Vars.spacing}>
      <image icon_name={icon} />
      <box halign={Gtk.Align.CENTER}>
        <overlay
          valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}
          heightRequest={100}
        >
          <levelbar
            orientation={Gtk.Orientation.VERTICAL}
            inverted
            value={value(v => Math.min(v, 1))}
          />
          <levelbar
            $type="overlay"
            class="danger"
            orientation={Gtk.Orientation.VERTICAL}
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
      visible={reveal}
      namespace="osd"
      name="osd"
      class="Osd"
      application={app}
      gdkmonitor={gdkmonitor}
      layer={Astal.Layer.OVERLAY}
      exclusivity={Astal.Exclusivity.NORMAL}
      anchor={Astal.WindowAnchor.LEFT}
      $={self => {
        setup_listen_fullscreen(self);
      }}
    >
      <box orientation={Gtk.Orientation.VERTICAL}>
        <box valign={Gtk.Align.START}>
          <RoundedCorner orientation={CornerOrientation.BOTTOM_LEFT} />
        </box>
        <box
          class="osd-container"
          height_request={100}
          width_request={2*Vars.spacing}
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
          <RoundedCorner orientation={CornerOrientation.TOP_LEFT} />
        </box>
      </box>
    </window>
  )
}
