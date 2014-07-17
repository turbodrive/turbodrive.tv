/* Turbodrive - Header Module
 * Author : Silvère Maréchal
 */

define(["jquery", "TweenMax", "signals"], function ($, TweenMax, signals) {
    
    var currentMenuState = "--";
    var header = {};
    var panelHeight = 313;
    var navMenuHeight = 50;
    var stealthEnabled = false;
    var isOpen = false;
    
    // header Signal Events
    header.on = {
        initialized : new signals.Signal(),
        open : new signals.Signal(),
        close : new signals.Signal(),
    } 
    
    /* initialize events and header behaviors */
    header.init = function () {
        var allListElements = $(".buttonSubMenu");
        for(var i=0 ;i<allListElements.length ;i++){
            var divEl = $(allListElements[i]);
            //var link = $(divEl).children("a");
            if(divEl.attr("folio-id")){
                $(divEl).css("background-image", "url('images/menu/"+divEl.attr("folio-id")+".jpg')");
            }
        }

        $(".button-menu, .button-contact").on("click", function (event){
            event.preventDefault();
            controlMenuState($(this).attr("id"),0.3);
        }) 

        $(".closeMenuPicto").on("click", function (event){
            event.preventDefault();
            header.close();
        })

        TweenMax.set($(".menu3D"),{height:-panelHeight, autoAlpha:1}) 
        controlMenuState("",0)
        //setTimeout(controlMenuState, 1500, "contact")        
        header.resize();
        header.on.initialized.dispatch();
        
        //controlMenuState("share");
    }
    
    header.isOpen = function() {
        return isOpen;
    }

    header.show = function(stealthMode) {
        TweenMax.to($(".navbar-default"),0.5, {autoAlpha:1});
        stealthEnabled = stealthMode;
        updateStealthStatus();
        
    }
    
    var updateStealthStatus = function(){
        if(stealthEnabled && !isOpen) {
            $(".navbar-default").addClass("navbar-stealth");
        } else {
            $(".navbar-default").removeClass("navbar-stealth");
        }
    }
    
    /* closing menu header from external module*/
    header.close = function() {
        controlMenuState("");
    }
    
    /* event handler for tablets*/
    header.onTouchClick = function(element) {
        var className = element.className
        console.log("onTouchClick >> " + className)
        if(className.indexOf("button-menu")>-1 || className.indexOf("menu-icon")>-1){
            if(className.indexOf("about-button") == -1){
                controlMenuState(element.id)
            }
        } else if (className.indexOf("closeMenuPicto")>-1){
            header.close();
            return
        } else if(className.indexOf("hireMeAbout")>-1){
            controlMenuState("contact");
            return
        }else if (className.indexOf("button-menu")== -1 && className.indexOf("button-contact")== -1){
            header.close();
            return
        }
    }
    
    controlMenuState = function (idButton, duration) {
        if(currentMenuState == "" && idButton == "") return
        
        header.resize();
        if (duration == null) duration = 0.3;
        //console.trace("idButton >> " + idButton)
        
        var yTarget = 0;
        var xTargetContent = 0;
        var yTargetContent = 0;
        var hTarget = 200;
        var alphaBgTarget = 0.8

        if (idButton == "about") {
            //gotoAbout();
        }

        if (currentMenuState == idButton) {
            // toggle
            yTarget = -panelHeight;

            if (currentMenuState == "contact" || currentMenuState == "share") {
                xTargetContent = -LAYOUT.viewportW;
            }

            currentMenuState = "";

        } else {
            if (idButton == "about" || idButton == "") {
                yTarget = -panelHeight;
            } else {
                yTarget = 0;
            }
            if (idButton == "contact" || idButton == "share") {
                xTargetContent = -LAYOUT.viewportW;
                hTarget = panelHeight+navMenuHeight;
                alphaBgTarget = 0;
                
            } else if (idButton == "") {
                if (currentMenuState == "contact" || currentMenuState == "share") {
                    xTargetContent = -LAYOUT.viewportW;
                }
            } else {
                xTargetContent = 0;
            }
            if (idButton == "moreProjects") {
                yTargetContent = -150;
            } else {
                yTargetContent = 0;
            }
            if (currentMenuState == "") {
                // no transition 
                TweenMax.to($(".menuContent"), 0, {
                    x: xTargetContent
                })
            }

            currentMenuState = (idButton == "about") ? "" : idButton
        }

        if (currentMenuState == "contact") {            
            TweenMax.to($(".contact .content"), duration, {
                opacity: 1
            })
        } else {
            TweenMax.to($(".contact .content"), duration, {
                opacity: 0.35
            })
        }

        if (currentMenuState == "share") {
            TweenMax.to($(".share .content"), duration, {
                opacity: 1
            })
        } else {
            TweenMax.to($(".share .content"), duration, {
                opacity: 0.35
            })
        }
        
        TweenMax.to($(".menuContent"), duration, {
            x: xTargetContent,
            y: yTargetContent
        })
        TweenMax.to($(".menu3D"), duration, {
            backgroundColor: "rgba(36,22,37,"+alphaBgTarget+")",
            height: hTarget,
            y: yTarget
        })
        
        if(yTarget == -panelHeight){
            header.on.close.dispatch();
            isOpen = false;
        }else {
            header.on.open.dispatch();
            isOpen = true;
        }
        updateStealthStatus();
    }
    
    var getWidthPanel = function() {
        return Math.min(LAYOUT.viewportW,1280);
    }
    
    header.resize = function(){
        var wSc = Math.floor(((LAYOUT.viewportW-20)/8)) - 2;
        var wBtr = Math.floor(((LAYOUT.viewportW-20)/8)) - 32;
        $(".menuSelectedCases .buttonSubMenu").width(wSc);
        $(".menuSelectedCases .buttonSubMenu.backToReel").width(wBtr);

        /*var wCloseDiv = 80;
        var w3 = Math.floor(parseInt(LAYOUT.viewportW-wCloseDiv)/3)-20*/
        var vW = getWidthPanel();
        var ratioPaddingW = 60*(1-(1024/LAYOUT.viewportW))
        var contentPaddingLeft = 10+ratioPaddingW;
        var hirePadddingLeft = 20+ratioPaddingW;
        var hirePadddingRight = 70+ratioPaddingW;
        var wA = (vW*0.41) - (hirePadddingLeft+hirePadddingRight);
        var wB = (vW*0.295)- contentPaddingLeft;
        
        $(".contactPanel").width(vW+100);
        $(".contactPanel").css("left",LAYOUT.viewportW);
        /*$(".menuContent").css("left", -LAYOUT.viewportW)*/

        $(".hireMe").width(wA);
        $(".contact").width(wB);
        $(".share").width(wB);
        
        $(".contact").css("left",wA+hirePadddingLeft+hirePadddingRight);
        $(".share").css("left",(wA+wB+hirePadddingLeft+hirePadddingRight+contentPaddingLeft));
        $(".content").css("padding-left",contentPaddingLeft);
        $(".contactPanel .hireMe").css("padding-left",hirePadddingLeft);
        $(".contactPanel .hireMe").css("padding-right",hirePadddingRight);

        //var wClose = LAYOUT.viewportW-((w3)*3);
        $(".closeMenu").css("left",(wA+hirePadddingLeft+hirePadddingRight)+((contentPaddingLeft+wB)*2)-80);
        //$(".closeMenu").css("width",wClose);

        if(currentMenuState == "contact" || currentMenuState == "share"){
            TweenMax.set($(".menuContent"),{x: -LAYOUT.viewportW}) 
        }
    }
    
    return header;
});