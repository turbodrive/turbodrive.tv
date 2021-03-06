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
    var timeClose = 0;
    
    // header Signal Events
    header.on = {
        initialized : new signals.Signal(),
        open : new signals.Signal(),
        close : new signals.Signal(),
        toggleRenderer : new signals.Signal()
    } 
    
    /* initialize events and header behaviors */
    header.init = function () {
        var allListElements = $(".buttonSubMenu");
        for(var i=0 ;i<allListElements.length ;i++){
            var divEl = $(allListElements[i]);
            //var link = $(divEl).children("a");
            if(divEl.attr("folio-id")){
                $(divEl).css("background-image", "url('images/menus/"+divEl.attr("folio-id")+".jpg')");
            }
        }

        $(".button-menu, .button-contact").on("click", function (event){
            event.preventDefault();
            controlMenuState($(this).attr("id"),0.3);
        })
        
         $(".toggle-renderer").on("click", function (event){
            event.preventDefault();
            header.on.toggleRenderer.dispatch();
        }) 

        $(".closeMenuPicto").on("click", function (event){
            event.preventDefault();
            header.close();
        })
        
        $(".contactPanel .share .content").mouseover(function(event){
            highlightContactPanel("share",0.3)
        })
        
        $(".contactPanel .contact").mouseover(function(event){
            highlightContactPanel("contact",0.3)
        });
        
        $("#submit_btn").on("click", submitMessage);
        $("#cancel_btn").on("click", cancelForm);
        $("a.email").on("click", clickEmailLinkHandler);
        $(".contact-form-button").on("click", scrollToForm);
        
        $(".content-filter").on("click", header.close);
        TweenMax.set($(".content-filter"),{autoAlpha:0});
        
        TweenMax.set($(".menu3D"),{height:panelHeight, y:-panelHeight, autoAlpha:1})
        controlMenuState("",0)   
        header.resize();
        header.on.initialized.dispatch();
        

        /*$("[data-toggle='tooltip']").tooltip();*/
        //setTimeout(function(){$('.googleplus').tooltip('show')},2500);
    }
    
    var clickEmailLinkHandler = function() {
        UTILS.linkTo_UnCryptMailto('nbjmup;jogpAuvscpesjwf/uw');
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
        removeHighlightButtons();
    }
    
    header.contains = function(domElement) {
        return ($.contains($(".menu3D")[0], domElement) || $.contains($(".navbar")[0],domElement));
    }
    
    /* closing menu header from external module*/
    header.close = function() {
        controlMenuState("");
    }
    
    header.openHireMe = function() {
        controlMenuState("contact")
    }
    
    /* event handler for tablets*/
    header.onTouchClick = function(element) {
        if(!header.contains(element)) return;
        
        var className = element.className;
        
        if(className.indexOf("button-toggle")>-1){
            //console.log("dispatch toggle renderer")
            header.on.toggleRenderer.dispatch();
        }
        
        if(className.indexOf("button-menu")>-1 || className.indexOf("menu-icon")>-1 || className.indexOf("button-contact")){
            if(className.indexOf("about-button") == -1){
                controlMenuState(element.id)
            }
        } else if (className.indexOf("closeMenuPicto")>-1){
            //header.close();
            return
        } else if(className.indexOf("hireMeAbout")>-1){
            controlMenuState("contact");
            return
        }else if (className.indexOf("button-menu")== -1 && className.indexOf("button-contact")== -1){
            header.close();
        }
    }
    
    var to1,to2, to3, to4;
    header.highlightButtons = function(){
        to1 = setTimeout(function(){
            $(".navbar-stealth .container").addClass("highlightContainer");
            $("#moreProjects").addClass("highlight");
        },1500);
        
        /*to2 = setTimeout(function(){
            $("#moreProjects").removeClass("highlight");
        },7000);*/
        
         to3 = setTimeout(function(){
            $(".about-button").addClass("highlight");
        },3000);
        
         to4 = setTimeout(removeHighlightButtons,8000);
    }
    
    var removeHighlightButtons = function() {
        $("#moreProjects").removeClass("highlight");
        $(".about-button").removeClass("highlight");
        $(".navbar-stealth .container").removeClass("highlightContainer");
        clearTimeout(to1);
        clearTimeout(to2);
        clearTimeout(to3);
        clearTimeout(to4);
    }
    
    controlMenuState = function (idButton, duration) {
        hideFormFeedback();
        
        if(currentMenuState == "" && idButton == "") return
        if(idButton == "toggleTimeline"){
            header.on.toggleTimeline.dispatch();
            return
        }
        
        header.resize();
        if (duration == null) duration = 0.3;
        //console.log("controlMenuState idButton >> " + idButton)
        
        var yTarget = 0;
        var xTargetContent = 0;
        var yTargetContent = 0;
        var hTarget = 200;
        var alphaBgTarget = 0.8

        if (currentMenuState == idButton) {
            // toggle
            var tme = new Date().getTime()-timeClose;

            
            if(tme < 500) return
            
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
        timeClose = new Date().getTime();
        
        TweenMax.to($(".menuContent"), duration, {
            x: xTargetContent,
            y: yTargetContent
        })
        
        if((!isOpen && yTarget == 0) || (isOpen && yTarget != 0)){
            TweenMax.to($(".menu3D"), duration, {
                backgroundColor: "rgba(36,22,37,"+alphaBgTarget+")",
                height: hTarget,
                y: yTarget
            })
        }else {
            TweenMax.to($(".menu3D"), duration, {
                backgroundColor: "rgba(36,22,37,"+alphaBgTarget+")",
                height: hTarget
            })
        }
        
        if(yTarget == -panelHeight){
            TweenMax.to($(".content-filter"),0.3,{autoAlpha:0});
            header.on.close.dispatch();
            downLightContactPanel()
            isOpen = false;
        }else {
            TweenMax.to($(".content-filter"),1,{autoAlpha:1, delay:0.3});
            header.on.open.dispatch();
            highlightContactPanel(currentMenuState, duration);
            isOpen = true;
        }
        //console.log("panel is open : " + isOpen)
        
        updateStealthStatus();
    }
    
    var highlightContactPanel = function(section, duration) {
        if (section == "contact") {            
            TweenMax.to($(".contact .content"), duration, {
                opacity: 1
            })
            
            $("#contact").addClass("active");        
            
        } else {
            TweenMax.to($(".contact .content"), duration, {
                opacity: 0.35
            })
            $("#contact").removeClass("active");
        }

        if (section == "share") {
            TweenMax.to($(".share .content"), duration, {
                opacity: 1
            })
            $("#share").addClass("active");
        } else {
            TweenMax.to($(".share .content"), duration, {
                opacity: 0.35
            })
            $("#share").removeClass("active");
        }
    }
    
    var downLightContactPanel = function(){
        TweenMax.to($(".share .content"), 0.2, {
                opacity: 0.35
            })
        TweenMax.to($(".contact .content"), 0.2, {
                opacity: 0.35
            })
        
        $("#share").removeClass("active");
        $("#contact").removeClass("active");
    }
    
    var getWidthPanel = function() {
        return Math.min(LAYOUT.viewportW,1280);
    }
    
    header.updateState = function(pageId, isProject) {
        //console.log("pageId >> " + pageId);
        
        var allListElements = $(".buttonSubMenu");
        for(var i=0 ;i<allListElements.length ;i++){
            var divEl = $(allListElements[i]);
            if(divEl.attr("folio-id")){
                if(divEl.attr("folio-id") == pageId){
                    divEl.addClass("active")
                }else {
                    divEl.removeClass("active")
                }
            }
        }
        
        if(pageId == "reel"){
            $("#selectedCases").removeClass("active");
            $(".about-button").removeClass("active");
            return
        }
        
        if(isProject) {
            $("#selectedCases").addClass("active");
            $(".about-button").removeClass("active");
        }else {
            $("#selectedCases").removeClass("active");
            $(".about-button").addClass("active");
        }
        
    }
    
    var timerFeedback;
    
    var sentEmailHandler = function(response) { 
        //load json data from server and output message
        
        console.log("sentEmailHandler >> " + response.type + " - " + response.text);
        
        var output;
        if(response.type == 'error')
        {
            output = response.text;
            $(".form-feedback h1").html("Error")
            $("#result-content").html(output)
            
            $(".form-feedback").addClass("error");
            $(".form-feedback").removeClass("success");
            
        }else{
            resetFormContent();
            $(".form-feedback h1").html("Thank you!");
            $("#result-content").html("Your message has been sent successfully.");

            $(".form-feedback").addClass("success");
            $(".form-feedback").removeClass("error");
        }
        TweenMax.fromTo($(".form-feedback"), 0.3, {top:-50}, {top:40});
        timerFeedback = setTimeout(hideFormFeedback,5000);
        //$("body").on("click", hideFormFeedback, true);
        $(".form-feedback").on("click", hideFormFeedback);
        $('textarea[name=message]').on("click", hideFormFeedback);
        $('input[name=email]').on("click", hideFormFeedback);
    }
    
    var hideFormFeedback = function(e) {
        console.log("hideFormFeedback !")
        $('textarea[name=message]').off("click", hideFormFeedback);
        $('input[name=email]').off("click", hideFormFeedback);
        
        clearTimeout(timerFeedback);
        TweenMax.to($(".form-feedback"), 0.3,
                       {
                           top:-50,
                           onComplete:function(){
                                $(".form-feedback").removeClass("error");
                                $(".form-feedback").removeClass("success");
                           }
                       })
    }
    
    var submitMessage = function(e) {
            hideFormFeedback();
        
            var user_email      = $('input[name=email]').val();
            var user_message    = $('textarea[name=message]').val();
            var user_subject    = "Message from Turbodrive Contact form [desktop]";

            var proceed = true;
            if(user_email==""){ 
                $('input[name=email]').addClass("field-error");
                $('input[name=email]').on("click", removeErrorClasses);
                proceed = false;
            }
            if(user_message=="") {  
                $('textarea[name=message]').addClass("field-error");
                $('textarea[name=message]').on("click", removeErrorClasses);
                proceed = false;
            }

            if(proceed) 
            {
                //data to be sent to server
                var post_data = {'userEmail':user_email, 'userMessage':user_message, 'userSubject':user_subject};

                //Ajax post data to server
                console.log("proceed >> " + post_data);
                
                $.post('php/contact.php', post_data, sentEmailHandler, 'json');

            }
    }
    
     var removeErrorClasses = function(event) {
        $(this).off("click", removeErrorClasses);
        $(this).removeClass("field-error");
    }
    
    var resetFormContent = function() {
        hideFormFeedback();
        $('input[name=email]').val("");
        $('textarea[name=message]').val("");
        $('input[name=email]').off("click", removeErrorClasses);
        $('input[name=email]').removeClass("field-error");
        $('textarea[name=message]').off("click", removeErrorClasses);
        $('textarea[name=message]').removeClass("field-error");
    }
    
    var scrollToForm = function(event) {
        event.preventDefault();
        var targetScroll = $("#contactform-title").position().top;     
        $(".contactPanel .contact").animate({scrollTop: targetScroll}, 500); 
    }
    
    var cancelForm = function(event) {
        event.preventDefault();
        resetFormContent()        
        
        var targetScroll = $("#contact-title").position().top;     
        $(".contactPanel .contact").animate({scrollTop: targetScroll}, 500); 
    }
    
    
    header.resize = function(){
        var wSc = Math.floor(((LAYOUT.viewportW-20)/8)) - 2 - 10;
        var wBtr = Math.floor(((LAYOUT.viewportW-20)/8)) - 32 - 8;
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
        
        $(".contactPanel").width(vW+150);
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