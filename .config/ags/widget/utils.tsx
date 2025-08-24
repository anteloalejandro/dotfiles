import { Gtk } from "ags/gtk4";


/** empty box that enables sizing of elements that need some content*/
export function Empty() {
  return <box css="font-size: 0.01px; color: transparent;">.</box>
}

export type EventBoxProps  = {
  onClicked?: ((source: Gtk.Button) => void);
  children?: JSX.Element | Array<JSX.Element>;
  class?: string
}

export function EventBox(props: EventBoxProps)  {
  return <button
    cssName="eventbox"
    class={props.class}
    onClicked={props.onClicked}
  >
    {props.children ?? <Empty />}
  </button>
}
