var transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
		'MozTransition': 'transitionend', // only for FF < 15
		'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
	},
	transformEventName = Modernizr.prefixed('transform'),
	transEventName = Modernizr.prefixed('transition'),
	transEndEventName = transEndEventNames[transEventName];

// identify browser
var isMobileDevice = false;
document.isMobileDevice = isMobileDevice;

if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
	document.documentElement.classList.add('ios');
        document.isMobileDevice = true;
};
if (navigator.userAgent.match(/Android/i)) {
	document.documentElement.classList.add('android');
        document.isMobileDevice = true;
}
if (document.all && document.querySelector && !document.addEventListener) {
	document.documentElement.classList.add('ie8');
}
// fadeIn page (load or DOMContentLoaded);
window.addEventListener && window.addEventListener('load', function () {
	document.body.className += ' loaded';
});




//User bandwidth speed detect
var imageAddr = "../../img/test.jpg" + "?n=" + Math.random(); // size 761441 bytes
var startTime, endTime;
var downloadSize = 761441;
var download = new Image();
download.onload = function () {
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
        console.log(isMobileDevice);
	if(speedMbps > minBandwidth && !(isMobileDevice)){
            $("#video-iframe").show();
            $("#video-iframe").show(function(){
                    $(this).prop("src", function(){
                            return $(this).data("src");
                    });
            });
	} else {
            $("#video-backup-img").show();
	}
}

//Scrol Effects
var fadeUntil = 500;
var fadeUntilText = 450;
var fading = $('.content-holder');
var fadingText = $('.main-cta');
$(window).bind('scroll', function(){
    var offset = $(document).scrollTop();
    if( offset<=fadeUntil && !(isMobileDevice) ){
        fading.removeClass("fade-complete");
        var opacity = 0;
        opacity = offset/fadeUntil;
    } else {
        fading.addClass("fade-complete");
    }
    fading.css('opacity',opacity);
    
    
    if( offset<=fadeUntilText && !(isMobileDevice) ){
        fadingText.removeClass("fade-complete");
        var top = 160;
        top += (offset/fadeUntilText)*400;
    } else {
        fadingText.addClass("fade-complete");
    }
    fadingText.css('top',top);
});