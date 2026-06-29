local mod = require("variables").mod

local function edit()
  hl.config({ decoration = { dim_inactive = true } })
  hl.dispatch(hl.dsp.submap("edit"))
end

local function reset()
  hl.config({ decoration = { dim_inactive = false } })
  hl.dispatch(hl.dsp.submap("reset"))
end

hl.bind(mod .. "+ RETURN", edit)

hl.define_submap("edit", function ()
  -- NOTE: catchall does not catch keys with modifiers (like SUPER + key)
  hl.bind("catchall", function () end)
  hl.bind("escape", reset)
  hl.bind("RETURN", reset)

  hl.bind("H", hl.dsp.window.swap({ direction = "left" }))
  hl.bind("J", hl.dsp.window.swap({ direction = "down" }))
  hl.bind("K", hl.dsp.window.swap({ direction = "up" }))
  hl.bind("L", hl.dsp.window.swap({ direction = "right" }))

  hl.bind("CTRL + H", hl.dsp.window.move({ direction = "left" }))
  hl.bind("CTRL + J", hl.dsp.window.move({ direction = "down" }))
  hl.bind("CTRL + K", hl.dsp.window.move({ direction = "up" }))
  hl.bind("CTRL + L", hl.dsp.window.move({ direction = "right" }))

  hl.bind(mod .. " + H", hl.dsp.focus({ direction = "left" }))
  hl.bind(mod .. " + J", hl.dsp.focus({ direction = "down" }))
  hl.bind(mod .. " + K", hl.dsp.focus({ direction = "up" }))
  hl.bind(mod .. " + L", hl.dsp.focus({ direction = "right" }))

  hl.bind("SHIFT + H", hl.dsp.window.resize({x = -30, y = 0, relative = true}), { repeating = true })
  hl.bind("SHIFT + J", hl.dsp.window.resize({x = 0, y = 30, relative = true}), { repeating = true })
  hl.bind("SHIFT + K", hl.dsp.window.resize({x = 0, y = -30, relative = true}), { repeating = true })
  hl.bind("SHIFT + L", hl.dsp.window.resize({x = 30, y = 0, relative = true}), { repeating = true })

  hl.bind("mouse:272", hl.dsp.window.drag(), { mouse = true })
  hl.bind("mouse:273", hl.dsp.window.resize(), { mouse = true })

  -- window stacking
  hl.bind("S", hl.dsp.window.move({ out_of_group = true }))
  hl.bind("left", hl.dsp.group.move_window({ forward = false }))
  hl.bind("right", hl.dsp.group.move_window({ forward = true }))
  hl.bind(mod .. " + left", hl.dsp.window.move({ direction = "left", group_aware = true }))
  hl.bind(mod .. " + right", hl.dsp.window.move({ direction = "right", group_aware = true }))
end)
