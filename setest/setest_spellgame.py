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

    def assert_feedback_text_equals(self, text):
        elem = self.driver.find_element_by_id('feedback')
        self.assertEqual(text, elem.text)

    def assert_feedback_text_has(self, text):
        elem = self.driver.find_element_by_id('feedback')
        self.assertIn(text, elem.text)

    def assert_inputtext_is_focused(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        self.assertEqual(self.driver.switch_to.active_element, elem)

    def assert_inputtext_is_not_visible(self):
        elem = self.driver.find_element_by_id('user-entry-text')
        self.assertFalse(elem.is_displayed())

    def answer_with_return(self, text):
        elem = self.driver.find_element_by_id('user-entry-text')
        elem.clear()
        elem.send_keys(text)
        elem.send_keys(Keys.RETURN)

    def answer_with_click(self, text):
        elem = self.driver.find_element_by_id('user-entry-text')
        elem.clear()
        elem.send_keys(text)

        elem = self.driver.find_element_by_id('user-entry-button')
        elem.click()


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


class _TestCorrectAnswerBase(_TestBase):

    def _test_with_page(self):
        self.answer_correctly()

        self.assert_progress_text_equals('Progress: 1 / 19')
        self.assert_feedback_text_has('correct')
        self.assert_inputtext_is_focused()

        time.sleep(2)

        self.assert_feedback_text_has('here')


class TestCorrectAnswerReturn(_TestCorrectAnswerBase):
    '''
    Test the response to a correct answer with the RETURN key.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer_correctly(self):
        self.answer_with_return('some')


class TestCorrectAnswerClick(_TestCorrectAnswerBase):
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

    def answer_correctly(self):
        self.answer_with_click('some')


class _TestIncorrectAnswerBase(_TestBase):

    def _test_with_page(self):
        self.answer_incorrectly()

        self.assert_progress_text_equals('Progress: 0 / 19')
        self.assert_feedback_text_has('incorrect')
        self.assert_inputtext_is_focused()

        self.answer_incorrectly()

        self.assert_progress_text_equals('Progress: 0 / 19')
        self.assert_feedback_text_equals('The answer is: some')
        self.assert_inputtext_is_focused()

        self.answer_correctly()

        self.assert_progress_text_equals('Progress: 1 / 19')
        self.assert_feedback_text_has('correct')
        self.assert_inputtext_is_focused()

        time.sleep(2)

        self.assert_feedback_text_has('here')


class TestIncorrectAnswerReturn(_TestIncorrectAnswerBase):
    '''
    Test the response to an incorrect answer with the RETURN key.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer_incorrectly(self):
        self.answer_with_return('sum')

    def answer_correctly(self):
        self.answer_with_return('some')


class TestIncorrectAnswerClick(_TestIncorrectAnswerBase):
    '''
    Test the response to an incorrect answer with a click of the
    'Enter' button.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer_incorrectly(self):
        self.answer_with_click('sum')

    def answer_correctly(self):
        self.answer_with_click('some')


class _TestWinBase(_TestBase):

    def _test_with_page(self):
        self.answer_correctly('some')
        self.answer_correctly('walk')
        self.answer_correctly('talk')
        self.answer_correctly('a')
        self.answer_correctly('you')
        self.answer_correctly('come')
        self.answer_correctly('look')
        self.answer_correctly('want')
        self.answer_correctly('girl')
        self.answer_correctly('his')
        self.answer_correctly('don\'t')
        self.answer_correctly('said')
        self.answer_correctly('to')
        self.answer_correctly('oh')
        self.answer_correctly('of')
        self.answer_correctly('I')
        self.answer_correctly('has')
        self.answer_correctly('was')
        self.answer_correctly('do')

        self.assert_progress_text_equals('Progress: 19 / 19')
        self.assert_feedback_text_equals('YOU WIN!')
        self.assert_inputtext_is_not_visible()


class TestWinReturn(_TestWinBase):

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer_correctly(self, text):
        self.answer_with_return(text)


class TestWinClick(_TestWinBase):

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer_correctly(self, text):
        self.answer_with_click(text)


if __name__ == '__main__':
    unittest.main()
