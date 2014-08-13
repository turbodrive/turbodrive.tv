define(["Sprite3D","app/pageInfo", "TweenMax"], function(Sprite3D, pageInfo, TweenMax) {
    
    const USE_AEX_COORD = true;    

    function Page3D(jQueryDivElement, pageInfoEl)
    {
        // 1st param of call is THIS
        this.superclass.call(this,jQueryDivElement[0]);
        this.divElement = jQueryDivElement;
        this.setPageInfo(pageInfoEl);
    }
    
    // Important to extend just after the "subclass" constructor creation
    extend(Page3D, Sprite3D); 
    
    Page3D.prototype.divElement = {};
    Page3D.prototype.contentSprite3D = {};
    Page3D.prototype.initProps = {};
    Page3D.prototype.elementList = [];
    Page3D.prototype.sectionsList = [];
    
    // Sprite3D content //
    
    Page3D.prototype.title = null;
    Page3D.prototype.bg = null;
    Page3D.prototype.client = null;
    Page3D.prototype.redLine = null;
    Page3D.prototype.textPlane = null;
    Page3D.prototype.content = null;
    Page3D.prototype.textPlane = null;
    Page3D.prototype.free3DContainer = null;
    
    Page3D.prototype.twFadeIn = null;
    Page3D.prototype.twFadeOut = null;
    Page3D.prototype.isBuilt = false;
    Page3D.prototype.video = null;
    Page3D.prototype.pictoPlay = null;
    //Page3D.prototype.pictosInitialized = false;
    Page3D.prototype.projectPlayer = null;
    Page3D.prototype.secondaryElements = [];
    
    Page3D.prototype.setPageInfo = function(pageInfo)
    {
        this.pageInfo = pageInfo;
        this.build();
        return this;
    }
    
    Page3D.prototype.getPageInfo = function()
    {
        return this.pageInfo;
    }
    
    Page3D.prototype.playVideo = function(event)
    {   
        var page = event.currentTarget.self;        
        
        TweenMax.to(page.videoContainer,0.5, {delay:0.2, autoAlpha:1});
        page.projectPlayer.setCSS("visibility", "visible");
        TweenMax.to(page.pictoPlay.domElement,0.5, {autoAlpha:0});
        page.video.play();
    }
    
    Page3D.prototype.onClickVideo = function(event) {
        var currentVideo = event.currentTarget;
        if(currentVideo.paused){
            currentVideo.self.resumeVideo();
        }else {
            currentVideo.self.pauseVideo();
        }
    }
    
    var targetTouch;
    
    Page3D.prototype.onTouchStartPicto = function(event){
        console.log("href >> " + event.target.attributes("href"))   
    }
    
    Page3D.prototype.onTouchStartVideo = function(event){
        targetTouch = event.target
    }
    
    Page3D.prototype.onTouchEndVideo = function(event){
        if(event.target == targetTouch){
            console.log("className >> " + event.target.className);
            event.currentTarget.self.onClickVideo(event);
        }
    }
    
    Page3D.prototype.preloadVideo = function() {
        //TweenMax.to(this.pictoPlay.domElement, 1.25, {delay: 0.5, autoAlpha:1});
        
        for(var i = 0; i < this.secondaryElements.length; i++){
            console.log("PRELOAD >>> " + this.secondaryElements[i].getId());
            if(this.secondaryElements[i].getId() == "div_player"){
                this.projectPlayer = this.secondaryElements[i];
                this.projectPlayer.addClassName("project-player")
                this.videoContainer = this.projectPlayer.domElement;
            }
            
            if(this.secondaryElements[i].getId() == "button_playButton"){
                this.pictoPlay = this.secondaryElements[i];
            }
        }
        
        if(this.videoContainer){
            this.videoContainer.innerHTML = '<video id="project-video"><source src="https://vod.infomaniak.com/redirect/silvremarchal_1_vod/raw-12978/mp4-32/'+this.pageInfo.id+'.mp4" type="video/mp4"></video>';
            this.video = this.videoContainer.firstElementChild;
            console.log("start Preloadvideo >> " + this.video);
            this.videoContainer.self = this;
            this.video.self = this;
            this.video.addEventListener("click", this.onClickVideo);
            this.video.addEventListener("touchstart", this.onTouchStartVideo);
            this.video.addEventListener("touchend", this.onTouchEndVideo);
        }
        
        this.resize();
    }
    
    Page3D.prototype.resumeVideo = function() {
        if(this.video){
            this.video.play();
            this.video.className = this.video.className.replace("pause-video", '');
        }
    }
    
    Page3D.prototype.pauseVideo = function() {
        if(this.video){
            this.video.pause();
            this.video.className += " pause-video ";
        }
    }
    
    Page3D.prototype.removeVideo = function() {
        if(this.videoContainer && this.video){
            this.video.pause();
            this.video.removeEventListener("click", this.onClickVideo);
            this.video.removeEventListener("touchstart", this.onTouchStartVideo);
            this.video.removeEventListener("touchend", this.onTouchEndVideo);
            this.videoContainer.innerHTML = "";
            TweenMax.to(this.videoContainer,0.3, {autoAlpha:0,
                                                  onComplete:function(page){
                page.projectPlayer.setCSS("visibility", "hidden")},
                                                  onCompleteParams:[this]
            });
            TweenMax.to(this.pictoPlay.domElement,0.3, {autoAlpha:1});
        }
    }
    
    Page3D.prototype.resize = function() {
        if(this.projectPlayer){
            var _rX = LAYOUT.viewportW / 1280;
            var _rY = LAYOUT.viewportH / 720;
            var __scale = _rX > _rY ? _rX : _rY;
            var __width = Math.round(1280*__scale*0.55);
            var __height = Math.round(720*__scale*0.55);
            
            TweenMax.set(this.projectPlayer.domElement,
                         {width:__width,
                          height:__height
                         })
            TweenMax.set(this.video,
                         {width:__width-20,
                          height:__height-20
                         })
        }
    }
    
    var addClassName = function(element, className){
        element.className += " " +className+ " ";
        return element
    }
    
    var addAndroidFix = function(element){
        return addClassName(element, "android-fix")
    }
    
    Page3D.prototype.build = function()
    {   
        
        this.secondaryElements = [];
        
            // infoLayout
            
            this.elementList = [];            
            var infoLayout = UTILS.clone(this.pageInfo.layout);
            
            if(this.pageInfo.images != null){
                for(var q in this.pageInfo.images){
                    infoLayout["img_"+q] = this.pageInfo.images[q];
                }                
            }

            for(var p in infoLayout){
                var elementName = p;
                if(elementName != "id"){
                    var elementInfo = infoLayout[p];
                    var domEl;
                    var tag;
                    if(elementName.search("_") == -1){
                        //dom element
                        tag = elementName;
                        domEl = this.divElement.children(tag)[0];
                    }else{
                        tag = elementName.split("_");
                        //get element by 3dId element
                        domEl = this.divElement.children(tag[0]+"[id3d*='"+tag[1]+"']")[0];
                    }
                    
                    var element3d;
                    if(!domEl) {
                        element3d = this.createElement(tag[0],tag[1],elementInfo);
                    }else {
                        if(elementInfo.wrapLeftOffset != null){
                            // wrap the paragraphe text
                           domEl = wrapText(domEl, elementInfo.width, elementInfo.wrapLeftOffset);
                        }
                        
                        element3d = this.convertElement(domEl, elementInfo);
                    }     
                    
                    element3d.setId(elementName);
                    
                    if(elementInfo.position != pageInfo.FREE3D_P){
                        if(elementInfo.secondary){
                            this.secondaryElements.push(element3d);
                        }else {                        
                            this.addChild(element3d);
                        }
                    }else {
                        element3d.setRotateFirst(false);
                    }
                    
                    if(elementInfo.sectionId){
                        element3d.sectionId = elementInfo.sectionId;
                        this.sectionsList.push(element3d);
                    }
                    
                    if(elementInfo.clickHandler != null){
                        element3d.domElement.addEventListener("click", this[elementInfo.clickHandler]);
                        element3d.domElement.addEventListener("touchstart ", this[elementInfo.clickHandler]);
                        element3d.domElement.self = this;
                    }                  
                    
                    
                    element3d.update();
                    this.elementList.push({element3d:element3d, info:elementInfo, id:elementName});
                }
            }
            //this.addFree3dElement();
        
        
        this.setCSS("opacity","0");
        this.setCSS("visibility","hidden");
            //page3D.contentSprite3D.push(title, client, redLine,bg, textPlane, projectContent, pictoPlay)
        this.resize();
        this.isBuilt = true;
        
        return this;
    }
    
    wrapText = function(domElement, widthContent, leftOffset){
         var divText = document.createElement("div");
        divText.setAttribute("style", "-webkit-transform-style : preserve-3d; transform-style: preserve-3d; position:fixed; left:"+leftOffset+"px; width:"+widthContent+"px ;");
        divText.appendChild(domElement);
        if(leftOffset > 0) {
        
UTILS.shapeWrapper(15,"7.5,5,159|22.5,11,152|37.5,18,146|52.5,24,139|67.5,30,133|82.5,37,126|97.5,43,119|112.5,49,113|127.5,55,106|142.5,62,100|157.5,68,93|172.5,74,86|187.5,81,80|202.5,87,73|217.5,93,66|232.5,100,60|247.5,106,53|262.5,112,47|277.5,118,40|292.5,125,33|307.5,0,0|322.5,0,0|", divText, 20);
        }
        return divText;
    }
    
    Page3D.prototype.isHidden = function()
    {
        var hidden = (!this.isBuilt || this.getCSS("visibility") == "hidden");
        return hidden
    }
    
    Page3D.prototype.secElementsAdded = false;
    
    Page3D.prototype.addSecondaryElements = function()
    {
        if(this.secElementsAdded) return

       for(var i = 0; i< this.secondaryElements.length; i++ ){
           var el = this.secondaryElements[i];
           el.setCSS("opacity", "0");
           TweenMax.to(el.domElement, 0.3, {alpha:1, delay:0.2*i})
           this.addChild(el);
       }
        this.secElementsAdded = true;
    }
           
    Page3D.prototype.removeSecondaryElements = function()
    {
        if(!this.secElementsAdded) return
       for(var i = 0; i< this.secondaryElements.length; i++ ){
           var el = this.secondaryElements[i];
           this.removeChild(el);
       }
        
        this.secElementsAdded = false;
    }
    
    Page3D.prototype.show = function(delay)
    {   
        if(!this.isBuilt || !this.isHidden()) return;
        
        if(!this.twFadeIn || !this.twFadeIn.isActive()){
            if(this.twFadeOut) this.twFadeOut.pause();
            console.log("fadein >> " + this.getId());
            this.twFadeIn = TweenMax.to(this.domElement, 0.5, {
                delay: delay,
                autoAlpha:1
            });
        }
        
        if(this.free3DContainer){
             TweenMax.to(this.free3DContainer.domElement, 0.5, {
                delay: delay,
                autoAlpha: 1
            });   
        }
        
    }
    
    Page3D.prototype.hide = function(delay)
    {
        if(!this.isBuilt || this.isHidden()) return;
        this.pauseVideo();
        this.removeVideo();
        this.removeSecondaryElements();
        
        if(!this.twFadeOut || !this.twFadeOut.isActive()){
            if(this.twFadeIn) this.twFadeIn.pause();
            console.log("fadeout >> " + this.getId())
            this.twFadeOut = TweenMax.to(this.domElement, 0.3, {delay:delay,
                autoAlpha:0, ease:Linear.easeNone
            });
        }
        
        if(this.free3DContainer){
             TweenMax.to(this.free3DContainer.domElement, 0.3, {delay:delay,
                autoAlpha: 0, ease:Linear.easeNone
            });   
        }
    }
    
    
    Page3D.prototype.getSections = function()
    {
        return this.sectionsList;
    }
    
    Page3D.prototype.addFree3dElement = function()
    {
        if(this.elementList){
            for(var i = 0; i< this.elementList.length ; i++){
                if(this.elementList[i].info.position == pageInfo.FREE3D_P){
                    if(this.free3DContainer === null) {
                        var cInfo = this.pageInfo.free3DContainer;
                        
                        this.free3DContainer = new Sprite3D().setId(this.getId()+"-externalContainer").setPosition(cInfo.x, cInfo.y, cInfo.z).setRotation(cInfo.rotationX, cInfo.rotationY, cInfo.rotationZ);
                        
                        if(cInfo.scale != null){
                            this.free3DContainer.setScale(cInfo.scale, cInfo.scale, cInfo.scale);
                        }
                        
                        this.free3DContainer.update();
                        this.free3DContainer.setCSS("opacity","0");
                        this.free3DContainer.setCSS("visibility","hidden");
                        this.parentSprite3D.addChild(this.free3DContainer);
                    }
                    this.free3DContainer.addChild(this.elementList[i].element3d);
                }
            }
        }
    }
    
    Page3D.prototype.getFree3DContainer = function() {
        return this.free3DContainer;
    };
    
    Page3D.prototype.setParentSprite = function(e) {
        this.parentSprite3D = e;
        this.addFree3dElement();
    };

    
    Page3D.prototype.convertElement = function(domElement, info)
    {
        var el = new Sprite3D();
        el.addDomElement(domElement);                                                
        return el;
    }
    
    Page3D.prototype.createElement = function(tag, id3d, info)
    {
        var el = new Sprite3D();
        
        if(info.src){
            el.addDomElement(this.pageInfo[info.src]);
        }else{
            el.setInnerHTML(info.html);  
        }                                                                  
        return el;
    }
    
    
    // Extend Class (inheritence)
    function extend(subclass, superclass) {
       //function Dummy() {}
       //Dummy.prototype = superclass.prototype;
       subclass.prototype = new superclass() //new Dummy();
       subclass.prototype.constructor = subclass;
       subclass.prototype.superclass = superclass;
       subclass.prototype.superproto = superclass.prototype;
    } 
    
    
    return Page3D
});