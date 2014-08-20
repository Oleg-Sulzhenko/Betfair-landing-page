var transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd', // Saf 6, Android Browser
		'MozTransition': 'transitionend', // only for FF < 15
		'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
	},
	transformEventName = Modernizr.prefixed('transform'),
	transEventName = Modernizr.prefixed('transition'),
	transEndEventName = transEndEventNames[transEventName];

// identify browser
if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
	document.documentElement.classList.add('ios')
};
if (navigator.userAgent.match(/Android/i)) {
	document.documentElement.classList.add('android')
}
if (document.all && document.querySelector && !document.addEventListener) {
	document.documentElement.classList.add('ie8')
}

// fadeIn page (load or DOMContentLoaded);
window.addEventListener && window.addEventListener('load', function () {
	document.body.className += ' loaded';
});



//User bandwidth speed detect
var imageAddr = "../../img/test.jpg" + "?n=" + Math.random(); // 761441 bytes
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

	if(speedMbps > minBandwidth){
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
