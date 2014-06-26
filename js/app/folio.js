/* Turbodrive - Folio Module
 * Author : Silvère Maréchal
 */

define(["jquery","TweenMax","signals","app/pageInfo", "Sprite3D", "app/Page3D"], function ($, TweenMax, signals, pageInfo, Sprite3D, Page3D)
{
    var folio = {};
    
    const DEGREES_TO_RADIANS = Math.PI / 180;
    const GRID_TILE_SIZE = 1280;
    const GRID_TILE_SCALE = 15;
    const GRID_TILE_COORD = {x:0,y:0,z:0,rotationX:0,rotationY:90,rotationZ:0};
    
    var scene3DBuilt = false;
    var currentPageId = "", currentPage3D, previousPage3D;
    var tmpPageId;
    var stage, interactContainer, container;
    var pages3D = [];
    var transitionStarted;
    
    // Signal Events
    folio.on = {
        initialized : new signals.Signal(),
        pageLoaded : new signals.Signal(),
        twPositionDefined : new signals.Signal()
    } 
    
    folio.kill = function() {
        stopRendering();
        // delete all pages
    }
    
    folio.init = function(pageId) {
        collectContent();
        buildTimelines();
        buildScene();
        pageInfo.on.imagesLoaded.add(onImageLoaded);
        folio.on.initialized.dispatch(pageId);
        folio.resize();
    }
    
    folio.load = function (pageId) {
        var page = pageInfo.getPageInfo(pageId);
        if(!page) return
        console.log(page.id + " - loaded ? >> " + page.loaded)
        if(!page.loaded){            
            pageInfo.loadImage(pageId);
        } else {
            folio.on.pageLoaded.dispatch(pageId);
        }
    }
    
    this.onImageLoaded = function(pageId) {
        //pageInfo.on.imagesLoaded.remove(onImageLoaded);
        console.log("FOLIO >> " + pageId + " loaded !");
        folio.on.pageLoaded.dispatch(pageId);
    }
    
    folio.resize = function () {
        if (!scene3DBuilt) return
        
       
        $("#folio").css("left", LAYOUT.vW2)
        $("#folio").css("top", LAYOUT.vH2)
        stage.setPerspective(-LAYOUT_3D.PX_PERFECT_DISTANCE);
        stage.translate2D(LAYOUT.vW2,LAYOUT.vH2);
        
        
        if(CONFIG.isFirefox){
            var p = String(Number(-LAYOUT.vW2)) + "px " + String(Number(-LAYOUT.vH2)) + "px";
            console.log(" p > " +  p)            
            $("#folio").css("perspective-origin", p)
        }

        //if(currentPage3d) {
        interactContainer.translateOffsetX = - LAYOUT.vW2;
        interactContainer.translateOffsetY = - LAYOUT.vH2;
        interactContainer.translate2D(0,0);
        //interactContainer.update();
        
        
        
        if(currentPage3D) updatePage3D(currentPage3D)
        if(previousPage3D) updatePage3D(previousPage3D)
        // update camera position depending on the sprite's position and size
        //if(currentTarget) startTransition(currentTarget,0)
        //}
        
        
    }
    
    getPage3D = function(pageId) {
        for(var i=0; i< pages3D.length; i++){
            if(pages3D[i].getId() == pageId){
                return pages3D[i];
            }
        }
        return null;
    }
    
    /*********************************/
    /*********** TIMELINE ************/
    /*********************************/
    
    
    var objTmx = {tmxDuration:2, twPos:Number(0), twMem:0};
    var positionTmx = new TimelineMax({paused:true});
    //var rotationTmx = new TimelineMax({paused:true});

    buildTimelines = function(){
        positionTmx.add("empty")
        positionTmx.add(pageInfo.content[0].id)
        
        for(var i=0; i<pageInfo.content.length-1; i++){
            var label = pageInfo.content[i+1].id;
            positionTmx.append(TweenLite.to(objTmx,objTmx.tmxDuration,{
                twPos:Number(i+1),
                /*onUpdate:onUpdateTmx,*/
                /*onComplete:onCompleteTmx,*/
                ease:Quad.easeInOut}));
            //rotationTmx.to(this,tmxDuration,{tweenRotationValue:i+1})
            positionTmx.add(label)
            positionTmx.addPause();
        }
        
        if(CONFIG.debug) updateUI();
    }
    
    getValForProp = function(propName, rVal, log)
    {
        var res;
        
        if(rVal == parseInt(rVal)){
            res = -(pageInfo.content[parseInt(rVal)][propName]);
            //if(log) console.log("NoT0 > " + rVal)
        }else{
            if(log) console.log("rVal >> " + rVal)
            var t0 = Math.ceil(rVal-1);
            var t1 = Math.ceil(rVal);
            if(log) console.log(" - " + t0 + "-" + pageInfo.content[t0] )
            var v0 = pageInfo.content[t0][propName];
            var v1 = pageInfo.content[t1][propName];
            if(log) console.log( t0 + " - " + t1 + " - " + v0 + " - " + v1 + " - " + rVal)
            res = -(v0 + ((v1-v0)*(rVal-(parseInt(rVal)))));
        }
        
        //console.log(propName + " = " + res)
        return res;        
    };
    
    setTweenPosition = function(pageId) {
        interactTx = startx = 0
        touchEnd = touchEnd2 = false; 
        console.log("setTweenPosition >> " + pageId);
        folio.load(pageInfo.getNextPageId(pageId));
        folio.load(pageInfo.getPrevPageId(pageId));
        
        positionTmx.currentLabel(pageId);
        objTmx.twMem = objTmx.twPos = Number(pageInfo.getPageIndex(pageId));
        console.log("2 setTweenPosition >> " + objTmx.twMem);
        console.log("3 setTweenPosition >> " + objTmx.twPos);
        //onUpdateTmx();
        currentPageId = pageId;
        folio.on.twPositionDefined.dispatch(currentPageId)
    }
    
    onUpdateTmx = function() {
        objTmx.twPos = Number(objTmx.twPos).toFixed(5);
        //console.log("1 updateTimeline >> "+ container.x + " - twPos >> " + objTmx.twPos)
        if(isNaN( objTmx.twPos)) return
        //console.log("updateTimeline >> "+ container.x + " - twPos >> " + objTmx.twPos)
        
        container.x = getValForProp("x", objTmx.twPos, false);
        container.y = getValForProp("y", objTmx.twPos);
        container.z = getValForProp("z", objTmx.twPos);
        container.rotationX = getValForProp("rotationX", objTmx.twPos);
        container.rotationY = getValForProp("rotationY", objTmx.twPos);
        container.rotationZ = getValForProp("rotationZ", objTmx.twPos);
        //renderContainer();
        if(CONFIG.debug) updateUI();        
    }
    
    /*********************************/ 
    /********* DEBUG SLIDER **********/
    /*********************************/
    
    if(CONFIG.debug){

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


        updateUI = function() {
            var prg = isNaN(positionTmx.totalProgress()) ? numTargets : positionTmx.totalProgress()*numTargets;
            //progressSlider.slider("value", prg);
            $("#timeValue").html("val: "+prg.toFixed(2) + " - tweenPositionValue: " + objTmx.twPos);
            //msg("progress >> " + positionTmx.totalProgress())
        }
    }
    
    
    /*********************************/ 
    /********* TOUCH CONTROL *********/
    /*********************************/
    
    folio.onTouchClick = function(element) {
        if(element.className.indexOf("pictoPlayContainer")>-1){
            // play video   
        }
    }
    
    
    var targetTouch, lastTouch;
    var interactTx = 0, interactTy = 0, startx, starty, pX, pXm;
    var touchEnd = false;
    var speedX = 0;
    var limitSwitch = 200;
    var vx = 0,vy = 0;
    var elasticCoef = 0.5;
    var friction = 0.1;
    var touchEnd2 = false;
    var targetPage, tX;
    
    folio.onTouchStart = function(event)
    {        
        touchEnd2 = false;
        targetTouch = event.target;
        lastTouch = event.target.className;
        var t = event.changedTouches[0];        
        if(!transitionStarted){
            interactTx = interactTy = 0
            startx = parseInt(t.pageX)
            starty = parseInt(t.pageY)
            pXm = startx;
        }        
        //console.log("onTouchStart >> " + event.target + " - " + event.target.className);
    }
    
    folio.onTouchMove = function(event){
        var t = event.changedTouches[0];
        interactTx = -(parseInt(t.pageX) - startx)
        interactTy = (parseInt(t.pageY) - starty)
        touchEnd = false
        pXm = parseInt(t.pageX);      
        
        //interactContainer.translate2D(dx, dy);
    }
    
    folio.onTouchEnd = function(event){
        // trigger autotransition behavior
        touchEnd = true;
        touchEnd2 = false;
    }   
    
    updateContainerInteraction = function(){
        //console.log("touchEnd >> " + touchEnd);        
        if(touchEnd){
            // check what we do when we stop touching the screen
            touchEnd2 = false            
            if(Math.abs(interactTx) > 0.01 && Math.abs(interactTx) < limitSwitch) {
                vx += (0 - interactTx) * elasticCoef;
                interactTx += Number(vx *= friction);     
            } else if(Math.abs(interactTx) > limitSwitch) {
                tX = interactTx > 0 ? Number(objTmx.twMem)+1 : Number(objTmx.twMem)-1;
                targetPage = pageInfo.content[tX].id
                //prepPgeForTransition(targetPage);
                //touchEnd = false;
                touchEnd2 = true;
            } else {
               touchEnd = false
            }
            
           /* if(interactTy > 0.01) {
                vy += (0 - interactTy) * elasticCoef;            
                interactTy += (vy *= friction);     
            }*/ 
            //interactContainer.translate2D(interactTx, interactTy);
        }
        if(touchEnd2){            
            var dfX = (tX - Number(objTmx.twPos));
            var vx2 = dfX * 0.09;            
            //console.log("dfX = " + dfX + " | vX = " + vx2);
            objTmx.twPos =  Number(Number(objTmx.twPos)+Number(vx2));
            //fadeOut(currentPage3D.getId())
            
            if(Math.abs(dfX) < 0.1 ){
                console.log("fadeInAndActivate > ")
                if(currentPage3D.getId() != targetPage){
                    console.log("prepPgeForTransition > ")
                    prepPgeForTransition(targetPage);
                    fadeInAndActivate(targetPage,0.2, false);
                }
            }            
            if(Math.abs(dfX) < 0.0001){  
                transitionComplete(targetPage)
            }
        } else {
            //console.log("interactTx > " + interactTx)
            var prct = interactTx/(LAYOUT.viewportW);
            objTmx.twPos = Number(objTmx.twMem) + (0.5*prct)
        }
        onUpdateTmx();
    }
    
    /*********************************/
    /********* ENTER FRAME ***********/
    /*********************************/
    var isRendering = false;
    
    var startRendering = function() {
        if(isRendering) return
        isRendering = true
        enterFrame();
    }

    var stopRendering = function() {
        isRendering = true
    }

    var enterFrame = function() {
        if (isRendering) {
            requestAnimationFrame(enterFrame);
        }
        
        renderContainer();
        updateContainerInteraction();
    }
    
    if ( !window.requestAnimationFrame ) {
    /*
        if ( window.mozRequestAnimationFrame ) alert("has mozRequestAnimationFrame");
        if ( window.webkitRequestAnimationFrame ) alert("has webkitRequestAnimationFrame");
        if ( window.oRequestAnimationFrame ) alert("has oRequestAnimationFrame");
        if ( window.msRequestAnimationFrame ) alert("has msRequestAnimationFrame");
    */
        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame || // comment out if FF4 is slow (it caps framerate at ~30fps: https://bugzilla.mozilla.org/show_bug.cgi?id=630127)
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                window.setTimeout( callback, 1000 / 30 );

            };

        } )();

    }
    
    
    /*********************************/ 
    /********** VIEWPORT 3D **********/
    /*********************************/
        
    renderContainer = function() {
        if(container) container.update();
    }
    
    collectContent = function() {
        for(var i=0; i<pageInfo.content.length; i++){
            var page = pageInfo.content[i];
            var elementJQ = $("div[page-id*='"+page.id+"']");
            pageInfo.content[i].elementJQ =  elementJQ;
        }
        $("#folioContent").remove();
        
    }
    
    buildScene = function() {
        stage = Sprite3D.createCenteredContainer();
        stage.setId("folio");   
        //interactContainer = new Sprite3D(document.getElementById('folioContent'));
        interactContainer = new Sprite3D()
            .setId("interactContainer")
            .setRegistrationPoint(0,0,0);
        container = new Sprite3D()
            .setRotateFirst(true)
            .setRegistrationPoint(0,0,0);
        interactContainer.addChild(container);
        stage.setPerspective(-LAYOUT_3D.PX_PERFECT_DISTANCE)
        stage.addChild(interactContainer);
        
        // grid
        buildGridTile(0,1);
        //buildGridTile(-1,1);
        //buildGridTile(1,1);
        
        scene3DBuilt = true;
    }
    
    buildGridTile = function(indexX, indexY) {
        var grid = new Sprite3D()
            .setClassName("grid")
            .setRotateFirst(false)
            .setPosition(GRID_TILE_COORD.x+(indexX*GRID_TILE_SIZE*GRID_TILE_SCALE), GRID_TILE_COORD.y*indexY, -GRID_TILE_COORD.z)
            .setRotation(-GRID_TILE_COORD.rotationX, -GRID_TILE_COORD.rotationY, GRID_TILE_COORD.rotationZ)
            .setRegistrationPoint(GRID_TILE_SIZE>>1,GRID_TILE_SIZE>>1,0)
            .setScale(GRID_TILE_SCALE,GRID_TILE_SCALE,1)
            .update();
        container.addChild(grid);  
        return grid;
    }
    
    buildPage3D = function(page) {
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
        //console.log(page.id + " is Built");
        
        return page3D
    }
    
    getRatioPxPerfect = function(z) {
        var ratio = (LAYOUT_3D.PX_PERFECT_DISTANCE - (-z))/LAYOUT_3D.PX_PERFECT_DISTANCE;
        return ratio;
    }
    
    
    updatePage3D = function(page3D, currentPageInfo)
    {
        if(currentPageInfo == null){
            currentPageInfo = pageInfo.getPageInfo(page3D.getId());
        }
        
        var retinaScale = 1
        var invRetinaScale = 1
        if(CONFIG.isRetina){
            retinaScale = 1//0.85;
            invRetinaScale = 1/retinaScale;
        }

        var tH = LAYOUT.viewportH * (1) * invRetinaScale;
        var tW = LAYOUT.viewportW * (1)* invRetinaScale;
        var idElement = currentPageInfo.id;
        var layout = currentPageInfo.layout;
        var _rX = LAYOUT.viewportW/1280;
        var _rY = LAYOUT.viewportH/720;
        
                
        var zVisuel = -3500;
        //var _scaleVisuel = LAYOUT_3D.getPxPerfectScale(zVisuel);
        
        var scaleList = {_scaleVisuel : 0, _scaleAboutVisuel:0};
        scaleList._scaleVisuel = _rX > _rY ? _rX*4 : _rY*4;
        scaleList._scaleVisuel = scaleList._scaleVisuel.toFixed(3);
        
        scaleList._scaleAboutVisuel = _rX > _rY ? _rX : _rY;
        scaleList._scaleAboutVisuel = scaleList._scaleAboutVisuel.toFixed(3);
        //console.log("scaleBg >> " + scaleBg);
        
        /*var dfX = ((LAYOUT.viewportW-1280)/2)*_scaleVisuel
        var dfY = ((LAYOUT.viewportH-720)/2)*_scaleVisuel*/
        
        page3D.setRegistrationPoint(LAYOUT.vW2, LAYOUT.vH2, 0)
            .setPosition(currentPageInfo.x, currentPageInfo.y, currentPageInfo.z)
            .setRotation(currentPageInfo.rotationX, currentPageInfo.rotationY, currentPageInfo.rotationZ)
            .setRotateFirst(false)
        page3D.setScale(retinaScale,retinaScale,retinaScale)
        page3D.update();
       
        if(currentPageInfo.project){
            
            /*page3D.bg.setPosition(LAYOUT.vW2+dfX, LAYOUT.vH2+dfY, zVisuel)
                .setRegistrationPoint(LAYOUT.vW2+dfX, LAYOUT.vH2+dfY, 0)*/
           /* page3D.bg.setPosition(LAYOUT.vW2, LAYOUT.vH2, zVisuel)
                .setRegistrationPoint(LAYOUT.vW2, LAYOUT.vH2, 0)*/
            
            // BACKGROUND
            page3D.bg.setPosition(0, 0, zVisuel)
                //.setRegistrationPoint(LAYOUT.vW2, LAYOUT.vH2, 0)
                .setScale(scaleList._scaleVisuel, scaleList._scaleVisuel, 1) 
                .update();
            msg("scaleVisuel >> " + scaleList._scaleVisuel)
            msg("zVisuel >> " + zVisuel)
            
            // PICTOPLAY
            page3D.pictoPlay.setPosition(tW*(0.5+layout.pictoPlay.x), tH*(0.5+layout.pictoPlay.y), 0).update();
            
            // REDLINE
            var xRedLine = tW*(0.5+(layout.redLine.x));
            var yRedLine = tH*(0.5+(layout.redLine.y));
            page3D.redLine.setPosition(xRedLine, yRedLine, 0) //75
            .setRegistrationPoint(2500, 2, 0) //2500,2,0
            .update();
            
            // TITLE
            var oY = -70 - ((invRetinaScale-1)*10);
            var oX = (Math.sin(3*DEGREES_TO_RADIANS)*oY);    
            page3D.title.setPosition(xRedLine-(10*retinaScale)+oX,yRedLine+oY,0) //100
            .setRegistrationPoint(0,0,0)
            .update();
            
            // CLIENT
            oY = -95- ((invRetinaScale-1)*10);
            oX = (Math.sin(3*DEGREES_TO_RADIANS)*oY);    
            page3D.client.setPosition(xRedLine-(10*retinaScale)+oX,yRedLine+oY,0) //50
            .setRegistrationPoint(0,0,0)
            .update();

            // CONTENT
            oY = 25*retinaScale;
            oX = (Math.sin(3*DEGREES_TO_RADIANS)*oY);
            page3D.content.setPosition(xRedLine-(10*retinaScale)+oX,yRedLine+oY,0) //5
            .setRegistrationPoint(0,0,0)
            .update();    

            //page3D.textPlane.setPosition(xRedLine+layout.planeTextX, yRedLine, -250).update();
            // TEXTPLANE
            page3D.textPlane.setPosition(xRedLine+layout.planeTextX, yRedLine, -150).update();
        } else {
            var nbrElements = page3D.elementList.length;
            for(var i = 0; i<nbrElements; i++ ){
                var element = page3D.elementList[i].element3d;
                var elInfo = page3D.elementList[i].info;
                // conversion des distances selon la profondeur sélectionnée.
                var ratioPx = (getRatioPxPerfect(elInfo.z));
                //var sc = Math.abs(ratioPx-2)
                //console.log("elInfo Z = " + elInfo.z + " ->> " + ratioPx + " > ")
                if(elInfo.scale){
                    if(isNaN(elInfo.scale)){
                        var sc = ratioPx*scaleList[elInfo.scale];
                        element.setScale(sc, sc, 1);
                    }else{
                        if(elInfo.position == pageInfo.FREE3D_P) {
                            element.setScale(elInfo.scale,elInfo.scale,elInfo.scale);
                        }else {
                            element.setScale(elInfo.scale*ratioPx, elInfo.scale*ratioPx, 1);
                        }
                    }
                } else {
                    element.setScale(ratioPx,ratioPx,1);
                }
                
                /*var widthSquare = 102;
                var heightSquare = 102;*/
                
                var xF, yF;
                if(elInfo.position == pageInfo.ABSOLUTE_P){
                    //console.log("position >> " + elInfo.x)
                    xF = (LAYOUT.vW2) + (elInfo.x*ratioPx) - (elInfo.width*0.5);
                    yF = (LAYOUT.vH2) + (elInfo.y*ratioPx) - (elInfo.height*0.5);
                    element.setPosition(xF, yF, elInfo.z);
                } else if(elInfo.position == pageInfo.TOPLEFTSCREENRELATIVE_P){
                    xF = tW*(elInfo.x)*ratioPx;
                    yF = tH*(elInfo.y)*ratioPx;
                    element.setPosition(xF, yF, elInfo.z);
                } else if(elInfo.position == pageInfo.FREE3D_P){
                    element.setPosition(elInfo.x, elInfo.y, elInfo.z);
                }
                
                if(elInfo.rPointX && elInfo.rPointY){
                    element.setRegistrationPoint(elInfo.rPointX, elInfo.rPointY, 0);
                }else if(elInfo.width && elInfo.height){
                    element.setRegistrationPoint(-elInfo.width*0.5, -elInfo.height*0.5, 0);
                }else {
                    element.setRegistrationPoint(0, 0, 0);
                }
                
                if(elInfo.rX != null && elInfo.rY != null && elInfo.rZ != null){
                    element.setRotation(elInfo.rX, elInfo.rY, elInfo.rZ);
                }
                
                /*if(elInfo.opacity === null) {
                    
                }else {
                    element.setOpacity(elInfo.opacity);
                }*/
                
                element.update();
            }
        }

        $("#"+idElement).css("width", tW);
        $("#"+idElement).css("height", tH);
    }
    
    prepPgeForTransition = function(pageId) {
        var page = pageInfo.getPageInfo(pageId);        
        if(currentPage3D) previousPage3D = currentPage3D;
        
        if(!page.built){
            currentPage3D = buildPage3D(page);
        } else {
            currentPage3D = getPage3D(pageId);
        }
        
        updatePage3D(currentPage3D, page);
        return page;
    }
    
    folio.startTransition = function(pageId) {
        startRendering();
        if(currentPageId == pageId){
            console.log("allready uptoDate >> " + pageId)
            return
        }
        
        var page = prepPgeForTransition(pageId); 
        
        if(!previousPage3D){
            // transition depuis HyperSPACE
            setTweenPosition(pageId)
            fadeInAndActivate(pageId,0, false);
            // TODO : SET CONTAINER POSITION (temp)
        }else{
            var siblingsLevel = pageInfo.getLevelOfSibling(pageId, previousPage3D.getId());
            fadeOut(currentPageId,0.4)
            fadeInAndActivate(pageId,1.1, false);          
            if(Math.abs(siblingsLevel) == 1){
                level1Transition(page)
            }else{
                freeTransition(page)              
            }
        }     

    }   
    
    fadeOut = function(pageId, delay){
        if($("#"+pageId).css("opacity") < 1) return
        TweenMax.to($("#"+pageId), 0.3, {delay:delay, autoAlpha:0});
    }
    
    fadeInAndActivate = function(pageId, delay, setTweenPos) {
        console.log("current Opacity > " + $("#"+pageId).css("opacity") )
        if($("#"+pageId).css("opacity") > 0){
            return
        }else {
            console.log("show " + pageId)   
        }
        
        var dispatchComplete = setTweenPos ? transitionComplete : null
        
        TweenMax.to($("#"+pageId), 0.5, {
            delay:delay,
            autoAlpha:1,
            onComplete: dispatchComplete,
            onCompleteParams : [pageId]
        });
    }
    
    transitionComplete = function(pageId){
        console.log("transitionComplete >> " + pageId); 
        transitionStarted = false;
        setTweenPosition(pageId);
        previousPage3D = null;
    }
    
    level1Transition = function(page) {
        transitionStarted = true;
        console.log("level1Transition >> " + page.id)
        positionTmx.tweenTo(page.id, {
            ease:Quad.easeInOut,
            onUpdate: onUpdateTmx,
            onComplete: transitionComplete,
            onCompleteParams : [page.id]
        })
    }

    
    freeTransition = function(page) {
        transitionStarted = true;
        //stopRendering();
        console.log("target > "+ page.rotationY)
        
        
        TweenMax.to(container, 2, {
            x: -page.x,
            y: -page.y,
            z: -page.z,
            rotationX: -page.rotationX,
            rotationY: -page.rotationY,
            rotationZ: -page.rotationZ,
            ease: Power2.easeInOut,
            onUpdate: renderContainer,
            onComplete: transitionComplete,
            onCompleteParams : [page.id]
        })
    }   
    
    
    return folio;
});