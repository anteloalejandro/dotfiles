#!/bin/bash

cd $(dirname $0)

pacman -Qeqn | grep -Ev 'steam|lutris|mangohud|plasma-desktop' > native-packages.txt
pacman -Qeqm | grep -Ev 'yay|sm64|autofirma' > external-packages.txt
