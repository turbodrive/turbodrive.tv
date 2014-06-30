/* Turbodrive - Header Module
 * Author : Silvère Maréchal
 */

define(["jquery", "TweenMax", "signals"], function ($, TweenMax, signals) {
    
    var currentMenuState = "--";
    var header = {};
    
    // header Signal Events
    header.on = {
        initialized : new signals.Signal()
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

        TweenMax.set($(".menu3D"),{height:-280, autoAlpha:1}) 
        controlMenuState("",0)
        //setTimeout(controlMenuState, 1500, "contact")        
        header.resize();
        header.on.initialized.dispatch();
    }
    
    header.show = function() {
        TweenMax.to($(".navbar-default"),0.5, {autoAlpha:1});
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

        if (idButton == "about") {
            //gotoAbout();
        }

        if (currentMenuState == idButton) {
            // toggle
            yTarget = -200

            if (currentMenuState == "contact" || currentMenuState == "share") {
                xTargetContent = -LAYOUT.viewportW
            }

            currentMenuState = ""

        } else {
            if (idButton == "about" || idButton == "") {
                yTarget = -280;
            } else {
                yTarget = 0;
            }
            if (idButton == "contact" || idButton == "share") {
                xTargetContent = -LAYOUT.viewportW
                hTarget = 280;
            } else if (idButton == "") {
                if (currentMenuState == "contact" || currentMenuState == "share") {
                    xTargetContent = -LAYOUT.viewportW
                }
            } else {
                xTargetContent = 0
            }
            if (idButton == "moreProjects") {
                yTargetContent = -150
            } else {
                yTargetContent = 0
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
                opacity: 0.25
            })
        }

        if (currentMenuState == "share") {
            TweenMax.to($(".share .content"), duration, {
                opacity: 1
            })
        } else {
            TweenMax.to($(".share .content"), duration, {
                opacity: 0.25
            })
        }
        
        TweenMax.to($(".menuContent"), duration, {
            x: xTargetContent,
            y: yTargetContent
        })
        TweenMax.to($(".menu3D"), duration, {
            height: hTarget,
            y: yTarget
        })
    }
    
    header.resize = function(){
        var wSc = Math.floor(((LAYOUT.viewportW-20)/8)) - 2;
        var wBtr = Math.floor(((LAYOUT.viewportW-20)/8)) - 32;
        $(".menuSelectedCases .buttonSubMenu").width(wSc);
        $(".menuSelectedCases .buttonSubMenu.backToReel").width(wBtr);

        var wCloseDiv = 80;
        var w3 = Math.floor(parseInt(LAYOUT.viewportW-wCloseDiv)/3)-20
        $(".contactPanel").width(LAYOUT.viewportW);
        $(".contactPanel").css("left",LAYOUT.viewportW);

        $(".hireMe").width(w3);
        $(".contact").width(w3);
        $(".share").width(w3);
        $(".contact").css("left",w3+20);
        $(".share").css("left",((w3+20)*2));

        var wClose = LAYOUT.viewportW-((w3)*3);
        $(".closeMenu").css("left",((w3+20)*3));
        $(".closeMenu").css("width",wClose);

        if(currentMenuState == "contact" || currentMenuState == "share"){
            TweenMax.set($(".menuContent"),{x: -LAYOUT.viewportW}) 
        }    
    }
    
    return header;
});