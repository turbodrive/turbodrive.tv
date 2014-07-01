define(["signals"], function (signals)
{
    var pageInfo = {};
    
    /*** EVENTS ***/
    pageInfo.on = {
        imagesLoaded : new signals.Signal()
    }
    
    
    /*** PAGES TESTS & TREATMENTS ***/
    
    pageInfo.getPageInfo = function(id) {
        for(var i = 0; i<pageInfo.content.length; i++){
            if(pageInfo.content[i].id == id) return pageInfo.content[i]   
        }
        return null
    }
    
    pageInfo.getPageIndex = function(id){
        for(var i = 0; i<pageInfo.content.length; i++){
            if(pageInfo.content[i].id == id) return i
        }
        return null
    }
        
    pageInfo.getLevelOfSibling = function(pageId1,pageId2) {
        var id1 = pageInfo.getPageIndex(pageId1);
        var id2 = pageInfo.getPageIndex(pageId2);
        return id1-id2;
    }
         
    pageInfo.areDirectSiblings = function(pageId1,pageId2) {
        var df = getLevelSiblings(pageId1, pageId2);
        if(Math.abs(df) == 1) return true;
        return false
    }
    
    pageInfo.getNextPageId = function(pageId) {
        var pageIndex = pageInfo.getPageIndex(pageId);
        if(pageIndex == pageInfo.content.length-1) return null;
        var nextIndex = pageIndex+1; 
        return pageInfo.content[nextIndex].id;
    }
    
    pageInfo.getPrevPageId = function(pageId) {
        var pageIndex = pageInfo.getPageIndex(pageId);
        var prevIndex = pageIndex-1;
        if(prevIndex < 0) return null;
        return pageInfo.content[prevIndex].id;
    }
    
    
    /*** ASSETS LOADER ***/    
    pageInfo.loadImage = function(id){
        var page = pageInfo.getPageInfo(id);
        page.mainImage = new Image();
        page.mainImage.id = id
        page.loadedHandler = function(event){
            var img = event.target;
            var pageI = pageInfo.getPageInfo(img.id);
            img.removeEventListener("load", pageI.loadedHandler);
            pageI.loaded = true;
            pageInfo.on.imagesLoaded.dispatch(pageI.id);
            img.id = null;
        }
        page.mainImage.addEventListener("load", page.loadedHandler);
        page.mainImage.src = "images/" + id + ".png";
    }
    
    pageInfo.isLoaded = function(id) {
        var page = pageInfo.getPageInfo(id);
        return page.loaded;
    }
    
    /*** CONTENT ***/
    var loadedDefault = false;
    pageInfo.FREE3D_P = "free3dPosition";
    pageInfo.FOV_RELATED = "fovRelated";
    pageInfo.ABSOLUTE_P = "absolutePosition";
    pageInfo.RES_RC_P = "resolutionRelative-CenteredPosition";
    pageInfo.CENTERSCREENRELATIVE_P = "centerScreenRelativePosition";
    pageInfo.TOPLEFTSCREENRELATIVE_P = "topLeftScreenRelativePosition";
    pageInfo.TOPRIGHTSCREENRELATIVE_P = "topRightScreenRelativePosition";
    
    
    pageInfo.RIGHTBOTTOM_LAYOUT = {id:"rightBottom", planeTextX:300, redLine:{x:0.1, y:0.1}, pictoPlay:{x:-0.28, y:0.25}};
    pageInfo.LEFT_LAYOUT = {id:"left", planeTextX:100, redLine:{x:-0.38, y:-0.20}, pictoPlay:{x:0.28, y:0.25}};
    /*pageInfo.RIGHT_LAYOUT = {id:"right", planeTextX:280, redLine:{x:0.12, y:-0.17}, pictoPlay:{x:-0.28, y:0.25}};*/
    pageInfo.RIGHT_LAYOUT = {
        id:"right",
        planeTextX:280,
        redLine:{x:0.12, y:-0.17},
        pictoPlay:{x:-0.28, y:0.25}
    };
    
    var cX = -0.20; //-265
    var cY = -0.12;;
    
    pageInfo.ABOUT_LAYOUT = {
        id:"about-layout",
        h2:{position:pageInfo.RES_RC_P,
            z:0, rrcX:cX, rrcY:cY, rrcXOffset:-00, rrcYOffset:-90,
            width:206, height:25},
        h1:{position:pageInfo.RES_RC_P,
            z:-500, rrcX:cX, rrcY:cY, rrcXOffset:-00, rrcYOffset:27-90,
            width:590, height:50},
        p_intro:{position:pageInfo.RES_RC_P,
            z:-800, rrcX:cX, rrcY:cY, rrcXOffset:-00, rrcYOffset:88-90,
            width:590, height:120},
        h3_skillsFieldTitle:{position:pageInfo.RES_RC_P,
            z:0, rrcX:-0.38, rrcY:0.08, rrcXOffset:-80, rrcYOffset:0,
            width:166, height:36},
        h3_timelineTitle:{position:pageInfo.RES_RC_P,
            z:0, rrcX:0.16, rrcY:0.04, rrcXOffset:40, rrcYOffset:0,
            width:246, height:50},
        div_skillsFieldMenu:{position:pageInfo.RES_RC_P,
            z:0, rrcX:-0.38, rrcY:0.08, rrcXOffset:-80, rrcYOffset:0,
            width:620, height:250},
        a_skillsFieldButton:{position:pageInfo.RES_RC_P,  
            z:50, rrcX:-0.1, rrcY:0.32, rrcXOffset:0, rrcYOffset:0,
            width:138, height:28},
        a_timelineButton:{position:pageInfo.RES_RC_P,
            z:50, rrcX:0.30, rrcY:0.32, rrcXOffset:-40, rrcYOffset:0,
            width:142, height:28},
        /*img_background:{src:"mainImage", scale:0.8, position:pageInfo.ABSOLUTE_P,
            x:-260, y:0, z:-3500, rPointX:0, rPointY:0, width:1280, height:720},*/
        img_trsBg:{html:"<img src='images/trsbgContentAbout.png'/>", scale:"_scaleAboutVisuel", position:pageInfo.RES_RC_P,
            z:-1200,
            rrcX:0, rrcY:0.1,  rrcXOffset:0, rrcYOffset:-20,
            rPointX:0, rPointY:0, width:1366, height:665},
        img_bgOpt:{html:"<img src='images/about_opt.png'/>", scale:"_scaleAboutVisuel", position:pageInfo.RES_RC_P,
            z:-3000, rrcX:-0.20, rrcY:-0.40, rrcXOffset:-150, rrcYOffset:50,
            width:739, height:698}
    };
    
    pageInfo.SKILLS_LAYOUT = {
        id:"skills-layout",
        img_background:{position:pageInfo.RES_RC_P, scale:"_scaleAboutVisuel", src:"mainImage",
            z:-1500, rrcX:0, rrcY:0, rrcXOffset:-40, rrcYOffset:0,
            rPointX:0, rPointY:0, width:1568, height:641},
        _skillsMenu:{position:pageInfo.RES_RC_P,
            z:50, rrcX:0, rrcY:0.18, rrcXOffset:-366, rrcYOffset:0,
            width:712, height:346},
        _editingSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.1, rrcXOffset:-195, rrcYOffset:0,
            width:990, height:268, opacity:0},
        _researchSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.1, rrcXOffset:-445, rrcYOffset:0,
            width:990, height:268, opacity:0},
        _compositingSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.1, rrcXOffset:-445, rrcYOffset:-40,
            width:990, height:268, opacity:1},
        _frontSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.1, rrcXOffset:-445, rrcYOffset:0,
            width:990, height:257, opacity:0},
        _motionSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.1, rrcXOffset:-445, rrcYOffset:0,
            width:990, height:268, opacity:0},
    };
    
    var scaleH3 = 1.4
    
    pageInfo.TIMELINE_LAYOUT = {
        id:"timeline-layout",
        h1:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0.32, rrcY:-0.4, rrcXOffset:-180, rrcYOffset:80, width:356, height:58},
        /*p_contentNow:{position:pageInfo.ABSOLUTE_P,
            x:-460,y:-230, z:0, width:490, height:34},*/
        p_contentNow:{position:pageInfo.FOV_RELATED,
            x:{minL:-208, maxL:-421},y:{minL:-196, maxL:-364}, z:-350,
            width:490, height:34},
        p_content2012:{position:pageInfo.FOV_RELATED,
            x:{minL:-169, maxL:-349},y:{minL:-178, maxL:-322}, z:-300,
            width:490, height:60},
        p_content2006:{position:pageInfo.FOV_RELATED,
            x:{minL:-40, maxL:-86},y:{minL:-118, maxL:-187}, z:-250,
            width:490, height:40},
        p_content2004:{position:pageInfo.FOV_RELATED,
            x:{minL:19, maxL:35},y:{minL:-85, maxL:-127}, z:-200,
            width:490, height:40},
        p_content2001:{position:pageInfo.FOV_RELATED,
            x:{minL:95, maxL:179},y:{minL:-45, maxL:-50}, z:-150,
            width:490, height:20},
        p_content1999:{position:pageInfo.FOV_RELATED,
            x:{minL:179, maxL:336},y:{minL:-08, maxL:30}, z:-100,
            width:490, height:40},
        p_content1997:{position:pageInfo.FOV_RELATED,
            x:{minL:228, maxL:427},y:{minL:20, maxL:71}, z:-50,
            width:490, height:60},
        /*img_timelinehelper:{position:pageInfo.FOV_RELATED,
            html:"<img src='images/timeline_helper_001.png'/>",
            x:{minL:-91, maxL:-199},y:{minL:46, maxL:72}, z:0,
            scale:{minL:0.52, maxL:1}, width:919, height:497, rPointX:0, rPointY:0},*/
        
        h3_dateNow:{position:pageInfo.FREE3D_P,
            x:-900,y:1140, z:940,rX:30, rY:60, rZ:-90, rPointX:-200, scale:scaleH3},
        h3_date2012:{position:pageInfo.FREE3D_P,
            x:-900,y:890, z:940,rX:30, rY:60, rZ:-90, scale:scaleH3},
        h3_date2006:{position:pageInfo.FREE3D_P,
            x:-900,y:132, z:940,rX:30, rY:60, rZ:-90, scale:scaleH3},
        h3_date2004:{position:pageInfo.FREE3D_P,
            x:-900,y:-170, z:940,rX:30, rY:60, rZ:-90, scale:scaleH3},
        h3_date2001:{position:pageInfo.FREE3D_P,
            x:-900,y:-530, z:940,rX:30, rY:60, rZ:-90, scale:scaleH3},
        h3_date1999:{position:pageInfo.FREE3D_P,
            x:-900,y:-885, z:940,rX:30, rY:60, rZ:-90, scale:scaleH3},
        h3_date1997:{position:pageInfo.FREE3D_P,
            x:-900,y:-1068, z:940,rX:30, rY:60, rZ:-90, scale:scaleH3},
        
        
        img_timeline:{position:pageInfo.FREE3D_P,src:"mainImage",
                      x:-600, y:-1200, z:1400, rX:0, rY:90, rZ:180, scale:3.5},
        img_tmleBg:{position:pageInfo.FREE3D_P,html:"<img src='images/timeline_0.png'/>",
                      x:-450, y:-1070, z:860, rX:0, rY:90, rZ:180, scale:3.5},  
        img_line01:{position:pageInfo.FREE3D_P,html:"<img src='images/white_line.png'/>",
                      x:-850, y:1138, z:1230, rX:0, rY:-40, rZ:0, scale:1},
        img_line02:{position:pageInfo.FREE3D_P,html:"<img src='images/white_line.png'/>",
                      x:-850, y:910, z:1230, rX:0, rY:-40, rZ:0, scale:1},
        img_line03:{position:pageInfo.FREE3D_P,html:"<img src='images/white_line.png'/>",
                      x:-850, y:187, z:1230, rX:0, rY:-40, rZ:0, scale:1},
        img_line04:{position:pageInfo.FREE3D_P,html:"<img src='images/white_line.png'/>",
                      x:-850, y:-102, z:1230, rX:0, rY:-40, rZ:0, scale:1},
        img_line05:{position:pageInfo.FREE3D_P,html:"<img src='images/white_line.png'/>",
                      x:-850, y:-449, z:1230, rX:0, rY:-40, rZ:0, scale:1},
        img_line06:{position:pageInfo.FREE3D_P,html:"<img src='images/white_line.png'/>",
                      x:-850, y:-795, z:1230, rX:0, rY:-40, rZ:0, scale:1},
        img_line07:{position:pageInfo.FREE3D_P,html:"<img src='images/white_line.png'/>",
                      x:-850, y:-968, z:1230, rX:0, rY:-40, rZ:0, scale:1},
    };
    //from AEX : - - +
    
    
    /*img_background:{src:"mainImage", x:733, y:755, z:-143, scale:1.87, rX:142.122, rY:3.39142, rZ:237.937}*/
    
    
    
    pageInfo.content = [
        {   
            id: "tot",
            project: true,
            info: {},
            videoId: "OBa37rBBMS4",
            x:3057, y:-3562, z:1310, rotationX:17, rotationY:-170, rotationZ:-30,
            bgX:1.7,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.RIGHT_LAYOUT
        },
        {
            id: "ikaf",
            project: true,
            info: {},
            videoId: "kiX1dpp7_C4",
            x:-1952, y:-1456, z: -3537, rotationX: -7, rotationY:11, rotationZ:25,
            bgX:1.7,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.RIGHT_LAYOUT
        },
        {
            id: "borgia",
            project: true, 
            info: {},           
            videoId: "IS4Khh9rmi4",
            x:1882, y:-386, z:-1906, rotationX:3, rotationY:-3, rotationZ:194,
            bgX:1.6,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.RIGHTBOTTOM_LAYOUT
        },
        {
            id: "gs",
            project: true,
            info: {},
            videoId: "43Dury8SEGs",
            x:-1367, y:1288, z:-240, rotationX:1, rotationY:-15, rotationZ:201,
            bgX:1.85,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.LEFT_LAYOUT
        },
        {
            id: "tl",
            project: true,
            info: {},
            videoId: "4CF2R2Luvg0",
            x:-2573, y:-137, z:-2763, rotationX:1, rotationY:-21, rotationZ:147,
            bgX:1.90,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.LEFT_LAYOUT
        },
        {
            id: "greetings",
            project: true,
            info: {},
            videoId: "inoqVpPplYw",
            x:576, y:4432, z:1927, rotationX:-0.8, rotationY:-154.2, rotationZ:92.5,
            bgX:1.6,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.RIGHT_LAYOUT
        },
        {
            id: "ikaf2",
            project: true,
            info: {},
            videoId: "A85dZro-wr4",
            x:1990, y:-152, z:1088, rotationX:15, rotationY:-170, rotationZ:-14,
            bgX:1.65,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.RIGHT_LAYOUT
        },
        {
            id: "about",
            project: false,
            info: {},
            videoId: "A85dZro-wr4",
            x:-1439, y:-172, z:5000, rotationX:9, rotationY:-179, rotationZ:-109.5,
            bgX:1.65,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.ABOUT_LAYOUT
        },    
         {
            id: "timeline",
            project: false,
            info: {},
            x:-1897, y:-646, z:-1902, rotationX:-48.6, rotationY:-392.4, rotationZ:-94.8,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.TIMELINE_LAYOUT
        },
         {
            id: "skillsfield",
            project: false,
            info: {noBg:true},
            x:1538, y:-4505, z: 360, rotationX: -83, rotationY:-398, rotationZ:-15,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.SKILLS_LAYOUT
        }
    ]
    
    for(var i = 0; i<pageInfo.content.length; i++){
        pageInfo.content[i].z = -pageInfo.content[i].z;   
        pageInfo.content[i].rotationX = -pageInfo.content[i].rotationX;
        pageInfo.content[i].rotationY = -pageInfo.content[i].rotationY;   
    }
    
    return pageInfo;
});