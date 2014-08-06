/* Turbodrive - Reel Player Module
 * Author : Silvère Maréchal
 */

define(["jquery","TweenMax", "signals"], function ($, TweenMax, signals) {
    var reelPlayer = {};
    var _wP2 = 39;
    var p1, p2, p3;
    var p2X =0, p2Y = 0;
    var p3X = 0;
    var bgTimeline, progTimeline;
    var twObjects = {};
    twObjects.wBg = 0;
    twObjects.p2Rotation = 0;
    twObjects.bgTimelineOpacity = 1;
    twObjects.p1Width = 92.5;
    twObjects.pHeight = 8;
    
    var timelineIsInitialized = false;
    var timelineIsCreated = false;
    var twTmlePanel, twTmleAngle, twAlphaTmleBg, twTmleMenu;
    var timelineEl = $('<div class="timeline"><div id="timelineSvg"><svg xmlns="http://www.w3.org/2000/svg" width="2000" height="100"><g><clipPath id="timelineMask"><rect id="timelineP1" rect x="0" y="60" width="'+twObjects.p1Width+'" height="'+twObjects.pHeight+'"/><rect id="timelineP2" x="88" y="60" width="40" height="'+twObjects.pHeight+'" transform="rotate(-30,235,52)"/><rect id="timelineP3" x="271" y="60" width="500" height="'+twObjects.pHeight+'"/></clipPath></g><g><rect x="0" y="20" id="bgTimeline" clip-path="url(#timelineMask)" fill="#D44848" width="0" height="64" style="fill-opacity:1"/><rect x="0" y="20" id="bgProgress" clip-path="url(#timelineMask)" fill="#DE4B4B" width="0" height="64"/></g></svg></div></div>');
    
    /*<div id="timelineBg"><img id="footerGradient" src="images/gradient_timelineFooter.png"><img id="hexagrid" src="images/hexagrid_lcd.png"></div>*/
    
    var timelineMenu;
    var reelContainer;
    var video;
    var videoInitialized = false;
    var playButton, playButtonContent;
    var userPausedVideo = false;
    var active = false;
    var p3XConstant;
    
    var lastPlayPos    = 0
    var currentPlayPos = 0
    var bufferingFull = false;
    var checkInterval = 150;
    var bufferInterval;
    var bufferMax = 6;
    
    
    // Signal Events
    reelPlayer.on = {
        mobileCTAReady : new signals.Signal(),
        playStarted : new signals.Signal(),
        showHeader : new signals.Signal(),
        playGmd : new signals.Signal(),
        hideGmd : new signals.Signal(),
        enableOverlayClicks : new signals.Signal(),
        readyToPlayAfterSeek : new signals.Signal(),
        highlightButtonsHeader : new signals.Signal(),
        changeChapter : new signals.Signal(),
        videoComplete : new signals.Signal(),
        bufferEmpty : new signals.Signal(),
        bufferFull : new signals.Signal(),
        bufferProgress : new signals.Signal(),
        transitionComplete : new signals.Signal()
    }        

    reelPlayer.init = function (chapter) {
        timelineMenu = $(".timeline-menu");
        
        
        //reelPlayer.on.initialized.dispatch();
        initVideoPlayer(chapter);
    }
    
    reelPlayer.isActive = function(){
        return active;
    }
    
    reelPlayer.resize = function ()
    {
        if(timelineIsCreated){
            updateP3Pos();
            bgTimeline.attr("width",LAYOUT.viewportW)
            $("#footerGradient").attr("width",LAYOUT.viewportW);
            $("#hexagrid").attr("width",LAYOUT.viewportW);            
        }
        
        var paddingRightButtons = 10+(LAYOUT.ratioW*25);
        $(".timeline-menu a").css("padding-right", paddingRightButtons+"px");
        $(".timeline-menu").css("margin-left", (LAYOUT.ratioW*25)+"px");
    }
    
    reelPlayer.getCurrentChapter = function() {
        return currentChapter;
    }
    
    reelPlayer.play = function () {
        video.play();
        bufferInterval = setInterval(checkBuffering, checkInterval)
    }
    
    reelPlayer.resume = function () {
        if(!userPausedVideo) return
        reelPlayer.play();
        userPausedVideo = false;
    }
    
    reelPlayer.pause = function () {
        clearInterval(bufferInterval);
        video.pause();        
        userPausedVideo = true;
    }
    
    // pause the reel and everything related
    reelPlayer.sleep = function() {
        console.log("SLEEP REELPLAYER");
        removeTimeline();
        active = false;
        reelPlayer.pause();
        firedOverlayClickable = false;
    }
    
    reelPlayer.wakeup = function(chapter) {
        console.log("WAKEUP REELPLAYER");
        tmpChapter = chapter;
        active = true;
        video.addEventListener("playing", onPlayingVideo);
        reelPlayer.resume();
        //reelPlayer.seekToChapter(chapter);
    }
    
    reelPlayer.seekToChapter = function(chapterId, autoCloseTimeline) {
        if(currentChapter && chapterId == currentChapter.id) return
        
        for(var i = 0; i<timelineChapters.length ; i++){
            var chapterInfo = timelineChapters[i];
            if(chapterInfo.id == chapterId){
                //video.currentTime = chapterInfo.startAt;
                seekTo(chapterInfo.startAt);
                if(autoCloseTimeline === null) autoCloseTimeline = true;
                if(autoCloseTimeline) closeTimeline();
            }
        }
    }
    
    reelPlayer.startTransition = function(hide) {
        if(hide){
            TweenMax.to(reelContainer,1,{delay:0.1, y:-LAYOUT.viewportH, ease:Power2.easeInOut, onComplete:function(){
            reelContainer.css("visibility", "hidden");
        }})
            
            
        }else{
            reelContainer.css("visibility", "visible");
            TweenMax.fromTo(reelContainer,1,
                {y:-LAYOUT.viewportH},
                {delay:0.1, y:0, ease:Power2.easeInOut,
                    onComplete:function(){
                        reelPlayer.on.transitionComplete.dispatch();
                    }
                }
            );
        }
    }
    
    /******************************/
    /******** VARS & DATA *********/
    /******************************/
    
    var currentChapter;
    var timelineChapters = [
    {
        id: "preInto",
        startAt: 0,
        gmdDuration: 0,
        link:null,
        debugLink:"#/reel/ikaf/"
    }, {
        id: "intro",
        startAt: 12,
        gmdDuration: 2,
        link:"#/reel/tot/"
    }, {
        id: "tot",
        projectIndex: 0,
        startAt: 39,
        link:"#/folio/tot/"
    }, {
        id: "ikaf",
        projectIndex: 1,
        startAt: 55,
        link:"#/folio/ikaf/"
    }, {
        id: "borgia",
        projectIndex: 2,
        startAt: 69,
        link:"#/folio/borgia/"
    }, {
        id: "gs",
        projectIndex: 3,
        startAt: 89,
        link:"#/folio/gs/"
    }, {
        id: "tl",
        projectIndex: 4,
        startAt: 103,
        link:"#/folio/tl/"
    }, {
        id: "greetings",
        projectIndex: 5,
        startAt: 118,
        link:"#/folio/greetings/"
    }, {
        id: "ikaf2",
        projectIndex: 6,
        startAt: 133,
        link:"#/folio/ikaf2/"
    }, {
        id: "outro",
        projectIndex: 7,
        startAt: 164,
        link:"#/folio/about/"
    }, {
        id: "end",
        startAt: 500
    }];
    
    var nbrChapters = timelineChapters.length;
    var timeGmd = [0, 28, 44, 57, 71, 92, 105, 123, 137];
    var currentGmd = 0;
    var timeHeader = 38;
    var timeTimeline2 = 173;
    var gmdIsPlaying = false;
    var timeDetectRange = 2;
    var defaultGmdDuration = 8;
    var cTime = 0;
    var cTimeGmd = -1;
    var globalVideoOverlay;
    var timeOverlayClickable = CONFIG.debug ? timelineChapters[0].startAt : timelineChapters[1].startAt;
    var firedOverlayClickable = false;
    var firedShowHeader = false;
    var tmpChapter;
    
    /******************************/ 
    /************ VIDEO ***********/
    /******************************/
    
    var initVideoPlayer = function(chapter){
        if(videoInitialized){
            console.trace("Error - video allready Initialized");
        }
        
        if(chapter){
            tmpChapter = chapter;
        }else {
            tmpChapter = null;   
        }
        
        
        reelContainer = $("#reel");
        video = $("#video")[0];
        video.muted = CONFIG.debug;
        
        playButton = $("#play-pause");
        playButtonContent = $(".cta-start-text");
        
        playButton.on("click", function() {
          if (video.paused) {
              //video.play();
              reelPlayer.play();
              fadeButtonText();
          } else {
              video.pause();
          }
        });
        
        console.log("init and seek to chapter" + chapter);
        
        video.addEventListener("playing", onPlayingVideo);
        
        if(CONFIG.isMobile){
            console.log(">> IS MOBILE - " + video)
            video.addEventListener("progress", onProgress);
            video.addEventListener("canplaythrough", onCanplaythrough);
            video.addEventListener("loadstart", onLoadStart);
            /*video.addEventListener("canplay", onEvent1);
            video.addEventListener("loadedmetadata", onEvent3);
            video.addEventListener("waiting", onEvent4);
            video.addEventListener("suspend", onEvent5);*/
            
            timeoutReInit = setTimeout(reInitVideoLoop, 1000)
        }else{
            video.addEventListener("canplaythrough", dektopReady);
        }

        video.addEventListener("timeupdate", onTimeUpdate);
        /*video.addEventListener("seeking", onSeeking);*/
        //video.addEventListener("seeked", onSeeked);
        video.addEventListener("waiting", onWaitBuffering);
        video.addEventListener("ended", function() {
            reelPlayer.on.videoComplete.dispatch();
        });
        
        reelPlayer.play();
        videoInitialized = true;
        globalVideoOverlay = $(".video-overlay");
    }
    
    var timeoutReInit = 0;
    var tries = 0;
    var reInitVideoLoop = function() {
        console.log("tryReinit")
        tries++
        
        video.src = "https://vod.infomaniak.com/redirect/silvremarchal_1_vod/infomaniak_encoding-12980/mp4-226/mainediting_008_vhsscratch_prepinfomaniak.mp4?idTry="+tries;
        
        video.load();
        timeoutReInit = setTimeout(reInitVideoLoop, 2500)
    }
    
    var onProgress = function(event) {
        console.log("mobile onProgress")
        mobileReady(event)
    }
    
    var onCanplaythrough = function(event) {
        console.log("mobile onCanplaythrough")
        mobileReady(event)
    }
    
    var onLoadStart = function(event) {
        console.log("mobile onLoadStart")
        mobileReady(event)
    }
    
    var mobileReady = function(event) {
        clearTimeout(timeoutReInit)
        
        console.log("mobileReady !")
        video.pause();
        video.removeEventListener("loadstart", onLoadStart);
        video.removeEventListener("canplaythrough", onCanplaythrough);
        video.removeEventListener("progress", onProgress);
        
        playButton.css("visibility", "visible");
        reelPlayer.on.mobileCTAReady.dispatch();
    }
    
    var onWaitBuffering = function(event) {
        console.log("VIDEO - onWaitBuffering");
        /*video.addEventListener("playing", onBufferFull);*/
        bufferingFull = false;
        reelPlayer.on.bufferEmpty.dispatch();
    }
    
    var onBufferFull = function(event) {
        console.log("VIDEO - onBufferFull");
        /*video.removeEventListener("playing", onBufferFull);
        reelPlayer.on.bufferFull.dispatch();*/
    }
    
    var timeMem = 0;
    var onSeeking = function(event) {
        timeMem = video.currentTime
        console.log("VIDEO onSeeking - " + timeMem + " video.currentTime => " + video.currentTime)
        
        //video.addEventListener("playing", onSeeked);
        video.addEventListener("timeupdate", onSeeked);
        bufferingFull = false;
        reelPlayer.on.bufferEmpty.dispatch();
        
    }
    var onSeeked = function(event) {
        var testSeeked = Math.abs(timeMem - video.currentTime);
        
        console.log("VIDEO onSeeked" + testSeeked + " video.currentTime => " + video.currentTime)
        
        if(testSeeked > 0.01){
            timeMem = 0;
            //video.removeEventListener("playing", onSeeked);
            video.removeEventListener("timeupdate", onSeeked);
            reelPlayer.on.bufferFull.dispatch();
            //video.play();
            console.log("forcePlay")
        }
    }
    
    var onEvent1 = function(event) {
        console.log("mobile canplay");
    }

    var onEvent3 = function(event) {
        console.log("mobile loadedmetadata");
    }
    
    var onEvent4 = function(event) {
        console.log("mobile waiting");
    }
    
    var onEvent5 = function(event) {
        console.log("mobile suspend");
    }
    
    var onPlayingVideo = function(event) {
        video.removeEventListener("playing", onPlayingVideo);
        reelPlayer.on.playStarted.dispatch();
        active = true;
        fadeButton();
        if(tmpChapter){
            console.log("playing >> seek to chapter " + tmpChapter) 
            //video.addEventListener("seeked", onSeekedChapter)
            reelPlayer.seekToChapter(tmpChapter, false)
            reelPlayer.on.readyToPlayAfterSeek.dispatch();
            //video.pause();
        }
    }
    
    var onSeekedChapter = function(event){
        video.removeEventListener("seeked", onSeekedChapter)
        reelPlayer.on.readyToPlayAfterSeek.dispatch();
    }

    var dektopReady = function(event) {
        video.removeEventListener("canplaythrough", dektopReady);
        console.log("canplaythrough Desktop");        
        if(playButton){
            playButton.remove();
            playButton = null;
        }
        //video.play();
    }
    
    var fadeButtonText = function() {
        TweenMax.to(playButtonContent, 0.3, {
            delay:0.2,
            autoAlpha:0
        });
    }
    
    var fadeButton = function() {
        if(!playButton) return;
        TweenMax.to(playButton,0.2, {
            delay:1.3,
            autoAlpha:0,
            onComplete:function(){
                if(!playButton) return;
                playButton.remove();
                playButton = null;
            }
        })
    }
    
    var fireChangeChapter = function() {
        if(currentChapter == timelineChapters[0]) return;
        reelPlayer.on.changeChapter.dispatch(currentChapter);
    }
    
    var updateTimelineChapters = function() {
        var buttons = $(".timeline-menu a");
        for(var i=0; i<buttons.length ;i++){
            if($(buttons[i]).attr("id-chapter") == currentChapter.id){
                $(buttons[i]).addClass("active");    
            }else {
                $(buttons[i]).removeClass("active");   
            }
        }
    }
    
    var countFreeze = 0;
    var maxFreeze = 3
    
    var checkBuffering = function() {
        currentPlayPos = video.currentTime;

        //var offset = 0.150/* / checkInterval*/
        console.log("currentPlayPos = " + currentPlayPos + " - compare to " + (lastPlayPos) + " - video.paused " + video.paused + " - userPausedVideo = " + userPausedVideo);
        
        if (bufferingFull && currentPlayPos == lastPlayPos && !userPausedVideo) {
            countFreeze ++
            console.log("CountFreeze >> " + countFreeze)
            if(countFreeze > maxFreeze){
                reelPlayer.on.bufferEmpty.dispatch();
                bufferingFull = false
            }      
            
            //video.pause();
            //console.log("videoPause for waiting buffering")
        }
        
        var l = video.buffered.length;
        var bufferLength = 0;
        var bufferPrct = 0;
        if(l > 0){
            var index = 0;
            if(l > 1){
                if(currentPlayPos > video.buffered.start(l-1)){
                    index = l-1   
                }else {
                   for(var i = 1; i < l; i++){
                        if(video.buffered.start(i) > currentPlayPos){
                            index = i-1;
                        }
                    }
                }
            }           
            
            var start = video.buffered.start(index);
            var end = video.buffered.end(index);
            bufferLength = (end - cTime)
            //console.log("bufferLength >> " + bufferLength);
            bufferLength = Math.max(bufferLength,0);
            //console.log("buffering >> " + l + " - start "+ start + " - end" + end);
            
            bufferPrct = bufferLength / bufferMax;
            bufferPrct = Math.min(bufferPrct,1);
            reelPlayer.on.bufferProgress.dispatch(bufferPrct);
        
            if(!bufferingFull){
                
                console.log("LOADING - " + l + " / index " + index +" bufferLength >> " + bufferPrct);
                if(bufferLength > bufferMax){
                    //console.log("LOADING - buffer full 5 sec");
                    video.play();
                }
            }else {
                //console.log("bufferLength >> " + bufferPrct);
            }
            
        }
        
        
        
        // if we were buffering but the player has advanced,
        // then there is no buffering
        if (!bufferingFull && currentPlayPos > lastPlayPos && !userPausedVideo) {
            reelPlayer.on.bufferFull.dispatch();
            bufferingFull = true
            countFreeze = 0
        }
        lastPlayPos = currentPlayPos
    }
    
    var onTimeUpdate = function(event) {
        cTime = video.currentTime;
        
        for (var i = nbrChapters-2; i >= 0; i--) {
            var chapter = timelineChapters[i];
            var nextChapter = timelineChapters[i + 1];
            if (cTime >= chapter.startAt && cTime < nextChapter.startAt) {
                if (currentChapter == null || currentChapter.id != chapter.id) {
                    currentChapter = chapter;
                    updateTimelineChapters()
                    fireChangeChapter();
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
            reelPlayer.createTimeline();
        }
        
        if(cTime > timeOverlayClickable && !firedOverlayClickable){
            firedOverlayClickable = true;
            reelPlayer.on.enableOverlayClicks.dispatch();
        }
    
        if (cTime < timeGmd[0] && currentGmd > 0) currentGmd = 0
        if (cTime > timeHeader && !firedShowHeader) {
            firedShowHeader = true;
            reelPlayer.on.showHeader.dispatch();
        }

        if (cTime > timeTimeline2 && cTime < timeTimeline2 + timeDetectRange) {
            showAndHideTimeline();
            reelPlayer.on.highlightButtonsHeader.dispatch();
        }
        
        var widthProgress
        if(timelineIsCreated){
            var ratioProgress = (video.currentTime/video.duration)
            widthProgress = Number(p3XConstant) + ((LAYOUT.viewportW -  Number(p3XConstant))*ratioProgress);
        }else{
            widthProgress = 0
        }
        
        if(progTimeline) progTimeline.attr("width",widthProgress); 
        
        if (gmdDuration > 0) {
            if (cTime > cTimeGmd && cTime < (cTimeGmd + gmdDuration)) {
                playGmd();
            } else {
                hideGmd();
            }
        }
    }
    
    var playGmd = function() {
        if (!gmdIsPlaying) {
            gmdIsPlaying = true;
            reelPlayer.on.playGmd.dispatch();
        }
    }

    var hideGmd = function(force) {
        if (gmdIsPlaying) {
            force = (typeof force !== 'undefined') ? force : false;
            reelPlayer.on.hideGmd.dispatch(force);
            gmdIsPlaying = false;
        }
    }
    
    var seekable = function(time){
        console.log("seekableLength > " + video.seekable.length);
        return (time >= video.seekable.start(0) && time < video.seekable.end(0))
    }
    
    var seekTo = function(time){
        var isSeekable = seekable(time);
        if(isSeekable){
            timeMem = video.currentTime;
            video.currentTime = time;
            onSeeking(null)
        }
    }
    
    /******************************/ 
    /********** TIMELINE **********/
    /******************************/
    
    var mouseOverTimelineHandler = function(e){
        clearTimeout(timeOutCloseTimeline);
        openTimeline(false)
    }
    
    var mouseOutTimelineHandler = function(e){
        clearTimeout(timeOutCloseTimeline);
        closeTimeline()
    }
    
    var mouseDownTimelineHandler = function(event){
        var pageX = event.pageX;
        if(pageX < p3X) {
            // disabled
        }else {
            var scaleTime = (Number(pageX) - Number(p3X))/(Number(LAYOUT.viewportW) - Number(p3X));
            var seektime = scaleTime*video.duration;
            //video.currentTime = seektime
            seekTo(seektime)
        }
    }
    
    var clickTimelineHandler = function(e){
        var ratioSeek = (e.pageX - p3X)/(LAYOUT.viewportW-p3X)
        if(ratioSeek < 0) ratioSeek = 0;
        // seek the video : duration*ratioSeek;
        //console.log("ratio > " + ratioSeek);
        closeTimeline();
    }
    
    reelPlayer.toggleTimeline = function() {
        if(timelineAdded){
            removeTimelineDiv();      
        }else {
            appendTimelineDiv();
        }
    }
    
    var jqueryTimeline;
    var timelineAdded = false;
    
    var appendTimelineDiv = function () {
        if(!timelineAdded){
            console.trace("appendTimelineDiv - " + timelineEl)
            $(document.body).append(timelineEl);
            timelineAdded = true;
        }
    }
    
    var removeTimelineDiv = function () {
        if(timelineAdded){
            timelineEl.remove();
            timelineAdded = false;
        }
    }
    
    reelPlayer.createTimeline = function () {
        if(timelineIsInitialized) return
        appendTimelineDiv();
        $(".timeline").prepend(timelineMenu);
        
        p1 = $("#timelineP1");
        p2 = $("#timelineP2");
        p2X = p2.attr("x");
        p3XConstant = Number(p2X) + (Math.cos(degToRad(-52)) * _wP2);
        p2Y = p2.attr("y");
        p3 = $("#timelineP3");
        bgTimeline = $("#bgTimeline");
        $(".timeline").on("mouseover", mouseOverTimelineHandler);
        $(".timeline").on("mousedown", mouseDownTimelineHandler);
        $(".timeline").on("mouseout", mouseOutTimelineHandler);
        $("#bgTimeline").on("click", clickTimelineHandler);
        
        progTimeline = $("#bgProgress");
        bgTimeline.attr("width",twObjects.wBg);
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
    
        setTimeout(closeTimeline, 2500, true);
        timelineIsInitialized = true;
    }
    
    var timeOutCloseTimeline;
    var showAndHideTimeline = function() {
        if(timeOutCloseTimeline !== null) return;
        openTimeline();
        timeOutCloseTimeline = setTimeout(closeTimeline, 2500);
    }
    
    var openTimeline = function(first) {
        timeOutCloseTimeline = null;
        if(first){
            twObjects.p2Rotation = -52;
            $(".timeline").css("bottom",60);
            updateP3Pos();
        }else{
            if(twTmlePanel) twTmlePanel.pause();
            if(twTmleAngle) twTmleAngle.pause();
            if(twAlphaTmleBg) twAlphaTmleBg.pause();
            if(twTmleMenu) twTmleMenu.pause();
            
            twTmlePanel = TweenMax.to($(".timeline"),0.4,{css:{bottom:0}, ease:Power3.easeInOut});
            twTmleAngle = TweenMax.to(twObjects,0.4,{p2Rotation:-52, p1Width:91, pHeight:5, ease:Power3.easeInOut, onUpdate:updateP3Pos});
            twTmleMenu = TweenMax.to(timelineMenu,0.4, {autoAlpha:1, delay:0.2});
        }
        
        twAlphaTmleBg = TweenMax.to($("#timelineBg"),0.5, {autoAlpha:1});
        reelPlayer.resize();
    }
    
    var closeTimeline = function(first){
        timeOutCloseTimeline = null;
        if(twTmlePanel) twTmlePanel.pause();
        if(twTmleAngle) twTmleAngle.pause();
        if(twAlphaTmleBg) twAlphaTmleBg.pause();
        if(twTmleMenu) twTmleMenu.pause();
        var duration = first ? 0.7 : 0.5;
        var easeFunc = first ? Power2.easeInOut : Power3.easeOut;
        
        twTmlePanel = TweenMax.to($(".timeline"),duration,{delay:0.2, css:{bottom:-32}, ease:easeFunc});
        twTmleAngle = TweenMax.to(twObjects,duration,{delay:0.2, p2Rotation:0, p1Width:92.5, pHeight:8, ease:easeFunc, onUpdate:updateP3Pos});
        
        twAlphaTmleBg = TweenMax.to($("#timelineBg"),duration, {delay:0.2, autoAlpha:0});
        twTmleMenu = TweenMax.to(timelineMenu,duration, {autoAlpha:0})
        
        TweenMax.to(twObjects,2, {delay:3,bgTimelineOpacity:0.25,
            onUpdate:function(){
                $("#bgTimeline").css("fill-opacity",twObjects.bgTimelineOpacity)
            }
        });
    }
    
    var removeTimeline = function(){
        clearTimeout(timeOutCloseTimeline)
        $(".timeline").remove();
    }
        
    var updateP3Pos = function () {
        // adaptation depuis la version actionscript;
        //if(!timelineIsInitialized) return
        var rX = parseInt(p2X)+1;
        var rY = parseInt(p2Y)+2;
        if(!p2) return;
        
        p2.attr("transform","rotate("+twObjects.p2Rotation+","+rX+","+rY+")");
        p3X = Number(p2X) + (Math.cos(degToRad(twObjects.p2Rotation)) * _wP2);
        p3.attr("x",p3X);
        p3.attr("y",parseInt(Number(p2Y) + (Math.sin(degToRad(twObjects.p2Rotation)) * _wP2)));
        p3.attr("width", Number(LAYOUT.viewportW) - Number(p3X));
        
        p1.attr("height", twObjects.pHeight);
        p1.attr("width", twObjects.p1Width);
        p2.attr("height", twObjects.pHeight);
        p3.attr("height", twObjects.pHeight);
    }

    var degToRad = function(angle) {
        return angle * (Math.PI / 180)
    }

    return reelPlayer;
});