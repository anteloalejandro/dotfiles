#!/bin/bash

cd $(dirname $0)

pacman -Qeqn > native-packages.txt
pacman -Qeqm | grep -v '^yay' > external-packages.txt
