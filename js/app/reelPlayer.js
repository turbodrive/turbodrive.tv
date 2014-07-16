/* Turbodrive - Reel Player Module
 * Author : Silvère Maréchal
 */

define(["jquery","TweenMax", "signals"], function ($, TweenMax, signals) {
    var reelPlayer = {};
    var _wP2 = 39;
    var p2, p3;
    var p2X =0, p2Y = 0;
    var p3X = 0;
    var bgTimeline, progTimeline;
    var twObjects = {};
    twObjects.wBg = 0
    twObjects.p2Rotation = 0
    var timelineIsCreated = false;
    var twTmlePanel, twTmleAngle, twAlphaTmleBg;
    var timelineEl;
    //
    var video;
    var videoInitialized = false;
    var playButton;

    // Signal Events
    reelPlayer.on = {
        initialized : new signals.Signal(),
        readyToPlay : new signals.Signal(),
        playStarted : new signals.Signal()
    }        

    reelPlayer.init = function (timelineDiv) {
        timelineEl = timelineDiv
        initVideoPlayer();
        //createTimeline();
    }
    
    reelPlayer.resize = function () {
        
        if(timelineIsCreated){
            updateP3Pos();
            bgTimeline.attr("width",LAYOUT.viewportW)
            $("#footerGradient").attr("width",LAYOUT.viewportW);
            $("#hexagrid").attr("width",LAYOUT.viewportW);
        }
    }
    
    reelPlayer.play = function () {
       video.play();
    }
    
    /******************************/ 
    /************ VIDEO ***********/
    /******************************/
    
    var autoPlay = true;
    var initVideoPlayer = function(){
        video = $("#video")[0];
        video.muted = true;
        
        playButton = $("#play-pause");
        
        
        playButton.on("click", function() {
          if (video.paused) {
              video.play();
              fadeButtonText();
          } else {
              video.pause();
          }
        });
        
        
        video.addEventListener("playing", function() {
            reelPlayer.on.playStarted.dispatch();
            fadeButton();
        });
        
        video.addEventListener("loadstart", function() {
            console.log("loadstart")
        });
        
        video.addEventListener("durationchange", function() {
            console.log("durationchange")
        });
        
        if(CONFIG.isMobile){
            video.addEventListener("progress", mobileReady);
            video.addEventListener("canplaythrough", mobileReady);
        }else{
            video.addEventListener("canplaythrough", function() {
                console.log("canplaythrough Desktop");
                playButton.remove();
                playButton = null;
                video.play();
            });
        }
        
        video.addEventListener("loadstart", function() {
            console.log("loadstart")
        });
        
        video.addEventListener("progress", function() {
            console.log("progress")
        });
        
        video.addEventListener("canplaythrough", function() {
            console.log("canplaythrough")
        });
        
        videoInitialized = true;
        console.log(" >> videoInitialized");
        video.play();
    }
    
    var mobileReady = function(event) {
        autoPlay = false;
        video.removeEventListener("progress", mobileReady);
        video.removeEventListener("canplaythrough", mobileReady);
        console.log("progress - Mobile");
        playButton.css("visibility", "visible");
        reelPlayer.on.initialized.dispatch();
    }
    
    var fadeButtonText = function() {
        TweenMax.to(playButton, 0.3, {
            textShadow:"1px 1px 1px rgba(255, 255, 255, 0)",
            color:"rgba(255,255,255,0)"});
    }
    
    var fadeButton = function() {
        if(!playButton) return;
        TweenMax.to(playButton,0.2, {
            delay:1.3,
            opacity:0,
            onComplete:function(){
                playButton.remove();
                playButton = null;
            }
        })
    }
    
    /******************************/ 
    /********** TIMELINE **********/
    /******************************/
    
    var mouseOverTimelineHandler = function(e){
        openTimeline(false)
    }
    
    var mouseOutTimelineHandler = function(e){
        closeTimeline()
    }
    
    var clickTimelineHandler = function(e){
        var ratioSeek = (e.pageX - p3X)/(LAYOUT.viewportW-p3X)
        if(ratioSeek < 0) ratioSeek = 0;
        // seek the video : duration*ratioSeek;
        console.log("ratio > " + ratioSeek);
    }
    
    var appendTimelineDiv = function () {
        if(! $.contains(document.body, timelineEl)){
            $(document.body).append(timelineEl);
        }
    }
    
    var createTimeline = function () {
        appendTimelineDiv();
        
        p2 = $("#timelineP2");
        p2X = p2.attr("x");
        p2Y = p2.attr("y");
        p3 = $("#timelineP3");
        bgTimeline = $("#bgTimeline");
        $(".timeline").on("mouseover", mouseOverTimelineHandler)
        $(".timeline").on("mouseout", mouseOutTimelineHandler)
        $("#bgTimeline").on("click", clickTimelineHandler)
        
        progTimeline = $("#bgProgress");
        bgTimeline.attr("width",twObjects.wBg)
        progTimeline.attr("width",0)  
        
        openTimeline(true)
        TweenMax.to(twObjects,1,{delay:1, wBg:LAYOUT.viewportW, ease:Linear.easeNone,
            onUpdate:function(){
                bgTimeline.attr("width",twObjects.wBg);
            },
            onComplete:function(){
                timelineIsCreated = true;
            }
        });        
        
        setTimeout(closeTimeline, 2500) 
    }
    
    var openTimeline = function(first) {        
        if(first){
            twObjects.p2Rotation = -52
            $(".timeline").css("bottom",0)
        }else{
            if(twTmlePanel) twTmlePanel.pause();
            if(twTmleAngle) twTmleAngle.pause();
            if(twAlphaTmleBg) twAlphaTmleBg.pause();
            
            twTmlePanel = TweenMax.to($(".timeline"),0.3,{css:{bottom:0}, ease:Quart.EaseOut});
            twTmleAngle = TweenMax.to(twObjects,0.3,{p2Rotation:-52, ease:Quart.EaseOut, onUpdate:updateP3Pos});
        }        
        twAlphaTmleBg = TweenMax.to($("#timelineBg"),0.5, {autoAlpha:1});
    }
    
    var closeTimeline = function(){
        if(twTmlePanel) twTmlePanel.pause();
        if(twTmleAngle) twTmleAngle.pause();
        if(twAlphaTmleBg) twAlphaTmleBg.pause();
        
        twTmlePanel = TweenMax.to($(".timeline"),0.5,{delay:0.2, css:{bottom:-35}, ease:Quart.EaseOut});
        twTmleAngle = TweenMax.to(twObjects,0.5,{delay:0.2, p2Rotation:0, ease:Quart.EaseOut, onUpdate:updateP3Pos});
        
        twAlphaTmleBg = TweenMax.to($("#timelineBg"),0.5, {delay:0.2, autoAlpha:0});
        
    }

    var updateP3Pos = function () {
        // adaptation depuis la version actionscript;
        var rX = parseInt(p2X)+1;
        var rY = parseInt(p2Y)+2;
        p2.attr("transform","rotate("+twObjects.p2Rotation+","+rX+","+rY+")");
        p3X = Number(p2X) + (Math.cos(degToRad(twObjects.p2Rotation)) * _wP2);
        p3.attr("x",p3X);
        p3.attr("y",parseInt(Number(p2Y) + (Math.sin(degToRad(twObjects.p2Rotation)) * _wP2)));
        p3.attr("width", Number(LAYOUT.viewportW) - Number(p3X));
    }

    var degToRad = function(angle) {
        return angle * (Math.PI / 180)
    }

    return reelPlayer;
});