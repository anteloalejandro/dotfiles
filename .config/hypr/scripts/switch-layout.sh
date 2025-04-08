#!/bin/bash

current=$(hyprctl getoption general:layout -j | jq -r '.str')

echo $current
if test "$current" = "dwindle"; then
  echo "switch to master"
  hyprctl keyword general:layout master
else
  echo "switch to dwindle"
  hyprctl keyword general:layout dwindle
fi
