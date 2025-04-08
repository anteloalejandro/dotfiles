#!/bin/bash

current=$(hyprctl getoption master:slave_count_for_center_master -j | jq -r '.int')

if test $current -eq 0; then
  hyprctl keyword master:slave_count_for_center_master 2
else
  hyprctl keyword master:slave_count_for_center_master 0
fi
