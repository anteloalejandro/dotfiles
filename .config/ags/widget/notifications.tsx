import { Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import Pango from "gi://Pango?version=1.0"
import GLib from "gi://GLib?version=2.0"

const fileExists = (path: string) =>
  GLib.file_test(path, GLib.FileTest.EXISTS)

const time = (time: number, format = "%H:%M") => GLib.DateTime
  .new_from_unix_local(time)
  .format(format)!

const urgency = (n: Notifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency
  // match operator when?
  switch (n.urgency) {
    case LOW: return "low"
    case CRITICAL: return "critical"
    case NORMAL:
    default: return "normal"
  }
}

type Props = {
  notification: Notifd.Notification;
}

export function Notification(props: Props) {
  const { notification: n } = props
  const { START, CENTER, END } = Gtk.Align

  return <box
    class={`Notification ${urgency(n)}`}
  >
    <box orientation={Gtk.Orientation.VERTICAL}>
      <box class="header">
        {(n.appIcon || n.desktopEntry) && <image
          class="app-icon"
          visible={Boolean(n.appIcon || n.desktopEntry)}
          icon_name={n.appIcon || n.desktopEntry}
        />}
        <label
          class="app-name"
          halign={START}
          ellipsize={Pango.EllipsizeMode.END}
          max_width_chars={20}
          label={n.appName || "Unknown"}
        />
        <label
          class="time"
          hexpand
          halign={END}
          label={time(n.time)}
        />
        <button onClicked={() => n.dismiss()}>
          <image icon_name="window-close-symbolic" />
        </button>
      </box>
      <Gtk.Separator visible />
      <box class="content">
        {n.image && fileExists(n.image) && <box
          valign={START}
          class="image"
          css={`background-image: url('${n.image}')`}
        />}
        {n.image && <box
          hexpand={false}
          vexpand={false}
          valign={START}
          class="icon-image">
          <image icon_name={n.image} vexpand hexpand halign={CENTER} valign={CENTER} />
        </box>}
        <box orientation={Gtk.Orientation.VERTICAL}>
          <label
            class="summary"
            halign={START}
            xalign={0}
            label={n.summary}
            max_width_chars={30}
            ellipsize={Pango.EllipsizeMode.END}
          />
          {n.body && <label
            class="body"
            wrap
            useMarkup
            halign={START}
            xalign={0}
            justify={Gtk.Justification.FILL}
            label={n.body}
          />}
        </box>
      </box>
      {
        n.get_actions().length > 0 && <box class="actions">
          {n.get_actions().map(({ label, id }) => (
            <button
              hexpand
              onClicked={() => {
                n.invoke(id)
                console.log(label)
              }}>
              <label label={label} halign={CENTER} hexpand />
            </button>
          ))}
        </box>
      }
    </box>
  </box>
}


