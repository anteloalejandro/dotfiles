#!/bin/bash

cd $(dirname "$0")
SETUP_DIR="."

"$SETUP_DIR"/install-packages.sh

"$SETUP_DIR"/enable-services.sh

# git submodule init
# git submodule update

stow .
