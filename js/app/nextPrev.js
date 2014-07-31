/* Turbodrive - NextPrev Module
 * Author : Silvère Maréchal
 */

define(["jquery", "TweenMax","signals", "app/pageInfo"], function ($, TweenMax, signals, pageInfo) {
    var main;
    var backToTheReel;
    var nextButton;
    var prevButton;
    var tweenObj = {bgLeftPrct:-750, bgRightPrct:-750};
    var currentPageInfo;
    var nextPageId = "";
    var prevPageId = "";
    var hidden = true;
    
    var nextPrev = {}
    nextPrev.on = {
        nextPressed : new signals.Signal(),
        prevPressed : new signals.Signal(),
        backToTheReelPress : new signals.Signal()
    }
    
    nextPrev.init = function() {
        main = $(".next-prev");
        backToTheReel = $(".back-to-the-reel");
        nextButton = $(".next-button");
        prevButton = $(".prev-button");
        
        backToTheReel.click(function(event){
            event.preventDefault();
            nextPrev.on.backToTheReelPress.dispatch();
        })
        
        nextButton.on("mouseover",overNextPrevHandler);
        nextButton.on("mouseout",outNextPrevHandler);
        nextButton.on("click",clickNextPrevHandler);
        nextButton.on("touchstart",onTouchStart);
        nextButton.on("touchend",onTouchEnd);
        
        prevButton.on("mouseover",overNextPrevHandler);
        prevButton.on("mouseout",outNextPrevHandler);        
        prevButton.on("click",clickNextPrevHandler);
        prevButton.on("touchstart",onTouchStart);
        prevButton.on("touchend",onTouchEnd);
    }
    
    var updateBtnBgPosition = function() {
        prevButton.children(".transverse-nav-bg").css("left", tweenObj.bgLeftPrct+"%");
        nextButton.children(".transverse-nav-bg").css("right", tweenObj.bgRightPrct+"%");;
    }
    
    var isLeftButton = function(element){
        return  $(element).hasClass("prev-button");
    }
    
    var touchTarget;
    
    var onTouchStart = function(event) {
        touchTarget = event.target;
        var btn = event.currentTarget;
        var bg = $(btn).children(".transverse-nav-bg")[0];
        
        var objBgPos = {autoAlpha:1}
        if(isLeftButton(btn)){
            objBgPos.left = "-600%";
        }else {
            objBgPos.right = "-600%";
        }
        TweenMax.set(btn, {autoAlpha:1});
        TweenMax.set(bg, objBgPos);
    }
    
    var onTouchEnd = function(event) {
        if(touchTarget == event.target){
            clickNextPrevHandler(event);
        }else {
            var btn = event.currentTarget;
            var bg = $(btn).children(".transverse-nav-bg")[0];
            TweenMax.to(btn, 0.3, {autoAlpha:0.2});
            TweenMax.to(bg, 0.5, {autoAlpha:0});
        }
    }
    
    var overNextPrevHandler = function(event) {
        if(hidden) return
        
        var btn = event.currentTarget;
        var bg = $(btn).children(".transverse-nav-bg")[0];
        
        var objBtn = {autoAlpha:1,ease:Power3.easeOut};
        var objBgPos = {ease:Power3.easeOut, onUpdate:updateBtnBgPosition}
        if(isLeftButton(btn)){
            objBtn.left = 20;
            objBgPos.bgLeftPrct = -500;
        }else {
            objBtn.right = 20;
            objBgPos.bgRightPrct = -500;
        }
        
        TweenMax.to(btn,0.3, objBtn);
        TweenMax.to(bg,0.3, {autoAlpha:1,ease:Power3.easeOut});
        TweenMax.to(tweenObj,0.3, objBgPos);
    }
    
    var clickNextPrevHandler = function(event) {
        var idNewPage = isLeftButton(event.currentTarget) ? pageInfo.getPrevPageId(currentPageInfo.id) : pageInfo.getNextPageId(currentPageInfo.id);
        window.location.hash = "#/folio/"+idNewPage+"/";
    }
    
    var rolloutButton = function(btn, alphaTarget) {
        //var btn = button
        var bg = $(btn).children(".transverse-nav-bg")[0];
        
        var objBtn = {autoAlpha:alphaTarget,ease:Power3.easeInOut};
        var objBgPos = {ease:Power3.easeInOut, onUpdate:updateBtnBgPosition};
        if(isLeftButton(btn)){
            objBtn.left = -5; /*-80*/
            objBgPos.bgLeftPrct = -750;
        }else {
            objBtn.right = -5 /*-80;*/
            objBgPos.bgRightPrct = -750;
        }
        
        TweenMax.to(btn,0.3, objBtn);
        TweenMax.to(bg,0.3, {autoAlpha:0,ease:Power3.easeInOut});
        TweenMax.to(tweenObj,0.3,objBgPos);
    }
    
    var outNextPrevHandler = function(event) {
        if(hidden) return
        
        rolloutButton(event.currentTarget, 0.2)
    }
    
    nextPrev.hide = function(boost) {
        hidden = true;
        
        /*TweenMax.to(nextButton,0.3, {autoAlpha:0});
        TweenMax.to(prevButton,0.3, {autoAlpha:0});*/
        if(boost === null) boost = false
        
        if(boost){
            TweenMax.to(backToTheReel,0.3, {autoAlpha:0});
            TweenMax.to(nextButton,0.3, {autoAlpha:0});
            TweenMax.to(prevButton,0.3, {autoAlpha:0});
        }else {
            TweenMax.to(backToTheReel,0.3, {autoAlpha:0});
            rolloutButton(nextButton,0);
            rolloutButton(prevButton,0);
        }
    }
    
    nextPrev.show = function() {
        if(!hidden) return
        showIfNeeded();
    }
    
    var showIfNeeded = function() {
         if(currentPageInfo.project){
            hidden = false;
            
            TweenMax.to(backToTheReel,1.5, {autoAlpha:1});
            if(nextPageId != null){
                TweenMax.to(nextButton,1.5, {autoAlpha:0.2});
            }
            if(prevPageId != null){
                TweenMax.to(prevButton,1.5, {autoAlpha:0.2});
            }
        }
    }
    

    nextPrev.updateState = function(newPageInfo) {
        currentPageInfo = newPageInfo;
        nextPageId = pageInfo.getNextPageId(currentPageInfo.id);
        prevPageId = pageInfo.getPrevPageId(currentPageInfo.id);
        showIfNeeded();        
    }
    
    return nextPrev;
    
});