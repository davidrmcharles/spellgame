#!/bin/sh

username=`cat ~/.scholadomi.username`

scp spellgame.tar.gz $username@scholadomi.org:/home/$username/www

ssh $username@scholadomi.org <<EOF
rm -rf www/spellgame
mkdir www/spellgame
cd www/spellgame
tar xf ../spellgame.tar.gz
rm ../spellgame.tar.gz
EOF
