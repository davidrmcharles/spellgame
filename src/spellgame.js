window.onload = function() {
    _makeEnterKeyWorkLikeEnterButton();
}


userPressedEnter = function() {
    console.log('The user pressed enter!');
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
