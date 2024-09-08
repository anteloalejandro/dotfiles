#!/bin/bash

sudo systemctl enable ly                   # login
sudo systemctl enable nvidia-persistenced  # Hybrid graphics
sudo systemctl enable pipewire-pulse       # Pulseudio compat.
sudo systemctl enable bluetooth            # bluetooth
sudo systemctl enable tlp                  # power saver
sudo systemctl enable kanata               # keyboard remapper

sudo systemctl disable iwd                 # wifi
sudo systemctl enable NetworkManager       #

# Set iwd as the backend for NetworkManager
echo '[device]\nwifi.backend=iwd' | \
    sudo tee -a /etc/NetworkManager/conf.d/wifi_backend.conf &> /dev/null

# Add user to input group be able to use libinput-gestures
sudo usermod -aG input $USER
