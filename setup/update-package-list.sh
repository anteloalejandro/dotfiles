#!/bin/bash

cd $(dirname $0)

pacman -Qeqn > native-packages.txt
pacman -Qeqm | grep -Ev 'yay|sm64' > external-packages.txt
