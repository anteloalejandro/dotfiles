import { Astal, Gdk, Gtk } from "ags/gtk4";
import { createPoll, interval, timeout } from "ags/time";
import { Accessor, createConnection, createState, onCleanup, Setter } from "gnim";
import GLib from "gi://GLib?version=2.0"
import { execAsync } from "ags/process";
import AstalHyprland from "gi://AstalHyprland?version=0.1";


/** empty box that enables sizing of elements that need some content*/
export function Empty() {
  return <box css="font-size: 0.01px; color: transparent;">.</box>
}

export type EventBoxProps  = {
  onClicked?: ((source: Gtk.Button) => void);
  onHover?: ((source: Gtk.Button, controller: Gtk.EventControllerMotion) => void)
  onHoverLost?: ((source: Gtk.Button, controller: Gtk.EventControllerMotion) => void)
  children?: JSX.Element | Array<JSX.Element>;
  class?: string;
  height_request?: number | Accessor<number> | undefined;
  width_request?: number | Accessor<number> | undefined;
}

export function EventBox(props: EventBoxProps)  {
  const children = props.children;

  return <button
    cssName="eventbox"
    $={self => {
      const motion = new Gtk.EventControllerMotion();
      self.add_controller(motion);

      props.onHoverLost && motion.connect("leave", m => {
        props.onHoverLost!(self, m);
      });
      props.onHover && motion.connect("enter", m => {
        props.onHover!(self, m)
      });
    }}
    class={props.class}    
    height_request={props.height_request}    
    width_request={props.width_request}
    onClicked={props.onClicked}
  >
    {children ?? <Empty />}
  </button>
}

/**
 * WARN: DO NOT put padding on the window itself, as it affects the result of
 * `get_width()` and `get_height()`, but `set_size_request()` does not account for it
 */
export function setup_window_resizable(
  window: Astal.Window,
  reveal: Accessor<boolean>,
  orientation: Gtk.Orientation
) {
  const handle = reveal.subscribe(() => {
    if (reveal.get() == true) return;

    const size = orientation == Gtk.Orientation.VERTICAL
      ? {x: window.get_width(), y: 0}
      : {x: 0, y: window.get_height()}
    ;

    window.set_resizable(true);
    window.set_size_request(size.x, size.y);
    window.set_resizable(false);
  })
  onCleanup(handle);
}

export function setup_fix_hidden_window(
  window: Astal.Window,
  reveal: Accessor<boolean>
) {
  const handle = reveal.subscribe(() => {
    if (reveal.get() == false) {
      timeout(250, () => {
        // reset visibility to fix 1px window bug
        window.set_visible(false)
        window.set_visible(true)
      });
    }
  })
  onCleanup(handle);
}

export function setup_hide_on_escape(
  window: Astal.Window,
  set_reveal: Setter<boolean>,
  key_controller?: Gtk.EventControllerKey
) {
  key_controller ??= new Gtk.EventControllerKey();
  window.add_controller(key_controller);
  key_controller.connect('key-pressed', (_, keyval) => {
    if (keyval == Gdk.KEY_Escape) set_reveal(false);
  })
}

export function fileExists(path?: string) {
  if (!path) return false;
  return GLib.file_test(path, GLib.FileTest.EXISTS);
}

export function time_fmt(time: number, format = "%H:%M") {
  return GLib.DateTime
    .new_from_unix_local(time)
    .format(format)!
}

export const cpu_usage = createPoll(0, 5000, async () => {
  const out = await execAsync(["bash", "-c", `top -b -n1 | grep "%Cpu(s)" | awk '{print $2 + $4}'`]);
  return Number(out);
})

export const mem = createPoll({used: 0, total: 0}, 5000, async () => {
  const out = await execAsync(["bash", "-c", "free -m | grep Mem: | tr -s ' '"]);
  const values = out.split(' '); // total, used, free, shared, buff/cache
  return { used: Number(values[2]), total: Number(values[1]) }
})

const hyprland = AstalHyprland.get_default();
export const fullscreen = createConnection(
  0,
  [hyprland, "event", () => {
    if (!hyprland || !hyprland.focused_client) return 0;
    return hyprland.focused_client.fullscreen;
  }],
)

export function setup_listen_fullscreen(window: Astal.Window) {
  const class_name = "fullscreen-client";
  fullscreen.subscribe(() => {
    fullscreen.get() >= 2
      ? window.add_css_class(class_name)
      : window.remove_css_class(class_name)
    ;
  })
}
