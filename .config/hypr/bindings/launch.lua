local vars = require("variables")
local mod = vars.mod

-- Launch apps
hl.bind(mod .. " + T", hl.dsp.exec_cmd(vars.terminal))
hl.bind(mod .. " + F", hl.dsp.exec_cmd(vars.fileManager))
hl.bind(mod .. " + B", hl.dsp.exec_cmd(vars.browser))

-- Show panels and stuff
hl.bind(mod .. " + N", hl.dsp.exec_cmd("ags request show_panel"))
hl.bind(mod .. " + I", hl.dsp.exec_cmd("ags request show_system"))
hl.bind(mod .. " + U", hl.dsp.exec_cmd("ags request show_top"))

-- launch utils
hl.bind(mod .. " + C", hl.dsp.exec_cmd("hyprpicker | wl-copy"))
hl.bind(mod .. " + R", hl.dsp.exec_cmd(vars.launcher .. " run"))
hl.bind(mod .. " + tab", hl.dsp.exec_cmd(vars.launcher .. " window"))
hl.bind(mod .. " + SHIFT + C", hl.dsp.exec_cmd(vars.launcher .. " calc"))
hl.bind(mod .. " + A", hl.dsp.exec_cmd("ags request show_runner"))
hl.bind(mod .. " + SHIFT + H", hl.dsp.exec_cmd("cliphist list | " .. vars.runner .. " cliphist decode | wl-copy"))
hl.bind(mod .. " + SHIFT + CTRL + H", hl.dsp.exec_cmd("cliphist list | " .. vars.runner .. " | cut -f1 | cliphist delete"))
