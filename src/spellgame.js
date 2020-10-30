window.onload = function() {
    _makeEnterKeyWorkLikeEnterButton();
    _feedback.init();

    _challenge.presentFirstWord();
}


userPressedEnter = function() {
    var userEntryText = document.getElementById('user-entry-text').value;
    var challengeWord = _challenge._words[_challenge._wordIndex];
    if (userEntryText.toLowerCase() === challengeWord.toLowerCase()) {
        _respondToCorrectEntry();
    } else {
        _respondToIncorrectEntry();
    }
}


_respondToCorrectEntry = function() {
    _clearUserEntry();
    _challenge.presentNextWord();
}


_respondToIncorrectEntry = function() {
    _feedback.setFadingText('Sorry, that\'s incorrect.  Try again.');
}


_respondToUserWin = function() {
    var challengeBoxElem = document.getElementById('challenge-box');
    challengeBoxElem.hidden = true;

    var userEntryBoxElem = document.getElementById('user-entry-box');
    userEntryBoxElem.hidden = true;

    _feedback.setPersistentText('YOU WIN!');
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


_challenge = {

    presentFirstWord: function() {
        this._shuffleWords();
        this._wordIndex = 0;
        this._updateProgressBar();
        this._updateAudio();

        var elem = document.getElementById('user-entry-text');
        elem.focus();
    },


    presentNextWord: function() {
        ++this._wordIndex;
        this._updateProgressBar();

        if (this._wordIndex == this._words.length) {
            _respondToUserWin();
        } else {
            _feedback.setFadingText('That\'s correct!');
            this._updateAudio();

            var elem = document.getElementById('user-entry-text');
            elem.focus();
        }
    },

    _updateProgressBar: function() {
        text = Array.from(
            Array(this._words.length),
            function(_, i) {
                if (i < this._wordIndex) {
                    return String.fromCharCode(9745)
                } else {
                    return String.fromCharCode(9744);
                }
            }.bind(this)
        ).join(' ');

        var elem = document.getElementById('progress');
        elem.textContent = text;
    },

    _updateAudio: function() {
        var audioToken = this._words[this._wordIndex];
        audioToken = audioToken.replace("'", '').toLowerCase();

        var elem = document.getElementById('challenge-word-source');
        elem.src = '../audio/sight-words/' + audioToken + '.m4a';

        var elem = document.getElementById('challenge-word');
        elem.load();
        elem.play();
    },

    _shuffleWords: function() {
        for (var i = this._words.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [this._words[i], this._words[rand]] =
                [this._words[rand], this._words[i]];
        }
    },

    _wordIndex: 0,
    _words: [
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
    ],

}


_feedback = {

    init: function() {
        this._elem = document.getElementById('feedback');
    },

    setFadingText: function(text) {
        this._elem.textContent = text;
        this._startFade();
    },

    setPersistentText: function(text) {
        this._stopFade();
        this._elem.textContent = text;
    },

    _startFade: function() {
        this._stopFade();
        this._delayCounter = 10;
        this._timerHandle = setInterval(
            function() {
                this._updateFade();
            }.bind(this),
            100
        );
    },

    _updateFade: function() {
        if (this._delayCounter > 0) {
            --this._delayCounter;
        } else if (this._elem.style.opacity == 0.0) {
            this._elem.textContent = '';
            this._stopFade();
        } else {
            this._elem.style.opacity -= 0.1;
        }
    },

    _stopFade: function() {
        clearInterval(this._timerHandle);
        this._timerHandle = null;
        this._elem.style.opacity = 1.0;
    },

    _elem: null,
    _timerHandle: null,
    _delayCounter: null,

}
