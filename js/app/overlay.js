define(["jquery","TweenMax", "signals"], function ($,TweenMax,signals){
    
    var loader = $(".loader-overlay");
    var loaderText = $(".loader-text");
    var main = $(".video-overlay");
    var gmd = $(".getmore-overlay");
    var lanscapeAlert = $(".landscape-alert-overlay");
    var progressBar = $(".progress-load");
    
    var listElements = ["loader","getMoreDetails","landscapeAlert"];
    var overlay = {
        LOADER : listElements[0],
        GETMOREDETAILS : listElements[1],
        LANDSCAPE_ALERT : listElements[2]
    };
    
    var currentElName = overlay.LOADER;
    var gmdAnimation;
    var startLoadGmd = false;
    
    overlay.on = {
        clickMainOverlay: new signals.Signal()
    }
    
    var showMain = function(){
        main.css("opacity", 1);
        main.css("visibility", "show"); 
    }
    
    main.click(function(event) {
        overlay.on.clickMainOverlay.dispatch();
    });
    
    var getAssociatedElement = function(key){
        switch(key){
            case overlay.LOADER :
                return loader;
                break;
            case overlay.GETMOREDETAILS :
                return gmd;
                break;
            case overlay.LANDSCAPE_ALERT :
                return lanscapeAlert;
                break;
        }
        return null;
    }
    
    GLOBAL_ACCESS.gmdReady = function(sym){
        gmdAnimation = sym;
    }
    
    overlay.loadGmd = function(){
        
        if(startLoadGmd) return;
        startLoadGmd = true;
        if(gmdAnimation !== undefined) return;

        require(["GmdEdge"], function(GmdEdge){
            
        });
    }
    
    overlay.gmdLoaded = function(){
        return Boolean(gmdAnimation);
    }
    
    /*overlay.removeGmd = function(){
        $(gmdAnimation).remove();
        console.log("999 @@@@@@@ removed GMD");
    }*/
    
    overlay.show = function(element){
        showMain();
        var newEl = getAssociatedElement(element);
        //if(currentElName != "") overlay.hide(currentElName);
        
        if(element == overlay.GETMOREDETAILS){
            TweenMax.set(newEl, {autoAlpha:1});
            gmdAnimation.play()
        }else {
            TweenMax.to(newEl, 0.5, {autoAlpha:1});
        }
        
        if(element == overlay.LOADER){
            TweenMax.set(progressBar, {width:1})
             TweenMax.fromTo(loaderText, 0.5, {autoAlpha:0, marginTop:60},{delay:0.2, marginTop:0, autoAlpha:1});
        }
        
        if(element == overlay.LANDSCAPE_ALERT || element == overlay.LOADER){
            $(main).addClass("overlay-total");   
        }else {
            $(main).removeClass("overlay-total");
        }
        
        currentElName = element;
    }
    
    overlay.hide = function(element, force){
        //return;
        
        //console.trace("HIDE")
        
        var duration = (typeof force !== 'undefined') ? (force ? 0 : 0.5) : 0.5;       
        if(element == null) {
            for(var i = 0 ;i< listElements.length; i++){
                overlay.hide(listElements[i], force);
            }
        } else {
            TweenMax.to(getAssociatedElement(element), duration, {delay:0.2, autoAlpha:0, onComplete:function(){
            $(main).removeClass("overlay-total");            
            }
                                                                 });
        }
        
        if(element == currentElName) currentElName = "";
        
    }
    
    overlay.enableClicks = function(){
        main.css("cursor", "pointer");
        main.css("pointer-events", "auto");
    }
    
    overlay.disableClicks = function(){
        main.css("cursor", "auto");
        main.css("pointer-events", "none");
    }
    
    overlay.disable = function(){
        overlay.hide();
        main.css("visibility", "hidden");
        overlay.disableClicks();
    }
    
    overlay.updateProgress = function(prct){
        var widthMax = 224;
        var target = 224*prct;
        TweenMax.to(progressBar,0.4,{width:target, ease:Power1.easeInOut});   
    }
    
    var pausedAnimation = false;
    
    overlay.pauseGmd = function(){
        if(gmdAnimation && gmdAnimation.isPlaying()){
            gmdAnimation.stop();
            pausedAnimation = true;
        }
    }
    
    overlay.resumeGmd = function(){
        if(gmdAnimation && pausedAnimation){
            gmdAnimation.play();
            pausedAnimation = false;
        }
    }
    
    return overlay;
});