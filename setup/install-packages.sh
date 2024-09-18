#!/bin/bash

cd $(dirname "$0")

echo "installing native packages..."
sudo pacman -Sy $(cat 'native-packages.txt')
echo "DONE!\n"

echo "installing ZINIT..."
bash -c "$(curl --fail --show-error --silent --location https://raw.githubusercontent.com/zdharma-continuum/zinit/HEAD/scripts/install.sh)"
zinit self-update
chsh --shell /bin/zsh
echo "DONE!\n"

echo "installing TPM..."
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
echo "DONE\n"

echo "installing yay..."
(
cd /tmp
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
)
echo "DONE\n"

echo "installing AUR packages..."
yay -Sy $(cat 'external-packages.txt')
echo "DONE!\n"

echo "installing graphite theme..."
(
cd /tmp
git clone https://github.com/vinceliuice/Graphite-gtk-theme graphite
cd graphite
./install.sh --size compact --tweaks rimless normal -c dark -l
)
echo "DONE!\n"
