local vars = require("variables")
local mod = vars.mod

local floating_workspaces = { }

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
hl.bind(mod .. " + SHIFT + CTRL + H", hl.dsp.exec_cmd( "cliphist list | $runner | cut -f1 | cliphist delete"))

-- Control windows
hl.bind(mod .. " + Q", hl.dsp.window.close(hl.get_active_window()))
hl.bind(mod .. " + SHIFT + Q", hl.dsp.exit())
hl.bind(mod .. " + M", hl.dsp.window.fullscreen({ mode = "maximized", action = "toggle" }))
hl.bind(mod .. " + SHIFT + M", hl.dsp.window.fullscreen({ mode = "fullscreen", action = "toggle" }))
hl.bind(mod .. " + G", hl.dsp.window.float({ action = "toggle" }))
hl.bind(mod .. " + G", function ()
  local workspace = hl.get_active_workspace()
  assert(workspace ~= nil)
  local windows = hl.get_workspace_windows(workspace)
  local action
  if floating_workspaces[workspace.id] then
    action = "unset"
    floating_workspaces[workspace.id] = false
  else
    action = "set"
    floating_workspaces[workspace.id] = true
  end
  for _, window in ipairs(windows) do
    hl.dsp.window.float({ action = action, window = window })
  end
end)

-- focus with mod + hjkl
hl.bind(mod .. " + H", hl.dsp.focus({ direction = "left" }))
hl.bind(mod .. " + L", hl.dsp.focus({ direction = "right" }))
hl.bind(mod .. " + K", hl.dsp.focus({ direction = "up" }))
hl.bind(mod .. " + J", hl.dsp.focus({ direction = "down" }))

for i = 1, 10, 1 do
  local workspace = hl.get_workspaces()[i%10]
  -- switch workspaces with mod + (0..9)
  hl.bind(mod .. " + " .. i, hl.dsp.workspace({ workspace = workspace }))
  -- move active window to a workspace with mod + SHIFT + (0..9)
  hl.bind(mod .. " + SHIFT + " .. i, hl.dsp.window.move({ workspace = workspace }))
end

-- switch and move workspaces with mod + ... + J/K
-- NOTE: these should be bindl, what did bindl do?
hl.bind(mod .. " + K", hl.dsp.exec_cmd("hyprnome -p"))
hl.bind(mod .. " + J", hl.dsp.exec_cmd("hyprnome"))
hl.bind(mod .. " + SHIFT + K", hl.dsp.exec_cmd("hyprnome -p -m"))
hl.bind(mod .. " + SHIFT + J", hl.dsp.exec_cmd("hyprnome -m"))
hl.bind(mod .. " + CTRL + SHIFT + J", hl.dsp.window.move({ monitor = hl.get_monitor(math.max(0, hl.get_active_monitor().id - 1)) }))
hl.bind(mod .. " + CTRL + SHIFT + K", hl.dsp.window.move({ monitor = hl.get_monitor(hl.get_active_monitor().id + 1) }))

-- special workspace
hl.bind(mod .. " + W", hl.dsp.workspace.toggle_special("magic"))
hl.bind(mod .. " + SHIFT + W", hl.dsp.window.move({ workspace = hl.get_workspace("magic") }))

-- TODO: Window stacking

-- submaps
require("bindings.edit-mode")
require("bindings.extra")
