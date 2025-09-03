# DOTFILES

A minimal but (hopefully) fully usable archlinux installation with Hyprland as the window manager.

Tested on a laptop with NVIDIA-Intel hybrid graphics,
and a Asus Zephyrus with NVIDIA-AMD hybrid graphics,
so graphics drivers issues _shouldn't_ be a thing.

## Features

- Widgets, applets, notifications, and media controls through `ags`.
- Lockscreen/sleep through `hypridle` and `hyprlock`.
- Wallpapers through `hyprpaper`.
- `rofi-wayland` as the launcher/runner.
- Clipboard support by `wl-clipboard`, `cliphist` and `rofi-wayland`.
- Brightness and volume controls through `brightnessctl` and various PipeWire related packages.
- Smartphone connectivity through `kdeconnect`.
- Screenshots through `hyprshot`.
- Integrated/Hybrid GPU mode through `envycontrol`
- Custom gestures through `libinput-gestures`

## Setup

Just cd into the repo and run `./setup/setup.sh`
, and read the rest of this section if you want to learn what the script does or if you want to [set up the homepage](#setting-up-the-homepage).

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
sudo systemctl enable tlp                  # power saver
sudo systemctl enable bluetooth            # bluetooth

sudo systemctl disable iwd                 # wifi
sudo systemctl enable NetworkManager       #
```

### Configuring iwd with network manager

_See [the NetworkManager arch wiki page](https://wiki.archlinux.org/title/NetworkManager#Using_iwd_as_the_Wi-Fi_backend)_

### Keyboard layout

By default, the keyboard layout is set to `es_ES` on [hyprland.conf](.config/hypr/hyprland.conf), you may want to change that.

### Enabling gestures

The user must be part of the `input` group for the gestures to work.

```bash
sudo usermod -aG input $USER
```

### Setting up the homepage

This repo comes with the [.homepage](.homepage) submodule, which is a custom browser homepage. Manual setup is required:

First, install a web server, in this case, `nginx` should be installed if the `setup.sh` script was used. For nginx, set a new location like so:

```nginx
server {
    listen       localhost:80;
    server_name  localhost;

    #...

    location / {
        root   /usr/share/nginx/homepage;
        # root   /usr/share/nginx/html;
        index  index.html index.htm;
    }

    # ...
}
```

Then, link (or mount it) `~/.homepage` to `/usr/share/nginx/homepage`.

```bash
sudo ln -s ~/.homepage /usr/share/nginx/homepage
```

Finally install the [New Tab Override](https://addons.mozilla.org/en-US/firefox/addon/new-tab-override/) extension
and set `http://localhost` as the new tab custom URL and configure Firefox to use localhost as the homepage and New Tab Override for new tabs.

## TO-DO

- [x] Migrate EWW widgets to AGS
- [x] Make lockscreen widgets interactable (e.g.: Add a suspend button)

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
