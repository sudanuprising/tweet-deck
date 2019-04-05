$(document).ready(function () {
    var socket = io.connect('https://stormy-castle-92694.herokuapp.com/');
    window.paused = false;
    window.tweets = 0;

    socket.on("stream", function (tweet) {
        if (window.paused === false && $('[tweet-id="' + tweet.id + '"]').length === 0) {
            window.tweets += 1;
            $(".content").prepend('<li class="tweet" tweet-id="' + tweet.id + '"><img src="' + tweet.icon + '" alt=""><div class="name">' + tweet.name + ' (@' + tweet.username + ')</div><div class="message">' + tweet.text + '</div></li>');
            $('.list ').text(tweet.users + ' User Currently, ' + window.tweets + ' Tweet ');
            $('.tweet').mouseenter(function () {
                window.paused = true;
                $('.change-hash-tag').text('Resume')

            });
            $('.tweet').mouseleave(function () {
                window.paused = false;
                $('.change-hash-tag').text('Pause')
            });
            $('[tweet-id="' + tweet.id + '"]').css('background', tweet.color);
        }
    });


    socket.on("followers", function (followers) {
        $(".number").text(followers.number);
    });

    $(".change-hash-tag").click(function () {
        window.paused = (!window.paused);
    });


    $(document).keyup(function (e) {
        if (e.keyCode == 27) {
            $(".popup").fadeOut();
        }
    });

    $(".about").hover(function () {
        $(".about div").stop().fadeToggle();
    });


    socket.emit("hash", {hash: ''});
});