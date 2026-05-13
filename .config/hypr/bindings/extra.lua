local mod = require("variables").mod

hl.bind(mod .. " + mouse:272", hl.dsp.window.drag(), {mouse = true})
hl.bind(mod .. " + mouse:273", hl.dsp.window.resize(), {mouse = true})

hl.bind("XF86Poweroff", hl.dsp.exec_cmd("ags request show_power"))
hl.bind(mod .. " + escape", hl.dsp.exec_cmd("loginctl lock-session"))
hl.bind(mod .. " + SHIFT + escape", hl.dsp.exec_cmd("systemctl suspend"))

-- Raise (limited to 150%), lower volume and mute
hl.bind("XF86AudioRaiseVolume", hl.dsp.exec_cmd("wpctl set-volume -l 1.5 @DEFAULT_AUDIO_SINK@ 5%+"), { repeating = true })
hl.bind("XF86AudioLowerVolume", hl.dsp.exec_cmd("wpctl set-volume @DEFAULT_AUDIO_SINK@ 5%-"), { repeating = true })
hl.bind("XF86AudioMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SINK@ toggle"), { repeating = true })
hl.bind("XF86AudioMicMute", hl.dsp.exec_cmd("wpctl set-mute @DEFAULT_AUDIO_SOURCE@ toggle"), { repeating = true })

-- # Raise or lower (limited to a 1000 units) the display brightness, and save it to be used later
hl.bind("XF86MonBrightnessDown", hl.dsp.exec_cmd("brightnessctl --min-value=10 set 10%-"), { repeating = true })
hl.bind("XF86MonBrightnessUp", hl.dsp.exec_cmd("brightnessctl set 10%+"), { repeating = true })

-- # Screenshots
hl.bind("PRINT", hl.dsp.exec_cmd("hyprshot -m active -m output"))
hl.bind("SHIFT + PRINT", hl.dsp.exec_cmd("hyprshot -z -m region"))
hl.bind("ALT + PRINT", hl.dsp.exec_cmd("hyprshot -z -m window"))

hl.bind("CTRL + PRINT", hl.dsp.exec_cmd("hyprshot -m active -m output --clipboard-only"))
hl.bind("CTRL + SHIFT + PRINT", hl.dsp.exec_cmd("hyprshot -z -m region --clipboard-only"))
hl.bind("CTRL + ALT + PRINT", hl.dsp.exec_cmd("hyprshot -z -m window --clipboard-only"))

-- # Keyboard backlight
hl.bind("XF86KbdBrightnessUp", hl.dsp.exec_cmd("asusctl leds next"), { repeating = true })
hl.bind("XF86KbdBrightnessDown", hl.dsp.exec_cmd("asusctl leds prev"), { repeating = true })

-- launch ROG control center
hl.bind("XF86Launch1", hl.dsp.exec_cmd("pidof rog-control-center && killall rog-control-center || rog-control-center"))
