import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout } from "astal/time"
import Variable from "astal/variable"
import Brightness from "./brightness"
import Wp from "gi://AstalWp"

function OnScreenProgress({ visible }: { visible: Variable<boolean> }) {
  const brightness = Brightness.get_default()
  const speaker = Wp.get_default()!.get_default_speaker()

  const iconName = Variable("")
  const value = Variable(0)

  let count = -1
  function show(v: number, icon: string) {
    if (count < 0) {
      count = 0;
      return;
    }
    visible.set(true)
    value.set(v)
    iconName.set(icon)
    count++
    timeout(2000, () => {
      count--
      if (count === 0) visible.set(false)
    })
  }

  return (
    <revealer
      setup={(self) => {
        self.hook(brightness, "notify::screen", () =>
          show(brightness.screen, "display-brightness-symbolic")
        )

        self.hook(brightness, "notify::kbd", () => 
          show(brightness.kbd, "keyboard-brightness-symbolic")
        )

        if (speaker) {
          self.hook(speaker, "notify::volume", () =>
            show(speaker.volume, speaker.volumeIcon),
          )
        }
        visible.set(false)
      }}
      revealChild={visible()}
      transitionType={Gtk.RevealerTransitionType.CROSSFADE}
    >
      <box className="OSD" vertical>
        <icon icon={iconName()} />
        <box halign={Gtk.Align.CENTER}>
          <overlay>
            <levelbar vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} inverted heightRequest={100} value={value().as(v => Math.min(v, 1))} />
            <levelbar className="danger" vertical valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER} inverted heightRequest={100} visible={value().as(v => v > 1)} value={value().as(v => Math.min(Math.max(v-1, 0), 1))} />
          </overlay>
        </box>
        <label halign={Gtk.Align.CENTER} label={value(v =>
          String(Math.floor(v * 100))
        )} />
      </box>
    </revealer>
  )
}

export default function OSD(monitor: Gdk.Monitor) {
  const visible = Variable(false)

  return (
    <window
      gdkmonitor={monitor}
      className="OSD"
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.LEFT}
    >
      <eventbox onClick={() => visible.set(false)}>
        <OnScreenProgress visible={visible} />
      </eventbox>
    </window>
  )
}
