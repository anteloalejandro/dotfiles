#!/bin/bash

battery=$(upower -i $(upower -e | grep "BAT0"))
battery_percent=$(echo "$battery" | grep "percentage:" | cut -d':' -f2 | tr -d " " | tr -d "%")
battery_state=$(echo "$battery" | grep "state:" | cut -d':' -f2 | tr -d " ")
battery_time=$(echo "$battery" | grep "time to" | tr -s " ")

if test $battery_percent -gt 95; then
  icon='󰁹'  
elif test $battery_percent -gt 85; then
  icon='󰂂'
elif test $battery_percent -gt 75; then
  icon='󰂁'
elif test $battery_percent -gt 65; then
  icon='󰂀'
elif test $battery_percent -gt 55; then
  icon='󰁿'
elif test $battery_percent -gt 45; then
  icon='󰁾'
elif test $battery_percent -gt 35; then
  icon='󰁽'
elif test $battery_percent -gt 25; then
  icon='󰁼'
elif test $battery_percent -gt 15; then
  icon='󰁻'
elif test $battery_percent -gt 7; then
  icon='󰁺'
else
  icon='󰂃'
fi

if test $battery_state = "charging"; then
  icon="$icon"
fi

echo "$icon $battery_time"
