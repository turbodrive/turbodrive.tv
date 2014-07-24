/* Turbodrive - NextPrev Module
 * Author : Silvère Maréchal
 */

define(["jquery", "TweenMax","signals"], function ($, TweenMax, signals) {
    var main;
    var backToTheReel;
    
    var nextPrev = {}
    nextPrev.on = {
        nextPressed : new signals.Signal(),
        prevPressed : new signals.Signal(),
        backToTheReelPress : new signals.Signal()
    }
    
    nextPrev.hide = function() {
       TweenMax.to(main,0.5, {autoAlpha:0}); 
    }
    
    nextPrev.init = function() {
        main = $(".next-prev");
        backToTheReel = $(".back-to-the-reel");
        backToTheReel.click(function(event){
            event.preventDefault();
            nextPrev.on.backToTheReelPress.dispatch();
        })
    }
    
    nextPrev.show = function() {
        TweenMax.to(main,0.5, {autoAlpha:1});
    }
    
    
    nextPrev.updateState = function(idPage) {
        var indexPage = pages.getPageIndex(idPage);
        
    }
    
    return nextPrev;
    
});