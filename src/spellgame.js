window.onload = function() {
    _makeEnterKeyWorkLikeEnterButton();
    _presentFirstChallengeWord();
}


userPressedEnter = function() {
    var userEntryText = document.getElementById('user-entry-text').value;
    var challengeWord = _challengeWords[_challengeWordsIndex];
    if (userEntryText.toLowerCase() === challengeWord.toLowerCase()) {
        _respondToCorrectEntry();
    } else {
        _respondToIncorrectEntry();
    }
}


_respondToCorrectEntry = function() {
    _clearUserEntry();
    _presentNextChallengeWord();
}


_respondToIncorrectEntry = function() {
    var feedbackElem = document.getElementById('feedback');
    feedbackElem.textContent = 'Sorry, that\'s incorrect.  Try again.';
    _fadeFeedbackText();
}


_respondToUserWin = function() {
    var challengeBoxElem = document.getElementById('challenge-box');
    challengeBoxElem.hidden = true;

    var userEntryBoxElem = document.getElementById('user-entry-box');
    userEntryBoxElem.hidden = true;

    clearInterval(_feedbackTimerHandle);
    var feedbackElem = document.getElementById('feedback');
    feedbackElem.style.opacity = 1.0;
    feedbackElem.textContent = 'YOU WIN!';
}


_makeEnterKeyWorkLikeEnterButton = function() {
    document.getElementById('user-entry-text').addEventListener(
        'keyup',
        function(event) {
            event.preventDefault();
            if (event.keyCode === 13) {
                document.getElementById('user-entry-button').click();
            }
        }
    )
}


_clearUserEntry = function() {
    var userEntryText = document.getElementById('user-entry-text');
    userEntryText.value = '';
}


_presentFirstChallengeWord = function() {
    _shuffleChallengeWords();

    _challengeWordsIndex = 0
    _updateProgressBar();

    _updateChallengeWordAudio();

    var elem = document.getElementById('user-entry-text');
    elem.focus();
}


_presentNextChallengeWord = function() {
    _challengeWordsIndex++;
    _updateProgressBar();

    if (_challengeWordsIndex == _challengeWords.length) {
        _respondToUserWin();
    } else {
        var feedbackElem = document.getElementById('feedback');
        feedbackElem.textContent = 'That\'s correct!';
        _fadeFeedbackText();

        _updateChallengeWordAudio();

        var elem = document.getElementById('user-entry-text');
        elem.focus();
    }
}


_updateProgressBar = function() {
    text = Array.from(
        Array(_challengeWords.length),
        function(_, i) {
            if (i < _challengeWordsIndex) {
                return String.fromCharCode(9745)
            } else {
                return String.fromCharCode(9744);
            }
        }
    ).join(' ');

    var progressElem = document.getElementById('progress');
    progressElem.textContent = text;
}


_updateChallengeWordAudio = function() {
    var audioFileBaseName = _challengeWords[_challengeWordsIndex];
    audioFileBaseName = audioFileBaseName.replace("'", '').toLowerCase();

    var sourceElem = document.getElementById('challenge-word-source');
    sourceElem.src = '../audio/sight-words/' + audioFileBaseName + '.m4a';

    var audioElem = document.getElementById('challenge-word');
    audioElem.load();
    audioElem.play();
}


_challengeWordsIndex = 0


_challengeWords = [
    'some',
    'walk',
    'talk',
    'a',
    'you',
    'come',
    'look',
    'want',
    'girl',
    'his',
    'don\'t',
    'said',
    'to',
    'oh',
    'of',
    'I',
    'has',
    'was',
    'do',
]


_shuffleChallengeWords = function() {
    for (var i = _challengeWords.length - 1; i > 0; i--) {
        var rand = Math.floor(Math.random() * (i + 1));
        [_challengeWords[i], _challengeWords[rand]] =
            [_challengeWords[rand], _challengeWords[i]];
    }
}


_fadeFeedbackText = function() {
    clearInterval(_feedbackTimerHandle);
    var elem = document.getElementById('feedback');
    elem.style.opacity = 1.0;
    _feedbackDelayCounter = 10;
    _feedbackTimerHandle = setInterval(_updateFadeFeedbackText, 100);
}


_feedbackTimerHandle = null;


_feedbackDelayCounter = null;


_updateFadeFeedbackText = function() {
    if (_feedbackDelayCounter > 0) {
        console.log('delay');
        --_feedbackDelayCounter;
        return;
    }

    var elem = document.getElementById('feedback');
    if (elem.style.opacity == 0.0) {
        elem.textContent = '';
        elem.style.opacity = 1.0;
        clearInterval(_feedbackTimerHandle);
    } else {
        elem.style.opacity -= 0.1;
    }
}
