import { Gtk } from "ags/gtk4";
import { Accessor } from "gnim";


/** empty box that enables sizing of elements that need some content*/
export function Empty() {
  return <box css="font-size: 0.01px; color: transparent;">.</box>
}

export type EventBoxProps  = {
  onClicked?: ((source: Gtk.Button) => void);
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
    {...props}
  >
    {children ?? <Empty />}
  </button>
}
