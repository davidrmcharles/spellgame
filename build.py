#!/usr/bin/env python

import json
import os
import shutil

from jinja2 import Template


def main():
    _clean()
    template = _create_template()
    for wordset_path in _get_wordset_paths():
        _render_html(template, wordset_path)


def _clean():
    if os.path.exists('build'):
        shutil.rmtree('build')
    os.mkdir('build')


def _create_template():
    with open('src/spellgame.html', 'r') as template_file:
        template_text = template_file.read()
    return Template(template_text)


def _get_wordset_paths():
    return [
        'sight-words/wordset.json',
        'frmost/01/wordset.json',
    ]


def _render_html(template, wordset_path):
    with open(f'src/audio/{wordset_path}', 'r') as wordset_file:
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
