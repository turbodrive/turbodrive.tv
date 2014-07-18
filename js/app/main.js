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
hyperDriveTransition:true, volumeReel:0};

var LAYOUT = {initW:1280, initH:720, minW:1024, minH:610, viewportW:1280,viewportH:720, vW2:640, vH2:360, currentEnv:"", ratioW:1, ratioH:1};


LAYOUT.getRatioW = function(w){
    return (Math.max(w, LAYOUT.minW) - LAYOUT.minW) / (LAYOUT.initW - LAYOUT.minW);
}
		
LAYOUT.getRatioH = function(h){
    return (Math.max(h, LAYOUT.minH) - LAYOUT.minH) / (LAYOUT.initH - LAYOUT.minH);
}

LAYOUT.getSimpleRatio = function(value, min, max){
    var ratio = (Math.max(value, min) - min) / (max - min);
    if (ratio > 1) ratio = 1
    if (ratio < 0) ratio = 0
    return ratio
}


var LAYOUT_3D = {
    PX_PERFECT_DISTANCE:0,
    getPxPerfectScale: function(z) {
        return (LAYOUT_3D.PX_PERFECT_DISTANCE - (-z))/LAYOUT_3D.PX_PERFECT_DISTANCE
    }
}

var tTemp = "";
function msg(t) {
    if(!CONFIG.debug) return
    tTemp += t + "<br/>"
    document.getElementById("debugText").innerHTML = tTemp
}

var GLOBAL_ACCESS = this;

require.config({
    baseUrl: 'js/',
    paths: {
        jquery: 'jquery.min',
        jquery_ui: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min',
        bootstrap: 'bootstrap.min',
        TweenMax:'http://cdnjs.cloudflare.com/ajax/libs/gsap/1.11.5/TweenMax.min',
        modernizr:'modernizr.custom.55142',
        requestAnimationFrame:'RequestAnimationFrame',
        Sprite3D: 'Sprite3D',
        edgeCta: 'gmdpng_edgePreload',
        crossroads: 'crossroads.min',
        signals:'signals.min',
        hasher:'hasher.min'
    }
    
});

require(['js/app/core.js']);