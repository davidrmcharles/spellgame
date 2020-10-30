#!/bin/sh

username=`cat ~/.fideidepositum-username`

scp spellgame.tar.gz $username@fideidepositum.org:/home/$username/www

ssh $username@fideidepositum.org <<EOF
rm -rf www/spellgame
mkdir www/spellgame
cd www/spellgame
tar xf ../spellgame.tar.gz
rm ../spellgame.tar.gz
EOF
