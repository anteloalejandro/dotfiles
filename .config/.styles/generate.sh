#!/bin/bash

cd $(dirname "$0")

mkdir -p 'generated'

rm 'generated/style.hyprland.conf'
rm 'generated/style.scss'

while read line; do
  name=$(echo $line | cut -d':' -f1 | tr -d ' ')
  value=$(echo $line | cut -d':' -f2 | tr -d ' ')

  echo "\$$name = rgba($value)" >> 'generated/style.hyprland.conf'
  echo "\$$name: #$value;" >> 'generated/style.scss'
done < 'colors'

while read line; do
  name=$(echo $line | cut -d':' -f1 | tr -d ' ')
  value=$(echo $line | cut -d':' -f2 | tr -d ' ')

  echo "\$$name = $value" >> 'generated/style.hyprland.conf'
  echo "\$$name: ${value}px;" >> 'generated/style.scss'
done < 'variables'

hyprctl reload
if test -n "$(ags list | grep astal)"; then
  ags quit
  ags run &
fi
