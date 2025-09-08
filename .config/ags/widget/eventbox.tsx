import Gtk from "gi://Gtk?version=4.0";
import { EventBoxProps } from "../utils";


export function EventBox(props: EventBoxProps) {
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
                props.onHover!(self, m);
            });
        }}
        class={props.class}
        height_request={props.height_request}
        width_request={props.width_request}
        onClicked={props.onClicked}
    >
        {children ?? <Empty />}
    </button>;
}


/** empty box that enables sizing of elements that need some content*/
export function Empty() {
    return <box css="font-size: 0.01px; color: transparent;">.</box>;
}

