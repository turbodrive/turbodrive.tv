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


$(document).ready(function() {
    $(".menu-button").on("click", clickMenuButtonHandler);
    $("a").on("click", clickAnchorHandler);
    mainMenu = $(".menu");
    $(document).scroll(updateScroll);
    
    video = $("#video")[0];
    videoContainer = $(".intro-reel");
    mainContent = $(".main-content");
    mainHeader = $(".main-content .header");
    hireMeButton = $(".main-content .header .hire-me");
    warningMobile = $(".warning-mobile");
    bttrButton = $(".bttr-button");
    bttrButton.on("click", function(e){
        e.preventDefault();
        setMode(REEL_MODE);
        closeMenu();
    })
    
    
    playButton = $("#play-pause");        
    playButton.on("click", function(e) {
        video.controls = true;
        video.play();
        playButton.remove();
        warningMobile.hide();
    });
    setMode(REEL_MODE);
    
    window.scrollTo(0,1);
    //$(window).scrollTop(0);
});

var REEL_MODE = "reel mode";
var ABOUT_MODE = "about mode";
var menuIsOpen = false;
var currentMode = "";

var touchMoveHandler = function(e) {
    e.preventDefault();
}

var disableTouchMove = function() {
   document.addEventListener('touchmove', touchMoveHandler, false);
}

var enableTouchMove = function() {
   document.removeEventListener('touchmove', touchMoveHandler);
}

var updateScroll = function(e) {
    var scrollTop = $(document).scrollTop();
    if(scrollTop <= 70){
        mainHeader.removeClass("opaque");
    } else {
        mainHeader.addClass("opaque");
    }
}


var setMode = function (newMode){
    if(newMode == currentMode) return;
    currentMode = newMode;
    $('html, body').scrollTop(0);
    
    if(currentMode == REEL_MODE){        
        disableTouchMove();
        mainContent.animate({right:"-100%"},400);
        mainHeader.animate({right:"-100%"},300);
        hireMeButton.animate({right:"-100%"},200);
        warningMobile.removeClass("small");
    }else {
        enableTouchMove();
        
        mainContent.animate({right:"0%"},300);
        mainHeader.animate({right:"0%"},400);
        hireMeButton.animate({right:"0%"},500);
        warningMobile.addClass("small");
        warningMobile.show();
    }
}

var clickMenuButtonHandler = function(e) {
    if(menuIsOpen){
        // close menu
        closeMenu(); 
        if(menuPausedVideo){
            menuPausedVideo = false;
            video.play();   
        }
    }else {
        // open menu
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
}

var closeMenu = function() {
    mainMenu.animate({right:"-100%"}, 300);
    bttrButton.animate({left:"-100%"},200);
    menuIsOpen = false;
}

var scrollToSection = function(id){
    var targetScroll = $("#"+id).offset().top - 70    
    $('html, body').animate({scrollTop: targetScroll}, 500);
}

var warningOpen = false;

var openWarning = function() {
    warningMobile.animate({"bottom": -0}, 300, function(){
        $(document).on("click", closeWarning)
    });
    videoContainer.animate({"top": -200}, 300);
    
    mainContent.animate({"top":-200},300);
    mainHeader.animate({"top":-200},300);
    hireMeButton.animate({"top":-200},300);

    warningOpen = true;
    
}

var closeWarning = function() {
    $(document).off("click", closeWarning)
    var bottomPanel = currentMode == REEL_MODE ? -200 : -220;
    
    warningMobile.animate({"bottom": bottomPanel}, 300, "swing")
    videoContainer.animate({"top": 0}, 300);
    
    mainContent.animate({"top":0},300);
    mainHeader.animate({"top":0},300);
    hireMeButton.animate({"top":0},300);
    
    warningOpen = false;
}


var clickAnchorHandler = function(e) {    
    e.preventDefault();
    var dataId = $(this).attr("data-id");
    var dataSection = $(this).attr("data-section");
    var href = $(this).attr("href");
    if(dataId == undefined && dataSection == undefined){
        if(href == "#") return;
        window.location.href = href;
        
    }else {
        
        if(dataId == "mobile-info"){
            if(warningOpen){
               closeWarning();    
            }else {
                openWarning();   
            }            
        }else {
            
            if(dataId == "reel"){
                setMode(REEL_MODE);
            } else {
                setMode(ABOUT_MODE);
            }
            closeWarning();
            if(dataSection != undefined){
                scrollToSection(dataSection)
            }            
        }
    } 
    closeMenu();
}