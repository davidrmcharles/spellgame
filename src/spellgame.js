window.onload = function() {
    _makeEnterKeyWorkLikeEnterButton();
}


userPressedEnter = function() {
    var userEntry = document.getElementById('user-entry-text').value;
    if (userEntry.toLowerCase() === 'yay') {
        _respondToCorrectEntry();
    } else {
        _respondToIncorrectEntry();
    }
}


_respondToCorrectEntry = function() {
    feedbackElem = document.getElementById('feedback');
    feedbackElem.textContent = 'That\'s correct!';
}


_respondToIncorrectEntry = function() {
    feedbackElem = document.getElementById('feedback');
    feedbackElem.textContent = 'Sorry, that\'s incorrect.';
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
