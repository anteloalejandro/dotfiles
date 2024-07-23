#!/bin/bash

cd $(dirname $0)

pacman -Qeqn | grep -Ev 'steam' > native-packages.txt
pacman -Qeqm | grep -Ev 'yay|sm64|autofirma' > external-packages.txt
