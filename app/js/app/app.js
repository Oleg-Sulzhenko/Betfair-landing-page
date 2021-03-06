var transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
    'MozTransition': 'transitionend', // only for FF < 15
    'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
},
transformEventName = Modernizr.prefixed('transform'),
        transEventName = Modernizr.prefixed('transition'),
        transEndEventName = transEndEventNames[transEventName];

// fadeIn page (load or DOMContentLoaded);
window.addEventListener && window.addEventListener('load', function() {
    document.body.className += ' loaded';
});

// identify browser
var isMobileDevice = false;
var isIE = false;
if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
    document.documentElement.classList.add('ios');
    isMobileDevice = true;
}
if (navigator.userAgent.match(/Android/i)) {
    document.documentElement.classList.add('android');
    isMobileDevice = true;
}
if (document.all && document.querySelector && !document.addEventListener) {
    document.documentElement.classList.add('ie8');
    isIE = true;
}

//User bandwidth speed detect
var imageAddr = "img/test.jpg" + "?n=" + Math.random(); // size 761441 bytes
var startTime, endTime;
var downloadSize = 761441;
var download = new Image();
download.onload = function() {
    endTime = (new Date()).getTime();
    showResults();
}
startTime = (new Date()).getTime();
download.src = imageAddr;
function showResults() {
    var duration = (endTime - startTime) / 1000;
    var bitsLoaded = downloadSize * 8;
    var speedBps = (bitsLoaded / duration).toFixed(2);
    var speedKbps = (speedBps / 1024).toFixed(2);
    var speedMbps = (speedKbps / 1024).toFixed(2);
    var minBandwidth = 2;

    console.log("Your connection speed is: \n" + speedMbps + " Mbps\n");

    if (speedMbps > minBandwidth && !(isMobileDevice)) {
        //Start downloading Vimeo iframe video content
        $("#video-iframe").show();
        $("#video-iframe").show(function() {
            $(this).prop("src", function() {
                return $(this).data("src");
            });
        });
        
        //Vimeo player API, mute video on start
        //do not Mute on ie8 (its too buggy)
        if (!(isIE)) {
            $(function() {
                var player = $('#video-iframe');
                var url = window.location.protocol + player.attr('src').split('?')[0];
                // Listen for messages from the player
                if (window.addEventListener) {
                    window.addEventListener('message', onMessageReceived, false);
                }
                else {
                    window.attachEvent('onmessage', onMessageReceived, false);
                }
                // Handle messages received from the player
                function onMessageReceived(e) {
                    onReady();
                }
                // Helper function for sending a message to the player
                function post(action, value) {
                    var data = {
                        method: action
                    };
                    if (value) {
                        data.value = value;
                    }
                    var message = JSON.stringify(data);
                    player[0].contentWindow.postMessage(data, url);
                }
                function onReady() {
                    post('setVolume', '0');
                }
            });
        }

    } else {
        $("#video-backup-img").show();
    }
}
 
if (!(isMobileDevice)) {
    //Scrol Effects
    var fadeUntil = 500;
    var fadeUntilText = 300;
    var fading = $('.bg');
    var fadingText = $('.main-cta');
    $(window).bind('scroll', function() {
        var offset = $(document).scrollTop();
        if (offset <= fadeUntil && !(isMobileDevice)) {
            fading.removeClass("fade-complete");
            var opacity = 0;
            opacity = offset / fadeUntil;
        } else {
            fading.addClass("fade-complete");
        }
        fading.css('opacity', opacity);

        if (offset <= fadeUntilText && !(isMobileDevice)) {
            fadingText.removeClass("fade-complete");
            var top = 160;
            top += (offset / fadeUntilText) * 200;
        } else {
            fadingText.addClass("fade-complete");
        }
        fadingText.css('top', top);
    });
}

