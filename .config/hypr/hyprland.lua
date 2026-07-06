local style = require("style")

-- monitor setup
hl.monitor({
  output = "",
  mode = "preferred",
  position = "auto",
  scale = "1"
})

-- bindings
require("bindings")

-- autostart
hl.on("hyprland.start", function ()
  -- hl.exec_cmd("hyprpm reload")
  hl.exec_cmd("ags run &")
  hl.exec_cmd("hyprpaper")
  hl.exec_cmd("hypridle")
  hl.exec_cmd("blueman-applet")
  hl.exec_cmd("nm-applet")
  hl.exec_cmd("brighnessctl -- restore")
  hl.exec_cmd("wl-paste --watch cliphist store")
  hl.exec_cmd("cliphist wipe")
  hl.exec_cmd("kdeconnectd")
  hl.exec_cmd("udiskie")

  hl.exec_cmd("systemctl --user start hyprpolkitagent")

  -- hl.exec_cmd("hydroxide serve")

  -- fix screensharing
  hl.exec_cmd("dbus-update-activation-environment --systemd WAYLAND_DISPLAY XDG_CURRENT_DESKTOP")
  hl.exec_cmd("systemctl --user start xdg-desktop-portal-hyprland")

  -- fix wine traybar showing as a standalone window
  hl.exec_cmd("xembedsniproxy")

  hl.exec_cmd("asusctl profile -P Quiet")

end)

hl.on("hyprland.shutdown", function ()
  hl.exec_cmd("tmux kill-server")
end)

-- env vars
-- hl.env("XCURSOR_SIZE","24")
-- hl.env("XCURSOR_THEME","Simp1e-Dark")
-- hl.env("HYPRCURSOR_SIZE","24")
-- hl.env("HYPRCURSOR_THEME","Simp1e-Dark")
-- hl.env("GTK_THEME","adw-gtk3-dark")
hl.env("QT_QPA_PLATFORMTHEME","kde")
hl.env("HYPRSHOT_DIR","$HOME/Pictures/Screenshots")
hl.env("XDG_CURRENT_DESKTOP","Hyprland")
hl.env("XDG_SESSION_TYPE","wayland")
hl.env("XDG_SESSION_DESKTOP","Hyprland")
hl.env("GTK_IM_MODULE","simple")
-- hl.env("SIGNAL_PASSWORD_STORE","gnome-libsecret")

hl.config({
  debug = {
    disable_logs = false
  }
})

hl.config({
  general = {
    gaps_in = style.half_spacing,
    gaps_out = style.spacing,
    border_size = 2,
    resize_on_border = true,
    allow_tearing = false,
    layout = "dwindle",
    col = {
      active_border = style.accent,
      inactive_border = "#595959aa"
    }
  }
})

hl.config({
  misc = {
    force_default_wallpaper = 1, -- Set to 0 or 1 to disable the anime mascot wallpapers
    disable_hyprland_logo = true, -- If true disables the random hyprland logo / anime girl background. :(
    disable_autoreload = false, -- Disable config reload on save
    focus_on_activate = true, -- Focus on apps that request it
    on_focus_under_fullscreen = 2, -- # Exits fullscreen when opening a window
    font_family = "Ubuntu",
  }
})

hl.config({
  input = {
    kb_layout = "es",
    kb_variant = "deadtilde",
    follow_mouse = 2, -- Change keyboard focus when clicking
    sensitivity = 0.0, -- -1.0 - 1.0, 0 means no modification.
    touchpad = {
      natural_scroll = false
    }
  }
})

hl.config({
  gestures = {
    workspace_swipe_distance = 100,
    workspace_swipe_invert = false,
  }
})
hl.gesture({
  fingers = 4,
  direction = "vertical",
  action = "workspace"
})
hl.gesture({
  fingers = 3,
  direction = "swipe",
  action = "move"
})
hl.gesture({
  fingers = 3,
  direction = "pinch",
  action = "resize"
})

hl.config({
  group = {
    drag_into_group = 2, -- only when dragging into de groupbar 
    col = {
      border_active = style.secondary,
      border_inactive = "#595959aa"
    },
    groupbar = {
      font_family = "Ubuntu Mono",
      font_size = 12,
      scrolling = false,
      height = 20,
      indicator_height = 0,
      gradients = true,
      gradient_rounding = style.spacing,
      gradient_round_only_edges = true,
      gaps_out = style.spacing,
      gaps_in = style.spacing,
      keep_upper_gap = false,
      col = {
        active = style.bg,
        inactive = style.bg_alt,
      }
    }
  }
})

hl.config({
  decoration = {
    rounding = style.radius,
    shadow = { color = "#1a1a1aee" },
    dim_inactive = hl.get_current_submap() == "edit",
    blur = {
      enabled = true,
      size = 4,
      passes = 1
    }
  }
})

hl.config({
  dwindle = {
    -- pseudotile = true,
    preserve_split = true,
    force_split = 2,
  }
})

hl.window_rule({
  persistent_size = true,
  no_blur = true,
})

-- fullscreen mode decorations
hl.window_rule({
  match = { fullscreen = true },
  dim_around = true,
  idle_inhibit = "fullscreen"
})

-- float specific windows
local floating_windows = {
  { title = "Bulk Rename - Rename Multiple Files" },
  { class = "nwg-displays" },
  { class = "blueman-manager" },
  { class = "nm-connection-editor" },
  { class = "org.pulseaudio.pavucontrol" },
  { class = "rustdesk" },
  { class = "org.kde.kdeconnect.app" },
  { class = "org.kde.kdeconnect-settings" },
}
for _, match in ipairs(floating_windows) do
  hl.window_rule({
    match = match,
    float = true
  })
end
hl.window_rule({
  match = { class = "org.kde.kdeconnect-settings" },
  float = true,
  size = { 950, 600 },
})

-- ROG control
hl.window_rule({
  match = { title = "ROG Control" },
  size = { 900, 500 },
  dim_around = true,
  float = true,
})

hl.window_rule({
  match = {
    class = "steam" ,
    title = "Steam Big Picture Mode"
  },
  fullscreen = true,
})

hl.workspace_rule({
  workspace = "name:.*",
  persistent = false
})

-- smart gaps
hl.workspace_rule({ workspace = "w[tv1]", gaps_out = 0, gaps_in = 0 })
hl.workspace_rule({ workspace = "f[1]", gaps_out = 0, gaps_in = 0 })
hl.window_rule({ match = { float = false, workspace = "w[tv1]" }, border_size = 0 })
hl.window_rule({ match = { float = false, workspace = "w[tv1]" }, rounding = 0 })
hl.window_rule({ match = { float = false, workspace = "f[1]" }, border_size = 0 })
hl.window_rule({ match = { float = false, workspace = "f[1]" }, rounding = 0 })

hl.animation({
  leaf = "fadeLayersIn",
  enabled = false
})
hl.animation({
  leaf = "workspaces",
  enabled = true,
  speed = 6.0,
  bezier = "default",
  style = "slidevert"
})

local ags_widgets = {
  "osd", "notification-popup", "panel", "runner", "system", "alerts"
}
for _, widget in ipairs(ags_widgets) do
  local animation = (widget == "system" or widget == "alerts") and "slide top" or "slide"
  hl.layer_rule({
    match = { namespace = widget },
    animation = animation
  })
end
for _, layer in ipairs(ags_widgets) do
  hl.layer_rule({
    match = { namespace = layer },
    order = 1
  })
end
hl.layer_rule({
  match = { namespace = "border-.*" },
  order = 0
})

hl.layer_rule({
  match = { namespace = "power-menu" },
  blur = true,
  ignore_alpha = 0.5
})

hl.layer_rule({
  match = { namespace = "alerts" },
  blur = true,
  ignore_alpha = 0.2
})

-- TODO: enable widgets on overlay layer
local lockscreen_widgets = {}
for _, widget in ipairs(lockscreen_widgets) do
  hl.layer_rule({
    match = { namespace = widget }
  })
end
