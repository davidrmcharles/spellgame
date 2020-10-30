// Public Interface


window.onload = function() {
    _userEntry.init();
    _feedback.init();
    _challenge.presentFirstWord();
}


userPressedHearIt = function() {
    _userEntry.handleHearIt();
}


userPressedEnter = function() {
    _userEntry.handleEntry();
}


// Details


_userEntry = {

    init: function() {
        this._inputTextElem = document.getElementById('user-entry-text');
        this._inputButtonElem = document.getElementById('user-entry-button');
        this._makeEnterKeyWorkLikeEnterButton();
    },

    handleHearIt: function() {
        var elem = document.getElementById('challenge-word');
        elem.play();
    },

    handleEntry: function() {
        var challengeWord = _challenge._words[_challenge._wordIndex];
        if (this._inputTextElem.value.toLowerCase() == challengeWord.toLowerCase()) {
            this._handleCorrectEntry();
        } else {
            this._handleIncorrectEntry();
        }
    },

    focus: function() {
        this._inputTextElem.focus();
    },

    hide: function() {
        var elem = document.getElementById('user-entry-box');
        elem.hidden = true;
    },

    _handleCorrectEntry: function() {
        this._clear();
        _challenge.presentNextWord();
    },

    _handleIncorrectEntry: function() {
        _feedback.setFadingText('Sorry, that\'s incorrect.  Try again.');
    },

    _clear: function() {
        this._inputTextElem.value = '';
    },

    _makeEnterKeyWorkLikeEnterButton: function() {
        this._inputTextElem.addEventListener(
            'keyup',
            function(event) {
                event.preventDefault();
                if (event.keyCode === 13) {
                    this._inputButtonElem.click();
                }
            }.bind(this)
        )
    },

    _inputTextElem: null,
    _inputButtonElem: null,
}


_challenge = {

    presentFirstWord: function() {
        this._shuffleWords();
        this._wordIndex = 0;
        this._updateProgressIndicator();
        this._updateAudio();
        _userEntry.focus();
    },

    presentNextWord: function() {
        ++this._wordIndex;
        this._updateProgressIndicator();

        if (this._wordIndex == this._words.length) {
            this._presentVictory();
        } else {
            _feedback.setFadingText('That\'s correct!');
            this._updateAudio();

            _userEntry.focus();
        }
    },

    _presentVictory: function() {
        this._hide();
        _userEntry.hide();
        _feedback.setPersistentText('YOU WIN!');
    },

    _hide: function() {
        var elem = document.getElementById('challenge-box');
        elem.hidden = true;
    },

    _updateProgressIndicator: function() {
        var elem = document.getElementById('progress');
        elem.textContent = `Progress: ${this._wordIndex + 1} / ${this._words.length}`;
    },

    _updateAudio: function() {
        var audioToken = this._words[this._wordIndex];
        audioToken = audioToken.replace("'", '').toLowerCase();

        var elem = document.getElementById('challenge-word-source');
        elem.src = 'audio/sight-words/' + audioToken + '.m4a';

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
            this._elem.textContent = '(Hints appear here.)';
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
