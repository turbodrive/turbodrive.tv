define(["jquery","TweenMax"], function ($,TweenMax){
    
    var overlay = {
        LOADER : "loader",
        CTA_MOBILE : "callToActionMobile",
        GETMOREDETAILS : "getMoreDetails",
        MAIN : "main"
    };    
    
    var currentEl = overlay.LOADER;
    
    var loader = $(".loader-overlay");
    var ctaMobile = $(".start-overlay");
    var main = $(".video-overlay");
    var gmd = $(".getmore-overlay");
    var bg = $(".blackBg-overlay");
    
    enablePointer = function(){
        main.css("pointer-events", "auto");
        ctaMobile.css("pointer-events", "auto");
        bg.css("pointer-events", "auto");
    }
    
    disablePointer = function(){
        main.css("pointer-events", "none");
        ctaMobile.css("pointer-events", "none");
        bg.css("pointer-events", "none");
    }
    
    showMain = function(){
        main.css("opacity", 1);
        main.css("visibility", "show");
    }
    
    getAssociatedElement = function(key){
        switch(key){
            case overlay.CTA_MOBILE :
                return ctaMobile;
                break;
            case overlay.LOADER :
                return loader;
                break;
            case overlay.GETMOREDETAILS :
                return gmd;
                break;
            case overlay.MAIN :
                return ctaMobile;
                break;
            default :
                return null;
        }
        return null;
    }
    
    overlay.show = function(element, showBackground){
        showMain();
        overlay.hide(currentEl);
        
        if(showBackground){
            TweenMax.to(bg, 0.5, {autoAlpha:1})
        }
        
        if(element == overlay.CTA_MOBILE){
            disablePointer();
        }else{
            enablePointer();
        }
        
        if(element == overlay.GETMOREDETAILS){
            TweenMax.set(getAssociatedElement(element), {autoAlpha:1})
        }else {
            TweenMax.to(getAssociatedElement(element), 0.5, {autoAlpha:1})
        }     
    }
    
    overlay.hide = function(element){
        if(element == null) {
            TweenMax.to(main, 0.5, {autoAlpha:0});
        } else {
            TweenMax.to(getAssociatedElement(element), 0.5, {autoAlpha:0})
        }        
    }    
    
    return overlay;
});