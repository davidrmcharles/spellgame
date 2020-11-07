#!/usr/bin/env python

import json
import os
import shutil

from jinja2 import Template


def main():
    _clean()
    shutil.copyfile('src/index.html', 'build/index.html')
    shutil.copyfile('src/spellgame.js', 'build/spellgame.js')
    shutil.copytree(
        'src/audio',
        'build/audio',
        ignore=_ignore_emacs_temporary_files
    )
    template = _create_template()
    for wordset_path in _get_wordset_paths():
        _render_html(template, wordset_path)


def _clean():
    if os.path.exists('build'):
        shutil.rmtree('build')
    os.mkdir('build')


def _ignore_emacs_temporary_files(folder_path, file_names):
    return [
        name
        for name in file_names
        if name.endswith('~')
    ]


def _create_template():
    with open('src/spellgame.html', 'r') as template_file:
        template_text = template_file.read()
    return Template(template_text)


def _get_wordset_paths():
    return [
        'src/wordsets/sight-words-01.json',
        'src/wordsets/frmost-01.json',
    ]


def _render_html(template, wordset_path):
    with open(wordset_path, 'r') as wordset_file:
        wordset_doc = json.load(wordset_file)

    wordset_json = json.dumps(wordset_doc, indent=4)
    wordset_title = wordset_doc['title']
    html_path = wordset_doc['htmlPath']

    with open(f'build/{html_path}', 'w') as html_file:
        html_file.write(
            template.render(
                wordset_title=wordset_title,
                wordset_json=wordset_json
            )
        )

if __name__ == '__main__':
    main()
