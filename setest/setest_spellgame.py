#!/usr/bin/env python

import os
import unittest

from selenium import webdriver


_setest_folder = os.path.dirname(os.path.abspath(__file__))
_project_folder = os.path.dirname(_setest_folder)


class TestInit(unittest.TestCase):
    '''
    Test the initial state of the page.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test()

    def _test(self):
        try:
            self.driver.get(f'file:///{_project_folder}/src/spellgame.html?istest=true')
            self._test_progressindicator_has_text()
            self._test_feedback_has_text()
            self._test_inputtext_is_focused()
        finally:
            self.driver.close()

    def _test_progressindicator_has_text(self):
        elem = self.driver.find_element_by_id('progress')
        self.assertEqual('Progress: 0 / 19', elem.text)

    def _test_feedback_has_text(self):
        elem = self.driver.find_element_by_id('feedback')
        self.assertIn('few', elem.text)

    def _test_inputtext_is_focused(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        self.assertEqual(self.driver.switch_to.active_element, elem)


if __name__ == '__main__':
    unittest.main()
