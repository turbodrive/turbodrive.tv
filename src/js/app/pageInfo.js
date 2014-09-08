/* Turbodrive - pageInfo Module
 * Author : Silvère Maréchal
 */

define(["signals"], function (signals)
{
    var pageInfo = {};
    var MAIN_IMAGE = "mainImage";
    
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
    pageInfo.loadImage = function(id, sectionId){
        var page = pageInfo.getPageInfo(id);
        var mainImageName = page.mainImageName ? page.mainImageName : "main.png";
        page.mainImage = new Image();
        page.mainImage.id = id
        page.loadedHandler = function(event){
            var img = event.target;
            var pageI = pageInfo.getPageInfo(img.id);
            img.removeEventListener("load", pageI.loadedHandler);
            pageI.loaded = true;
            pageInfo.on.imagesLoaded.dispatch(pageI.id, sectionId);
            img.id = null;
        }
        page.mainImage.addEventListener("load", page.loadedHandler);
        page.mainImage.src = "images/pages/" + id + "/"+mainImageName;
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
    
    
    pageInfo.LEFT_LAYOUT = {
        id:"left",
        div_redLine:{position:pageInfo.RES_RC_P,
            z:-1200, rrcX:-0.45, rrcY:-0.16, rrcXOffset:50, rrcYOffset:0, rPointX:0, rPointY:-130,
            rotationZ:-3, width:5000, height:4},  // used has parent, so it has to be defined first
        div_bgContent:{html:"<div class='textPlane380'></div>", position:pageInfo.RES_RC_P,
            parent : "div_redLine",
            z:-1500, rrcXOffset:120, rrcYOffset:-1000,
            rotationZ:34.5, width:400, height:2500},     
        h2_client:{position:pageInfo.RES_RC_P,
            secondary:true,
            parent:"div_redLine",
            z:-80, rrcXOffset:0, rrcYOffset:-80, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:500, height:25},
        h1_title:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            z:-50, rrcXOffset:0, rrcYOffset:-60, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:500, height:50},
        p_skillsIcon:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            secondary:true,
            z:-100, rrcXOffset:20, rrcYOffset:20, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:420, height:74},
        p_content:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            secondary:true,
            z:-150, rrcXOffset:0, rrcYOffset:95, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:350, height:240, wrapLeftOffset:0},
        div_player:{position:pageInfo.RES_RC_P,
            secondary:{stayHidden:true},
            z:0, rrcX:-0.25, rrcY:-0.25, rrcXOffset:0, rrcYOffset:0,
            rotationZ:-3, width:100, height:100},
        button_playButton:{position:pageInfo.RES_RC_P,
            secondary:true,
            z:0, rrcX:0.25, rrcY:0.24, rrcXOffset:0, rrcYOffset:0,
            rotationZ:-3, width:620, height:250, clickHandler:"playVideo"},
        img_background:{position:pageInfo.RES_RC_P, scale:"_scaleVisuel", src:MAIN_IMAGE,
            z:-3500, rrcX:0, rrcY:0, rrcXOffset:0, rrcYOffset:0,
            rPointX:0, rPointY:0, width:1280, height:720}
    };
    
    pageInfo.RIGHTBOTTOM_LAYOUT = {
        id:"right-bottom-layout",
        div_redLine:{position:pageInfo.RES_RC_P,
            z:-1200, rrcX:0.41, rrcY:0.17, rrcXOffset:-280, rrcYOffset:0, rPointX:0, rPointY:-130,
            rotationZ:-3, width:5000, height:4},  // used has parent, so it has to be defined first
        div_bgContent:{html:"<div class='textPlane380'></div>", position:pageInfo.RES_RC_P,
            parent : "div_redLine",
            z:-1500, rrcXOffset:80, rrcYOffset:-1000,
            rotationZ:34.5, width:400, height:2500},     
        h2_client:{position:pageInfo.RES_RC_P,
            secondary:true,
            parent:"div_redLine",
            z:-80, rrcXOffset:0, rrcYOffset:-80, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:500, height:25},
        h1_title:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            z:-50, rrcXOffset:0, rrcYOffset:-60, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:500, height:50},
        p_skillsIcon:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            secondary:true,
            z:-100, rrcXOffset:200, rrcYOffset:-75, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:420, height:74},
        p_content:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            secondary:true,
            z:-150, rrcXOffset:0, rrcYOffset:25, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:330, height:240, wrapLeftOffset:0},
        div_player:{position:pageInfo.RES_RC_P,
            secondary:{stayHidden:true},
            z:0, rrcX:-0.41, rrcY:-0.25, rrcXOffset:0, rrcYOffset:0,
            rotationZ:-3, width:100, height:100},
        button_playButton:{position:pageInfo.RES_RC_P,
            secondary:true,
            z:0, rrcX:-0.35, rrcY:0.25, rrcXOffset:0, rrcYOffset:0,
            rotationZ:-3, width:620, height:250, clickHandler:"playVideo"},
        img_background:{position:pageInfo.RES_RC_P, scale:"_scaleVisuel", extraScale:0.9, src:MAIN_IMAGE,
            z:-3500, rrcX:0, rrcY:0, rrcXOffset:0, rrcYOffset:0,
            rPointX:450, rPointY:-100, width:1280, height:720}
    };
    
    var cX = 0.33;
    var cY = -0.12;
    
    pageInfo.RIGHT_LAYOUT = {
        id:"right-layout",
        div_redLine:{position:pageInfo.RES_RC_P,
            z:-1200, rrcX:cX, rrcY:cY, rrcXOffset:-320, rrcYOffset:0, rPointX:0, rPointY:-130,
            rotationZ:-3, width:5000, height:4},  // used has parent, so it has to be defined first
        div_bgContent:{html:"<div class='textPlane'></div>", position:pageInfo.RES_RC_P,
            parent : "div_redLine",
            z:-1500, rrcXOffset:-80, rrcYOffset:-1000,
            rotationZ:-25, width:400, height:2500},     
        h2_client:{position:pageInfo.RES_RC_P,
            secondary:true,
            parent:"div_redLine",
            z:-80, rrcXOffset:-26, rrcYOffset:-80, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:500, height:25},
        h1_title:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            z:-50, rrcXOffset:-16, rrcYOffset:-60, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:500, height:50},
        p_skillsIcon:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            secondary:true,
            z:-100, rrcXOffset:35, rrcYOffset:20, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:420, height:74},
        p_content:{position:pageInfo.RES_RC_P,
            parent:"div_redLine",
            secondary:true,
            z:-150, rrcXOffset:0, rrcYOffset:100, // no need of rrcX or rrcY, parent's rrcX & rrcY used
            width:560, height:240, wrapLeftOffset:20},
        div_player:{position:pageInfo.RES_RC_P,
            secondary:{stayHidden:true},
            z:0, rrcX:-0.41, rrcY:-0.25, rrcXOffset:0, rrcYOffset:0,
            rotationZ:-3, width:100, height:100},
        button_playButton:{position:pageInfo.RES_RC_P,
            secondary:true,
            z:0, rrcX:-0.39, rrcY:0.25, rrcXOffset:0, rrcYOffset:0,
            rotationZ:-3, width:620, height:250, clickHandler:"playVideo"}
    };
    
    pageInfo.IKAF_LAYOUT = UTILS.clone(pageInfo.RIGHT_LAYOUT);
    pageInfo.IKAF_LAYOUT.div_redLine.rrcX = 0.38;
    pageInfo.IKAF_LAYOUT.div_redLine.rrcY = -0.18;
    pageInfo.IKAF_LAYOUT.p_content.width = 500;
    pageInfo.IKAF_LAYOUT.div_bgContent.html = "<div class='textPlane380'></div>";
    pageInfo.IKAF_LAYOUT.div_bgContent.width = 380;
    //pageInfo.IKAF_LAYOUT.div_redLine.rrcYOffset = -40;
    
    
    cX = -0.20; //-265
    cY = -0.12;;
    
    pageInfo.ABOUT_LAYOUT = {
        id:"about-layout",        
        
        div_hireMeAbout:{position:pageInfo.RES_RC_P,  
            z:100, rrcX:0.30, rrcY:-0.45, rrcXOffset:10, rrcYOffset:35,
            z:-5,
            scale:{minL:0.4, maxL:0.88},
            width:300, height:250 
        },
        
        h1_title:{position:pageInfo.FOV_RELATED,
            x:{minL:185-340, maxL:650-960},
            y:{minL:85-188, maxL:350-540},            
            z:-100,
            width:1200, height:88,
            scale:{minL:0.4, maxL:0.7}, // max 0.7
        },
        
        h2_name:{position:pageInfo.FOV_RELATED,
            parent:"h1_title",
            x:0,
            y:{minL:-20, maxL:-30},        
            z:-300,
            width:422, height:49,
            scale:{minL:0.4, maxL:0.7} // max 0.7
        },
        p_intro:{position:pageInfo.FOV_RELATED,
            parent:"h1_title",
            x:{minL:0, maxL:5}, 
            y:{minL:60, maxL:80},       
            z:-600,
            width:1130, height:216,
            scale:{minL:0.4, maxL:0.6} // max 0.6
        },
        h3_skillsFieldTitle:{position:pageInfo.FOV_RELATED,
            x:{minL:-5-340, maxL:250-960},
            y:{minL:240-188, maxL:650-540},            
            z:-300,
            scale:{minL:0.35, maxL:0.8}, // max 0.7
            width:332, height:72},
        
        h3_timelineTitle:{position:pageInfo.FOV_RELATED,
            x:{minL:320-340, maxL:1300-960},
            y:{minL:200-188, maxL:700-540},            
            z:-400,
            scale:{minL:0.35, maxL:0.8}, // max 0.7
            width:492, height:100},

        
        div_skillsFieldMenu:{position:pageInfo.FOV_RELATED,
            x:{minL:-160-340, maxL:90-960},
            y:{minL:180-188, maxL:620-540},
            z:-500,
            scale:{minL:0.32, maxL:0.7}, // max 0.7
            width:1240, height:500},
        
        
        a_skillsFieldButton:{position:pageInfo.RES_RC_P,  
            z:50, rrcX:-0.14, rrcY:0.30, rrcXOffset:-15, rrcYOffset:30,
            width:276, height:56,
            secondary:true,              
            extraScale:0.5},
        a_timelineButton:{position:pageInfo.RES_RC_P,
            z:50, rrcX:0.30, rrcY:0.35, rrcXOffset:-40, rrcYOffset:0,
            width:284, height:56,
            secondary:true,
            extraScale:0.5},
        
        img_trsBg:{html:"<img src='images/pages/about/alpha_background.png'/>",
                   position:pageInfo.RES_RC_P,
                    z:-2000,
            rrcX:0, rrcY:0.05,  rrcXOffset:0, rrcYOffset:50,
            rPointX:0, rPointY:0, width:1366, height:665,
            scale:{minL:0.65, maxL:1.6},
        },
        
        img_bgOpt:{src:MAIN_IMAGE,
                   scale:"_scaleVisuel", position:pageInfo.RES_RC_P,
            z:-6000, rrcX:-0.28, rrcY:-0.27, rrcXOffset:70, rrcYOffset:50,
                rPointX:0,rPointY:0,
            width:1280, height:720} // z = -3000
    };
    
    pageInfo.SKILLS_LAYOUT = {
        id:"skills-layout",
        img_background:{position:pageInfo.RES_RC_P, scale:"_scaleAboutVisuel", src:MAIN_IMAGE,
            z:-1500, rrcX:0, rrcY:0.05, rrcXOffset:-40, rrcYOffset:-40,
            rPointX:0, rPointY:0, width:1568, height:641,
            scale:{minL:0.7, maxL:1.3},           
            },
        
        _skillsMenu:{position:pageInfo.RES_RC_P,
            z:50, rrcX:0, rrcY:0.175, rrcXOffset:-733, rrcYOffset:-55,
            scale:{minL:0.45, maxL:0.60},
            width:1424, height:150},
        
        _editingSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.05, rrcXOffset:-245, rrcYOffset:-80,
            width:990, height:268, opacity:0, sectionId:"editing-3d",
            scale:{minL:0.8, maxL:1.2}},
        _researchSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.05, rrcXOffset:-415, rrcYOffset:-80,
            width:990, height:268, opacity:0, sectionId:"research",
            scale:{minL:0.8, maxL:1.2}},
        _compositingSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.05, rrcXOffset:-415, rrcYOffset:-80,
            width:990, height:268, opacity:0, sectionId:"compositing",
            scale:{minL:0.8, maxL:1.2}},
        _frontSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.05, rrcXOffset:-415, rrcYOffset:-80,
            width:990, height:257, opacity:0, sectionId:"front",
            scale:{minL:0.8, maxL:1.2}},
        _motionSection:{position:pageInfo.RES_RC_P,
            z:-100, rrcX:0, rrcY:-0.04, rrcXOffset:-415, rrcYOffset:-80,
            width:990, height:268, opacity:1, sectionId:"motion",
            scale:{minL:0.8, maxL:1.2}
            },
        
        
        div_hireMeSkills:{
            position:pageInfo.RES_RC_P,
            z:100, rrcX:0.30, rrcY:-0.45, rrcXOffset:10, rrcYOffset:35,
            z:-5,
            scale:{minL:0.4, maxL:0.88},
            width:360, height:250
        }
    };
    
        
    
    var scaleH3 = 1.4
    var offsetXDate = 80; 
    var offsetXT1 = -10; 
    var offsetYT1 = 5; 
    
    pageInfo.TIMELINE_LAYOUT = {
        id:"timeline-layout",
        grid:{alpha:0.5},
        
        h1:{position:pageInfo.FOV_RELATED,
            x:{minL:505-340, maxL:1150-960},
            y:{minL:60-188, maxL:80-540},
            z:-200, useOffsetRatio:true,
            width:620, height:132,
            scale:{minL:0.4, maxL:0.9}},
        
        
        img_timeline:{position:pageInfo.FREE3D_P,
                src:MAIN_IMAGE,
                x:-510, y:-1335, z:1280, rX:0, rY:90, rZ:180, scale:3.5},
        img_tmleBg:{position:pageInfo.FREE3D_P,
                html:"<img src='images/pages/timeline/alpha_dates.png'/>",
                x:-450, y:-1070, z:860, rX:0, rY:90, rZ:180, scale:3.5},        
        div_block:{position:pageInfo.FREE3D_P,
                html:"<div class='block01'></div>",
                secondary:{delay:0.6},
                x:-1470, y:-2500, z:330, rX:0, rY:90, rZ:0, scale:1},            
        div_block2:{position:pageInfo.FREE3D_P,
                html:"<div class='block02'></div>",
                secondary:{delay:0.7},
                x:-1700, y:-2520,
                z:{minL:2120, maxL:2350},
                rX:0, rY:90, rZ:0, scale:1},        
        div_block3:{position:pageInfo.FREE3D_P,
                html:"<div class='block03'></div>",
                secondary:{delay:0.8},
                x:-691, y:-400,
                z:{minL:1, maxL:-200},
                rX:0, rY:0, rZ:0, scale:1},
        div_corner:{position:pageInfo.FREE3D_P,
                html:"<div class='block-corner'></div>",
                secondary:{delay:0.9},
                x:-691, y:-3517,
                z:{minL:-1657, maxL:-1857},
                rX:56, rY:0, rZ:0, scale:1},
        div_block4:{position:pageInfo.FREE3D_P,
                html:"<div class='block04'></div>",
                secondary:{delay:1},
                x:-1791, y:-1200,
                z:{minL:-1100, maxL:-1300},
                rX:0, rY:90, rZ:0, scale:1},
        
        
        p_contentNow:{position:pageInfo.FOV_RELATED,
            x:{minL:60-340, maxL:336-960},
            y:{minL:10-188, maxL:164-540},
            z:-3500, useOffsetRatio:true,
            //x:{minL:0, maxL:0},y:{minL:0, maxL:0}, z:0,
            secondary:{delay:0.73},
                      /*, rPointX:-283, rPointY:-31,*/
            width:586, height:62, scale:{minL:0.5, maxL:1}},
        
        h3_date2012:{position:pageInfo.FOV_RELATED,
            x:{minL:110-340+offsetXT1, maxL:445-960+offsetXT1},
            y:{minL:36-188+offsetYT1, maxL:224-540+offsetYT1},
            z:-3700, useOffsetRatio:true,
            secondary:{delay:0.63},
            width:100, height:50,
            scale:{minL:0.5, maxL:0.9}}, 
        h3_date2006:{position:pageInfo.FOV_RELATED,
            x:{minL:217-340+offsetXT1, maxL:688-960+offsetXT1},
            y:{minL:113-188+offsetYT1, maxL:405-540+offsetYT1},
            z:-3500, useOffsetRatio:true,
            secondary:{delay:0.53},
            width:100, height:70, scale:{minL:0.5, maxL:0.9}},
        h3_date2004:{position:pageInfo.FOV_RELATED,
            x:{minL:257-340+offsetXT1, maxL:778-960+offsetXT1},
            y:{minL:142-188+offsetYT1, maxL:470-540+offsetYT1},
            z:-3300, useOffsetRatio:true,
            secondary:{delay:0.43},
            width:100, height:70, scale:{minL:0.5, maxL:0.9}},
        h3_date2001:{position:pageInfo.FOV_RELATED,
            x:{minL:320-340+offsetXT1, maxL:926-960+offsetXT1},
            y:{minL:193-188+offsetYT1, maxL:581-540+offsetYT1},
            z:-3100, useOffsetRatio:true,
            secondary:{delay:0.33},
            width:100, height:70, scale:{minL:0.5, maxL:0.9}},
        h3_date1999:{position:pageInfo.FOV_RELATED,
            x:{minL:366-340+offsetXT1, maxL:1028-960+offsetXT1},
            y:{minL:230-188+offsetYT1, maxL:660-540+offsetYT1},
            z:-2900, useOffsetRatio:true,
            secondary:{delay:0.23},
            width:100, height:70, scale:{minL:0.5, maxL:0.9}},
        h3_date1997:{position:pageInfo.FOV_RELATED,
            x:{minL:418-340+offsetXT1, maxL:1144-960+offsetXT1},
            y:{minL:269-188+offsetYT1, maxL:747-540+offsetYT1},
            z:-2700, useOffsetRatio:true,
            secondary:{delay:0.13},
            width:100, height:70, scale:{minL:0.5, maxL:0.9}},

        
        p_content2012:{position:pageInfo.FOV_RELATED,
            parent:"h3_date2012",
            x:{minL:50, maxL:90},
            y:{minL:5, maxL:13},
            z:-3750, useOffsetRatio:true,
            secondary:{delay:0.65},
            scale:{minL:0.6, maxL:1},
            width:270, height:36, clickHandler:"openDatePanel"},     
        div_content2012_open:{position:pageInfo.FOV_RELATED,
            parent:"h3_date2012",
            x:{minL:-15, maxL:-15},
            y:{minL:-3, maxL:-3 },
            z:0, useOffsetRatio:true,
            opacity:0,
            visibility:"hidden",
            secondary:{stayHidden:true},
            scale:{minL:1, maxL:1},
            width:400, height:52},
        
        p_content2006:{position:pageInfo.FOV_RELATED,
            parent:"h3_date2006",
            x:{minL:50, maxL:90},
            y:{minL:5, maxL:13}, z:-3550, useOffsetRatio:true,
            secondary:{delay:0.55},
            scale:{minL:0.6, maxL:1},
            width:270, height:36, clickHandler:"openDatePanel"},
        div_content2006_open:{position:pageInfo.FOV_RELATED,
            parent:"h3_date2006",
            x:{minL:-15, maxL:-15},
            y:{minL:-3, maxL:-3 },
            z:0, useOffsetRatio:true,
            opacity:0,
            visibility:"hidden",
            secondary:{stayHidden:true},
            scale:{minL:1, maxL:1},
            width:400, height:52},
        
        
        p_content2004:{position:pageInfo.FOV_RELATED,
            parent:"h3_date2004",
            x:{minL:50, maxL:90},
            y:{minL:21, maxL:31}, z:-3350, useOffsetRatio:true,
            secondary:{delay:0.45},
            scale:{minL:0.6, maxL:1},
            width:300, height:18, clickHandler:"openDatePanel"},
         div_content2004_open:{position:pageInfo.FOV_RELATED,
            parent:"h3_date2004",
            x:{minL:-15, maxL:-15},
            y:{minL:-3, maxL:-3 },
            z:0, useOffsetRatio:true,
            opacity:0,
            visibility:"hidden",
            secondary:{stayHidden:true},
            scale:{minL:1, maxL:1},
            width:400, height:52},
        
        p_content2001:{position:pageInfo.FOV_RELATED,
            parent:"h3_date2001",
            x:{minL:50, maxL:90},
            y:{minL:21, maxL:31}, z:-3150, useOffsetRatio:true,
            secondary:{delay:0.35},
            scale:{minL:0.6, maxL:1},
            width:370, height:18},
        
        p_content1999:{position:pageInfo.FOV_RELATED,
            parent:"h3_date1999",
            x:{minL:50, maxL:90},
            y:{minL:21, maxL:31}, z:-2950, useOffsetRatio:true,
            secondary:{delay:0.25},
            scale:{minL:0.6, maxL:1},
            width:363, height:18, clickHandler:"openDatePanel"},
        div_content1999_open:{position:pageInfo.FOV_RELATED,
            parent:"h3_date1999",
            x:{minL:-15, maxL:-15},
            y:{minL:-3, maxL:-3 },
            z:0, useOffsetRatio:true,
            opacity:0,
            visibility:"hidden",
            secondary:{stayHidden:true},
            scale:{minL:1, maxL:1},
            width:400, height:52},
        
        p_content1997:{position:pageInfo.FOV_RELATED,
            parent:"h3_date1997",
            x:{minL:50, maxL:90},
            y:{minL:21, maxL:31}, z:-2750, useOffsetRatio:true,
            secondary:{delay:0.15},
            scale:{minL:0.6, maxL:1},
            width:350, height:18, clickHandler:"openDatePanel"},
       div_content1997_open:{position:pageInfo.FOV_RELATED,
            parent:"h3_date1997",
            x:{minL:-15, maxL:-15},
            y:{minL:-3, maxL:-3 },
            z:0, useOffsetRatio:true,
            opacity:0,
            visibility:"hidden",
            secondary:{stayHidden:true},
            scale:{minL:1, maxL:1},
            width:400, height:52},
       
        /*img_timelinehelper:{position:pageInfo.FOV_RELATED,
            html:"<img src='images/timeline_helper_001.png'/>",
            x:{minL:-91, maxL:-199},y:{minL:46, maxL:72}, z:0,
            scale:{minL:0.52, maxL:1}, width:919, height:497, rPointX:0, rPointY:0},*/
        
        
        
        
            
        
        
        img_line01:{position:pageInfo.FREE3D_P,html:"<img class='white-line' src='images/pages/timeline/white_line.png'/>",
                    secondary:{delay:0.68},
                      x:-700, y:1253, z:1150, rX:60, rY:-40, rZ:0, scale:1},
        img_line02:{position:pageInfo.FREE3D_P,html:"<img class='white-line' src='images/pages/timeline/white_line.png'/>",
                    secondary:{delay:0.58},
                      x:-700, y:1002, z:1150, rX:60, rY:-40, rZ:0, scale:1},
        img_line03:{position:pageInfo.FREE3D_P,html:"<img class='white-line' src='images/pages/timeline/white_line.png'/>",
                    secondary:{delay:0.48},
                      x:-700, y:246, z:1150, rX:40, rY:-40, rZ:0, scale:1},
        img_line04:{position:pageInfo.FREE3D_P,html:"<img class='white-line' src='images/pages/timeline/white_line.png'/>",
                    secondary:{delay:0.38},
                      x:-700, y:-9, z:1150, rX:30, rY:-40, rZ:0, scale:1},
        img_line05:{position:pageInfo.FREE3D_P,html:"<img class='white-line' src='images/pages/timeline/white_line.png'/>",
                    secondary:{delay:0.28},
                      x:-700, y:-386, z:1150, rX:20, rY:-40, rZ:0, scale:1},
        img_line06:{position:pageInfo.FREE3D_P,html:"<img class='white-line' src='images/pages/timeline/white_line.png'/>",
                    secondary:{delay:0.18},
                      x:-700, y:-635, z:1150, rX:0, rY:-40, rZ:0, scale:1},
        img_line07:{position:pageInfo.FREE3D_P,html:"<img class='white-line' src='images/pages/timeline/white_line.png'/>",
                    secondary:{delay:0.08},
                      x:-700, y:-885, z:1150, rX:-20, rY:-40, rZ:0, scale:1},
    };
    //from AEX : - - +

    /*img_background:{src:"mainImage", x:733, y:755, z:-143, scale:1.87, rX:142.122, rY:3.39142, rZ:237.937}*/

    
    pageInfo.content = [
        {   
            id: "tot",
            project: true,
            images: {
                front:{html:"<img src='images/pages/tot/front.png'/>", position:pageInfo.RES_RC_P, scale:"_scaleVisuel", z:-1000, rrcX:0, rrcY:0, rrcXOffset:0, rrcYOffset:0, rPointX:0, rPointY:0, width:1280, height:720},
                background:{position:pageInfo.RES_RC_P, scale:"_scaleVisuel", src:MAIN_IMAGE,
            z:-3500, rrcX:0, rrcY:0, rrcXOffset:0, rrcYOffset:0,
            rPointX:0, rPointY:0, width:1280, height:720}
            },
            info: {},
            videoId: "OBa37rBBMS4",
            x:4500, y:-3562, z:1000, rotationX:17, rotationY:-170, rotationZ:-30,
            bgX:1.7,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.IKAF_LAYOUT
        },
        {
            id: "ikaf",
            project: true,
            images: {
                background:{src:MAIN_IMAGE, position:pageInfo.RES_RC_P,
                        scale:"_scaleVisuel", extraScale:0.95, z:-1000, rrcX:0.15, rrcY:0,
                        rPointX:150, rPointY:-50,
                        rrcXOffset:-130, rrcYOffset:0, width:1280, height:720},
            },
            info: {},
            videoId: "kiX1dpp7_C4",
            x:-2952, y:-1456, z: -3537, rotationX: -7, rotationY:11, rotationZ:27,
            bgX:1.7,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.IKAF_LAYOUT
        },
        {
            id: "borgia",
            project: true, 
            info: {},           
            videoId: "IS4Khh9rmi4",
            x:4550, y:-386, z:-6, rotationX:12, rotationY:17, rotationZ:210,
            //x:1882, y:-386, z:-1906, rotationX:3, rotationY:-3, rotationZ:194,
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
            x:-2057, y:1288, z:-240, rotationX:1, rotationY:-5, rotationZ:201,
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
            x:-2573, y:-137, z:-2763, rotationX:11, rotationY:-5, rotationZ:150,
            bgX:1.90,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.LEFT_LAYOUT
        },
        {
            id: "greetings",
            project: true,
            images: {
                background:{position:pageInfo.RES_RC_P, scale:"_scaleVisuel", src:MAIN_IMAGE,
                        z:-3500, rrcX:0, rrcY:0, rrcXOffset:0, rrcYOffset:0,
                        rPointX:0, rPointY:0, width:1280, height:720}
            },
            info: {},
            videoId: "inoqVpPplYw",
            x:2576, y:4432, z:873, rotationX:-7.8, rotationY:-154.2, rotationZ:89.5,
            //x:576, y:4432, z:1927, rotationX:-0.8, rotationY:-154.2, rotationZ:92.5,
            bgX:1.6,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.IKAF_LAYOUT
        },
        {
            id: "ikaf2",
            project: true,
            images: {
                front:{html:"<img src='images/pages/ikaf2/front.png'/>", position:pageInfo.RES_RC_P,
                       scale:"_scaleVisuel", z:-1000, rrcX:0, rrcY:0, rrcXOffset:0,
                       rrcYOffset:0, rPointX:380, rPointY:-85, width:343, height:582},
                background:{position:pageInfo.RES_RC_P, scale:"_scaleVisuel", src:MAIN_IMAGE,
                        z:-3500, rrcX:0, rrcY:0, rrcXOffset:0, rrcYOffset:0,
                        rPointX:0, rPointY:0, width:1280, height:720}
            },
            info: {},
            videoId: "A85dZro-wr4",
            x:3000, y:-1152, z:1600, rotationX:15, rotationY:-170, rotationZ:-23,
            bgX:1.65,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.IKAF_LAYOUT
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
            mainImageName: "main.svg",
            info: {},
            x:-4200, y:-646, z:-1902, rotationX:-48.6, rotationY:-400, rotationZ:-94.8,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.TIMELINE_LAYOUT,
            free3DContainer:{x:-500,y:1000,z:-1100, rotationX:0, rotationY:0, rotationZ:0, scale:1.65}
        },
         {
            id: "skillsfield",
            project: false,
            info: {noBg:true},
            x:1538, y:-4505, z: 360, rotationX: -83, rotationY:-398, rotationZ:-15,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.SKILLS_LAYOUT
        }/*,
         {
            id: "moreprojects",
            project: false,
            info: {noBg:true},
            x:1552, y:-4505, z: 360, rotationX: -135, rotationY:-270, rotationZ:45,
            loaded:loadedDefault,
            built:false,
            layout:pageInfo.SKILLS_LAYOUT
        }*/
    ]
    
    for(var i = 0; i<pageInfo.content.length; i++){
        pageInfo.content[i].z = -pageInfo.content[i].z;   
        pageInfo.content[i].rotationX = -pageInfo.content[i].rotationX;
        pageInfo.content[i].rotationY = -pageInfo.content[i].rotationY;   
    }
    
    return pageInfo;
});