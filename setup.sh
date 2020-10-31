#!/bin/sh

rm -rf venv
python -m venv venv
. venv/bin/activate
python -m pip install --upgrade pip
pip install selenium
