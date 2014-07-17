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
    
    var timelineIsInitialized = false;
    var timelineIsCreated = false;
    var twTmlePanel, twTmleAngle, twAlphaTmleBg;
    var timelineEl;
    
    var video;
    var videoInitialized = false;
    var playButton;
    
    // Signal Events
    reelPlayer.on = {
        mobileCTAReady : new signals.Signal(),
        playStarted : new signals.Signal(),
        showHeader : new signals.Signal(),
        showGmd : new signals.Signal(),
        hideGmd : new signals.Signal(),
        videoComplete : new signals.Signal()
    }        

    reelPlayer.init = function (timelineDiv) {
        timelineEl = timelineDiv
        //reelPlayer.on.initialized.dispatch();
        //createTimeline();
        initVideoPlayer();
    }
    
    reelPlayer.resize = function ()
    {
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
    /******** VARS & DATA *********/
    /******************************/
    
    var currentChapter;
    var timelineChapters = [
    {
        id: "preInto",
        startAt: 0,
        gmdDuration: 0
    }, {
        id: "intro",
        startAt: 12,
        gmdDuration: 2
    }, {
        id: "tot",
        projectIndex: 0,
        startAt: 39
    }, {
        id: "ikaf",
        projectIndex: 1,
        startAt: 55
    }, {
        id: "borgia",
        projectIndex: 2,
        startAt: 69
    }, {
        id: "gs",
        projectIndex: 3,
        startAt: 89
    }, {
        id: "tl",
        projectIndex: 4,
        startAt: 103
    }, {
        id: "greetings",
        projectIndex: 5,
        startAt: 118
    }, {
        id: "ikaf2",
        projectIndex: 6,
        startAt: 133
    }, {
        id: "outro",
        projectIndex: 7,
        startAt: 164
    }, {
        id: "end",
        startAt: 500
    }];
    
    var nbrChapters = timelineChapters.length;
    var timeGmd = [0, 28, 44, 57, 71, 92, 105, 123, 137];
    var currentGmd = 0;
    var timeHeader = 5; //38
    var timeTimeline = 32;
    var timeTimeline2 = 173;
    var gmdShown = false;
    var timeDetectRange = 2;
    var defaultGmdDuration = 8;
    var cTime = 0;
    var cTimeGmd = -1;
    
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
            console.log("loadstart");
        });
        
        video.addEventListener("durationchange", function() {
            console.log("durationchange");
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
            console.log("loadstart");
        });
        
        /*video.addEventListener("progress", function() {
            console.log("progress")
        });*/
        
        video.addEventListener("canplaythrough", function() {
            console.log("canplaythrough")
        });
        
        video.addEventListener("ended", function() {
            // gotoAbout
            reelPlayer.on.videoComplete.dispatch();
        });
        
        video.addEventListener("timeupdate", onTimeUpdate);
        
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
        reelPlayer.on.mobileCTAReady.dispatch();
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
                if(!playButton) return;
                playButton.remove();
                playButton = null;
            }
        })
    }
    
    var onTimeUpdate = function(event) {
        
        cTime = video.currentTime;
        
        for (var i = nbrChapters-2; i >= 0; i--) {
            var chapter = timelineChapters[i];
            var nextChapter = timelineChapters[i + 1];
            if (cTime >= chapter.startAt && cTime < nextChapter.startAt) {
                if (currentChapter == null || currentChapter.id != chapter.id) {
                    currentChapter = chapter;
                    console.log("currentChapter > " + currentChapter.id)
                    if (i > 0) {
                        cTimeGmd = timeGmd[i];
                    }
                    if (typeof chapter.gmdDuration !== 'undefined') {
                        gmdDuration = chapter.gmdDuration;
                    } else {
                        gmdDuration = defaultGmdDuration;
                    }
                }
                break;
            }
        }
        
        if(cTime > 31) {
            createTimeline();
        }

        /*if(currentChapter.id == timelineChapters[0].id){
            globalVideoOverlay.css("cursor", "auto");   
        }else{
            globalVideoOverlay.css("cursor", "pointer");
        }*/

        if (cTime < timeGmd[0] && currentGmd > 0) currentGmd = 0
        if (cTime > timeHeader && cTime < timeHeader + timeDetectRange) {
            reelPlayer.on.showHeader.dispatch();
        }
        
        /*if (cTime > timeTimeline && cTime < timeTimeline + timeDetectRange) {
            //showAndHideTimeline();
        }

        if (cTime > timeTimeline2 && cTime < timeTimeline2 + timeDetectRange) {
            //showAndHideTimeline();
        }*/

        if (gmdDuration > 0) {
            if (cTime > cTimeGmd && cTime < (cTimeGmd + gmdDuration)) {
                playGmd();
            } else {
                hideGmd();
            }
        }
    }
    
    function playGmd() {
        if (!gmdShown) {
            gmdShown = true;
            reelPlayer.on.showGmd.dispatch();
        }
    }

    function hideGmd(force) {
        if (gmdShown) {
            force = (typeof force !== 'undefined') ? force : false;
            reelPlayer.on.hideGmd.dispatch(force);
            gmdShown = false;
        }
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
        if(timelineIsInitialized) return
        appendTimelineDiv();
        
        p2 = $("#timelineP2");
        p2X = p2.attr("x");
        p2Y = p2.attr("y");
        p3 = $("#timelineP3");
        bgTimeline = $("#bgTimeline");
        $(".timeline").on("mouseover", mouseOverTimelineHandler);
        $(".timeline").on("mouseout", mouseOutTimelineHandler);
        $("#bgTimeline").on("click", clickTimelineHandler);
        
        progTimeline = $("#bgProgress");
        bgTimeline.attr("width",twObjects.wBg)
        progTimeline.attr("width",0);        
        openTimeline(true);
        TweenMax.to(twObjects,1,{delay:1, wBg:LAYOUT.viewportW, ease:Linear.easeNone,
            onUpdate:function(){
                bgTimeline.attr("width",twObjects.wBg);
            },
            onComplete:function(){
                timelineIsCreated = true;
            }
        });        
        
        setTimeout(closeTimeline, 2500)
        timelineIsInitialized = true;
    }
    
    var openTimeline = function(first) {        
        if(first){
            twObjects.p2Rotation = -52;
            $(".timeline").css("bottom",0);
            updateP3Pos();
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