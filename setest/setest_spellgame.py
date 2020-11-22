#!/usr/bin/env python

import os
import time
import unittest

from selenium import webdriver
from selenium.webdriver.common.keys import Keys


_setest_folder = os.path.dirname(os.path.abspath(__file__))
_project_folder = os.path.dirname(_setest_folder)


class _TestBase(unittest.TestCase):

    @property
    def url(self):
        spellgame_url = os.environ.get('SPELLGAME_URL')
        if spellgame_url is not None:
            return spellgame_url
        return  f'file:///{_project_folder}/build/sight-words-01.html'

    def _test_with_driver(self):
        try:
            self.driver.get(f'{self.url}?istest=true')
            self._test_with_page()
        finally:
            self.driver.close()

    def assert_progress_text_equals(self, text):
        elem = self.driver.find_element_by_id('progress')
        self.assertEqual(text, elem.text)

    def assert_review_progress_text_equals(self, text):
        elem = self.driver.find_element_by_id('review-progress')
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

    def answer_all(self):
        self.answer('some')
        self.answer('walk')
        self.answer('talk')
        self.answer('a')
        self.answer('you')
        self.answer('come')
        self.answer('look')
        self.answer('want')
        self.answer('girl')
        self.answer('his')
        self.answer('don\'t')
        self.answer('said')
        self.answer('to')
        self.answer('oh')
        self.answer('of')
        self.answer('I')
        self.answer('has')
        self.answer('was')
        self.answer('do')


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
        self.assert_review_progress_text_equals('')
        self.assert_feedback_text_has('few')
        self.assert_inputtext_is_focused()


class _TestCorrectAnswerBase(_TestBase):

    def _test_with_page(self):
        self.answer_correctly()

        self.assert_progress_text_equals('Progress: 1 / 19')
        self.assert_review_progress_text_equals('')
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
        self.assert_review_progress_text_equals('')
        self.assert_feedback_text_has('incorrect')
        self.assert_inputtext_is_focused()

        self.answer_incorrectly()

        self.assert_progress_text_equals('Progress: 0 / 19')
        self.assert_review_progress_text_equals('')
        self.assert_feedback_text_equals('The answer is: some')
        self.assert_inputtext_is_focused()

        self.answer_correctly()

        self.assert_progress_text_equals('Progress: 1 / 19')
        self.assert_review_progress_text_equals('Review: 0 / 1')
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


class _TestWinNoReviewsBase(_TestBase):

    def _test_with_page(self):
        self.answer_all()

        self.assert_progress_text_equals('Progress: 19 / 19')
        self.assert_review_progress_text_equals('')
        self.assert_feedback_text_equals('YOU WIN!')
        self.assert_inputtext_is_not_visible()


class TestWinNoReviewsReturn(_TestWinNoReviewsBase):
    '''
    Test the response to winning the game with the RETURN key.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer(self, text):
        self.answer_with_return(text)


class TestWinNoReviewsClick(_TestWinNoReviewsBase):
    '''
    Test the response to winning the game with a click of the Enter
    button.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer(self, text):
        self.answer_with_click(text)


class _TestWinOneReviewBase(_TestBase):

    def _test_with_page(self):
        self.answer('taco')
        self.answer('donut')

        # The review progress indicator shouldn't be visible yet.
        self.assert_review_progress_text_equals('')

        self.answer('some')

        # Now the review progress indicator should have appeared.
        self.assert_review_progress_text_equals('Review: 0 / 1')

        self.answer_all()

        self.answer('some')

        self.assert_progress_text_equals('Progress: 19 / 19')
        self.assert_review_progress_text_equals('Review: 1 / 1')
        self.assert_feedback_text_equals('YOU WIN!')
        self.assert_inputtext_is_not_visible()


class TestWinOneReviewReturn(_TestWinOneReviewBase):
    '''
    Test the response to winning the game with the RETURN key while
    generating one review item.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer(self, text):
        self.answer_with_return(text)


class TestWinOneReviewClick(_TestWinOneReviewBase):
    '''
    Test the response to winning the game with a click of the Enter
    button while generating one review item.
    '''

    def test_chrome(self):
        self.driver = webdriver.Chrome()
        self._test_with_driver()

    def test_firefox(self):
        self.driver = webdriver.Firefox()
        self._test_with_driver()

    def answer(self, text):
        self.answer_with_click(text)


if __name__ == '__main__':
    unittest.main()
