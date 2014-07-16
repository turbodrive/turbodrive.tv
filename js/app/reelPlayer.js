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
    var ytReelPlayer;
    var videoInitialized = false;

    // Signal Events
    reelPlayer.on = {
        initialized : new signals.Signal(),
        readyToPlay : new signals.Signal(),
        playStarted : new signals.Signal()
    }        

    reelPlayer.init = function (timelineDiv) {
        timelineEl = timelineDiv
        loadYTPlayer();
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
       if(ytReelPlayer) ytReelPlayer.playVideo();
    }
    
    /******************************/ 
    /********** TIMELINE **********/
    /******************************/
    
    var loadYTPlayer = function()
    {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }


    GLOBAL_ACCESS.onYouTubeIframeAPIReady = function () {
        console.log("youtubeAPIReady")
        //startCheckPlayHead();
        
        ytReelPlayer = new YT.Player('ytPlayer', {
            width: '100%',
            height: '100%',
            videoId: '0n_m_LJQ6zo',
            playerVars: {
                playsinline: 0,
                html5: 1,
                showinfo: 0,
                controls: 0,
                enablejsapi: 1,
                modestbranding: 1,
                autoplay:1,
                hd: 1
            },
            events: {
              'onReady': onYTPlayerReady
            }
        });
    }
    
    var onYTPlayerReady = function(event) {
        console.log("onPlayerReady >> CONFIG.isMobile = " + CONFIG.isMobile)
        ytReelPlayer.addEventListener('onStateChange', onPlayerStateChange)
        ytReelPlayer.removeEventListener('onReady', onYTPlayerReady)
        
        
        
        if(CONFIG.isMobile){
            ytReelPlayer.pauseVideo();
            reelPlayer.on.readyToPlay.dispatch();
        }else{
            //ytReelPlayer.playVideo();
        }
        
        reelPlayer.resize();
        reelPlayer.on.initialized.dispatch();
        // ready to receive interaction
    }
    
    var onPlayerStateChange = function(event){
        console.log("2. onPlayerStateChange >> " + event.data);
        switch (event.data) { // idCode = event.data
            case -1:
                //enableClickVideoOverlay();
                TweenMax.to($('#startExperience'),0.3, {autoAlpha:0});
                break;
            case 1:
                //enableClickVideoOverlay();
                setTimeout(initVideo, 1200);
                break;
            case 2:
                console.log("gotoAbout ?")
                break;
        }
    }
    
    var initVideo = function() {
        console.log("initVideo")
        
        ytReelPlayer.setVolume(CONFIG.volumeReel);
        reelPlayer.on.playStarted.dispatch();
        //if(videoInitialized) return
        
        //removeCTATablet();
        //startCheckPlayHead();

        // in case of FlashPlayer used instead of HTML5 in the frame
        // allow the overlays
        $('iframe[src^="//www.youtube.com/embed"').each(function(){
            var url = $(this).attr("src");
            var separator = (url.indexOf('?') > 0) ? '&' : '?';
            $(this).attr('src', url + separator + 'wmode=opaque');
        });
        videoInitialized = true
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