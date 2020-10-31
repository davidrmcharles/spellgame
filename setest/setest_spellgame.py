#!/usr/bin/env python

import os
import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.keys import Keys


_setest_folder = os.path.dirname(os.path.abspath(__file__))
_project_folder = os.path.dirname(_setest_folder)


class _TestBase(unittest.TestCase):

    def _test_with_driver(self):
        try:
            self.driver.get(
                f'file:///{_project_folder}/src/spellgame.html?istest=true'
            )
            self._test_with_page()
        finally:
            self.driver.close()


class TestInit(_TestBase):
    '''
    Test the initial state of the page.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def _test_with_page(self):
        self._test_progress_has_text()
        self._test_feedback_has_text()
        self._test_inputtext_is_focused()

    def _test_progress_has_text(self):
        elem = self.driver.find_element_by_id('progress')
        self.assertEqual('Progress: 0 / 19', elem.text)

    def _test_feedback_has_text(self):
        elem = self.driver.find_element_by_id('feedback')
        self.assertIn('few', elem.text)

    def _test_inputtext_is_focused(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        self.assertEqual(self.driver.switch_to.active_element, elem)


class TestCorrectEntryReturn(_TestBase):
    '''
    Test the response to a correct entry with the RETURN key.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def _test_with_page(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        elem.send_keys('some')
        elem.send_keys(Keys.RETURN)
        self._test_progress_has_text()
        self._test_feedback_has_text()
        self._test_inputtext_is_focused()
        time.sleep(2)
        self._test_feedback_has_text_2()

    def _test_progress_has_text(self):
        elem = self.driver.find_element_by_id('progress')
        self.assertEqual('Progress: 1 / 19', elem.text)

    def _test_feedback_has_text(self):
        elem = self.driver.find_element_by_id('feedback')
        self.assertIn('correct', elem.text)

    def _test_inputtext_is_focused(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        self.assertEqual(self.driver.switch_to.active_element, elem)

    def _test_feedback_has_text_2(self):
        elem = self.driver.find_element_by_id('feedback')
        self.assertIn('here', elem.text)


if __name__ == '__main__':
    unittest.main()
