/* Turbodrive - Overlay Module
 * Author : Silvère Maréchal
 */

define(["jquery","TweenMax", "signals"], function ($,TweenMax,signals){
    
    var loader = $(".loader-overlay");
    var loaderText = $(".loader-text");
    var main = $(".video-overlay");
    var gmd = $(".getmore-overlay");
    var lanscapeAlert = $(".landscape-alert-overlay");
    var miniloader = $(".miniloader-overlay");
    var progressBar = $(".progress-load");
    
    var listElements = ["loader","getMoreDetails","landscapeAlert", "miniloader"];
    var overlay = {
        LOADER : listElements[0],
        GETMOREDETAILS : listElements[1],
        LANDSCAPE_ALERT : listElements[2],
        MINI_LOADER : listElements[3]
    };
    
    var currentElName = overlay.LOADER;
    var gmdAnimation;
    var startLoadGmd = false;
    var bufferEmpty = false;
    var widthMaxProgressBar = 224;
    
    overlay.on = {
        clickMainOverlay: new signals.Signal(),
        gmdLoaded: new signals.Signal()
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
            case overlay.MINI_LOADER :
                return miniloader;
                break;
        }
        return null;
    }
    
    document.gmdReady = function(sym){
        gmdAnimation = sym;
        console.log("GmdEdge - gmdReady " + overlay.gmdLoaded() )
        overlay.on.gmdLoaded.dispatch();
    }
    
    overlay.loadGmd = function(){
        console.log("GmdEdge - startLoad" + overlay.gmdLoaded() )
        if(startLoadGmd) return;
        startLoadGmd = true;
        if(gmdAnimation !== undefined) return;

        require(["assets/GmdEdge"], function(GmdEdge){
            console.log("GmdEdge - Loaded" + overlay.gmdLoaded() )
        });
    }
    
    overlay.gmdLoaded = function(){
        return Boolean(gmdAnimation);
    }
    
    /*overlay.removeGmd = function(){
        $(gmdAnimation).remove();
        console.log("999 @@@@@@@ removed GMD");
    }*/
    
    overlay.onBufferFull = function() {
        miniloader.css("pointer-events","none")
        bufferEmpty = false;
        overlay.hide(overlay.MINI_LOADER);
    }
    
    overlay.onBufferEmpty = function() {
        miniloader.css("pointer-events", "auto")
        bufferEmpty = true;
        overlay.show(overlay.MINI_LOADER,0.8);
    }
    
    overlay.onBufferProgress = function(prct) {
        if(!bufferEmpty) return
        var target = widthMaxProgressBar*prct;
        TweenMax.to(progressBar,0.4,{width:target, ease:Power1.easeInOut}); 
    }
    
    overlay.show = function(element, bgAlpha){
        showMain();
        
        if(bgAlpha === null) bgAlpha = 1;
        
        var newEl = getAssociatedElement(element);
        //if(currentElName != "") overlay.hide(currentElName);
        var duration = 0.5
        if(element == overlay.MINI_LOADER){
            duration = 0.2
        }
        
        if(element == overlay.GETMOREDETAILS){
            TweenMax.set(newEl, {autoAlpha:1});
            console.log("overlay.gmdLoaded >> " + overlay.gmdLoaded());
            gmdAnimation.play()
        }else {
            TweenMax.set(newEl, {backgroundColor:"rgba(0,0,0,"+bgAlpha+")"})
            TweenMax.to(newEl, duration, {autoAlpha:1});
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
    
    overlay.hide = function(element, force, switchMainVisible){
        //return;
        
        //console.log("HIDE - " + element)
        
        var duration = (typeof force !== 'undefined') ? (force ? 0 : 0.8) : 0.8;
        if(element == overlay.MINI_LOADER) duration = 0.8;
        if(switchMainVisible === null) switchMainVisible = false;
        
        //console.log("")
        
        if(element == null) {
            for(var i = 0 ;i< listElements.length; i++){
                overlay.hide(listElements[i], force, switchMainVisible);
            }
        } else {
            TweenMax.to(getAssociatedElement(element), duration, {
                delay:0, autoAlpha:0,
                onComplete:function(){
                    $(main).removeClass("overlay-total");
                    if(switchMainVisible) main.css("visibility", "hidden");
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
        overlay.hide(null,false, true);
        //main.css("visibility", "hidden");
        overlay.disableClicks();
        
    }
    
    overlay.updateProgress = function(prct){
        var target = widthMaxProgressBar*prct;
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