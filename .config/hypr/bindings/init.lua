local vars = require("variables")
local mod = vars.mod

-- imports
require("bindings.launch")
require("bindings.extra")

-- submaps
require("bindings.modes.edit")

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
local function index_of_workspace(workspace_id)
  for i, w in ipairs(hl.get_workspaces()) do
    if w.id == workspace_id then
      return i
    end
  end

  return nil
end

local function next_workspace()
  local index = index_of_workspace(hl.get_active_workspace().id)
  if index == nil then return "+1" end

  local workspaces = hl.get_workspaces()
  while index < #workspaces do
    index = index + 1
    if workspaces[index].windows > 0 then
      return workspaces[index]
    end
  end

  return "+1"
end

local function prev_workspace()
  local index = index_of_workspace(hl.get_active_workspace().id)
  if index == nil then return "-1" end

  local workspaces = hl.get_workspaces()
  while index > 1 do
    index = index - 1
    if workspaces[index].windows > 0 then
      return workspaces[index]
    end
  end

  return "-1"
end

hl.bind(mod .. " + CTRL + J", function()
  hl.dispatch(hl.dsp.focus({ workspace = next_workspace() }))
end)
hl.bind(mod .. " + CTRL + K", function()
	hl.dispatch(hl.dsp.focus({ workspace = prev_workspace() }))
end)
hl.bind(mod .. " + SHIFT + J", function ()
  hl.dispatch(hl.dsp.window.move({ workspace = next_workspace() }))
end)
hl.bind(mod .. " + SHIFT + K", function ()
  hl.dispatch(hl.dsp.window.move({ workspace = prev_workspace() }))
end)
hl.bind(mod .. " + ALT + SHIFT + J", function ()
  hl.dispatch(hl.dsp.window.move({ monitor = next_workspace(), follow = true }))
end)
hl.bind(mod .. " + ALT + SHIFT + K", function ()
  hl.dispatch(hl.dsp.window.move({ monitor = prev_workspace(), follow = true }))
end)

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
