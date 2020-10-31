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

    def assert_progress_text_equals(self, text):
        elem = self.driver.find_element_by_id('progress')
        self.assertEqual(text, elem.text)

    def assert_feedback_text_has(self, text):
        elem = self.driver.find_element_by_id('feedback')
        self.assertIn(text, elem.text)

    def assert_inputtext_is_focused(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        self.assertEqual(self.driver.switch_to.active_element, elem)


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
        self.assert_progress_text_equals('Progress: 0 / 19')
        self.assert_feedback_text_has('few')
        self.assert_inputtext_is_focused()


class TestCorrectAnswerReturn(_TestBase):
    '''
    Test the response to a correct answer with the RETURN key.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def _test_with_page(self):
        self._enter_correct_answer()

        self.assert_progress_text_equals('Progress: 1 / 19')
        self.assert_feedback_text_has('correct')
        self.assert_inputtext_is_focused()

        time.sleep(2)

        self.assert_feedback_text_has('here')

    def _enter_correct_answer(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        elem.send_keys('some')
        elem.send_keys(Keys.RETURN)


class TestCorrectAnswerClick(_TestBase):
    '''
    Test the response to a correct answer with a click of the 'Enter'
    button.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def _test_with_page(self):
        self._enter_correct_answer()

        self.assert_progress_text_equals('Progress: 1 / 19')
        self.assert_feedback_text_has('correct')
        self.assert_inputtext_is_focused()

        time.sleep(2)

        self.assert_feedback_text_has('here')

    def _enter_correct_answer(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        elem.send_keys('some')

        elem = self.driver.find_element_by_id('user-entry-button')
        elem.click()


if __name__ == '__main__':
    unittest.main()
