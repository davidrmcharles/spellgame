// Public Interface


window.onload = function() {
    _game.init();
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
        _game.playAudio();
        this._focus();
    },

    handleEntry: function() {
        var challengeWord = _game.word().word;
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
        if (!_game.presentNextWord()) {
            _controls.hide();
            _feedback.setPersistentText('YOU WIN!');
            _game.playVictoryAudio();
        } else {
            _controls._focus();
            _feedback.setFadingText('That\'s correct!');
        }
    },

    _handleIncorrectEntry: function() {
        _game.addMistake();
        _controls._focus();
        if (_game.mistakeCount() < 2) {
            _feedback.setFadingText('Sorry, that\'s incorrect.  Try again.');
        } else {
            _feedback.setPersistentText(
                `The answer is: ${_game.word().word}`
            );
            _game.addReviewWordMaybe();
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
        var hint = _game.word().hint
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


_game = {

    init: function() {
        this._dataElem = document.getElementById('challenge-word-data');
        this._data = JSON.parse(this._dataElem.textContent);
        this._audioPath = this._data['audioPath']
        this._allWords = this._data['words']
        this._audioElem = document.getElementById('challenge-word');
        this._sourceElem = document.getElementById('challenge-word-source');
        this._presentFirstWord();
    },

    presentNextWord: function() {
        ++this._wordIndex;
        this._mistakeCount = 0;

        if (this._wordIndex == this._words().length) {
            if (!this._reviewing && this._reviewWords.length > 0) {
                this._reviewing = true;
                this._wordIndex = 0;
            } else {
                this._updateProgressIndicators();
                return false;
            }
        }

        this._updateProgressIndicators();
        this._updateAudio();
        return true;
    },

    word: function() {
        return this._words()[this._wordIndex];
    },

    _words: function() {
        if (!this._reviewing) {
            return this._allWords;
        } else {
            return this._reviewWords;
        }
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

    addReviewWordMaybe: function() {
        if (this._reviewing) {
            return;
        }

        if (this.word() == this._reviewWords[this._reviewWords.length - 1]) {
            return;
        }

        this._reviewWords.push(this.word());
    },

    _presentFirstWord: function() {
        this._wordIndex = 0;
        this._mistakeCount = 0;
        if (!_is_test()) {
            this._shuffleWords();
        }
        this._updateProgressIndicators();
        this._updateAudio();
    },

    _updateProgressIndicators: function() {
        if (!this._reviewing) {
            this._updateMainProgressIndicator(
                this._wordIndex, this._allWords.length);
            if (this._reviewWords.length > 0) {
                this._updateReviewProgressIndicator(
                    0, this._reviewWords.length);
            }
        } else {
            this._updateMainProgressIndicator(
                this._allWords.length, this._allWords.length);
            this._updateReviewProgressIndicator(
                this._wordIndex, this._reviewWords.length);
        }
    },

    _updateMainProgressIndicator: function(index, count) {
        var elem = document.getElementById('progress');
        elem.textContent = `Progress: ${index} / ${count}`;
    },

    _updateReviewProgressIndicator: function(index, count) {
        var elem = document.getElementById('review-progress');
        elem.textContent = `Review: ${index} / ${count}`;
    },

    _updateAudio: function() {
        var audioToken = this.word().word;
        audioToken = audioToken.replace("'", '').toLowerCase();
        this._loadAudio(`audio/${this._audioPath}/${audioToken}.m4a`);
        this.playAudio();
    },

    _loadAudio: function(file) {
        this._sourceElem.src = file;
        this._audioElem.load();
    },

    _shuffleWords: function() {
        for (var i = this._allWords.length - 1; i > 0; i--) {
            var rand = Math.floor(Math.random() * (i + 1));
            [this._allWords[i], this._allWords[rand]] =
                [this._allWords[rand], this._allWords[i]];
        }
    },

    _audioElem: null,
    _sourceElem: null,
    _wordIndex: 0,
    _allWords: null,
    _reviewWords: [],
    _mistakeCount: 0,
    _reviewing: false,

}


_is_test = function() {
    return 'true' == new URL(window.location).searchParams.get('istest')
}
