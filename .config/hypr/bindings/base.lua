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

-- Control windows
hl.bind(mod .. " + Q", hl.dsp.window.close(hl.get_active_window()))
hl.bind(mod .. " + SHIFT + Q", hl.dsp.exit())
hl.bind(mod .. " + M", hl.dsp.window.fullscreen({ mode = "maximized", action = "toggle" }))
hl.bind(mod .. " + SHIFT + M", hl.dsp.window.fullscreen({ mode = "fullscreen", action = "toggle" }))
hl.bind(mod .. " + G", hl.dsp.window.float({ action = "toggle" }))
local floating_workspaces = { }
hl.bind(mod .. " + SHIFT +  G", function ()
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
    hl.dispatch(hl.dsp.window.float({ action = action, window = window }))
  end
end)

-- focus with mod + hjkl
hl.bind(mod .. " + H", hl.dsp.focus({ direction = "left" }))
hl.bind(mod .. " + L", hl.dsp.focus({ direction = "right" }))
hl.bind(mod .. " + K", hl.dsp.focus({ direction = "up" }))
hl.bind(mod .. " + J", hl.dsp.focus({ direction = "down" }))

for i = 1, 10, 1 do
  -- switch workspaces with mod + (0..9)
  hl.bind(mod .. " + " .. i % 10, hl.dsp.focus({ workspace = i }))
  -- move active window to a workspace with mod + SHIFT + (0..9)
  hl.bind(mod .. " + SHIFT + " .. i % 10, hl.dsp.window.move({ workspace = i }))
end

-- switch and move workspaces with mod + ... + J/K
-- TODO: Move to the next workspace WITH WINDOWS
local function workspace_with_windows(offset)
  local workspaces = hl.get_workspaces()
  if offset == 0 then
    return hl.get_active_workspace()
  end

  local index = hl.get_active_workspace().id
  for i, ws in ipairs(workspaces) do
    if ws.id == hl.get_active_workspace().id then index = i end
  end

  local start
  local finish
  local step
  if offset < 0 then
    start = index - 1
    finish = 1
    step = -1
  else
    start = index + 1
    finish = #workspaces
    step = 1
  end
  for i = start, finish, step do
    local ws = workspaces[i]
    if ws.special then goto continue end
    if ws.windows > 0 then return ws end
    ::continue::
  end

  return hl.get_active_workspace()
end
hl.bind(mod .. " + CTRL + J", hl.dsp.focus({ workspace = "+1" }))
hl.bind(mod .. " + CTRL + K", hl.dsp.focus({ workspace = "-1" }))
hl.bind(mod .. " + SHIFT + J", hl.dsp.window.move({ workspace = "+1" }))
hl.bind(mod .. " + SHIFT + K", hl.dsp.window.move({ workspace = "-1" }))
hl.bind(mod .. " + ALT + SHIFT + J", hl.dsp.window.move({ monitor = "+1", follow = true }))
hl.bind(mod .. " + ALT + SHIFT + K", hl.dsp.window.move({ monitor = "-1", follow = true }))

-- special workspace
hl.bind(mod .. " + W", hl.dsp.workspace.toggle_special("magic"))
hl.bind(mod .. " + SHIFT + W", function ()
  local special_ws = hl.get_active_special_workspace()
  local special_is_active = special_ws ~= nil and special_ws.active and special_ws.name == "special:magic"
  local target_ws = (special_is_active) and hl.get_active_workspace() or "special:magic"
  hl.dispatch(hl.dsp.window.move({ workspace = target_ws, follow = true }))
end)

-- Window stacking
hl.bind(mod .. " + S", hl.dsp.group.toggle())
hl.bind(mod .. "+ left", hl.dsp.group.prev())
hl.bind(mod .. "+ right", hl.dsp.group.next())

-- submaps
require("bindings.edit-mode")
require("bindings.extra")
