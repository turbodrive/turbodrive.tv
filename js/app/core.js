/* Turbodrive - Core Module
 * Author : Silvère Maréchal
 */

define(["jquery","TweenMax","modernizr","crossroads", "hasher", "app/overlay"], function ($,TweenMax, Modernizr, crossroads, hasher, overlay){ 
    var viewportH = 0, viewportW = 0,
    DEFAULT_HASH = "reel/",
    REEL_ENV = "reel", FOLIO_ENV = "folio", currentEnv = "", currentPage = "",
    navigationBar, globalVideoOverlay, startCTATablet, gmdOverlay, gmdAnimation, startWithReel = true,
    MODULES = {}, timelineDiv;
    var touchEventsBinded = false;
    
    if(CONFIG.debug){
        volumeReel = 0;
        DEFAULT_HASH = "reel/";
    }

    initCore = function() {
        Modernizr.addTest('highresdisplay', function(){ 
            if (window.matchMedia) { 
                var mq = window.matchMedia("only screen and (-moz-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
                if(mq && mq.matches) {
                    return true;
                } 
            }
        });
    
        Modernizr.addTest('ipad', function () {return !!navigator.userAgent.match(/iPad/i);});
        Modernizr.addTest('iphone', function () {return !!navigator.userAgent.match(/iPhone/i);});
        Modernizr.addTest('ipod', function () {return !!navigator.userAgent.match(/iPod/i);});
        Modernizr.addTest('android', function () {return !!navigator.userAgent.match(/android/i);});
        Modernizr.addTest('appleios', function () {return (Modernizr.ipad || Modernizr.ipod || Modernizr.iphone);});
        Modernizr.addTest('mobile', function () {return (Modernizr.appleios || Modernizr.android);});
        Modernizr.addTest('firefox', function () {return (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);});

        CONFIG.isRetina = Modernizr.highresdisplay;
        CONFIG.isiOs = Modernizr.appleios;
        CONFIG.isMobile = Modernizr.mobile;
        CONFIG.isFirefox = Modernizr.firefox;
        
        crossroads.addRoute('/{env}/{page}/', switchPage);
        crossroads.addRoute('/{env}/{page}/{section}/', switchPageSection);
        
        //loadCss("http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css");
        if(CONFIG.debug){
            //console.dir(CONFIG)
            loadCss("http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css");
            require(["jquery_ui"]);
        }
        
        /*if(!hasher.getHash()){
            //hasher.setHash(DEFAULT_HASH);
        } */       
        hasher.initialized.add(parseHash);
        hasher.changed.add(parseHash);
        hasher.init();        
        
        document.ontouchmove = function(event){
            event.preventDefault();
        }
        
        $(window).resize(resizeWindowHandler);
        resizeWindowHandler(null);
        
        // overlay
        overlay.on.clickMainOverlay.add(onClickMainOverlay);
    }
    
    var onClickMainOverlay = function() {
        if(MODULES.reel){
            var currentChapter = MODULES.reel.getCurrentChapter();
            if(currentChapter && currentChapter.link){
                window.location.hash = currentChapter.link;
            }
        }
    }
    
    loadCss = function(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
        var lnk = document.getElementsByTagName("link");
        lnk[0].parentNode.insertBefore(lnk[lnk.length-1], lnk[0]);
    }
    
    parseHash = function(newHash, oldHash){
        console.log("parseHash >> " + newHash)
        if(newHash == "") hasher.setHash(DEFAULT_HASH);
        if(newHash == "reel/") newHash = "reel/preintro/";
        if(newHash == "folio/") hasher.setHash("folio","ikaf2/");
        //if(newHash == "about/") switchPage("about");
        crossroads.parse(newHash);
    }
    
    switchPageSection = function(env, page, section) {
        console.log("switchPageSection env > " + env + " page > " + page + " section > " + section);
        switchPage(env, page, section);
    }
    
    switchPage = function(env, page, section){
        
        //if(env == ABOUT_ENV && page == undefined) page = "about"
        console.log("env > " + env + " page > " + page + " section > " + section);
        
        var isFolio = (env == FOLIO_ENV);
        
        if(MODULES.header) MODULES.header.close();
        if(currentEnv == env) {
            if (page == currentPage){
                if(!section) return
                loadFolio(page, section)   
            }
            if (isFolio) {
                // switch3D ?
                loadFolio(page, section);
            }else {
                console.log("seek TO >> " + page)
                MODULES.reel.seekToChapter(page)
            }
        }else if(currentEnv == ""){
            if (isFolio) {
                showHeader();
                loadFolio(page, section);
            } else {
                hideFolioContent();
                loadReel();
            }
        }else {
            // transition between both Env
            if (isFolio) {
                /*showHeader();
                loadFolio(page, section);*/
                // From Reel to Folio
            }else {
                // From Folio to Reel
            }
            
        }
        currentPage = page
        currentEnv = env
    }  
    
    hideFolioContent = function() {
        $("#folioContent").css("visibility", "hidden");
    }
        
    /******* FOLIO MODULE *******/
    
    gatherTimeline = function() {
        if(!timelineDiv){
            timelineDiv = $(".timeline");
            timelineDiv.remove();
        }
        return timelineDiv
    }
    
    loadFolio = function(pageId, sectionId){
        gatherTimeline();
        bindTouchEvents();
        
        if(!MODULES.folio){
            // show Loader ??
            overlay.show(overlay.LOADER, false);
            require(["app/folio"], function(folio){
                //console.log("folio loaded");
                MODULES.folio = folio;
                MODULES.folio.on.initialized.add(onFolioInitialized);
                MODULES.folio.on.twPositionDefined.add(onTwPositionDefined);
                MODULES.folio.init(pageId, sectionId);
            })
        }else{
            MODULES.folio.on.pageLoaded.add(onPageLoaded)
            MODULES.folio.load(pageId, sectionId);
        }
    }
    
    onFolioInitialized = function(pageId, sectionId){
        // transition between REEL and FOLIO if REEL AND FOLIO are initialized
        //console.log("FOLIO onFolioInitialized >> " + pageId);
        MODULES.folio.on.initialized.remove(onFolioInitialized);
        MODULES.folio.on.pageLoaded.add(onPageLoaded);
        MODULES.folio.load(pageId, sectionId);
    }
    
    onTwPositionDefined = function(pageId,sectionId){
        // passer la section ?
        if(sectionId) {
            hasher.setHash("folio",pageId+"/"+sectionId+"/");
        }else {
            hasher.setHash("folio",pageId+"/");
        }
    }
    
    onPageLoaded = function(pageId, sectionId){
        MODULES.folio.on.pageLoaded.remove(onPageLoaded);
        console.log("FOLIO onPageLoaded >> " + pageId);
        MODULES.folio.startTransition(pageId, sectionId)
        overlay.hide();
    }
    
    /******* REEL MODULE *******/
    
    loadReel = function(){
        unBindTouchEvents();
        if(!MODULES.reel){
            // show Loader ??
            overlay.loadGmd();
            require(["app/reelPlayer"], function(reelPlayer){
                console.log("reelplayer loaded");
                MODULES.reel = reelPlayer;
                MODULES.reel.on.playStarted.add(onPlayStarted);
                MODULES.reel.on.showHeader.add(onShowHeader);
                MODULES.reel.on.playGmd.add(onPlayGmd);
                MODULES.reel.on.hideGmd.add(onHideGmd);
                MODULES.reel.on.videoComplete.add(onVideoComplete);
                MODULES.reel.init(gatherTimeline());
                
                if(CONFIG.isMobile){
                    MODULES.reel.on.mobileCTAReady.add(onReelMobileReady);
                }
            })
        }else{
            playReel();
        }
    }   
    
    onReelMobileReady = function(){        
        MODULES.reel.on.mobileCTAReady.remove(onReelMobileReady);
        overlay.hide();
    }
    
    onPlayStarted = function(){        
        MODULES.reel.on.playStarted.remove(onPlayStarted);
        overlay.hide();
    }
    
    onShowHeader = function() {
        showHeader(true);
    }
    
    onPlayGmd = function() {
        overlay.show(overlay.GETMOREDETAILS);
    }
    
    onHideGmd = function(force) {
        overlay.hide(overlay.GETMOREDETAILS, force);
    }
    
    onVideoComplete = function() {
        hasher.setHash("folio","about/");
    }
    
    /*playReel = function(){
        //MODULES.reel.appendTimelineDiv();
        MODULES.reel.play();
        overlay.hide();
    }*/
    
    /******* HEADER MODULE *******/
    
    showHeader = function(stealthMode){
        if(!MODULES.header){
            require(["app/header"], function(header){
                MODULES.header = header;
                MODULES.header.on.close.add(onCloseHeader)
                MODULES.header.on.open.add(onOpenHeader)
                MODULES.header.init();
                MODULES.header.show(stealthMode);
            })
        }else{
            MODULES.header.show(stealthMode);
        }        
    }
    
    var onCloseHeader = function(){
        if(MODULES.reel) MODULES.reel.resume();
        overlay.resumeGmd();
    }
    
    var onOpenHeader = function(){
        if(MODULES.reel) MODULES.reel.pause();
        overlay.pauseGmd();
    }
    
    /******* EVENT HANDLERS ******/
    /******* TOUCH EVENTS *******/
    
    var targetTouch;  
    
    unBindTouchEvents = function(){
        document.removeEventListener("touchstart", onTouchStart, true );
        document.removeEventListener("touchmove", onTouchMove, true );
        document.removeEventListener("touchend", onTouchEnd, true );
        touchEventsBinded = false
    }   

    bindTouchEvents = function(){
        if(!touchEventsBinded){
            document.addEventListener("touchstart", onTouchStart, true );
            document.addEventListener("touchmove", onTouchMove, true );
            document.addEventListener("touchend", onTouchEnd, true );
            touchEventsBinded = true
        }
    }
    
    processRegularLink = function(element)
    {
        // simple link
        if($(element).is("a")){
            var targetUrl = $(element).attr("href");
            var targetWindow = $(element).attr("target");
            if(targetUrl != "#"){
                if(targetWindow && targetWindow != "_self"){
                    window.open(targetUrl, targetWindow);
                }else {
                    console.log("Set HASH >> " + targetUrl)
                    if(targetUrl.indexOf("#/") == 0){
                        targetUrl = targetUrl.slice(2)
                        console.log("Set HASH2 >> " + targetUrl)
                    }
                    hasher.setHash(targetUrl);
                }               
            }
        }
        
        // image in anchor
        /*if($(element).is("img")){
            var parent = $(element).parent()
            if(parent.is("a")){
                processRegularAnchor(parent)
            }
        }*/
    }    
    
    onTouchStart = function(event){
        targetTouch = event.target        
        event.preventDefault();
        if(MODULES.folio) MODULES.folio.onTouchStart(event);
    }
    
    onTouchMove = function(event){
        event.preventDefault();
        if(MODULES.folio) MODULES.folio.onTouchMove(event);
    }
    
    onTouchEnd = function(event){
        event.preventDefault();
        var target = event.target;               
        if(MODULES.folio) MODULES.folio.onTouchEnd(event);
        
        if(target == targetTouch){
            if(MODULES.header) MODULES.header.onTouchClick(event.target);
            if(MODULES.folio) MODULES.folio.onTouchClick(event.target);
            processRegularLink(target);
        }        
        targetTouch = null
    }   
    
    /******* RESIZE EVENT *******/
    
    resizeWindowHandler = function(event) {
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
    
    initCore();
});