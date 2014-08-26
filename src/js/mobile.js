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
var contactPanelIsOpen = false;


$(document).ready(function() {
    $(".menu-button").on("click", clickMenuButtonHandler);
    $("a").on("click", clickAnchorHandler);
    mainMenu = $(".menu");
    $(document).scroll(updateScroll);
    $(window).resize(resizeHandler);
    
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
    
    $("#submit_btn").on("click", submitMessage);    
    
    playButton = $("#play-pause");        
    playButton.on("click", function(e) {
        video.controls = true;
        video.play();
        playButton.remove();
        warningMobile.hide();
    });
    
    $(".form-feedback").hide();
    $("#success-validation").on("click", removeFeedback)
    $("#error-validation").on("click", removeFeedback)
    
    setMode(REEL_MODE);
    
    disableDocumentScroll();  
    window.scrollTo(0,1);
    resizeHandler()
    //$(window).scrollTop(0);
});


var xStart, yStart = 0;
 
document.addEventListener('touchstart',function(e) {
    xStart = e.touches[0].screenX;
    yStart = e.touches[0].screenY;
});
 
document.addEventListener('touchmove',function(e) {
    var xMovement = Math.abs(e.touches[0].screenX - xStart);
    var yMovement = Math.abs(e.touches[0].screenY - yStart);
    if((xMovement * 3) > yMovement) {
        e.preventDefault();
    }
});

var resizeHandler = function() {
    viewportHeight = window.innerHeight;
    
    if(contactPanelIsOpen) {
        updateContactPanel();
    }
}

var REEL_MODE = "reel mode";
var ABOUT_MODE = "about mode";
var menuIsOpen = false;
var currentMode = "";

var touchMoveHandler = function(e) {
    e.preventDefault();
}

var disableTouchMove = function() {
    document.addEventListener('touchmove', touchMoveHandler, true);
    disableDocumentScroll();
}

var enableTouchMove = function() {
    document.removeEventListener('touchmove', touchMoveHandler);
    enableDocumentScroll();
}

var disableDocumentScroll = function() {
   $("html").addClass("lock-scroll")
}

var enableDocumentScroll = function() {
   $("html").removeClass("lock-scroll")
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
    if(contactPanelIsOpen){
        closeContactPanel();
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
        // open menu
        
        disableDocumentScroll();
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
    if(currentMode == ABOUT_MODE) enableDocumentScroll();
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

var updateContactPanel = function() {
    $(".contact-panel").css("height",viewportHeight);
    if(currentContactSectionId == "share"){
        var targetScroll =  $("#share-section").offset().top - 70; 
        $('.contact-panel').scrollTop(targetScroll);   
    }
}


var currentContactSectionId = "";

var openContactPanel = function (dataId){
    if(!contactPanelIsOpen){
        $(".contact-panel").animate({"height":viewportHeight});
    }
    disableDocumentScroll();    
    currentContactSectionId = dataId;
    
    if(dataId == "share"){
        var targetScroll =  $("#share-section").offset().top - 70; 
        $('.contact-panel').animate({scrollTop: targetScroll}, 500);
    }else {
        $('.contact-panel').animate({scrollTop: 0}, 500);
    }
    
    contactPanelIsOpen = true;
    
}

var closeContactPanel = function (){
    $(".contact-panel").animate({"height":0});
    contactPanelIsOpen = false;
    
    if(!menuIsOpen && currentMode == ABOUT_MODE){
       enableDocumentScroll();
    }
}

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
        
        if(dataId == "email" || dataId == "share" || dataId == "hire-me"){
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
                     setMode(REEL_MODE);
                 } else {
                     setMode(ABOUT_MODE);
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

var removeFeedback = function(event) {
        $(".feedback-filter").removeClass("open");
        $(".form-feedback").hide();
}

var removeErrorClasses = function(event) {
        $(this).off("click", removeErrorClasses);
        $(this).removeClass("field-error");
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
    location.href=UnCryptMailto( s );
}
