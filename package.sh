#!/bin/sh
rm -f spellgame.tar.gz
tar --create --gzip --file=spellgame.tar.gz --directory=build .
