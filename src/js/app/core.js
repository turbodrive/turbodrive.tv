/* Turbodrive - Core Module
 * Author : Silvère Maréchal
 */

define(["jquery","TweenMax","Modernizr","crossroads", "hasher", "app/overlay"], function ($,TweenMax, Modernizr, crossroads, hasher, overlay){ 
    var viewportH = 0, viewportW = 0,
    DEFAULT_HASH = "reel/",
    REEL_ENV = "reel", FOLIO_ENV = "folio", currentEnv = "", currentPage = "",
    navigationBar, globalVideoOverlay, startCTATablet, gmdOverlay, gmdAnimation, startWithReel = true,
    MODULES = {}, timelineDiv;
    var touchEventsBinded = false;
    
    var flashUrl = "http://flash.turbodrive.tv/";
    var html5Url = "http://www.turbodrive.tv/";
    var mobileUrl = "http://m.turbodrive.tv/";
    var redirectEnabled = true;
    
    if(CONFIG.debug){
        //DEFAULT_HASH = "folio/ikaf2/";
    }

    var initCore = function() {
        Modernizr.addTest('ipad', function () {return !!navigator.userAgent.match(/iPad/i);});
        Modernizr.addTest('iphone', function () {return !!navigator.userAgent.match(/iPhone/i);});
        Modernizr.addTest('ipod', function () {return !!navigator.userAgent.match(/iPod/i);});
        Modernizr.addTest('android', function () {return !!navigator.userAgent.match(/android/i);});
        Modernizr.addTest('ieMobile', function () {return !!navigator.userAgent.match(/IEMobile/i);});
        Modernizr.addTest('ie', function () {return !!navigator.userAgent.match(/MSIE/i);});
        Modernizr.addTest('ie2', function () {return !!navigator.userAgent.match(/Trident/i);});
        Modernizr.addTest('appleios', function () {return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);});
        Modernizr.addTest('mobile', function () {return (Modernizr.appleios || Modernizr.android || Modernizr.ieMobile);});
        
        Modernizr.addTest('highresdisplay', function(){ 
            if (window.matchMedia) { 
                var mq = window.matchMedia("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
                if(mq && mq.matches) {
                    return true;
                } 
            }
        });
        
        if(redirectEnabled){
            
            if(!Modernizr.video || Modernizr.ie || Modernizr.ie2){
                window.location.href = flashUrl;
            }else{
                if(Modernizr.mobile && screen.height < 1000 && screen.width < 1000){
                    //window.location.href = mobileUrl;
                    console.log("redirect to mobile.")
                }else {
                    //alert("no redirect - stay on html5 version")
                }
            }
        }
        
        
        
        
        Modernizr.addTest('firefox', function () {return (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);});
        Modernizr.addTest('chrome36', function () {
            if(navigator.userAgent.toLowerCase().indexOf('chrome') == -1) return false;            
            return (parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10) > 35);
        });
        Modernizr.addTest('ios7', function () {return !!navigator.userAgent.match(/OS 7_\d/i);});
        
        CONFIG.isRetina = Modernizr.highresdisplay;
        CONFIG.isiOs = Modernizr.appleios;
        CONFIG.isMobile = Modernizr.mobile;
        CONFIG.isFirefox = Modernizr.firefox;
        CONFIG.isChrome36 = Modernizr.chrome36;
                
        crossroads.addRoute('/{env}/{page}/', switchPage);
        crossroads.addRoute('/{env}/{page}/{section}/', switchPageSection);
        
        //loadCss("http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css");
        /*if(CONFIG.debug){
            //console.dir(CONFIG)
            loadCss("http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css");
            require(["jquery_ui"]);
        }*/
        
        /*if(!hasher.getHash()){
            //hasher.setHash(DEFAULT_HASH);
        } */       
              
        
        document.ontouchmove = function(event){
            event.preventDefault();
        }
        
        // overlay
        overlay.on.clickMainOverlay.add(onClickMainOverlay);
        
        $(window).resize(resizeWindowHandler);
        resizeWindowHandler(null);
        
        overlay.loadGmd();
        overlay.on.gmdLoaded.add(startHasher);
        
        
        /** GA Tracking ***/
        $(".buttonShare, .trackSocial").on("click", function(event){
            var network = $(this).attr("data-network");
            var action = $(this).attr("data-action");
            console.log("send SOCIAL track >> " + network + " - " + action)
            ga('send', 'social', network, action, window.location);
        })

        $(".trackEvent").on("click", function(event){
            var eventValues = $(this).attr("data-event").split(",");
            console.log("send EVENT track >> " + eventValues[0] + " - " + eventValues[1] + " - " + eventValues[2]);
            ga('send', 'event', eventValues[0], eventValues[1], eventValues[1]);
        })        
    }
    
    var startHasher = function() {
        overlay.on.gmdLoaded.remove(startHasher);
        
        if(orientationIsLandscape){
            initializedHasher();
        }else{
            orientationCallBack = initializedHasher;
        }
    }
    
    var initializedHasher = function() {
        orientationCallBack = null;
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init(); 
    }
    
    var onClickMainOverlay = function() {
        if(MODULES.header && MODULES.header.isOpen()){
            MODULES.header.close();   
        }else if(MODULES.reel){
            var currentChapter = MODULES.reel.getCurrentChapter();            
            if(currentChapter){
                if(currentChapter.link){
                    window.location.hash = currentChapter.link;
                }else if(CONFIG.debug && currentChapter.debugLink){
                    window.location.hash = currentChapter.debugLink;
                }
            }
        }
    }
    
    var loadCss = function(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
        var lnk = document.getElementsByTagName("link");
        lnk[0].parentNode.insertBefore(lnk[lnk.length-1], lnk[0]);
    }
    
    var parseHash = function(newHash, oldHash){
        console.log("parseHash >> " + newHash)
        if(newHash == "") hasher.setHash(DEFAULT_HASH);
        if(newHash == "reel/") newHash = "reel/preintro/";
        if(newHash == "folio/") hasher.setHash("folio","ikaf2/");
        
       
        
        //if(newHash == "about/") switchPage("about");
        var pageView = "/"+newHash;
        ga('send', 'pageview', {'page': pageView});
        crossroads.parse(newHash);
    }
    
    var switchPageSection = function(env, page, section) {
        console.log("switchPageSection env > " + env + " page > " + page + " section > " + section);
        switchPage(env, page, section);
    }
    
    var switchPage = function(env, page, section){
        
        //if(env == ABOUT_ENV && page == undefined) page = "about"
        console.log("env > " + env + " page > " + page + " section > " + section);
        console.log("currentEnv > " + currentEnv);
        var newEnvIsFolio = (env == FOLIO_ENV);
        
        if(MODULES.header) MODULES.header.close();
        if(currentEnv == env) {
            if (page == currentPage){
                if(!section) return
                loadFolio(page, section)   
            }
            if (newEnvIsFolio) {
                loadFolio(page, section);
            }else {
                console.log("CORE - seekToChapter " + page )
                MODULES.reel.seekToChapter(page, true)
            }
        }else if(currentEnv == ""){
            if (newEnvIsFolio) {
                $("#reel").css("visibility", "hidden");
                overlay.show(overlay.LOADER);
                loadFolio(page, section);
            } else {
                hideFolioContent();
                loadReel(page);
            }
        }else {
            // transition between both of Env
            if (newEnvIsFolio) {
                MODULES.reel.pause();
                overlay.show(overlay.MINI_LOADER,0.6);
                loadFolio(page, section/*, onReadyForTransitionToFolio*/);
                //overlay.disable();
            }else {
                loadReel(page, onReadyForTransitionToReel);
            }
        }
        currentPage = page
        currentEnv = env
    }  
    
    var onReadyForTransitionToReel = function() {
        console.log("onReadyForTransitionToReel")
        MODULES.reel.on.readyToPlayAfterSeek.remove(onReadyForTransitionToReel);
        MODULES.reel.on.transitionComplete.add(onTransitionToReelComplete);
        MODULES.reel.startTransition(false);
        MODULES.reel.resume();
        showHeader(true);
        
    }
    
    var onReadyForTransitionToFolio = function() {
        
        //overlay.disable();
        MODULES.folio.on.readyForIntroTransition.remove(onReadyForTransitionToFolio);
        if(MODULES.reel){
            MODULES.reel.pause();
            MODULES.reel.startTransition(true);
        }
        if(MODULES.header){
            //MODULES.reel.pauseEnv();
            setTimeout(showHeader,8000,false);
        }else {
            setTimeout(showHeader,8000,false, onHeaderInitialized);
        }
    }
    
    var onTransitionToReelComplete = function(){
        MODULES.reel.on.transitionComplete.remove(onTransitionToReelComplete);
        MODULES.folio.kill();
    }
    
    var onHeaderInitialized = function() {
        console.log("header init !" + MODULES.folio.pageIsProject(currentPage))
        MODULES.header.updateState(currentPage, MODULES.folio.pageIsProject(currentPage));
        MODULES.header.on.initialized.remove(onHeaderInitialized);
        if(MODULES.reel) MODULES.reel.sleep();
    }
    
    var hideFolioContent = function() {
        //$("#folioContent").css("visibility", "hidden");
        $("#folioContent").css("display", "none");
    }
        
    /******* FOLIO MODULE *******/
    
    var loadFolio = function(pageId, sectionId, initloadFunc2){
        
        if(!MODULES.folio){
            $("body").addClass("texture-background");
            
            require(["app/folio"], function(folio){
                MODULES.folio = folio;
                MODULES.folio.on.initialized.add(onFolioInitialized);
                if(initloadFunc2){
                    MODULES.folio.on.readyForIntroTransition.add(initloadFunc2)
                }
                MODULES.folio.on.twPositionDefined.add(onTwPositionDefined);
                MODULES.folio.on.creationProgress.add(overlay.updateProgress);
                MODULES.folio.on.creationComplete.add(onCreationComplete);
                //MODULES.header.on.toggleRenderer.add(folio.toggleRenderer);
                MODULES.folio.on.pageCreationComplete.add(onPageCreationComplete);
                MODULES.folio.on.pageLoading.add(onPageLoading);
                MODULES.folio.on.hireMeClicked.add(onHireMeClicked);
                MODULES.folio.init(pageId, sectionId);

            })
        }else{
            if(initloadFunc2){
                MODULES.folio.on.readyForIntroTransition.add(initloadFunc2)
            }
            MODULES.folio.on.pageLoaded.add(onPageLoaded)
            MODULES.folio.load(pageId, sectionId);
        }
    }
    
    var onHireMeClicked = function() {
        MODULES.header.openHireMe()   
    }
    
    var onPageLoading = function() {
        MODULES.folio.on.pageLoading.remove(onPageLoading);
        overlay.show(overlay.MINI_LOADER,0);
    }
    
    var onPageCreationComplete = function() {
        //overlay.loadGmd();
        MODULES.folio.on.pageCreationComplete.remove(onPageCreationComplete);
        overlay.hide(overlay.MINI_LOADER);
    }
    
    var onCreationComplete = function() {
        MODULES.folio.on.creationComplete.remove(onCreationComplete);
        MODULES.folio.on.creationProgress.remove(overlay.updateProgress);
        overlay.disable();
    }
    
    var onFolioInitialized = function(pageId, sectionId){
        // transition between REEL and FOLIO if REEL AND FOLIO are initialized
        console.log("FOLIO onFolioInitialized >> " + pageId);
        MODULES.folio.on.initialized.remove(onFolioInitialized);
        MODULES.folio.on.pageLoaded.add(onPageLoaded);
        /*if(CONFIG.hyperDriveTransition){
            MODULES.folio.on.readyForIntroTransition.add(onHideOverlay);
        }*/
        MODULES.folio.load(pageId, sectionId);
    }
    
    /*var onHideOverlay = function(){
        MODULES.folio.on.readyForIntroTransition.remove(onHideOverlay)
        //overlay.hide();
    }*/
    
    var onTwPositionDefined = function(pageId,sectionId){
        // passer la section ?
        if(MODULES.header) MODULES.header.updateState(pageId, MODULES.folio.pageIsProject(currentPage));
        
        if(sectionId) {
            hasher.setHash("folio",pageId+"/"+sectionId+"/");
        }else {
            hasher.setHash("folio",pageId+"/");
        }
    }
    
    var onPageLoaded = function(pageId, sectionId){
        bindTouchEvents();
        MODULES.folio.on.pageLoaded.remove(onPageLoaded);
        /*console.log("FOLIO onPageLoaded >> " + pageId);
        console.log("MODULES.folio.hasCurrentPage3D() >>" + MODULES.folio.hasCurrentPage3D());*/
        if(MODULES.folio.hasCurrentPage3D()){
            MODULES.folio.startTransition(pageId, sectionId);
        }else{
            MODULES.folio.on.readyForIntroTransition.add(readyForIntroTransitionToFolio);
            MODULES.folio.startIntroTransition(pageId, sectionId);
        }
    }
    
    var readyForIntroTransitionToFolio = function(pageId, sectionId) {
        /*overlay.hide();*/
        console.log("readyForIntroTransitionToFolio - " + pageId + " - " + sectionId);
        MODULES.folio.wakeup(pageId);
        overlay.disable();
        MODULES.folio.startTransition(pageId, sectionId);
        
        if(MODULES.reel){
            MODULES.reel.sleep();
            MODULES.reel.startTransition(true);
        }
        if(MODULES.header){
            //MODULES.reel.pauseEnv();
            setTimeout(showHeader,500,false);
        }else {
            var time = CONFIG.hyperDriveTransition ? 8000 : 500;
            
            setTimeout(showHeader,time,false, onHeaderInitialized);
        }
    }
    
    /******* REEL MODULE *******/
    
    var loadReel = function(chapter, seekFunction){
        overlay.loadGmd();
        unBindTouchEvents();
        
        if(MODULES.header) MODULES.header.updateState("reel", false)
        
        if(!MODULES.reel){
            // show Loader ??
            require(["app/reelPlayer"], function(reelPlayer){
                console.log("reelplayer loaded");
                MODULES.reel = reelPlayer;
                MODULES.reel.on.playStarted.add(onPlayStarted);
                MODULES.reel.on.showHeader.add(onShowHeader);
                MODULES.reel.on.playGmd.add(onPlayGmd);
                MODULES.reel.on.hideGmd.add(onHideGmd);
                MODULES.reel.on.enableOverlayClicks.add(overlay.enableClicks);
                MODULES.reel.on.highlightButtonsHeader.add(onHighLightButtonsHeader);
                MODULES.reel.on.bufferFull.add(overlay.onBufferFull);
                MODULES.reel.on.bufferEmpty.add(overlay.onBufferEmpty);
                MODULES.reel.on.bufferProgress.add(overlay.onBufferProgress);
                MODULES.reel.on.videoComplete.add(onVideoComplete);
                MODULES.reel.on.changeChapter.add(onChangeChapter);
                if(seekFunction){
                    MODULES.reel.on.readyToPlayAfterSeek.add(seekFunction);  
                }
                MODULES.reel.init(chapter);
                if(CONFIG.isMobile){
                    MODULES.reel.on.mobileCTAReady.add(onReelMobileReady);
                }
            })
        }else{
            if(!chapter || !seekFunction){
                throw new Error("no chapter or handlerFunction defined");
            }else {
                MODULES.reel.on.readyToPlayAfterSeek.add(seekFunction);
                console.log(" from folio to reel >> wakeup to chapter " + chapter)
                MODULES.reel.wakeup(chapter);
            }
        }
    } 
    
    var onHighLightButtonsHeader = function(event){
        if(MODULES.header) MODULES.header.highlightButtons();
    }
    
    var onChangeChapter = function(newChapter){
        hasher.setHash("reel",newChapter.id+"/");
    }
    
    var onReelMobileReady = function(){        
        MODULES.reel.on.mobileCTAReady.remove(onReelMobileReady);
        overlay.hide();
    }
    
    var onPlayStarted = function(){        
        MODULES.reel.on.playStarted.remove(onPlayStarted);
        overlay.hide();
    }
    
    var onShowHeader = function() {
        showHeader(true);
    }
    
    var onPlayGmd = function() {
        overlay.show(overlay.GETMOREDETAILS);
    }
    
    var onHideGmd = function(force) {
        overlay.hide(overlay.GETMOREDETAILS, force);
    }
    
    var onVideoComplete = function() {
        hasher.setHash("folio","about/");
    }
    
    /*playReel = function(){
        //MODULES.reel.appendTimelineDiv();
        MODULES.reel.play();
        overlay.hide();
    }*/
    
    /******* HEADER MODULE *******/
    
    var showHeader = function(stealthMode, initFunc){
        if(!MODULES.header){
            require(["app/header"], function(header){
                MODULES.header = header;
                MODULES.header.on.close.add(onCloseHeader)
                if(initFunc) MODULES.header.on.initialized.add(initFunc);
                MODULES.header.on.open.add(onOpenHeader)
                /*if(MODULES.reel)MODULES.header.on.toggleTimeline.add(MODULES.reel.toggleTimeline)*/
                MODULES.header.init();
                MODULES.header.show(stealthMode);
            })
        }else{
            MODULES.header.show(stealthMode);
        }        
    }
    
    var onCloseHeader = function(){
        if(MODULES.reel && MODULES.reel.isActive()) MODULES.reel.resume();
        if(overlay.gmdLoaded()) overlay.resumeGmd();
    }
    
    var onOpenHeader = function(){
        if(MODULES.reel && MODULES.reel.isActive()) MODULES.reel.pause();
        if(overlay.gmdLoaded()) overlay.pauseGmd();
    }
    
    /******* EVENT HANDLERS ******/
    /******* TOUCH EVENTS *******/
    
    var targetTouch;
    var unBindTouchEvents = function(){
        /*var folioDiv = $("#folio")[0];
        if(!folioDiv) return*/
        document.removeEventListener("touchstart", onTouchStart, false );
        document.removeEventListener("touchmove", onTouchMove, false );
        document.removeEventListener("touchend", onTouchEnd, false );
        touchEventsBinded = false
    }   

    var bindTouchEvents = function(){
        if(!touchEventsBinded){
            //var folioDiv = $("#folio")[0];
            document.addEventListener("touchstart", onTouchStart, false );
            document.addEventListener("touchmove", onTouchMove, false );
            document.addEventListener("touchend", onTouchEnd, false );
            touchEventsBinded = true
        }
    }
    
    var processRegularLink = function(element)
    {
        if($(element).is("a")){
            var targetUrl = $(element).attr("href");
            var targetWindow = $(element).attr("target");
            if(targetUrl != "#"){
                if(targetWindow && targetWindow != "_self"){
                    window.open(targetUrl, targetWindow);
                    return true
                }else {
                    if(targetUrl.indexOf("#/") == 0){
                        targetUrl = targetUrl.slice(2)
                        hasher.setHash(targetUrl);
                    }else {
                        window.open(targetUrl, targetWindow);
                    }
                    
                    return true
                }               
            }
        }
        
        
        return false;
        
        // image in anchor
        /*if($(element).is("img")){
            var parent = $(element).parent()
            if(parent.is("a")){
                processRegularAnchor(parent)
            }
        }*/
    }    
    
    var onTouchStart = function(event){
        event.preventDefault();
        targetTouch = event.target
        console.log("onTouchStart - " + event.target)
        
        if(MODULES.folio) MODULES.folio.onTouchStart(event);
        if(MODULES.header) MODULES.header.close();
        
    }
    
    var onTouchMove = function(event){
        event.preventDefault();
        if(MODULES.folio) MODULES.folio.onTouchMove(event);
    }
    
    var onTouchEnd = function(event){
        event.preventDefault();
        var target = event.target;               
        if(MODULES.folio) MODULES.folio.onTouchEnd(event);
        
        if(target == targetTouch){
            console.log("onTouchClick - " + event.target)
            console.dir(event.target)
            if(!processRegularLink(target)){
                // regular link didn't work so, we try modules.
                if(MODULES.header){
                    MODULES.header.onTouchClick(target);
                }
                if(MODULES.folio){
                    MODULES.folio.onTouchClick(target);
                }
            }
        }        
        targetTouch = null
    }   
    
    /******* RESIZE EVENT *******/
    
    var resizeWindowHandler = function(event) {
        readDeviceOrientation();
        
        LAYOUT.viewportH = window.innerHeight;
        LAYOUT.viewportW = window.innerWidth;
        LAYOUT.vH2 = LAYOUT.viewportH*0.5;
        LAYOUT.vW2 = LAYOUT.viewportW*0.5;
        LAYOUT.ratioH = LAYOUT.getRatioH(LAYOUT.viewportH);
        LAYOUT.ratioW = LAYOUT.getRatioW(LAYOUT.viewportW);
        LAYOUT._rX = LAYOUT.initW/LAYOUT.viewportW;
		LAYOUT._rY = LAYOUT.initH/LAYOUT.viewportH;
        
        //console.log("ratioH = " + LAYOUT.ratioH + " ratioW = " + LAYOUT.ratioW);
        //console.log("_rX = " + LAYOUT._rX + " _rY = " + LAYOUT._rY);
        
        var cameraFov = (((LAYOUT.viewportH/LAYOUT.viewportW)*35.130)+20);
        var fovY = cameraFov*Math.PI/180;
        LAYOUT_3D.PX_PERFECT_DISTANCE = -(LAYOUT.viewportH/2) / Math.tan(fovY/2);
        /*console.log("PX_PERFECT_DISTANCE >> " + LAYOUT_3D.PX_PERFECT_DISTANCE)
        console.log("fovY >> " + fovY)*/
        LAYOUT_3D.fovMult001 = (LAYOUT_3D.PX_PERFECT_DISTANCE+526)/-966;
        
        if(MODULES.header) MODULES.header.resize();
        if(MODULES.reel) MODULES.reel.resize();
        if(MODULES.folio) MODULES.folio.resize();
        //msg("viewport: " + viewportW + "x" + viewportH)

        
        // TODO >> A gérer dans le module lui même.
        if (LAYOUT.currentEnv == FOLIO_ENV){
            TweenMax.set($(REEL_ENV), {y: -viewportH-200});        
            //$("#folio").css("top", viewportH / 2)
        }else{
            //$("#folio").css("top", viewportH*1.5)        
            //stage.translate2D(viewportW/2,viewportH*1.5);
        }


        //updateScene3D(); // if needed
        $(REEL_ENV).css('height', viewportH);
    }
    
    var orientationIsLandscape = true;
    var orientationCallBack;
    
    var readDeviceOrientation = function() {
        
        if(!CONFIG.isMobile) return
        
        var isLandscape = ($(window).width() > $(window).height());
        if(orientationIsLandscape && !isLandscape){
            console.log("SHOW ALERT");
            overlay.show(overlay.LANDSCAPE_ALERT);
            
            if(MODULES.reel && MODULES.reel.isActive()){
                MODULES.reel.pause()   
            }
        }else if(!orientationIsLandscape && isLandscape){
            overlay.hide(overlay.LANDSCAPE_ALERT);
            if(orientationCallBack) orientationCallBack();
             if(MODULES.reel && MODULES.reel.isActive()){
                MODULES.reel.resume()   
            }
        }
        orientationIsLandscape = isLandscape;
        console.log("orientationIsLandscape >> " + isLandscape);
        console.log("orientationCallBack >> " + orientationCallBack);
    }
    
    initCore();
});