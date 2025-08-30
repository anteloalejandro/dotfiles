import { Astal, Gtk } from "ags/gtk4";
import { timeout } from "ags/time";
import { Accessor, onCleanup } from "gnim";


/** empty box that enables sizing of elements that need some content*/
export function Empty() {
  return <box css="font-size: 0.01px; color: transparent;">.</box>
}

export type EventBoxProps  = {
  onClicked?: ((source: Gtk.Button) => void);
  onHoverLost?: ((source: Gtk.EventControllerMotion) => void)
  children?: JSX.Element | Array<JSX.Element>;
  class?: string;
  height_request?: number | Accessor<number> | undefined;
  width_request?: number | Accessor<number> | undefined;
}

export function EventBox(props: EventBoxProps)  {
  const children = props.children;
  delete props.children;


  return <button
    cssName="eventbox"
    $={self => {
      const motion = new Gtk.EventControllerMotion();
      if (props.onHoverLost !== undefined) {
        self.add_controller(motion);
        motion.connect("leave", m => {
          props.onHoverLost!(m);
          return true;
        });
      }
    }}
    {...props}
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
