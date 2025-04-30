#!/bin/bash

cd $(dirname "$0")
SETUP_DIR="."

"$SETUP_DIR"/install-packages.sh

"$SETUP_DIR"/enable-services.sh

cd "$SETUP_DIR/.."

git submodule init
git submodule update
rm ~/.zshrc

stow .

(
  cd ~/.config/ags
  npm install
  ags types
)

zsh
