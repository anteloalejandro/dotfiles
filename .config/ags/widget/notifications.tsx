import { Gtk } from "ags/gtk4"
import Notifd from "gi://AstalNotifd"
import Pango from "gi://Pango?version=1.0"
import GLib from "gi://GLib?version=2.0"
import Vars from "../Vars"
import Apps from "gi://AstalApps?version=0.1"

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
  show_date?: boolean;
}

export function Notification(props: Props) {
  const { notification: n } = props;
  const { START, CENTER, END } = Gtk.Align;
  const show_date = props.show_date ?? false;

  const apps = new Apps.Apps();
  const name = n.app_name || n.desktop_entry || n.app_icon;
  const query = apps.fuzzy_query(name);
  let icon = n.app_icon || n.desktop_entry;
  for (const q of query) {
    if (q && q.icon_name != "") {
      icon = q.icon_name;
      break;
    }
  }

  return <box
    class={`Notification ${urgency(n)}`}
  >
    <box orientation={Gtk.Orientation.VERTICAL} spacing={Vars.spacing}>
      <box class="header" spacing={Vars.spacing}>
        {(n.appIcon || n.desktopEntry) && <image
          class="app-icon"
          visible={Boolean(icon)}
          icon_name={icon}
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
          label={time(n.time, show_date ? "%d/%m - %H:%M" : "%H:%M")}
        />
        <button onClicked={() => n.dismiss()}>
          <image icon_name="window-close-symbolic" />
        </button>
      </box>
      <Gtk.Separator visible />
      <box class="content" spacing={Vars.spacing}>
        {n.image && fileExists(n.image) && <image
          height_request={100}
          width_request={100}
          halign={START}
          class="image"
          file={n.image}
        />}
        <box orientation={Gtk.Orientation.VERTICAL} spacing={Vars.spacing}>
          <label
            class="summary"
            halign={START}
            xalign={0}
            label={n.summary}
            max_width_chars={40}
            ellipsize={Pango.EllipsizeMode.END}
          />
          {n.body && <label
            class="body"
            wrap
            useMarkup
            halign={START}
            xalign={0}
            justify={Gtk.Justification.FILL}
            wrap_mode={Pango.WrapMode.WORD_CHAR}
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


