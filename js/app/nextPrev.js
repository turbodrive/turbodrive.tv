/* Turbodrive - NextPrev Module
 * Author : Silvère Maréchal
 */

define(["jquery", "TweenMax","signals","app/pages"], function ($, TweenMax, signals, pages) {
    var nextPrev = {}
    nextPrev.on = {
        nextPressed : new signals.Signal(),
        prevPressed : new signals.Signal()
    }
    
    nextPrev.hide = function() {
        
    }
    
    nextPrev.updateState = function(idPage) {
        var indexPage = pages.getPageIndex(idPage);
        
    }
    
    return nextPrev;
    
});