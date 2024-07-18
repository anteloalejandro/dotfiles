#!/usr/bin/env bash

dir=$(dirname $0)

if [ -z $1 ]; then
    mode="drun"
else
    mode=${1}
fi 

rofi -show ${mode} -theme ${dir}/style.rasi \
     -calc-command "echo '{result}' | wl-copy"
