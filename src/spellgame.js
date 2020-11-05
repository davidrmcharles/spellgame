// Public Interface


window.onload = function() {
    _challenge.init();
    _feedback.init();
    _controls.init();
}


userPressedHearIt = function() {
    _controls.handleHearIt();
}


userPressedEnter = function() {
    _controls.handleEntry();
}


// Details


_controls = {

    init: function() {
        this._inputTextElem = document.getElementById('user-entry-text');
        this._inputButtonElem = document.getElementById('user-entry-button');
        this._makeEnterKeyWorkLikeEnterButton();
        this._focus();
    },

    handleHearIt: function() {
        _challenge.playAudio();
        this._focus();
    },

    handleEntry: function() {
        var challengeWord = _challenge.word().word;
        if (this._inputTextElem.value.toLowerCase() == challengeWord.toLowerCase()) {
            this._handleCorrectEntry();
        } else {
            this._handleIncorrectEntry();
        }
    },

    hide: function() {
        var elem = document.getElementById('user-entry-box');
        elem.hidden = true;
    },

    _focus: function() {
        this._inputTextElem.focus();
    },

    _handleCorrectEntry: function() {
        this._clear();
        if (!_challenge.presentNextWord()) {
            _controls.hide();
            _feedback.setPersistentText('YOU WIN!');
            _challenge.playVictoryAudio();
        } else {
            _controls._focus();
            _feedback.setFadingText('That\'s correct!');
        }
    },

    _handleIncorrectEntry: function() {
        _challenge.addMistake();
        _controls._focus();
        if (_challenge.mistakeCount() < 2) {
            _feedback.setFadingText('Sorry, that\'s incorrect.  Try again.');
        } else {
            _feedback.setPersistentText(
                `The answer is: ${_challenge.word().word}`
            );
        }
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


_feedback = {

    init: function() {
        this._elem = document.getElementById('feedback');
        this._displayHint();
    },

    setFadingText: function(text) {
        this._elem.textContent = text;
        this._startFade();
    },

    setPersistentText: function(text) {
        this._stopFade();
        this._elem.textContent = text;
    },

    _displayHint: function() {
        var hint = _challenge.word().hint
        if (hint == null) {
            hint = '(Hints appear here)';
        }
        this._elem.textContent = hint;
    },

    _startFade: function() {
        this._stopFade();
        this._delayCounter = 5;
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
            this._displayHint();
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


_challenge = {

    init: function() {
        this._dataElem = document.getElementById('challenge-word-data');
        this._data = JSON.parse(this._dataElem.textContent);
        this._audioPath = this._data['audioPath']
        this._words = this._data['words']
        this._audioElem = document.getElementById('challenge-word');
        this._sourceElem = document.getElementById('challenge-word-source');
        this._presentFirstWord();
    },

    presentNextWord: function() {
        ++this._wordIndex;
        this._mistakeCount = 0;
        this._updateProgressIndicator();

        if (this._wordIndex == this._words.length) {
            return false;
        } else {
            this._updateAudio();
            return true;
        }
    },

    word: function() {
        return this._words[this._wordIndex];
    },

    playAudio: function() {
        this._audioElem.play();
    },

    playVictoryAudio: function() {
        this._loadAudio('audio/yay.mp3');
        this.playAudio();
    },

    addMistake: function() {
        ++this._mistakeCount;
    },

    mistakeCount: function() {
        return this._mistakeCount;
    },

    _presentFirstWord: function() {
        this._wordIndex = 0;
        this._mistakeCount = 0;
        if (!_is_test()) {
            this._shuffleWords();
        }
        this._updateProgressIndicator();
        this._updateAudio();
    },

    _updateProgressIndicator: function() {
        var elem = document.getElementById('progress');
        elem.textContent = `Progress: ${this._wordIndex} / ${this._words.length}`;
    },

    _updateAudio: function() {
        var audioToken = this._words[this._wordIndex].word;
        audioToken = audioToken.replace("'", '').toLowerCase();
        this._loadAudio(`audio/${this._audioPath}/${audioToken}.m4a`);
        this.playAudio();
    },

    _loadAudio: function(file) {
        this._sourceElem.src = file;
        this._audioElem.load();
    },

    _shuffleWords: function() {
        for (var i = this._words.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [this._words[i], this._words[rand]] =
                [this._words[rand], this._words[i]];
        }
    },

    _audioElem: null,
    _sourceElem: null,
    _wordIndex: 0,
    _words: null,
    _mistakeCount: 0,

}


_is_test = function() {
    return 'true' == new URL(window.location).searchParams.get('istest')
}
