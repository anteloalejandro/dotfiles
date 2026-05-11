local vars = require("variables")

-- monitor setup
hl.monitor({
  output = "",
  mode = "preferred",
  position = "auto",
  scale = "auto"
})

-- bindings
require("bindings.base")

-- autostart
hl.on("hyprland.start", function ()
  hl.exec_cmd("hyprpm reload")
  hl.exec_cmd("ags run &")
  hl.exec_cmd("hyprpaper")
  hl.exec_cmd("hypridle")
  hl.exec_cmd("blueman-applet")
  hl.exec_cmd("brighnessctl -- restore")
  hl.exec_cmd("wl-paste --watch cliphist store")
  hl.exec_cmd("cliphist wipe")
  hl.exec_cmd("kdeconnectd")
  hl.exec_cmd("udiskie")

  hl.exec_cmd("systemctl --user start hyprpolkitagent")

  hl.exec_cmd("hydroxide serve")

  hl.exec_cmd("dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
  hl.exec_cmd("systemctl --user start xdg-desktop-portal-hyprland")

  hl.exec_cmd("asusctl profile -P Quiet")
end)

hl.on("hyprland.shutdown", function ()
  hl.exec_cmd("tmux kill-server")
end)

-- env vars
hl.env("XCURSOR_SIZE","24")
hl.env("XCURSOR_THEME","Simp1e-Dark")
hl.env("HYPRCURSOR_SIZE","24")
hl.env("HYPRCURSOR_THEME","Simp1e-Dark")
hl.env("HYPRSHOT_DIR"," $HOME/Pictures/Screenshots")
hl.env("GTK_THEME"," adw-gtk3-dark")
hl.env("QT_QPA_PLATFORMTHEME","kde")
hl.env("XDG_CURRENT_DESKTOP","Hyprland")
hl.env("XDG_SESSION_TYPE","wayland")
hl.env("XDG_SESSION_DESKTOP","Hyprland")
hl.env("GTK_IM_MODULE","simple")
hl.env("SIGNAL_PASSWORD_STORE","gnome-libsecret")
