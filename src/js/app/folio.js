/* Turbodrive - Folio Module
 * Author : Silvère Maréchal
 */

define(["jquery", "TweenMax", "signals", "../app/pageInfo", "Sprite3D", "../app/Page3D"], function ($, TweenMax, signals, pageInfo, Sprite3D, Page3D) {
    var folio = {};

    const DEGREES_TO_RADIANS = Math.PI / 180;
    const GRID_TILE_SIZE = 1280;
    const GRID_TILE_SCALE = 15;
    const GRID_TILE_COORD = {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 0,
        rotationY: 90,
        rotationZ: 0
    };
    
    var vignetInfo;

    var scene3DBuilt = false;
    var currentPageId = "",
        currentPage3D, previousPage3D;
    var currentSectionId;
    var tmpSectionId;
    var tmpPageId;
    var stage3d, interactContainer, container;
    var hyperdriveContainer;
    var pages3D = [];
    var transitionStarted = false;
    var nextPrev;
    var elementsBuild = 0;
    var maxElements = 0;
    var pagesBuild = 0;
    
    var updateCreation = function(){
        elementsBuild++
        folio.on.creationProgress.dispatch(Number(elementsBuild/maxElements));
        
        if(elementsBuild >= maxElements){
            console.log("creationComplete")
            //if(CONFIG)
            //folio.on.creationComplete.dispatch();
        }
    }

    // Signal Events
    folio.on = {
        initialized: new signals.Signal(),
        pageLoaded: new signals.Signal(),
        readyForIntroTransition: new signals.Signal(),
        creationProgress: new signals.Signal(),
        creationComplete: new signals.Signal(),
        twPositionDefined: new signals.Signal(),
        pageLoading: new signals.Signal(),
        hireMeClicked: new signals.Signal(),
        pageReady: new signals.Signal(),
        pageCreationComplete: new signals.Signal()
    }

    folio.kill = function () {
        stopRendering();
        fadeOut(currentPageId);
        previousPage3D = null;
        currentPage3D = null;
        $(stage3d).css("visibility", "hidden");
        if(nextPrev) nextPrev.hide();
        console.log("KILL FOLIO");
        TweenMax.to(vignetInfo, 0.2, {autoAlpha:0})
        // delete all pages
    }
    
    folio.wakeup = function(pageId) {
        $(stage3d).css("visibility", "visible");
        console.log("WAKEUP FOLIO");
    }

    folio.init = function (pageId, sectionId) {
        maxElements = nbrBunchParticles+1;
        vignetInfo = $(".touch-anim-container");
        collectContent();
        buildTimelines();
        buildScene();
        pageInfo.on.imagesLoaded.add(onImageLoaded);
        folio.on.initialized.dispatch(pageId, sectionId);
        folio.resize();
    }
    
    folio.contains = function(domElement) {
        return ($("#folio")[0].contains(domElement));
    }
    
    folio.load = function (pageId, sectionId) {
        var page = pageInfo.getPageInfo(pageId);
        if (!page) return
        if (!page.loaded) {
            pageInfo.loadImage(pageId, sectionId);
        } else {
            folio.on.pageLoaded.dispatch(pageId, sectionId);
        }
    }
    
    var autoLoadSiblings = false;
    
    this.onImageLoaded = function (pageId, sectionId) {
        //pageInfo.on.imagesLoaded.remove(onImageLoaded);
        //console.log("FOLIO >> " + pageId + " loaded !");
        folio.on.pageLoaded.dispatch(pageId, sectionId);
        
        if(autoLoadSiblings){
            loadSiblings(pageId);
        }else {
            updateCreation();
        }
    }

    var loadSiblings = function(pageId) {
        if(folio.on.pageLoading){
            folio.on.pageLoading.dispatch();
            folio.on.pageLoading = null;
        }
        autoLoadSiblings = true;
        prebuildPages(pageId);
        
        folio.load(pageInfo.getNextPageId(pageId));
        folio.load(pageInfo.getPrevPageId(pageId));
    }
    
    var prebuildPages = function(pageId) {
        var page = pageInfo.getPageInfo(pageId);
        if(!page.built){
            var page3D = buildPage3D(pageInfo.getPageInfo(pageId));
            updatePage3D(page3D, page)
        }
    }
    
    folio.resize = function () {
        if (!scene3DBuilt) return
        
        $("#folio").css("left", LAYOUT.vW2)
        $("#folio").css("top", LAYOUT.vH2)
        stage3d.setPerspective(-LAYOUT_3D.PX_PERFECT_DISTANCE);
        stage3d.translate2D(LAYOUT.vW2, LAYOUT.vH2);
        
        if (CONFIG.isFirefox || CONFIG.isChrome36) {
            // attention aux anciennes version de chrome (avant v36)!
            var p = String(Number(-LAYOUT.vW2)) + "px " + String(Number(-LAYOUT.vH2)) + "px";
            $("#folio").css("perspective-origin", p);
        }
            
        //if(currentPage3d) {
        interactContainer.translateOffsetX = -LAYOUT.vW2;
        interactContainer.translateOffsetY = -LAYOUT.vH2;
        interactContainer.translate2D(0, 0);
        //interactContainer.update();

        if (currentPage3D) updatePage3D(currentPage3D);
        if (previousPage3D) updatePage3D(previousPage3D);
        // update camera position depending on the sprite's position and size
        //if(currentTarget) startTransition(currentTarget,0)
        //}
    }

    getPage3D = function (pageId) {
        for (var i = 0; i < pages3D.length; i++) {
            if (pages3D[i].getId() == pageId) {
                return pages3D[i];
            }
        }
        return null;
    }
    
    folio.pageIsProject = function(pageId) {
        return getPage3D(pageId).getPageInfo().project;
    }

    /*********************************/
    /*********** TIMELINE ************/
    /*********************************/


    var objTmx = {
        tmxDuration: 2,
        twPos: Number(0),
        twMem: 0
    };
    var positionTmx = new TimelineMax({
        paused: true
    });
    //var rotationTmx = new TimelineMax({paused:true});

    buildTimelines = function () {
        positionTmx.add("empty");
        positionTmx.add(pageInfo.content[0].id);

        for (var i = 0; i < pageInfo.content.length - 1; i++) {
            var label = pageInfo.content[i + 1].id;
            positionTmx.append(TweenLite.to(objTmx, objTmx.tmxDuration, {
                twPos: Number(i + 1),
                /*onUpdate:onUpdateTmx,*/
                /*onComplete:onCompleteTmx,*/
                ease: Quad.easeInOut
            }));
            //rotationTmx.to(this,tmxDuration,{tweenRotationValue:i+1})
            positionTmx.add(label)
            positionTmx.addPause();
        }

        if (CONFIG.debug) updateUI();
    }

    getValForProp = function (propName, rVal, log) {
        var res;
        if (rVal == parseInt(rVal)) {
            res = -(pageInfo.content[parseInt(rVal)][propName]);
            //if(log) console.log("NoT0 > " + rVal)
        } else {
            if (log) console.log("rVal >> " + rVal);
            var t0 = Math.ceil(rVal - 1);
            var t1 = Math.ceil(rVal);
            if (log) console.log(" - " + t0 + "-" + pageInfo.content[t0])
            var v0 = pageInfo.content[t0][propName];
            var v1 = pageInfo.content[t1][propName];
            if (log) console.log(t0 + " - " + t1 + " - " + v0 + " - " + v1 + " - " + rVal);
            res = -(v0 + ((v1 - v0) * (rVal - (parseInt(rVal)))));
        }

        //console.log(propName + " = " + res)
        return res;
    };

    setTweenPosition = function (pageId, sectionId, isIntro) {
        interactTx = startx = 0;
        touchEnd = touchEnd2 = false;
        console.log("setTweenPosition >> " + pageId + " - " + sectionId);

        positionTmx.currentLabel(pageId);
        sourceTwPosition = objTmx.twMem = objTmx.twPos = Number(pageInfo.getPageIndex(pageId));
        updateWindowStatus(pageId, sectionId);
        if(isIntro === null) isIntro = false;
        if(!isIntro) {        
            if(nextPrev) nextPrev.updateState(currentPage3D.getPageInfo());
            if(currentPage3D.getPageInfo().project){
                currentPage3D.preloadVideo();
            }  
        }
    }
    
    updateWindowStatus = function(pageId, sectionId) {
        currentPageId = pageId;
        if (sectionId) {
            currentSectionId = sectionId;
        }else {
            currentSectionId = null;   
        }
        //console.log("currentSectionId >> " + currentSectionId);  
        folio.on.twPositionDefined.dispatch(currentPageId, currentSectionId)
    }

    onUpdateTmx = function () {
        objTmx.twPos = Number(objTmx.twPos).toFixed(5);
        //console.log("1 updateTimeline >> "+ container.x + " - twPos >> " + objTmx.twPos)
        if (isNaN(objTmx.twPos)) return
            //console.log("updateTimeline >> "+ container.x + " - twPos >> " + objTmx.twPos)

        if(objTmx.twPos > pageInfo.content.length-1) return
        
        //console.log("-- > " + objTmx.twPos + " length > " + pageInfo.content.length)
        
        container.x = getValForProp("x", objTmx.twPos, false);
        container.y = getValForProp("y", objTmx.twPos);
        container.z = getValForProp("z", objTmx.twPos);
        container.rotationX = getValForProp("rotationX", objTmx.twPos);
        container.rotationY = getValForProp("rotationY", objTmx.twPos);
        container.rotationZ = getValForProp("rotationZ", objTmx.twPos);
        //renderContainer();
        if (CONFIG.debug) updateUI();
    }

    /*********************************/
    /********* DEBUG SLIDER **********/
    /*********************************/

    if (CONFIG.debug) {

        var numTargets = pageInfo.content.length;

        /*progressSlider = $("#progressSlider").slider({
            range: false,
            min: 0,
            max: numTargets,
            step:.01,
            slide: function ( event, ui ) {
                positionTmx.pause();
                positionTmx.totalProgress( ui.value/numTargets );
                //onUpdateTmx();
            }
        });*/


        updateUI = function () {
            var prg = isNaN(positionTmx.totalProgress()) ? numTargets : positionTmx.totalProgress() * numTargets;
            //progressSlider.slider("value", prg);
            $("#timeValue").html("val: " + prg.toFixed(2) + " - tweenPositionValue: " + objTmx.twPos);
        }
    }


    /*********************************/
    /********* TOUCH CONTROL *********/
    /*********************************/

    folio.onTouchClick = function (element) {        
        if(!folio.contains(element)) return

        if($(element).parent().is("a")){
            var href = $(element).parent().attr("href");   
            window.location.hash = href;
        }else if($($(element).children()[0]).is("a")){
            var href =  $($(element).children()[0]).attr("href");
            window.location.hash = href;
        }
    }


   var targetTouch, lastTouch;
    var interactTx = 0,
        interactTy = 0,
        startx, starty, pX, pXm;
    var touchEnd = false;
    var speedX = 0;
    var limitSwitch = 200;
    var limitSwitchMini = 40;
    var vx = 0,
        vy = 0;
    var elasticCoef = 0.5;
    var friction = 0.1;
    var touchEnd2 = false;
    var targetPage;
    var touchTransitionPlaying = false;
    var sourceTwPosition = 0;
    var targetTransition = -1;
    var interruptWhenPlaying = false;
    var memLastPage3D;
    var commonGrid;
    
    folio.onTouchStart = function (event) {
        if(!transitionSiblingsAvailable) return;
        
        touchEnd2 = false;
        targetTouch = event.target;
        lastTouch = event.target.className;
        var t = event.changedTouches[0];
        
        interactTx = interactTy = 0
        startx = parseInt(t.pageX)
        //starty = parseInt(t.pageY)
        
        if (!touchTransitionPlaying) {
            //pXm = startx;
            interruptWhenPlaying = false;
            sourceTwPosition = objTmx.twMem;
        }else {
            // interrupt transition 
            interruptWhenPlaying = true;
            sourceTwPosition = Number(objTmx.twPos);
        }
        //console.log("onTouchStart >> " + event.target + " - " + event.target.className);
    }

    folio.onTouchMove = function (event) {
        if(!transitionSiblingsAvailable) return;
        
        var t = event.changedTouches[0];
        interactTx = -(parseInt(t.pageX) - startx)
        interactTy = (parseInt(t.pageY) - starty)
        touchEnd = false
        //pXm = parseInt(t.pageX);        
    }
    
    var hideExceptPage = function(pageId, delay) {
        for(var i = 0; i<pages3D.length ; i++){
            if(pageId != pages3D[i].getId()){
                pages3D[i].hide(delay);
            }
        }
    }
    
    folio.onTouchEnd = function (event) {
        if(!transitionSiblingsAvailable) return;
        
        // trigger autotransition behavior
        if(interactTx > 0 && objTmx.twPos == pageInfo.content.length-1) return;
        if(interactTx < 0 && objTmx.twPos == 0) return;
        
        if(touchTransitionPlaying){
            touchEnd2 = true;
            if(interruptWhenPlaying){
                interruptWhenPlaying = false;
                hideExceptPage(targetPage,0);
                fadeInAndActivate(targetPage, 0.2);
                //updateWindowStatus(targetPage);
                currentPageId = targetPage;
            }  
        }else {
            touchEnd = true;
            touchEnd2 = false;            
        }
    }

    updateContainerInteraction = function () {
        //console.log("touchEnd >> " + touchEnd);
        if(interactTx > 0 && objTmx.twPos == pageInfo.content.length-1) return;
        if(interactTx < 0 && objTmx.twPos == 0) return;
        if(Math.abs(interactTx) > limitSwitchMini){
            //if(nextPrev) nextPrev.hide(true);
        }
        
        
        if(interruptWhenPlaying){
            if (Math.abs(interactTx) > limitSwitchMini){
                var forceStep = (Math.abs(interactTx) - limitSwitchMini)/512;
                //console.log("forceStep >> " + forceStep);
                
                targetTransition = interactTx > 0 ? Math.round(Number(objTmx.twPos) + forceStep) : Math.round(Number(objTmx.twPos) - forceStep);
                
                if(targetTransition < 0 || targetTransition > pageInfo.content.length-1){
                    return
                }
                targetPage = pageInfo.content[targetTransition].id;
                // prepare page in case of...
                prepPgeForTransition(targetPage);
            }
        }
        
        if (touchEnd) {
            // check what we do when we stop touching the screen
            touchEnd2 = false
            if (Math.abs(interactTx) > 0.01 && Math.abs(interactTx) < limitSwitch) {
                vx += (0 - interactTx) * elasticCoef;
                interactTx += Number(vx *= friction);
                //if(nextPrev) nextPrev.show();
                
            } else if (Math.abs(interactTx) > limitSwitch) {
                
                if(targetTransition < 0){
                    targetTransition = interactTx > 0 ? objTmx.twMem + 1 : objTmx.twMem - 1;
                    if(targetTransition < 0 || targetTransition > pageInfo.content.length-1) return
                    targetPage = pageInfo.content[targetTransition].id
                }
                
                if(!touchTransitionPlaying){
                    memLastPage3D = currentPage3D;
                    touchTransitionPlaying = true;
                }
                touchEnd2 = true;
            } else {
                touchEnd = false
            }
        }
        
        if (touchEnd2) {
            var dfX = (targetTransition - Number(objTmx.twPos));
            var vx2 = dfX * 0.09; //0.09
            //console.log("dfX = " + dfX + " | vX = " + vx2);
            objTmx.twPos = Number(Number(objTmx.twPos) + Number(vx2));
            //fadeOut(previousPage3D.getId())

            if (Math.abs(dfX) < 0.1) {    
                if (currentPageId != targetPage) {
                    console.log("!!!! NORMAL !!!! switch")
                    //updateWindowStatus(targetPage);
                    currentPageId = targetPage;
                    hideExceptPage(targetPage,0);
                    //prepPgeForTransition(targetPage,null, false);  
                    fadeInAndActivate(targetPage, 0.2);
                                      
                }
            }
            
            if(Math.abs(dfX) < 0.0015) {
                if(currentPage3D.getId() != currentPageId){
                    addSecondaryElementAndUpdatePage3DStatus(currentPageId)
                }
            }
            
            if (Math.abs(dfX) < 0.0001) { //0.0001
                
                interruptWhenPlaying = touchTransitionPlaying = false;
                targetTransition = -1;
                transitionComplete(targetPage)
                console.log("touchTransitionPlaying <> " + touchTransitionPlaying)
            }
        } else {
            //if(Math.abs(interactTx) > 0.01) console.log("interactTx > " + interactTx)
            var prct = interactTx / (LAYOUT.viewportW);
            objTmx.twPos = Number(sourceTwPosition) + (0.5 * prct)
        }
        onUpdateTmx();
    }

    /*********************************/
    /********* ENTER FRAME ***********/
    /*********************************/
    var isRendering = false;

    var startRendering = function () {
        if (isRendering) return
        isRendering = true;
        enterFrame();
    }

    var stopRendering = function () {
        isRendering = false;
    }

    var enterFrame = function () {        
        if (isRendering) {
            requestAnimationFrame(enterFrame);
        }
        if(GLOBAL_ACCESS.stats) GLOBAL_ACCESS.stats.update();
        renderContainer();
        updateContainerInteraction();
    }
    
    folio.toggleRenderer = function() {
        if(isRendering){
            console.log("STOP Rendering");
            stopRendering();
        }else {
            console.log("START Rendering");
            startRendering();   
        }
    }

    /*********************************/
    /********** VIEWPORT 3D **********/
    /*********************************/

    renderContainer = function () {
        //console.log("renderContainer")
        if (container){
            //console.log("container update")
            container.update();
        }
    }

    collectContent = function () {
        for (var i = 0; i < pageInfo.content.length; i++) {
            var page = pageInfo.content[i];
            var elementJQ = $("div[page-id*='" + page.id + "']");
            pageInfo.content[i].elementJQ = elementJQ;
        }        
        $("#folioContent").remove();
        
        require(["app/nextPrev"], function(nextPrevModule){
            nextPrev = nextPrevModule;
            nextPrev.on.backToTheReelPress.add(onBackToTheReelPressed);
            nextPrev.init();
            if(currentPage3D) nextPrev.updateState(currentPage3D.getPageInfo());
        });
    }
    
    var onBackToTheReelPressed = function(){
        window.location.hash = "#/reel/"+currentPageId+"/";
    }
                
    buildScene = function () {
        stage3d = Sprite3D.createCenteredContainer();
        stage3d.setId("folio");
        //interactContainer = new Sprite3D(document.getElementById('folioContent'));
        interactContainer = new Sprite3D()
            .setId("interactContainer")
            .setRegistrationPoint(0, 0, 0);
        container = new Sprite3D()
            .setId("contentContainer")
            .setRotateFirst(true)
            .setRegistrationPoint(0, 0, 0);
        interactContainer.addChild(container);
        stage3d.setPerspective(-LAYOUT_3D.PX_PERFECT_DISTANCE)
        stage3d.addChild(interactContainer);
        
        
        // grid
        commonGrid = buildGridTile(0, 1);
        //buildGridTile(-1,1);
        //buildGridTile(1,1);

        //if(CONFIG.hyperDriveTransition) buildHyperDriveScene();
        scene3DBuilt = true;
    }

    var particles = []
    var nbrParticles = 400; // 400 desktop, même si range Depth est faible /80 tablettes
    var rangeDepth = 8000;
    var widthPrtcle = 220; // 130
    var heightPrtcle = 15; //20
    var alphaPrtcle = 1;
    var prevIntZ = 0;

    var initZ = -50000*2;
    var translateObject = {z:initZ};
    
    var rangeWidth = 2000;
    var rangeHeight = 2000;
    var splitWidth = 100;
    var splitHeight = 100;
    var timeParticleCreation = 50;
    var intervalParticlesCreation;
    var bunchQuantity = 50;
    var baseZ;
    var multZ;
    
    
    if(CONFIG.isMobile) {
        // mobile-tablets only
        widthPrtcle = 130;
        heightPrtcle = 10;
        rangeDepth = 6000;
        nbrParticles = 200;
        rangeWidth = 1500;
        rangeHeight = 1500;
    }
    
    var nbrBunchParticles = CONFIG.hyperDriveTransition ? nbrParticles/bunchQuantity : 0;
    var limitLoopParticle = (widthPrtcle+800)
    var totalPrcle = 0;
    
    var enterFrameHyperDrive = function () {
        var interactZ = interactContainer.z
        for (var i = nbrParticles - 1; i >= 0; i--) {
            var prtcle = particles[i];
            if (interactZ + prtcle.z > limitLoopParticle) {
                var newZ = prtcle.z - rangeDepth;
                //console.log("old " + prtcle.z + " new " + newZ)
                prtcle.setZ(newZ).update();
            }
        }
    }
    
    var tmpPageIdHd, tmpSectionIdHd;
    folio.startIntroTransition = function(pageId, sectionId) {
        tmpPageIdHd = pageId;
        tmpSectionIdHd = sectionId; 
        if(CONFIG.hyperDriveTransition){
            if(!hyperdriveContainer){            
                buildHyperDriveScene();
            }else {
                startHyperdriveAnimation();   
            }            
        }else{
            fireReadyForIntroTransition();
            transitionComplete(pageId);
        }
    }
    
    var prepareHyperDriveScene = function(){
        console.log("FOLIO prepareHyperDriveScene")
        TweenMax.set(vignetInfo, {autoAlpha:1})
        interactContainer.addChild(hyperdriveContainer);
        interactContainer.setPosition(-LAYOUT.vW2, -LAYOUT.vH2, initZ);
        interactContainer.setRotation(0,-90,-100).update();
        // we prepare here the position of the particles.
        // this method is called eachtime we need to start the transition
        // not only when created.
        
        if(getPage3D(tmpPageIdHd)) fadeInAndActivate(tmpPageIdHd,0)
        
        for(var i = 0; i< particles.length ;i++){
            var randZ =  parseInt(baseZ + (multZ*i))//(Math.random() * rangeDepth) /* - (rangeDepth>>1);*/
            var prtcle = particles[i];
            prtcle.setZ(randZ).update();
        }
        
    }
    
    
    
    var buildHyperDriveScene = function () {
        console.log("FOLIO buildHyperDriveScene")
        
        hyperdriveContainer = new Sprite3D()
            .setId("hyperdriveContainer")
            .setRegistrationPoint(0, 0, 0);
        
        hyperdriveContainer.setPosition(-(widthPrtcle/2), -(heightPrtcle/2), 0);
        hyperdriveContainer.setRotateFirst(false);
        hyperdriveContainer.update();
        
        $(".hyperdrive-particle").css("width", widthPrtcle + "px");
        $(".hyperdrive-particle").css("height", heightPrtcle + "px");
        
        baseZ = -initZ - LAYOUT_3D.PX_PERFECT_DISTANCE - (rangeDepth);
        multZ = rangeDepth/nbrParticles;
            
        intervalParticlesCreation = setInterval(createBunchOfParticles,timeParticleCreation)
    }
    
    
    
    var createBunchOfParticles = function() {
        if(particles.length >= nbrParticles){
            clearInterval(intervalParticlesCreation);
            startHyperdriveAnimation();
        }else{
            console.log("create" + bunchQuantity + " particles");
            for (var i = 0; i < bunchQuantity; i++) {
                totalPrcle ++
                var particle = new Sprite3D();
                particle.setId("prtcle"+i+"")
                particle.setInnerHTML("<div class='hd-prtcle-tex'></div>");
                particle.addClassName("hd-prtcle")
                var randX = (Math.random() * rangeWidth) - (rangeWidth >> 1);
                var randY = (Math.random() * rangeHeight) - (rangeHeight >> 1);
                particle.setRotateFirst(false);


                if (randY > -splitHeight && randY < splitHeight && randX > -splitWidth && randX < splitWidth) {
                    if (randY > -splitHeight && randY < splitHeight) {
                        if (randY > 0) {
                            randY += splitHeight;
                        } else {
                            randY -= splitHeight;
                        }
                    }
                    if (randX > -splitWidth && randX < splitWidth) {
                        if (randX > 0) {
                            randX += splitWidth;
                        } else {
                            randX -= splitWidth;
                        }
                    }
                }
                
                particle.setPosition(randX, randY, 0);
                particle.setOpacity((0.3 + Math.random()*0.75));
                var rotX = (Math.atan2(randY, randX) * 180 / Math.PI);
                particle.setRotation(-rotX, 90, 0);
                particles.push(particle)
                hyperdriveContainer.addChild(particle); 
            }
            updateCreation();
        }
    }
    
    
    
    var startHyperdriveAnimation = function() {
        prepareHyperDriveScene();
        
        
        var delay = 0.5;
        var duration = 5*2;
        var endDuration = 1.2;
        var total = (delay+duration);
        var endDelay = total-endDuration;
                
        TweenMax.to(interactContainer, duration, {
            onStart: fireReadyForIntroTransition,
            delay: delay,
            z: 0,
            onUpdate: function () {
                interactContainer.updateZLast();
                enterFrameHyperDrive();
            },
            ease:Power1.easeOut,
            onComplete: hyperDriveTransitionComplete            
        })
        
        /*var touchAnim = new swiffy.Stage(document.getElementById('swiffycontainer'),touchAnimation, {  });
        touchAnim.setBackground(null);*/
        
        TweenMax.to(interactContainer, 2, {delay: delay+1,rotationY: 0,ease:Power1.easeInOut, onComplete:function() {
            //touchAnim.start();
        }});
        TweenMax.to(interactContainer, 4, {delay: delay+3.8,rotationZ: 0,ease:Power1.easeInOut});
                
        TweenMax.fromTo($("#contentContainer"), endDuration*2,
                        {opacity:0},{delay:endDelay-endDuration-0.5,opacity:1, onComplete: function(){
                            addSecondaryElementAndUpdatePage3DStatus(tmpPageIdHd);                  
                        }});
        TweenMax.fromTo($("#hyperdriveContainer"), endDuration/3,
                        {opacity:1},{delay:endDelay-(endDuration/2)-0.8,opacity:0});
        
        TweenMax.fromTo(vignetInfo, 3, {autoAlpha:1}, {delay:duration+delay-0.5, autoAlpha:0})
    }
    
    var hyperDriveTransitionComplete = function() {
        //if(nextPrev) nextPrev.show(currentPage3D.getPageInfo());
        interactContainer.removeChild(hyperdriveContainer);
        setTweenPosition(tmpPageIdHd, tmpSectionIdHd);
        loadSiblings(currentPage3D.getId());
    }
    
    var fireReadyForIntroTransition = function(){
        folio.on.readyForIntroTransition.dispatch(tmpPageIdHd, tmpSectionIdHd);
        folio.on.creationComplete.dispatch();
    }
    
    buildGridTile = function (indexX, indexY) {
        var grid = new Sprite3D()
            .setClassName("grid")
            .setId("grid-3d")
            .setRotateFirst(false)
            .setPosition(GRID_TILE_COORD.x + (indexX * GRID_TILE_SIZE * GRID_TILE_SCALE), GRID_TILE_COORD.y * indexY, -GRID_TILE_COORD.z)
            .setRotation(-GRID_TILE_COORD.rotationX, -GRID_TILE_COORD.rotationY, GRID_TILE_COORD.rotationZ)
            .setRegistrationPoint(GRID_TILE_SIZE >> 1, GRID_TILE_SIZE >> 1, 0)
            .setScale(GRID_TILE_SCALE, GRID_TILE_SCALE, 1)
            .update();
        container.addChild(grid);
        return grid;
    }

    buildPage3D = function (page) {
        // add 3D to pages, convert page content
        var pageDiv = page.elementJQ;
        /*console.log("## info >> " + pageDiv);
        console.log("## infopage >> " + page);
        console.log("## infopage.id >> " + page.id);*/
        var page3D = new Page3D(pageDiv, page).setId(page.id);
        container.addChild(page3D);
        page3D.setParentSprite(container);
        pages3D.push(page3D);
        page.built = true;
        console.log("--------- Page [" + page.id + "] is created");
        
        pagesBuild++
        
        folio.on.pageReady.dispatch(page.id);
        checkControlsEnabled(page.id);
        
        if(pagesBuild >= pageInfo.content.length){
            console.log('page creationComplete')  
            folio.on.pageCreationComplete.dispatch();
        }
        
        if (page.id == "skillsfield" || page.id == "about") {
            initSkillsMenu(page.id);
        }       

        return page3D
    }
    var transitionSiblingsAvailable = false;
    
    var nextPageIsBuilt = function (page) {
        var nextPageId = pageInfo.getNextPageId(page.getId())
        if(nextPageId == null) return null;
        if(getPage3D(nextPageId) == null) return false;
        return getPage3D(nextPageId).getPageInfo().built;
    }
    
    var prevPageIsBuilt = function (page) {
        var prevPageId = pageInfo.getPrevPageId(page.getId())
        if(prevPageId == null) return null;
        if(getPage3D(prevPageId) == null) return false;
        return getPage3D(prevPageId).getPageInfo().built;
    }
        
    var pageIsReadyForTouch = function(page) {
        var nextAvailableForTouch = (nextPageIsBuilt(page) !== false);
        var prevAvailableForTouch = (prevPageIsBuilt(page) !== false);
        return (nextAvailableForTouch && prevAvailableForTouch)
    }
    
    var checkControlsEnabled = function(builtPageId) {  
        if(!currentPage3D) return
        transitionSiblingsAvailable = pageIsReadyForTouch(currentPage3D);
    }
    
    folio.getProjectVideo = function(){
        return currentPage3D.video;
    }
    
    initSkillsMenu = function (idPage) {
        $("." + idPage + "-menu li").mouseenter(function () {
            TweenMax.to($(this).find(".skill-bg-over"),0.3,{autoAlpha:1, ease:Power2.easeOut});
        }).mouseleave(function () {
            TweenMax.to($(this).find(".skill-bg-over"),0.5,{autoAlpha:0, ease:Power2.easeOut});
        }).mousedown(function(){
            TweenMax.set($(this).find(".skill-bg-over"),{autoAlpha:0.6});
        }).mouseup(function(){
            TweenMax.set($(this).find(".skill-bg-over"),{autoAlpha:1});
        }).click(function(){
            window.location.hash = $(this).children("a").attr("href");
        })
    }

    getRatioPxPerfect = function (z) {
        var ratio = (LAYOUT_3D.PX_PERFECT_DISTANCE - (-z)) / LAYOUT_3D.PX_PERFECT_DISTANCE;
        return ratio;
    }

    updatePage3D = function (page3D, currentPageInfo) {
        if (currentPageInfo == null) {
            //console.log("updatePage3D >> " + page3D + " ID = " + pageInfo.id);
            currentPageInfo = pageInfo.getPageInfo(page3D.getId());
        }

        var retinaScale = 1
        var invRetinaScale = 1
        if (CONFIG.isRetina) {
            retinaScale = 1 //0.85;
            invRetinaScale = 1 / retinaScale;
        }

        var tH = LAYOUT.viewportH * (1) * invRetinaScale;
        var tW = LAYOUT.viewportW * (1) * invRetinaScale;
        var idElement = currentPageInfo.id;
        var layout = currentPageInfo.layout;
        var _rX = LAYOUT.viewportW / 1280;
        var _rY = LAYOUT.viewportH / 720;


        var zVisuel = -3500; //-200 pour android < 4.4.2
        //var _scaleVisuel = LAYOUT_3D.getPxPerfectScale(zVisuel);

        var scaleList = {
            _scaleVisuel: 0,
            _scaleAboutVisuel: 0
        };
        scaleList._scaleVisuel = _rX > _rY ? _rX : _rY;
        scaleList._scaleVisuel = scaleList._scaleVisuel.toFixed(3);

        scaleList._scaleAboutVisuel = _rX > _rY ? _rX : _rY;
        scaleList._scaleAboutVisuel = scaleList._scaleAboutVisuel.toFixed(3);
        scaleList._scaleAboutVisuel = Math.min(scaleList._scaleAboutVisuel, 1.2);
        //console.log("scaleBg >> " + scaleBg);

        page3D.setRegistrationPoint(LAYOUT.vW2, LAYOUT.vH2, 0)
            .setPosition(currentPageInfo.x, currentPageInfo.y, currentPageInfo.z)
            .setRotation(currentPageInfo.rotationX, currentPageInfo.rotationY, currentPageInfo.rotationZ)
            .setRotateFirst(false)
        page3D.setScale(retinaScale, retinaScale, retinaScale)
        page3D.update();
        page3D.resize();

        
            var nbrElements = page3D.elementList.length;
            for (var i = 0; i < nbrElements; i++) {
                var element = page3D.elementList[i].element3d;
                var elInfo = page3D.elementList[i].info;
                // conversion des distances selon la profondeur sélectionnée.
                var ratioPx = (getRatioPxPerfect(elInfo.z));
                //var sc = Math.abs(ratioPx-2)
                //console.log("elInfo Z = " + elInfo.z + " ->> " + ratioPx + " > ")
                
                var offsetRatioX = 0 ;
                var offsetRatioY = 0 ;
                /** ------------------- **/
                /** SCALE **/
                var sc = 1
                var baseSc = 1
                if (elInfo.position != pageInfo.FOV_RELATED) {
                    if (elInfo.scale) {
                        if(elInfo.scale.minL && elInfo.scale.maxL){
                            sc = getPropValue(elInfo.scale)*ratioPx;                 
                        }else if (isNaN(elInfo.scale)) {
                            sc = ratioPx * scaleList[elInfo.scale];
                        } else {
                            if (elInfo.position == pageInfo.FREE3D_P) {
                                sc = elInfo.scale
                            } else {
                               sc = elInfo.scale * ratioPx
                            }
                        }
                    } else {
                        sc = ratioPx;
                    }
                }else {
                    if (elInfo.scale != null) {
                        baseSc = getPropValue(elInfo.scale)
                        sc = baseSc*ratioPx;        
                    }else {                        
                        sc = ratioPx;
                    }
                    
                    offsetRatioX = (elInfo.width*sc) - elInfo.width;
                    offsetRatioY = (elInfo.height*sc) - elInfo.height;
                }
                
                if(elInfo.extraScale != null) {
                    sc *= elInfo.extraScale;   
                }
                
                element.setScale(sc, sc, 1);
                if(elInfo.log){
                    console.log(" SCALE >> " + sc)   
                    console.log(" base SC >> " + baseSc)   
                    console.log(" RATIO PX >> " + ratioPx)
                    
                    console.log(" RatioScale >> " + offsetRatioX)   
                }
                
                /** ------------------- **/
                /** ROTATION Z ONLY **/
                var rotationZ = 0
                if(elInfo.rotationZ != null){
                    rotationZ = elInfo.rotationZ;
                }else if(elInfo.parent != null){
                    var parentInfo = getParent(page3D, elInfo.parent).info;
                    if(parentInfo.rotationZ != null){
                        rotationZ = parentInfo.rotationZ;
                    }
                }
                
                if(rotationZ) element.setRotationZ(rotationZ);
                
                /** ------------------- **/
                /** POSITION **/
                var xF, yF, zF, scaleF;
                var tXF = 0;
                var tYF = 0;
                           
                if (elInfo.position == pageInfo.ABSOLUTE_P) {
                    /** ABSOLUTE **/
                    
                    xF = (LAYOUT.vW2) + (elInfo.x * ratioPx) - (elInfo.width * 0.5);
                    yF = (LAYOUT.vH2) + (elInfo.y * ratioPx) - (elInfo.height * 0.5);
                    element.setPosition(Math.round(xF), Math.round(yF), elInfo.z);
                } else if (elInfo.position == pageInfo.RES_RC_P) {
                    /** RESOLUTION RELATED, FROM THE CENTER OF THE SCREEN **/
                                        
                    if(elInfo.parent != null){
                        var parentInfo = getParent(page3D, elInfo.parent).info;
                        tYF = Math.round(parentInfo.tYF + elInfo.rrcYOffset)
                        tXF = Math.round(parentInfo.tXF + elInfo.rrcXOffset)+(Math.sin(-rotationZ * DEGREES_TO_RADIANS) * elInfo.rrcYOffset);                             
                    } else {
                        tXF = (LAYOUT.viewportW * elInfo.rrcX) + elInfo.rrcXOffset;
                        tYF = (LAYOUT.viewportH * elInfo.rrcY) + elInfo.rrcYOffset;
                    }
                    
                    elInfo.tXF = tXF;
                    elInfo.tYF = tYF;
                    
                    xF = (LAYOUT.vW2) + (tXF * ratioPx) - elInfo.width * 0.5;
                    yF = (LAYOUT.vH2) + (tYF * ratioPx) - elInfo.height * 0.5;
                    
                    element.setPosition(Math.round(xF), Math.round(yF), elInfo.z);
                } else if (elInfo.position == pageInfo.TOPLEFTSCREENRELATIVE_P) {
                    /** TOP LEFT SCREEN - CURRENTLY NOT USED **/
                    
                    xF = tW * (elInfo.x) * ratioPx;
                    yF = tH * (elInfo.y) * ratioPx;
                    element.setPosition(xF, yF, elInfo.z);
                } else if (elInfo.position == pageInfo.FREE3D_P) {
                    /** FREE 3D **/

                    xF = getPropValue(elInfo.x);
                    yF = getPropValue(elInfo.y);
                    zF = getPropValue(elInfo.z);
                        
                    element.setPosition(Math.round(xF), Math.round(yF), zF);
                } else if (elInfo.position == pageInfo.FOV_RELATED) {
                    /** FIELD OF VIEW RELATED **/
                    
                    if(elInfo.parent != null){
                        var parentInfo = getParent(page3D, elInfo.parent).info;
                        tXF = parentInfo.tXF;
                        tYF = parentInfo.tYF;
                    }
                    
                    tXF += getPropValue(elInfo.x);
                    tYF += getPropValue(elInfo.y);                            
                                        
                    elInfo.tXF = tXF;
                    elInfo.tYF = tYF;
                    
                    // SCALE
                    /*tXF += (1-baseSc)*elInfo.width*0.5;
                    tYF += (1-baseSc)*elInfo.height*0.5;*/
                    
                    if(elInfo.log){
                        console.log("Ratio PX >" + ratioPx);   
                    }
                                        
                    xF = LAYOUT.vW2 + (tXF * ratioPx) - (elInfo.width * 0.5);
                    yF = LAYOUT.vH2 + (tYF * ratioPx) - (elInfo.height * 0.5);
                    
                    if(elInfo.useOffsetRatio){
                        xF += (offsetRatioX/2);
                        yF += (offsetRatioY/2);
                    }
                    
                    element.setPosition(Math.round(xF), Math.round(yF), getPropValue(elInfo.z));
                    /*element.update();*/
                }
                
                
                /** ------------------- **/
                /** REGISTRATION POINT **/                
                if (!isNaN(elInfo.rPointX) && !isNaN(elInfo.rPointY)) {
                    element.setRegistrationPoint(elInfo.rPointX, elInfo.rPointY, 0);
                } else if (elInfo.width && elInfo.height) {
                    element.setRegistrationPoint(-elInfo.width * 0.5, -elInfo.height * 0.5, 0);
                } else {
                    element.setRegistrationPoint(0, 0, 0);
                }
                
               
                
                /** ------------------- **/
                /** ROTATION **/
                if (elInfo.rX != null && elInfo.rY != null && elInfo.rZ != null) {
                    element.setRotation(elInfo.rX, elInfo.rY, elInfo.rZ);
                }

                if (elInfo.opacity !== null) {
                    element.setOpacity(elInfo.opacity);
                }
                
                element.update();
            }

        $("#" + idElement).css("width", tW);
        $("#" + idElement).css("height", tH);
    }
    
    var getParent = function(page3D, parentName) {
        for(var i = 0; i< page3D.elementList.length; i++){
            if(page3D.elementList[i].id == parentName){
                return page3D.elementList[i];
            }
        }
    }
    
    var hideSection = function(sprite3d)
    {
        TweenMax.to(sprite3d.domElement, 0.3, {autoAlpha:0})
        TweenMax.to(sprite3d, 0.5,
                        {z:400,
                         ease:Power2.easeIn,
                           onUpdate:function(){
                                      sprite3d.update();                            
                        }})
    }
    
    var showSection = function(sprite3d)
    {
        TweenMax.to(sprite3d.domElement, 0.5, {delay:0.2, autoAlpha:1})
        TweenMax.fromTo(sprite3d, 0.5,
                        {z:-500},
                        {delay:0, z:-100,
                            ease:Power2.easeOut,
                           onUpdate:function(){
                                      sprite3d.update();                            
                        }})
        
    }

    updateSection = function (page3d, sectionId) {
        
        
        var sectionsList = page3d.getSections();
        console.log("UDPATE SECTION > " + sectionId + "nbrSections = " + sectionsList.length)
        for (var i = 0; i < sectionsList.length; i++) {
            var section = sectionsList[i];
            if (section.sectionId == sectionId) {
                //section.setOpacity(1);
                showSection(section);
            } else {
                //section.setOpacity(0);
                hideSection(section);
            }
        }
        currentSectionId = sectionId;
    }

    getPropValue = function (obj) {
        if(obj.minL != null && obj.maxL != null){
            return getRelatedToFovValue(obj.minL, obj.maxL);
        }        
        return obj
    }
    
    getRelatedToFovValue = function (minL, maxL) {
        return minL + (LAYOUT_3D.fovMult001 * (maxL - minL));
    }

    getResolutionOffset = function (m) {
        return offset;
    }
    
    prepPgeForTransition = function (pageId, sectionId, updatePage) {
        var page = pageInfo.getPageInfo(pageId);
        if (currentPage3D) previousPage3D = currentPage3D;
        
        if (!page.built) {
            currentPage3D = buildPage3D(page);
            updatePage3D(currentPage3D, page);
            
        } else {
            currentPage3D = getPage3D(pageId);
             if(updatePage === null || updatePage == true){
                updatePage3D(currentPage3D, page);
            }
        }

        if (sectionId) updateSection(currentPage3D, sectionId)
        return page;
    }
    
    folio.hasCurrentPage3D = function(){
        //console.log("hasCurrentPage3D >> " + currentPage3D)
        
        return (currentPage3D !== undefined && currentPage3D !== null)
    }
    
    folio.startTransition = function (pageId, sectionId) {
        console.log("startTransition >> + " + pageId);
        startRendering();
        tmpSectionId = sectionId;
        if (currentPageId == pageId) {
            if (sectionId && currentSectionId != sectionId) {
                updateSection(currentPage3D, sectionId);
                return
            }
            return
        }

        var page = prepPgeForTransition(pageId, sectionId);

        if (!previousPage3D) {
            // transition depuis HyperSPACE
            setTweenPosition(pageId, sectionId, true);
            fadeInAndActivate(pageId, 0);
            // TODO : SET CONTAINER POSITION (temp)
        } else {
            var siblingsLevel = pageInfo.getLevelOfSibling(pageId, previousPage3D.getId());
            fadeOut(currentPageId, 0.4)
            if(nextPrev) nextPrev.hide();
            if (Math.abs(siblingsLevel) == 1) {
                level1Transition(page);
            } else {
                freeTransition(page);
            }
            
            updatePage3D(getPage3D(pageId)) // only for non-touchtransition 
            fadeInAndActivate(pageId, 1.1);
            if(sectionId) updateSection(currentPage3D, sectionId)
        }
    }
    
    fadeOut = function (pageId, delay) {
        if(pageId == undefined) return;
        console.log("@@@@@@@@ HIDE " + pageId);
        getPage3D(pageId).hide(delay);
    }

    fadeInAndActivate = function (pageId, delay) {
        if(pageId == undefined) return;
        console.log("@@@@@@@@ SHOW " + pageId);
        getPage3D(pageId).show(delay);
        //
        
        if(!commonGrid) return
        
        var targetAlphaGrid = 1;
        var infoGrid = pageInfo.getPageInfo(pageId).layout.grid;
        if(infoGrid != null){
            if(infoGrid.alpha){
                targetAlphaGrid = infoGrid.alpha
            }
        }
        TweenMax.to(commonGrid.domElement, 0.5, {alpha:targetAlphaGrid})   
    }
    
    var addSecondaryElementAndUpdatePage3DStatus = function(pageId){
        currentPage3D = getPage3D(pageId);        
        currentPage3D.addSecondaryElements();
        checkControlsEnabled();
        
        $(".hireme-button").click(function(){
            folio.on.hireMeClicked.dispatch();
        })   
    }
    
    transitionComplete = function (pageId) {
        transitionStarted = false;
        //console.log("transitionComplete >> " + pageId + " - " + tmpSectionId);
        
        addSecondaryElementAndUpdatePage3DStatus(pageId);
        //console.log("transitionComplete2 >> " + currentPage3D.getId());
            
        setTweenPosition(pageId, tmpSectionId);
        
        loadSiblings(pageId);
        tmpSectionId = null;
        previousPage3D = null;
        
        //setTimeout(stopRendering,2500);
    }

    level1Transition = function (page) {
        transitionStarted = true;
        positionTmx.tweenTo(page.id, {
            ease: Quad.easeInOut,
            onUpdate: onUpdateTmx,
            onComplete: transitionComplete,
            onCompleteParams: [page.id]
        })
    }


    freeTransition = function (page) {
        transitionStarted = true;
        //stopRendering();

        TweenMax.to(container, 2, {
            delay:0.3,
            x: -page.x,
            y: -page.y,
            z: -page.z,
            rotationX: -page.rotationX,
            rotationY: -page.rotationY,
            rotationZ: -page.rotationZ,
            ease: Power2.easeInOut,
            onUpdate: renderContainer,
            onComplete: transitionComplete,
            onCompleteParams: [page.id]
        })
    }

    return folio;
});