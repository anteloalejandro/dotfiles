# DOTFILES

A minimal but (hopefully) fully usable archlinux installation with Hyprland as the window manager.

Tested on a laptop with NVIDIA-Intel hybrid graphics, so graphics drivers issues _shouldn't_ be a thing.

## Features

- Notifications and media controls through `swaync`.
- Widgets and applets through `eww`.
- Lockscreen/sleep through `hypridle` and `hyprlock`.
- Wallpapers through `hyprpaper`.
- `rofi-wayland` as the launcher/runner.
- Clipboard support by `wl-clipboard`, `cliphist` and `rofi-wayland`.
- Brightness and volume controls through `brightnessctl` and various PipeWire related packages.
- Smartphone connectivity through `kdeconnect`.
- Screenshots through `hyprshot`.

## Setup

Just cd into the repo and run `./setup/setup.sh`

### Dependencies

A list of dependencies, general apps and utilities and some personal favorites
can be found on [native-packages.txt](native-packages.txt) and [external-packages.txt](external-packages.txt).

Additionally, [Zinit](https://github.com/zdharma-continuum/zinit),
[TPM](https://github.com/tmux-plugins/tpm) and the AUR package manager `yay` have been installed through git directly, and are required.

### Services

The following services must be explicitly enabled/disabled.
Other background tasks are enabled on Hyprland itself or are enabled by default.

```bash
sudo systemctl enable ly                   # login
sudo systemctl enable nvidia-persistenced  # Hybrid graphics
sudo systemctl enable pipewire-pulse       # Pulseudio compat.
sudo systemctl enable bluetooth            # bluetooth

sudo systemctl disable iwd                 # wifi
sudo systemctl enable NetworkManager       #
```

### Configuring iwd with network manager

_See [the NetworkManager arch wiki page](https://wiki.archlinux.org/title/NetworkManager#Using_iwd_as_the_Wi-Fi_backend)_

## Thanks to...

- [pop-os](https://github.com/pop-os) for inspiring the keybindings.
- [adi1090x/rofi](https://github.com/adi1090x/rofi) for the config files and colors for rofi.
- [catppuccin/tmux](https://github.com/catppuccin/tmux) for the tmux status bar.
- [dreamsofcode-io/dotfiles](https://github.com/dreamsofcode-io/dotfiles) for the ZSH config file.
- [dharmx](https://github.com/dharmx) for his awesome [EWW tutorial](https://dharmx.is-a.dev/eww-powermenu).
- [croyleje/eww-hyprland-workspace](https://github.com/croyleje/eww-hyprland-workspace) for their EWW listeners for Hyprland.
- [Gogh-Co/Gogh](https://github.com/Gogh-Co/Gogh) for their terminal theme installer.
- [morhetz/gruvbox](https://github.com/morhetz/gruvbox) for the Gruvbox theme, which serves as a direct inspiration for the UI.
- AzraelIvy Ivy on Pinterest for (as far as I can tell) creating [the drawing](https://mx.pinterest.com/pin/26317979066767002/) on the desktop wallpaper.
- u/atlas-ark on r/wallpaper for creating the lock screen wallpaper ([here](https://www.reddit.com/r/wallpaper/comments/ll1gov/arch_gruvbox_wallpaper_v2_dark_light_3840x2160/)).
- You, for taking the time to read this list and (maybe?) checking out what these people do. Show them some love!
