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
        //console.log("play >> " + this.getPageInfo())
        //console.log("play 5 >> " + event.currentTarget.self.pageInfo.id);
        var page = event.currentTarget.self;

        TweenMax.to(page.videoContainer,0.5, {delay:0.2, autoAlpha:1});
        TweenMax.to(page.pictoPlay.domElement,0.5, {autoAlpha:0});
        
        page.video.play();
    }
    
    Page3D.prototype.onClickVideo = function(event) {
        var currentVideo = event.currentTarget;
        if(currentVideo.paused){
            currentVideo.play()
        }else {
            currentVideo.pause();
        }
    }
    
    var targetTouch
    Page3D.prototype.onTouchStartVideo = function(event){
        targetTouch = event.target
    }
    
    Page3D.prototype.onTouchEndVideo = function(event){
        if(event.target == targetTouch){
            event.currentTarget.self.onClickVideo(event)
        }
    }
    
    Page3D.prototype.preloadVideo = function() {
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
    }
    
    Page3D.prototype.removeVideo = function() {
        if(this.videoContainer){
            this.video.pause();
            this.video.removeEventListener("click", this.onClickVideo);
            this.video.removeEventListener("touchstart", this.onTouchStartVideo);
            this.video.removeEventListener("touchend", this.onTouchEndVideo);
            this.videoContainer.innerHTML = "";
            TweenMax.to(this.videoContainer,0.3, {autoAlpha:0});
            TweenMax.to(this.pictoPlay.domElement,0.3, {autoAlpha:1});
        }
    }
    
    Page3D.prototype.build = function()
    {   
        if(this.pageInfo.project){
            // 1. title
            var title = new Sprite3D()
                //.addClassName("title")
                .addDomElement(this.divElement.children("h1")[0])
                .setRotationZ(-3)
                .update();        
            this.addChild(title);
            this.title = title;

            // 2. client
            var client = new Sprite3D()
                //.addClassName("client")
                .addDomElement(this.divElement.children("h2")[0])
                .setRotationZ(-3)
                .update();
            this.addChild(client);
            this.client = client;

            // 3. redLine
            var redLine = new Sprite3D()
                .setClassName("redLine")
                .setRotateFirst(false)
                .setRotationZ(-3)
                .update();
            this.addChild(redLine);
            this.redLine = redLine;

            // 4. background
            var bg = new Sprite3D()
                .addDomElement(this.pageInfo.mainImage)
                .update();
            this.addChild(bg);
            this.bg = bg;

            // 5. textPlane
            var rotZPlane = this.pageInfo.layout.id == "right" ? -25 : 34.5;
            var textPlane = new Sprite3D()
                .addClassName("textPlane")
                .setRegistrationPoint(230, 2500, 0)
                .setRotationZ(rotZPlane)
                .update();
            this.addChild(textPlane);
            this.textPlane = textPlane
            //msg("textPlane >> " + textPlane)
            
            
            var isRightLayout = (this.pageInfo.layout == pageInfo.RIGHT_LAYOUT)
            
            // 6. content
            var pictoP = this.divElement.children("p")[0];
            var divText = document.createElement("div");
            var leftOffset =  isRightLayout ? "20" : "0";
            var widthContent =  isRightLayout ? "580" : "340";
            
            divText.setAttribute("style", "-webkit-transform-style : preserve-3d; transform-style: preserve-3d; position:fixed; left:"+leftOffset+"px; width:"+widthContent+"px ;");
            divText.appendChild(this.divElement.children("p")[1]);
            // wrap text to get shapped paragraph
if(isRightLayout){            UTILS.shapeWrapper(15,"7.5,5,159|22.5,11,152|37.5,18,146|52.5,24,139|67.5,30,133|82.5,37,126|97.5,43,119|112.5,49,113|127.5,55,106|142.5,62,100|157.5,68,93|172.5,74,86|187.5,81,80|202.5,87,73|217.5,93,66|232.5,100,60|247.5,106,53|262.5,112,47|277.5,118,40|292.5,125,33|307.5,0,0|322.5,0,0|", divText, 15);
                 }
            
            var projectContent = new Sprite3D()
                .addDomElement(pictoP) // Picto Skills
                .addDomElement(divText) // Text
                .setRotationZ(-3)
                .update();
            this.addChild(projectContent);
            this.content = projectContent;
            
             // 7. projectPlayer
            this.videoContainer = this.divElement.children(".project-player")[0];
            
            var projectPlayer = new Sprite3D()
                .addDomElement(this.videoContainer)
                .setRegistrationPoint(50, 50, 0)
                .setRotationZ(-3)
                .update();
            this.addChild(projectPlayer);
            this.projectPlayer = projectPlayer;
            
            // 7. pictoPlay
            var pictoPlay = new Sprite3D()
                .addDomElement(this.divElement.children("button")[0])
                .setRegistrationPoint(50, 50, 0)
                .setRotationZ(-3)
                /*.setScale(0.85,0.85,0)*/
                .update();
            this.addChild(pictoPlay);
            this.pictoPlay = pictoPlay;
            
            
            pictoPlay.domElement.addEventListener("click", this.playVideo)
            pictoPlay.domElement.addEventListener("touchstart", this.playVideo)
            pictoPlay.domElement.self = this;
            /*pictoPlay.domElement.video = projectPlayer.domElement.firstChild.firstElementChild;
            this.video = projectPlayer.domElement.firstChild.firstElementChild;*/
            
            
        }else {
            // infoLayout
            var infoLayout = this.pageInfo.layout;
            this.elementList = []
            
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
                        domEl = this.divElement.children(tag[0]+"[id3d*='"+tag[1]+"']")[0];}
                    
                    var element3d;
                    if(!domEl) {
                        element3d = this.createElement(tag[0],tag[1],elementInfo);
                    }else {
                        element3d = this.convertElement(domEl, elementInfo)
                    }
                    
                    if(elementInfo.position != pageInfo.FREE3D_P){
                        this.addChild(element3d);
                    }else {
                        element3d.setRotateFirst(false);   
                    }
                    
                    if(elementInfo.sectionId){
                        element3d.sectionId = elementInfo.sectionId;
                        this.sectionsList.push(element3d);
                    }
                    
                    element3d.update();
                    this.elementList.push({element3d:element3d, info:elementInfo, id:elementName});
                }
            }
            //this.addFree3dElement();
        }
        
        this.setCSS("opacity","0");
        this.setCSS("visibility","hidden");
            //page3D.contentSprite3D.push(title, client, redLine,bg, textPlane, projectContent, pictoPlay)
        this.isBuilt = true;
        
        return this;
    }
    
    Page3D.prototype.isHidden = function()
    {
        var hidden = (!this.isBuilt || this.getCSS("visibility") == "hidden");
        return hidden
    }
    
    Page3D.prototype.show = function(delay)
    {   
        if(!this.isBuilt || !this.isHidden()) return;
        
        if(!this.twFadeIn || !this.twFadeIn.isActive()){
            if(this.twFadeOut) this.twFadeOut.pause();
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
    
    Page3D.prototype.hide = function()
    {
        if(!this.isBuilt || this.isHidden()) return;        
        this.removeVideo();
        
        if(!this.twFadeOut || !this.twFadeOut.isActive()){
            if(this.twFadeIn) this.twFadeIn.pause();
            this.twFadeOut = TweenMax.to(this.domElement, 0.5, {autoAlpha:0});
        }
        
        if(this.free3DContainer){
             TweenMax.to(this.free3DContainer.domElement, 0.5, {
                autoAlpha: 0
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
                        this.free3DContainer = new Sprite3D().setId(this.getId()+"-externalContainer");
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
        el.setId(id3d);
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