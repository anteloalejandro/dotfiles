#!/bin/bash

test "$(hyprctl workspaces -j | jq '. | sort_by(.id) | last')" = "$(hyprctl activeworkspace -j | jq .)"
is_last=$?

test "$(hyprctl activeworkspace -j | jq '.windows')" -gt 0
has_windows=$?

echo $is_last
echo $has_windows

[[ $is_last -eq 0 ]] && [[ $has_windows -eq 0 ]]
