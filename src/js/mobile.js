var mainMenu;
var mainContent;
var mainHeader;
var hireMeButton;
var warningMobile;
var bttrButton;
var video;
var videoContainer;
var playButton;
var menuPausedVideo = false;
var viewportHeight = 0;
var viewportWidth = 0;
var contactPanelIsOpen = false;

var flashUrl = "http://flash.turbodrive.tv/";
var html5Url = "http://www.turbodrive.tv/";
var mobileUrl = "http://m.turbodrive.tv/";
var redirectEnabled = false;
var hWarning = 200;
var isIOS7 = false;


$(document).ready(function() {
    
    Modernizr.addTest('ipad', function () {return !!navigator.userAgent.match(/iPad/i);});
    Modernizr.addTest('iphone', function () {return !!navigator.userAgent.match(/iPhone/i);});
    Modernizr.addTest('ipod', function () {return !!navigator.userAgent.match(/iPod/i);});
    Modernizr.addTest('android', function () {return !!navigator.userAgent.match(/android/i);});
    Modernizr.addTest('ieMobile', function () {return !!navigator.userAgent.match(/IEMobile/i);});
    Modernizr.addTest('ie', function () {return !!navigator.userAgent.match(/MSIE/i);});
    Modernizr.addTest('ie2', function () {return !!navigator.userAgent.match(/Trident/i);});
    Modernizr.addTest('appleios', function () {return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);});
    Modernizr.addTest('mobile', function () {return (Modernizr.appleios || Modernizr.android || Modernizr.ieMobile);});
    
    if(redirectEnabled){
        if(!Modernizr.video || Modernizr.ie || Modernizr.ie2){
            alert("redirect to flash version")
            window.location.href = flashUrl;
        }else{
            if(Modernizr.mobile && screen.height < 1000 && screen.width < 1000){
                alert("no redirect - stay on mobile version - " + screen.height + " - " + screen.width)
            }else {
                alert("redirect to html5 video version - " + screen.height + " - " + screen.width)
                window.location.href = html5Url;
            }
        } 
    }
    
    Modernizr.addTest('ios7', function () {return !!navigator.userAgent.match(/OS 7_\d/i);});
    
    isIOS7 = Modernizr.ios7;
    
    $(".menu-button").on("click", clickMenuButtonHandler);
    $(".lines-button").on("click", clickMenuButtonHandler);
    $("a").on("click", clickAnchorHandler);
    mainMenu = $(".menu");
    $(window).resize(resizeHandler);
    
    video = $("#video")[0];
    video.addEventListener('webkitbeginfullscreen', onVideoBeginsFullScreen, false);
    video.addEventListener('webkitendfullscreen', onVideoEndsFullScreen, false);
        
    
    videoContainer = $(".intro-reel");
    mainContent = $(".main-content");
    mainContent.scroll(updateScroll);
    mainHeader = $(".main-header");
    hireMeButton = $(".main-header .hire-me");
    warningMobile = $(".warning-mobile");
    bttrButton = $(".bttr-button");
    bttrButton.on("click", function(e){
        e.preventDefault();
        setMode(REEL_MODE);
        closeMenu();
    })
    
    $("#submit_btn").on("click", submitMessage);
    $(".email").on("click", clickEmailLinkHandler);
    
    playButton = $("#play-pause");        
    playButton.on("click", function(e) {
        if(menuIsOpen){
            closeMenu();
            return;
        }
        if(warningOpen){
            closeWarning();
            return;
        }
        
        video.controls = true;
        
        if (video.webkitSupportsFullscreen) {
            video.webkitEnterFullscreen();
        }
        
        video.play();
        $(video).css("display", "inline");
        playButton.hide()
        warningMobile.hide();
    });
    
    $(".form-feedback").hide();
    $("#success-validation").on("click", removeFeedback)
    $("#error-validation").on("click", removeFeedback)
    
    setMode(REEL_MODE);   
    
    //disableDocumentScroll();  
    window.scrollTo(0,1);
    resizeHandler()
    //$(window).scrollTop(0);
    
    document.addEventListener("touchmove", touchMoveHandler);
    document.addEventListener("touchstart", touchstartHandler);
    document.addEventListener("touchend", touchendHandler);
    
});

var startx, starty;

var touchMoveHandler = function(event) {
    var t = event.changedTouches[0];        
    var interactTx = t.pageX - startx;
    var interactTy = t.pageY - starty;

    if(Math.abs(interactTx * 3) > Math.abs(interactTy)) {
        event.preventDefault();
    }
    
    
    /** WARNING **/
    if(starty > viewportHeight - 30 && interactTy < 30){
           if(!warningOpen){
                openWarning();
           }
    }
    
    
    if(interactTy > 30 && warningOpen){
        closeWarning();
        return
    }
    
    // open menu when swiped from right side and menu close;
    if(startx > viewportWidth-50 && interactTx < 50){
        if(!contactPanelIsOpen && !menuIsOpen){
            openMenu();
        }
    }
    
    // close main menu when it's touched and open;
    if(targetIsAPartOfMenu && interactTx > 30){
        if(menuIsOpen){
            startx = 6000;
            closeMenu();
            return;
        }        
    }
    
    // back to reel mode when swiped from left side;    
    if(startx < 100 && interactTx > 15){
        if(!contactPanelIsOpen && currentMode == ABOUT_MODE){
                setMode(REEL_MODE, true);
        }
    }
}

var targetTouchStart;
var targetIsAPartOfMenu = false;

var touchstartHandler = function(event) {
    var t = event.changedTouches[0];        
    startx = t.pageX;
    starty = t.pageY;
    
    targetTouchStart = event.target;
    targetIsAPartOfMenu = $.contains(mainMenu[0], targetTouchStart);
}

var touchendHandler = function(e) {
    
}


onVideoBeginsFullScreen = function() {
   // nothing
}

onVideoEndsFullScreen = function() {
    video.pause();
    playButton.show();
    warningMobile.show();
    $(video).css("display", "none");
}

var resizeHandler = function() {
    viewportHeight = window.innerHeight; 
    viewportWidth = window.innerWidth; 
    if(contactPanelIsOpen) {
        updateContactPanel();
    }
    
    mainContent.css("height",viewportHeight);
}

var REEL_MODE = "reel mode";
var ABOUT_MODE = "about mode";
var menuIsOpen = false;
var currentMode = "";

var updateScroll = function(e) {
    var scrollTop = mainContent.scrollTop();
    if(scrollTop <= 70){
        mainHeader.removeClass("opaque");
    } else {
        mainHeader.addClass("opaque");
    }
}


var setMode = function (newMode, boost){
    if(newMode == currentMode) return;
    currentMode = newMode;
    //$('html, body').scrollTop(0);
    
    if(currentMode == REEL_MODE){
        warningMobile.removeClass("small");        
        
        if(boost){
            console.log("boost !")
            mainContent.addClass("boost-transition");
            mainHeader.addClass("boost-transition");
            hireMeButton.addClass("boost-transition");        
            
            mainContent.animate({right:"-100%"},200, function(){
                mainContent.removeClass("boost-transition");
                mainHeader.removeClass("boost-transition");
                hireMeButton.removeClass("boost-transition");
            });
            mainHeader.animate({right:"-100%"},200);
            hireMeButton.animate({right:"-100%"},200);
        }else {        
            mainContent.animate({right:"-100%"},400);
            mainHeader.animate({right:"-100%"},300);
            hireMeButton.animate({right:"-100%"},200);
        }
        
    }else {
        mainContent.animate({right:"0%"},300);
        mainHeader.animate({right:"0%"},400);
        hireMeButton.animate({right:"0%"},500);   
        warningMobile.addClass("small");
        warningMobile.show();
    }
    
    var bottomPanel = currentMode == REEL_MODE ? -hWarning : -hWarning-20;
    warningMobile.animate({"bottom": bottomPanel}, 300, function(){
        warningOpen = false;   
    })
}

var clickMenuButtonHandler = function(e) {
    if(contactPanelIsOpen){
        closeContactPanel();
        if(contact_direct){
            closeMenu();   
        }
        return;
    }
    
    if(menuIsOpen){
        // close menu
        closeMenu(); 
        if(menuPausedVideo){
            menuPausedVideo = false;
            video.play();   
        }
    }else {
       openMenu();
    } 
}

var openMenu = function() {
    if(menuIsOpen) return;
     // open menu
        //mainContent.css("overflow", "hidden");
        //disableDocumentScroll();
        //disableTouchMove();
        if(!video.paused){
            menuPausedVideo = true;
            video.pause();
        }        
        mainMenu.animate({right:"0%"},300);
        if(currentMode == ABOUT_MODE){
            bttrButton.animate({left:"0%"},250);
        }
        menuIsOpen = true;
}

var closeMenu = function() {
    /*if(currentMode == ABOUT_MODE) enableDocumentScroll();*/
    mainMenu.animate({right:"-100%"}, 300, function(){
        menuIsOpen = false;
    });
    bttrButton.animate({left:"-100%"},200);
    
    //enableTouchMove();
    
    //mainContent.css("overflow", "visible");
}

var scrollToSection = function(id){
    var targetScroll = $("#"+id).position().top - 100;
    mainContent.animate({scrollTop: targetScroll}, 500);
}

var warningOpen = false;

var openWarning = function() {
    warningMobile.animate({"bottom": -0}, 300, function(){
        $(document).on("click", closeWarning)
    });
    videoContainer.animate({"top": -hWarning}, 300);
    
    mainContent.animate({"top":-hWarning},300);
    mainHeader.animate({"top":-hWarning},300);
    hireMeButton.animate({"top":-hWarning},300);

    warningOpen = true;
    
}

var closeWarning = function() {
    $(document).off("click", closeWarning)
    var bottomPanel = currentMode == REEL_MODE ? -hWarning : -hWarning-20;
    
    warningMobile.animate({"bottom": bottomPanel}, 300, function(){
        warningOpen = false;   
    })
    videoContainer.animate({"top": 0}, 300);
    
    mainContent.animate({"top":0},300);
    mainHeader.animate({"top":0},300);
    hireMeButton.animate({"top":0},300);
    
    /*warningOpen = false;*/
}

var updateContactPanel = function() {
    $(".contact-panel").css("height",viewportHeight-36);
    if(currentContactSectionId == "share"){
        var targetScroll =  $("#share-section").offset().top - 120; 
        $('.contact-panel').scrollTop(targetScroll);   
    }
}


var currentContactSectionId = "";

var openContactPanel = function (dataId){
    if(!contactPanelIsOpen){
        $(".contact-panel").animate({"height":viewportHeight});
    }
    //disableDocumentScroll();    
    currentContactSectionId = dataId;
    
    if(dataId == "share"){
        var targetScroll =  $("#share-section").offset().top - 120; 
        $('.contact-panel').animate({scrollTop: targetScroll}, 500);
    }else {
        $('.contact-panel').animate({scrollTop: 0}, 500);
    }
    
    contactPanelIsOpen = true;
    $(".lines-button.x").addClass("close");
    
}

var closeContactPanel = function (){
    $(".contact-panel").animate({"height":0});
    contactPanelIsOpen = false;
    $(".lines-button.x").removeClass("close");
    
    /*if(!menuIsOpen && currentMode == ABOUT_MODE){
       enableDocumentScroll();
    }*/
}

var contact_direct = false;

var clickAnchorHandler = function(e) {
    e.preventDefault();
    var dataId = $(this).attr("data-id");
    var dataSection = $(this).attr("data-section");
    var href = $(this).attr("href");

    if(dataId == undefined && dataSection == undefined){
        if(href == "#") return;
        window.location.href = href;
        closeMenu();
    }else {
        
        if(dataId == "email" || dataId == "email-direct" || dataId == "share" || dataId == "hire-me"){
            contact_direct = (dataId == "email-direct" || dataId == "hire-me");
            openMenu();
            openContactPanel(dataId);
        }else{           
        
            if(dataId == "mobile-info"){
                if(warningOpen){
                   closeWarning();    
                }else {
                    openWarning();   
                }            
            } else {                   
                 if(dataId == "reel"){
                     setMode(REEL_MODE, false);
                 } else {
                     setMode(ABOUT_MODE, false);
                 }                
                closeWarning();
                if(dataSection != undefined){
                    scrollToSection(dataSection)
                }            
            }
            closeMenu();
        }
    } 
    
}

var removeFeedback = function(event) {
        $(".feedback-filter").removeClass("open");
        $(".form-feedback").hide();
}

var removeErrorClasses = function(event) {
        $(this).off("click", removeErrorClasses);
        $(this).removeClass("field-error");
    }

var sentEmailHandler = function(response) { 
        //load json data from server and output message
    
        $(".feedback-filter").addClass("open")
    
        var output;
        if(response.type == 'error')
        {
            output = response.text;
            $("#error-content").html(output)
            $(".form-feedback.error").show();
            $(".form-feedback.success").hide();
            
        }else{
            //output = response.text;
            //reset values in all input fields
            $(".form-feedback.error").hide();
            $(".form-feedback.success").show();
        }
}



var submitMessage  = function(e) { 
        //get input field values
    
        removeFeedback("null")
        var user_email      = $('input[name=email]').val();
        var user_message    = $('textarea[name=message]').val();
        var user_subject    = "Message from Turbodrive Contact form - [mobile]";
        
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
            $.post('php/contact.php', post_data, sentEmailHandler, 'json');
            
        }
}

var clickEmailLinkHandler = function() {
    linkTo_UnCryptMailto('nbjmup;jogpAuvscpesjwf/uw');
}

/** JavaScript eMail Encrypter ***/
/* http://jumk.de/nospam/stopspam.html */

var UnCryptMailto = function(s) {
    var n = 0;
    var r = "";
    for( var i = 0; i < s.length; i++){
        n = s.charCodeAt( i );
        if( n >= 8364 ){
            n = 128;
        }
        r += String.fromCharCode( n - 1 );
    }
    return r;
}

var linkTo_UnCryptMailto = function (s){
    window.open(UnCryptMailto(s),'_blank');
    /*location.href=UnCryptMailto( s );*/
}
