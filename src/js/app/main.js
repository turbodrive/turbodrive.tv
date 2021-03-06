/**
 * Author : Silvère Maréchal
 * Project : Mobile version of Turbodrive
 * Website : http://www.turbodrive.tv
 * ---- Started : March 14th 2014 ------
 * AMD version
 */


// jquery, jqueryUI (debug only), bootstrap (à supprimer par la suite, comme je ne l'utilise pas finalement), tweenmax, modernizr, core.js
// puis : requestAnimationFrame (à garder ou remplacer ?), sprite3D
// edgepreload, 
var CONFIG = {isRetina:false, isiOs:false, isMobile:false, volumeReel:100, loadEdgeAnimations:true, defaultSelectedCases:1, debug:true, isFirefox:false,
hyperDriveTransition:false, volumeReel:0};

var LAYOUT = {initW:1280, initH:720, minW:1024, minH:610, viewportW:1280,viewportH:720, vW2:640, vH2:360, currentEnv:"", ratioW:1, ratioH:1};


CONFIG.hyperDriveTransition = !CONFIG.debug;


LAYOUT.getRatioW = function(w){
    return (Math.max(w, LAYOUT.minW) - LAYOUT.minW) / (LAYOUT.initW - LAYOUT.minW);
}
		
LAYOUT.getRatioH = function(h){
    return (Math.max(h, LAYOUT.minH) - LAYOUT.minH) / (LAYOUT.initH - LAYOUT.minH);
}

LAYOUT.getSimpleRatio = function(value, min, max){
    var ratio = (Math.max(value, min) - min) / (max - min);
    if (ratio > 1) ratio = 1;
    if (ratio < 0) ratio = 0;
    return ratio;
}

var LAYOUT_3D = {
    PX_PERFECT_DISTANCE:0,
    getPxPerfectScale: function(z) {
        return (LAYOUT_3D.PX_PERFECT_DISTANCE - (-z))/LAYOUT_3D.PX_PERFECT_DISTANCE
    }
}


var UTILS = {};

UTILS.shapeWrapper = function(lineHeight,Xs,container, nbrLines) {
    //var container = document.getElementById(idElement);
    var firstNode = container.firstChild;
	var Xvalues = Xs.split('|');
	for(i=0; i <= nbrLines; i++) {
		parts = Xvalues[i].split(',');
        var divA = document.createElement("div");
        divA.setAttribute("style",'float:left;clear:left;height:'+lineHeight+'px;width:'+ parts[1]+'px');
        var divB = document.createElement("div");
        divB.setAttribute("style",'float:right;clear:right;height:'+lineHeight+'px;width:'+ parts[2]+'px');
        container.insertBefore(divA, firstNode);
        container.insertBefore(divB, firstNode);
	}
}

UTILS.clone = function(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = UTILS.clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = UTILS.clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

/** JavaScript eMail Encrypter ***/
/* http://jumk.de/nospam/stopspam.html */

UTILS.UnCryptMailto = function(s) {
    var n = 0;
    var r = "";
    for( var i = 0; i < s.length; i++){
        n = s.charCodeAt( i );
        if( n >= 8364 ){
            n = 128;
        }
        r += String.fromCharCode( n - 1 );
    }
    return r;
}

UTILS.linkTo_UnCryptMailto = function (s){
    location.href = UTILS.UnCryptMailto( s );
}


var GLOBAL_ACCESS = this;

if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (function () {

            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback,  element) {
                    window.setTimeout(callback, 1000 / 20);
                };

        })();
    }

require.config({
    waitSeconds: 30,
    baseUrl: 'js/',
    paths: {        
        jquery: 'lib/jquery.min',
        TweenMax:'http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.5/TweenMax.min',
        Modernizr:'lib/modernizr',
        Sprite3D: 'lib/Sprite3D',
        edgeCta: 'lib/gmdpng_edgePreload',
        crossroads: 'lib/crossroads.min',
        signals:'lib/signals.min',
        hasher:'lib/hasher.min'
    }
    
});

var arrayRequire = ['js/app/core.js']
require(arrayRequire);

if(CONFIG.debug){
    var stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    if(document.getElementById("debug")){
        document.getElementById("debug").appendChild(stats.domElement);
    }
}