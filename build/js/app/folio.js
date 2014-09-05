define(["jquery","TweenMax","signals","../app/pageInfo","Sprite3D","../app/Page3D"],function(a,b,c,d,e,f){var g={};const h=Math.PI/180,i=1280,j=15,k={x:0,y:0,z:0,rotationX:0,rotationY:90,rotationZ:0};var l,m,n,o,p,q,r,s,t,u,v=!1,w="",x=[],y=!1,z=0,A=0,B=0,C=function(){z++,g.on.creationProgress.dispatch(Number(z/A))};g.on={initialized:new c.Signal,pageLoaded:new c.Signal,readyForIntroTransition:new c.Signal,creationProgress:new c.Signal,creationComplete:new c.Signal,twPositionDefined:new c.Signal,pageLoading:new c.Signal,hireMeClicked:new c.Signal,pageReady:new c.Signal,pageCreationComplete:new c.Signal},g.kill=function(){eb(),fadeOut(w),n=null,m=null,a(q).css("visibility","hidden"),u&&u.hide(),b.to(l,.2,{autoAlpha:0})},g.wakeup=function(){a(q).css("visibility","visible")},g.init=function(b,c){A=yb+1,l=a(".touch-anim-container"),collectContent(),buildTimelines(),buildScene(),d.on.imagesLoaded.add(onImageLoaded),g.on.initialized.dispatch(b,c),g.resize()},g.contains=function(b){return a("#folio")[0].contains(b)},g.load=function(a,b){var c=d.getPageInfo(a);c&&(c.loaded?g.on.pageLoaded.dispatch(a,b):d.loadImage(a,b))};var D=!1;this.onImageLoaded=function(a,b){g.on.pageLoaded.dispatch(a,b),D?E(a):C()};var E=function(a){g.on.pageLoading&&(g.on.pageLoading.dispatch(),g.on.pageLoading=null),D=!0,F(a),g.load(d.getNextPageId(a)),g.load(d.getPrevPageId(a))},F=function(a){var b=d.getPageInfo(a);if(!b.built){var c=buildPage3D(d.getPageInfo(a));updatePage3D(c,b)}};g.resize=function(){if(v){if(a("#folio").css("left",LAYOUT.vW2),a("#folio").css("top",LAYOUT.vH2),q.setPerspective(-LAYOUT_3D.PX_PERFECT_DISTANCE),q.translate2D(LAYOUT.vW2,LAYOUT.vH2),CONFIG.isFirefox||CONFIG.isChrome36){var b=String(Number(-LAYOUT.vW2))+"px "+String(Number(-LAYOUT.vH2))+"px";a("#folio").css("perspective-origin",b)}r.translateOffsetX=-LAYOUT.vW2,r.translateOffsetY=-LAYOUT.vH2,r.translate2D(0,0),m&&updatePage3D(m),n&&updatePage3D(n)}},getPage3D=function(a){for(var b=0;b<x.length;b++)if(x[b].getId()==a)return x[b];return null},g.pageIsProject=function(a){return getPage3D(a).getPageInfo().project};var G={tmxDuration:2,twPos:Number(0),twMem:0},H=new TimelineMax({paused:!0});if(buildTimelines=function(){H.add("empty"),H.add(d.content[0].id);for(var a=0;a<d.content.length-1;a++){var b=d.content[a+1].id;H.append(TweenLite.to(G,G.tmxDuration,{twPos:Number(a+1),ease:Quad.easeInOut})),H.add(b),H.addPause()}CONFIG.debug&&updateUI()},getValForProp=function(a,b,c){var e;if(b==parseInt(b))e=-d.content[parseInt(b)][a];else{var f=Math.ceil(b-1),g=Math.ceil(b),h=d.content[f][a],i=d.content[g][a];e=-(h+(i-h)*(b-parseInt(b)))}return e},setTweenPosition=function(a,b,c){Q=L=0,S=Y=!1,H.currentLabel(a),$=G.twMem=G.twPos=Number(d.getPageIndex(a)),updateWindowStatus(a,b),null===c&&(c=!1),c||(u&&u.updateState(m.getPageInfo()),m.getPageInfo().project&&m.preloadVideo())},updateWindowStatus=function(a,b){w=a,o=b?b:null,g.on.twPositionDefined.dispatch(w,o)},onUpdateTmx=function(){G.twPos=Number(G.twPos).toFixed(5),isNaN(G.twPos)||G.twPos>d.content.length-1||(s.x=getValForProp("x",G.twPos,!1),s.y=getValForProp("y",G.twPos),s.z=getValForProp("z",G.twPos),s.rotationX=getValForProp("rotationX",G.twPos),s.rotationY=getValForProp("rotationY",G.twPos),s.rotationZ=getValForProp("rotationZ",G.twPos),CONFIG.debug&&updateUI())},CONFIG.debug){var I=d.content.length;updateUI=function(){var b=isNaN(H.totalProgress())?I:H.totalProgress()*I;a("#timeValue").html("val: "+b.toFixed(2)+" - tweenPositionValue: "+G.twPos)}}g.onTouchClick=function(b){if(g.contains(b))if(a(b).parent().is("a")){var c=a(b).parent().attr("href");window.location.hash=c}else if(a(a(b).children()[0]).is("a")){var c=a(a(b).children()[0]).attr("href");window.location.hash=c}};var J,K,L,M,N,O,P,Q=0,R=0,S=!1,T=200,U=40,V=0,W=.5,X=.1,Y=!1,Z=!1,$=0,_=-1,ab=!1;g.onTouchStart=function(a){if(Ib){Y=!1,J=a.target,K=a.target.className;var b=a.changedTouches[0];Q=R=0,L=parseInt(b.pageX),Z?(ab=!0,$=Number(G.twPos)):(ab=!1,$=G.twMem)}},g.onTouchMove=function(a){if(Ib){var b=a.changedTouches[0];Q=-(parseInt(b.pageX)-L),R=parseInt(b.pageY)-M,S=!1}};var bb=function(a,b){for(var c=0;c<x.length;c++)a!=x[c].getId()&&x[c].hide(b)};g.onTouchEnd=function(){Ib&&(Q>0&&G.twPos==d.content.length-1||0>Q&&0==G.twPos||(Z?(Y=!0,ab&&(ab=!1,bb(N,0),fadeInAndActivate(N,.2),w=N)):(S=!0,Y=!1)))},updateContainerInteraction=function(){if(!(Q>0&&G.twPos==d.content.length-1||0>Q&&0==G.twPos)){if(Math.abs(Q)>U,ab&&Math.abs(Q)>U){var a=(Math.abs(Q)-U)/512;if(_=Math.round(Q>0?Number(G.twPos)+a:Number(G.twPos)-a),0>_||_>d.content.length-1)return;N=d.content[_].id,prepPgeForTransition(N)}if(S)if(Y=!1,Math.abs(Q)>.01&&Math.abs(Q)<T)V+=(0-Q)*W,Q+=Number(V*=X);else if(Math.abs(Q)>T){if(0>_){if(_=Q>0?G.twMem+1:G.twMem-1,0>_||_>d.content.length-1)return;N=d.content[_].id}Z||(O=m,Z=!0),Y=!0}else S=!1;if(Y){var b=_-Number(G.twPos),c=.09*b;G.twPos=Number(Number(G.twPos)+Number(c)),Math.abs(b)<.1&&w!=N&&(w=N,bb(N,0),fadeInAndActivate(N,.2)),Math.abs(b)<.0015&&m.getId()!=w&&Qb(w),Math.abs(b)<1e-4&&(ab=Z=!1,_=-1,transitionComplete(N))}else{var e=Q/LAYOUT.viewportW;G.twPos=Number($)+.5*e}onUpdateTmx()}};var cb=!1,db=function(){cb||(cb=!0,fb())},eb=function(){cb=!1},fb=function(){cb&&requestAnimationFrame(fb),GLOBAL_ACCESS.stats&&GLOBAL_ACCESS.stats.update(),renderContainer(),updateContainerInteraction()};g.toggleRenderer=function(){cb?eb():db()},renderContainer=function(){s&&s.update()},collectContent=function(){for(var b=0;b<d.content.length;b++){var c=d.content[b],e=a("div[page-id*='"+c.id+"']");d.content[b].elementJQ=e}a("#folioContent").remove(),require(["app/nextPrev"],function(a){u=a,u.on.backToTheReelPress.add(gb),u.init(),m&&u.updateState(m.getPageInfo())})};var gb=function(){window.location.hash="#/reel/"+w+"/"};buildScene=function(){q=e.createCenteredContainer(),q.setId("folio"),r=(new e).setId("interactContainer").setRegistrationPoint(0,0,0),s=(new e).setId("contentContainer").setRotateFirst(!0).setRegistrationPoint(0,0,0),r.addChild(s),q.setPerspective(-LAYOUT_3D.PX_PERFECT_DISTANCE),q.addChild(r),P=buildGridTile(0,1),v=!0};var hb,ib,jb,kb=[],lb=400,mb=8e3,nb=220,ob=15,pb=-1e5,qb=2e3,rb=2e3,sb=100,tb=100,ub=50,vb=50;CONFIG.isMobile&&(nb=130,ob=10,mb=6e3,lb=200,qb=1500,rb=1500);var wb,xb,yb=CONFIG.hyperDriveTransition?lb/vb:0,zb=nb+800,Ab=0,Bb=function(){for(var a=r.z,b=lb-1;b>=0;b--){var c=kb[b];if(a+c.z>zb){var d=c.z-mb;c.setZ(d).update()}}};g.startIntroTransition=function(a,b){wb=a,xb=b,CONFIG.hyperDriveTransition?t?Fb():Db():(Hb(),transitionComplete(a))};var Cb=function(){b.set(l,{autoAlpha:1}),r.addChild(t),r.setPosition(-LAYOUT.vW2,-LAYOUT.vH2,pb),r.setRotation(0,-90,-100).update(),getPage3D(wb)&&fadeInAndActivate(wb,0);for(var a=0;a<kb.length;a++){var c=parseInt(ib+jb*a),d=kb[a];d.setZ(c).update()}},Db=function(){t=(new e).setId("hyperdriveContainer").setRegistrationPoint(0,0,0),t.setPosition(-(nb/2),-(ob/2),0),t.setRotateFirst(!1),t.update(),a(".hyperdrive-particle").css("width",nb+"px"),a(".hyperdrive-particle").css("height",ob+"px"),ib=-pb-LAYOUT_3D.PX_PERFECT_DISTANCE-mb,jb=mb/lb,hb=setInterval(Eb,ub)},Eb=function(){if(kb.length>=lb)clearInterval(hb),Fb();else{for(var a=0;vb>a;a++){Ab++;var b=new e;b.setId("prtcle"+a),b.setInnerHTML("<div class='hd-prtcle-tex'></div>"),b.addClassName("hd-prtcle");var c=Math.random()*qb-(qb>>1),d=Math.random()*rb-(rb>>1);b.setRotateFirst(!1),d>-tb&&tb>d&&c>-sb&&sb>c&&(d>-tb&&tb>d&&(d>0?d+=tb:d-=tb),c>-sb&&sb>c&&(c>0?c+=sb:c-=sb)),b.setPosition(c,d,0),b.setOpacity(.3+.75*Math.random());var f=180*Math.atan2(d,c)/Math.PI;b.setRotation(-f,90,0),kb.push(b),t.addChild(b)}C()}},Fb=function(){Cb();var c=.5,d=10,e=1.2,f=c+d,g=f-e;b.to(r,d,{onStart:Hb,delay:c,z:0,onUpdate:function(){r.updateZLast(),Bb()},ease:Power1.easeOut,onComplete:Gb}),b.to(r,2,{delay:c+1,rotationY:0,ease:Power1.easeInOut,onComplete:function(){}}),b.to(r,4,{delay:c+3.8,rotationZ:0,ease:Power1.easeInOut}),b.fromTo(a("#contentContainer"),2*e,{opacity:0},{delay:g-e-.5,opacity:1,onComplete:function(){Qb(wb)}}),b.fromTo(a("#hyperdriveContainer"),e/3,{opacity:1},{delay:g-e/2-.8,opacity:0}),b.fromTo(l,3,{autoAlpha:1},{delay:d+c-.5,autoAlpha:0})},Gb=function(){r.removeChild(t),setTweenPosition(wb,xb),E(m.getId())},Hb=function(){g.on.readyForIntroTransition.dispatch(wb,xb),g.on.creationComplete.dispatch()};buildGridTile=function(a,b){var c=(new e).setClassName("grid").setId("grid-3d").setRotateFirst(!1).setPosition(k.x+a*i*j,k.y*b,-k.z).setRotation(-k.rotationX,-k.rotationY,k.rotationZ).setRegistrationPoint(640,640,0).setScale(j,j,1).update();return s.addChild(c),c},buildPage3D=function(a){var b=a.elementJQ,c=new f(b,a).setId(a.id);return s.addChild(c),c.setParentSprite(s),x.push(c),a.built=!0,B++,g.on.pageReady.dispatch(a.id),Mb(a.id),B>=d.content.length&&g.on.pageCreationComplete.dispatch(),("skillsfield"==a.id||"about"==a.id)&&initSkillsMenu(a.id),c};var Ib=!1,Jb=function(a){var b=d.getNextPageId(a.getId());return null==b?null:null==getPage3D(b)?!1:getPage3D(b).getPageInfo().built},Kb=function(a){var b=d.getPrevPageId(a.getId());return null==b?null:null==getPage3D(b)?!1:getPage3D(b).getPageInfo().built},Lb=function(a){var b=Jb(a)!==!1,c=Kb(a)!==!1;return b&&c},Mb=function(){m&&(Ib=Lb(m))};g.getProjectVideo=function(){return m.video},initSkillsMenu=function(c){a("."+c+"-menu li").mouseenter(function(){b.to(a(this).find(".skill-bg-over"),.3,{autoAlpha:1,ease:Power2.easeOut})}).mouseleave(function(){b.to(a(this).find(".skill-bg-over"),.5,{autoAlpha:0,ease:Power2.easeOut})}).mousedown(function(){b.set(a(this).find(".skill-bg-over"),{autoAlpha:.6})}).mouseup(function(){b.set(a(this).find(".skill-bg-over"),{autoAlpha:1})}).click(function(){window.location.hash=a(this).children("a").attr("href")})},getRatioPxPerfect=function(a){var b=(LAYOUT_3D.PX_PERFECT_DISTANCE- -a)/LAYOUT_3D.PX_PERFECT_DISTANCE;return b},updatePage3D=function(b,c){null==c&&(c=d.getPageInfo(b.getId()));var e=1,f=1;CONFIG.isRetina&&(e=1,f=1/e);var g=1*LAYOUT.viewportH*f,i=1*LAYOUT.viewportW*f,j=c.id,k=(c.layout,LAYOUT.viewportW/1280),l=LAYOUT.viewportH/720,m={_scaleVisuel:0,_scaleAboutVisuel:0};m._scaleVisuel=k>l?k:l,m._scaleVisuel=m._scaleVisuel.toFixed(3),m._scaleAboutVisuel=k>l?k:l,m._scaleAboutVisuel=m._scaleAboutVisuel.toFixed(3),m._scaleAboutVisuel=Math.min(m._scaleAboutVisuel,1.2),b.setRegistrationPoint(LAYOUT.vW2,LAYOUT.vH2,0).setPosition(c.x,c.y,c.z).setRotation(c.rotationX,c.rotationY,c.rotationZ).setRotateFirst(!1),b.setScale(e,e,e),b.update(),b.resize();for(var n=b.elementList.length,o=0;n>o;o++){var p=b.elementList[o].element3d,q=b.elementList[o].info,r=getRatioPxPerfect(q.z),s=0,t=0,u=1,v=1;q.position!=d.FOV_RELATED?u=q.scale?q.scale.minL&&q.scale.maxL?getPropValue(q.scale)*r:isNaN(q.scale)?r*m[q.scale]:q.position==d.FREE3D_P?q.scale:q.scale*r:r:(null!=q.scale?(v=getPropValue(q.scale),u=v*r):u=r,s=q.width*u-q.width,t=q.height*u-q.height),null!=q.extraScale&&(u*=q.extraScale),p.setScale(u,u,1),q.log;var w=0;if(null!=q.rotationZ)w=q.rotationZ;else if(null!=q.parent){var x=Nb(b,q.parent).info;null!=x.rotationZ&&(w=x.rotationZ)}w&&p.setRotationZ(w);var y,z,A,B=0,C=0;if(q.position==d.ABSOLUTE_P)y=LAYOUT.vW2+q.x*r-.5*q.width,z=LAYOUT.vH2+q.y*r-.5*q.height,p.setPosition(Math.round(y),Math.round(z),q.z);else if(q.position==d.RES_RC_P){if(null!=q.parent){var x=Nb(b,q.parent).info;C=Math.round(x.tYF+q.rrcYOffset),B=Math.round(x.tXF+q.rrcXOffset)+Math.sin(-w*h)*q.rrcYOffset}else B=LAYOUT.viewportW*q.rrcX+q.rrcXOffset,C=LAYOUT.viewportH*q.rrcY+q.rrcYOffset;q.tXF=B,q.tYF=C,y=LAYOUT.vW2+B*r-.5*q.width,z=LAYOUT.vH2+C*r-.5*q.height,p.setPosition(Math.round(y),Math.round(z),q.z)}else if(q.position==d.TOPLEFTSCREENRELATIVE_P)y=i*q.x*r,z=g*q.y*r,p.setPosition(y,z,q.z);else if(q.position==d.FREE3D_P)y=getPropValue(q.x),z=getPropValue(q.y),A=getPropValue(q.z),p.setPosition(Math.round(y),Math.round(z),A);else if(q.position==d.FOV_RELATED){if(null!=q.parent){var x=Nb(b,q.parent).info;B=x.tXF,C=x.tYF}B+=getPropValue(q.x),C+=getPropValue(q.y),q.tXF=B,q.tYF=C,q.log,y=LAYOUT.vW2+B*r-.5*q.width,z=LAYOUT.vH2+C*r-.5*q.height,q.useOffsetRatio&&(y+=s/2,z+=t/2),p.setPosition(Math.round(y),Math.round(z),getPropValue(q.z))}isNaN(q.rPointX)||isNaN(q.rPointY)?q.width&&q.height?p.setRegistrationPoint(.5*-q.width,.5*-q.height,0):p.setRegistrationPoint(0,0,0):p.setRegistrationPoint(q.rPointX,q.rPointY,0),null!=q.rX&&null!=q.rY&&null!=q.rZ&&p.setRotation(q.rX,q.rY,q.rZ),null!==q.opacity&&p.setOpacity(q.opacity),p.update()}a("#"+j).css("width",i),a("#"+j).css("height",g)};var Nb=function(a,b){for(var c=0;c<a.elementList.length;c++)if(a.elementList[c].id==b)return a.elementList[c]},Ob=function(a){b.to(a.domElement,.3,{autoAlpha:0}),b.to(a,.5,{z:400,ease:Power2.easeIn,onUpdate:function(){a.update()}})},Pb=function(a){b.to(a.domElement,.5,{delay:.2,autoAlpha:1}),b.fromTo(a,.5,{z:-500},{delay:0,z:-100,ease:Power2.easeOut,onUpdate:function(){a.update()}})};updateSection=function(a,b){for(var c=a.getSections(),d=0;d<c.length;d++){var e=c[d];e.sectionId==b?Pb(e):Ob(e)}o=b},getPropValue=function(a){return null!=a.minL&&null!=a.maxL?getRelatedToFovValue(a.minL,a.maxL):a},getRelatedToFovValue=function(a,b){return a+LAYOUT_3D.fovMult001*(b-a)},getResolutionOffset=function(){return offset},prepPgeForTransition=function(a,b,c){var e=d.getPageInfo(a);return m&&(n=m),e.built?(m=getPage3D(a),(null===c||1==c)&&updatePage3D(m,e)):(m=buildPage3D(e),updatePage3D(m,e)),b&&updateSection(m,b),e},g.hasCurrentPage3D=function(){return void 0!==m&&null!==m},g.startTransition=function(a,b){if(db(),p=b,w!=a){var c=prepPgeForTransition(a,b);if(n){var e=d.getLevelOfSibling(a,n.getId());fadeOut(w,.4),u&&u.hide(),1==Math.abs(e)?level1Transition(c):freeTransition(c),updatePage3D(getPage3D(a)),fadeInAndActivate(a,1.1),b&&updateSection(m,b)}else setTweenPosition(a,b,!0),fadeInAndActivate(a,0)}else if(b&&o!=b)return void updateSection(m,b)},fadeOut=function(a,b){void 0!=a&&getPage3D(a).hide(b)},fadeInAndActivate=function(a,c){if(void 0!=a&&(getPage3D(a).show(c),P)){var e=1,f=d.getPageInfo(a).layout.grid;null!=f&&f.alpha&&(e=f.alpha),b.to(P.domElement,.5,{alpha:e})}};var Qb=function(b){m=getPage3D(b),m.addSecondaryElements(),Mb(),a(".hireme-button").click(function(){g.on.hireMeClicked.dispatch()})};return transitionComplete=function(a){y=!1,Qb(a),setTweenPosition(a,p),E(a),p=null,n=null},level1Transition=function(a){y=!0,H.tweenTo(a.id,{ease:Quad.easeInOut,onUpdate:onUpdateTmx,onComplete:transitionComplete,onCompleteParams:[a.id]})},freeTransition=function(a){y=!0,b.to(s,2,{delay:.3,x:-a.x,y:-a.y,z:-a.z,rotationX:-a.rotationX,rotationY:-a.rotationY,rotationZ:-a.rotationZ,ease:Power2.easeInOut,onUpdate:renderContainer,onComplete:transitionComplete,onCompleteParams:[a.id]})},g});