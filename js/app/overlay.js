define(["jquery","TweenMax"], function ($,TweenMax){
    
    var loader = $(".loader-overlay");
    var main = $(".video-overlay");
    var gmd = $(".getmore-overlay");
    
    var listElements = ["loader","getMoreDetails"];
    var overlay = {
        LOADER : listElements[0],
        GETMOREDETAILS : listElements[1]
    };
    
    var currentElName = overlay.LOADER;
    var gmdAnimation;
    
    /*enablePointer = function(){
        main.css("pointer-events", "auto");
        bg.css("pointer-events", "auto");
    }
    
    disablePointer = function(){
        main.css("pointer-events", "none");
        bg.css("pointer-events", "none");
    }*/
    
    var showMain = function(){
        main.css("opacity", 1);
        main.css("visibility", "show");
    }
    
    var getAssociatedElement = function(key){
        switch(key){
            case overlay.LOADER :
                return loader;
                break;
            case overlay.GETMOREDETAILS :
                return gmd;
                break;
        }
        return null;
    }
    
    
    GLOBAL_ACCESS.gmdReady = function(sym){
        gmdAnimation = sym;
    }
    
    overlay.loadGmd = function(){
        require(["GmdEdge"], function(GmdEdge){
            console.log("firstScript getMoreDetails loaded");
        });
    }
    
    overlay.removeGmd = function(){
        $(gmdAnimation).remove();
        console.log("removed GMD");
    }
    
    overlay.show = function(element){
        showMain();
        var newEl = getAssociatedElement(element);
        if(currentElName != "") overlay.hide(currentElName);
        
        /*if(element == overlay.CTA_MOBILE){
            disablePointer();
        }else{
            enablePointer();
        }*/
        if(element == overlay.GETMOREDETAILS){
            TweenMax.set(newEl, {autoAlpha:1});
            gmdAnimation.play()
        }else {
            TweenMax.to(newEl, 0.5, {autoAlpha:1});
        }
        currentElName = element;
    }
    
    overlay.hide = function(element, force){
        var duration = (typeof force !== 'undefined') ? (force ? 0 : 0.5) : 0.5;       
        if(element == null) {
            for(var i = 0 ;i< listElements.length; i++){
                overlay.hide(listElements[i], force);
            }
        } else {
            TweenMax.to(getAssociatedElement(element), duration, {autoAlpha:0});
        }
        
        if(element == currentElName) currentElName = "";
    }    
    
    return overlay;
});