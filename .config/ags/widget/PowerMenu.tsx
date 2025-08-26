import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { exec } from "ags/process";
import { State } from "gnim";

export default function PowerMenu(gdkmonitor: Gdk.Monitor, show_power: State<boolean>) {
  const [ visible, set_visible ] = show_power;
  const {BOTTOM, LEFT, RIGHT, TOP} = Astal.WindowAnchor;
  return (
    <window
      visible={visible} application={app}
      name="power-menu"
      class="PowerMenu"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.OVERLAY}
      keymode={Astal.Keymode.EXCLUSIVE}
      anchor={BOTTOM | TOP | LEFT | RIGHT}
      css="background-color: rgba(0,0,0, 0.4);"
    >
      <box valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
        <button
          $={self => {
            visible.subscribe(() => {
              if (visible.get()) self.grab_focus();
            })
          }}
          icon_name="system-shutdown-symbolic"
          onClicked={() => {
            exec("poweroff");
          }}
        />
        <button
          icon_name="system-reboot-symbolic"
          onClicked={() => {
            exec("reboot");
          }}
        />
        <button
          icon_name="system-suspend-symbolic"
          onClicked={() => {
            set_visible(false);
            exec(["systemctl", "suspend"]);
          }}
        />
        <button
          icon_name="application-exit-symbolic"
          onClicked={() => {
            exec(["hyprctl", "dispatch", "exit"]);
          }}
        />
        <button
          icon_name="window-close-symbolic"
          onClicked={() => {
            set_visible(false);
          }}
        />
      </box>
    </window>
  )
}
