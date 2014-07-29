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

            // 6. content
            var projectContent = new Sprite3D()
                .addDomElement(this.divElement.children("p")[0]) // Picto Skills
                .addDomElement(this.divElement.children("p")[0]) // Text
                .setRotationZ(-3)
                .update();
            this.addChild(projectContent);
            this.content = projectContent;

            // 7. pictoPlay
            var pictoPlay = new Sprite3D()
                .addDomElement(this.divElement.children("a")[0])
                .setRegistrationPoint(50, 50, 0)
                .setRotationZ(-3)
                /*.setScale(0.85,0.85,0)*/
                .update();
            this.addChild(pictoPlay);
            this.pictoPlay = pictoPlay;
            
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
    
    Page3D.prototype.show = function()
    {   
        if(!this.isBuilt || !this.isHidden()) return;
        
        if(!this.twFadeIn || !this.twFadeIn.isActive()){
            if(this.twFadeOut) this.twFadeOut.pause();
            this.twFadeIn = TweenMax.to(this.domElement, 0.5, {autoAlpha:1});
        }
        
    }
    
    Page3D.prototype.hide = function()
    {
        if(!this.isBuilt || this.isHidden()) return;        
        
        if(!this.twFadeOut || !this.twFadeOut.isActive()){
            if(this.twFadeIn) this.twFadeIn.pause();
            this.twFadeOut = TweenMax.to(this.domElement, 0.5, {autoAlpha:0});
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