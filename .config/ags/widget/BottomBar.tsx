import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { timeout } from "ags/time";
import { createState, onMount, State } from "gnim";

export default function BottomBar(gdkmonitor: Gdk.Monitor, bottom_popup: State<boolean>) {
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor
  const [ popup_visible, set_popup_visible ] = bottom_popup;
  return (
    <window
      visible
      name="border-bottom"
      class="BorderBottom"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      height_request={8}
      // keymode={Astal.Keymode.ON_DEMAND}
    >
      <menubutton sensitive={false}>
        <box class="border-bottom-bar"></box>
        <popover
          $={self => {
            // wait a lil bit before activating
            onMount(() => timeout(250, () => {
              self.popup();
              // self.set_visible(true);
            }));
            // keep on trying until it works.
            // self.connect("notify::visible", () => self.popup());
          }}
          position={Gtk.PositionType.TOP}
          autohide={false}
          has_arrow={false}
        >
          <revealer
            transition_type={Gtk.RevealerTransitionType.SLIDE_UP}
            reveal_child={popup_visible}
            height_request={1}
          >
            <box css="background-color: #181818; border-radius: 8px; color: white; padding: 10px;">
              BOTTOM
            </box>
          </revealer>
        </popover>
      </menubutton>
    </window>
  )
}
