(function(factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory()
  } else {
    factory()
  }
})(function() {
  var ua = window.navigator.userAgent.toLowerCase();
  var html = document.getElementsByTagName("html")[0];
  window.Platform = {
    isHD: window.devicePixelRatio > 1,
    isiPad: ua.match(/ipad/i) !== null,
    isNexus7: ua.match(/Nexus 7/gi) !== null,
    isMobile: ua.match(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile/i) !== null && ua.match(/Mobile/i) !== null,
    isiPhone: ua.match(/iphone/i) !== null,
    isAndroid: ua.match(/android/i) !== null,
    isS3: ua.match(/gt\-i9300/i) !== null,
    isS4: ua.match(/(gt\-i95)|(sph\-l720)/i) !== null,
    isS5: ua.match(/sm\-g900/i) !== null,
    isIE: /(msie|trident|Edge)/i.test(navigator.userAgent),
    isIE11: ua.match(/Trident\/7\.0/i) !== null,
    isChrome: ua.match(/Chrome/gi) !== null,
    isFirefox: ua.match(/firefox/gi) !== null,
    hasTouch: "ontouchstart" in window,
    supportsSvg: !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect
  };
  window.Platform.isAndroidPad = Platform.isAndroid && !Platform.isMobile;
  window.Platform.isTablet = Platform.isiPad || Platform.isAndroidPad;
  window.Platform.isDesktop = !(Platform.isMobile || Platform.isTablet);
  window.Platform.isIOS = Platform.isiPad || Platform.isiPhone;
  window.Platform.isSafari = Platform.isDesktop && !Platform.isIE && !Platform.isChrome && !Platform.isFirefox;
  if (Platform.isHD) html.classList.add("hd");
  if (Platform.isiPad) html.classList.add("ipad");
  if (Platform.isNexus7) html.classList.add("nexus7");
  if (Platform.isMobile) html.classList.add("mobile");
  if (Platform.isiPhone) html.classList.add("iphone");
  if (Platform.isAndroid) html.classList.add("android");
  if (Platform.isS3) html.classList.add("s3");
  if (Platform.isS4) html.classList.add("s4");
  if (Platform.isS5) html.classList.add("s5");
  if (Platform.isIE) html.classList.add("ie");
  if (Platform.isIE11) html.classList.add("ie11");
  if (Platform.isChrome) html.classList.add("chrome");
  if (Platform.isFirefox) html.classList.add("firefox");
  if (Platform.hasTouch) html.classList.add("has-touch");
  if (!Platform.hasTouch) html.classList.add("no-touch");
  if (Platform.supportsSvg) html.classList.add("support-svg");
  if (Platform.isAndroidPad) html.classList.add("android-pad");
  if (Platform.isTablet) html.classList.add("tablet");
  if (Platform.isDesktop) html.classList.add("desktop");
  if (Platform.isIOS) html.classList.add("ios");
  if (Platform.isSafari) html.classList.add("safari");
  return window.Platform;
});

/**
 * Captures mouse position within the context
 * of a DOM element.
 */
var Mouse = {};
Mouse.x = 0;
Mouse.y = 0;

Mouse.START = "mousedown";
Mouse.MOVE = "mousemove";
Mouse.END = "mouseup";

if (Platform.hasTouch) {
	Mouse.START = "touchstart";
	Mouse.MOVE = "touchmove";
	Mouse.END = "touchend";
}
	
Mouse.get = function(event, elem){
	if (!elem){
		elem = event.currentTarget;
	}

	if (event.touches){
		if (event.touches.length){
			Mouse.x = parseInt(event.touches[0].pageX);
			Mouse.y = parseInt(event.touches[0].pageY);
		}
	} else {
		// mouse events
		Mouse.x = parseInt(event.clientX);
		Mouse.y = parseInt(event.clientY);
	}

	var rect = elem.getBoundingClientRect();
	Mouse.x += elem.scrollLeft - elem.clientLeft - rect.left;
	Mouse.y += elem.scrollTop - elem.clientTop - rect.top;
	return Mouse;
}


if (!console){
	// log messages lost but no error
	console = {log:function(){}};
}
