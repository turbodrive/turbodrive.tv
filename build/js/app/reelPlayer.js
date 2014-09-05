define(["jquery","TweenMax","signals"],function(a,b,c){var d,e,f,g,h,i={},j=39,k=0,l=0,m=0,n={};n.wBg=0,n.p2Rotation=0,n.bgTimelineOpacity=1,n.p1Width=92.5,n.pHeight=8;var o,p,q,r,s,t,u,v,w,x,y=!1,z=!1,A=a('<div class="timeline"><div id="timelineSvg"><svg xmlns="http://www.w3.org/2000/svg" width="2000" height="100"><g><clipPath id="timelineMask"><rect id="timelineP1" rect x="0" y="60" width="'+n.p1Width+'" height="'+n.pHeight+'"/><rect id="timelineP2" x="88" y="60" width="40" height="'+n.pHeight+'" transform="rotate(-30,235,52)"/><rect id="timelineP3" x="271" y="60" width="500" height="'+n.pHeight+'"/></clipPath></g><g><rect x="0" y="20" id="bgTimeline" clip-path="url(#timelineMask)" fill="#D44848" width="0" height="64" style="fill-opacity:1"/><rect x="0" y="20" id="bgProgress" clip-path="url(#timelineMask)" fill="#DE4B4B" width="0" height="64"/></g></svg></div></div>'),B=!1,C=!1,D=!1,E=0,F=0,G=!1,H=50,I=-1,J=6;i.on={mobileCTAReady:new c.Signal,playStarted:new c.Signal,showHeader:new c.Signal,playGmd:new c.Signal,hideGmd:new c.Signal,enableOverlayClicks:new c.Signal,readyToPlayAfterSeek:new c.Signal,highlightButtonsHeader:new c.Signal,changeChapter:new c.Signal,videoComplete:new c.Signal,bufferEmpty:new c.Signal,bufferFull:new c.Signal,bufferProgress:new c.Signal,transitionComplete:new c.Signal},i.init=function(b){s=a(".timeline-menu"),ab(b)},i.isActive=function(){return D},i.resize=function(){z&&(Mb(),g.attr("width",LAYOUT.viewportW),a("#footerGradient").attr("width",LAYOUT.viewportW),a("#hexagrid").attr("width",LAYOUT.viewportW));var b=10+25*LAYOUT.ratioW;a(".timeline-menu a").css("padding-right",b+"px"),a(".timeline-menu").css("margin-left",25*LAYOUT.ratioW+"px")},i.getCurrentChapter=function(){return L},i.play=function(){u.play(),K()};var K=function(){0>I&&(I=setInterval(ub,H),a("body").addClass("active-filter"))};i.resume=function(){C&&(i.play(),C=!1)},i.pause=function(){clearInterval(I),a("body").removeClass("active-filter"),I=-1,u.pause(),C=!0},i.sleep=function(){Hb(),D=!1,i.pause(),$=!1},i.wakeup=function(a){N=a,D=!0,u.addEventListener("playing",mb),i.resume(),Fb(),Gb()},i.seekToChapter=function(a,b){if(!L||a!=L.id)for(var c=0;c<O.length;c++){var d=O[c];d.id==a&&(zb(d.startAt-2),null===b&&(b=!0),b&&Lb())}},i.startTransition=function(a){a?b.to(t,1,{delay:.1,y:-LAYOUT.viewportH,ease:Power2.easeInOut,onComplete:function(){t.css("visibility","hidden")}}):(t.css("visibility","visible"),b.fromTo(t,1,{y:-LAYOUT.viewportH},{delay:.1,y:0,ease:Power2.easeInOut,onComplete:function(){i.on.transitionComplete.dispatch()}}))};var L,M,N,O=[{id:"preInto",startAt:0,gmdDuration:0,link:null,debugLink:"#/reel/ikaf/"},{id:"intro",startAt:12,gmdDuration:2,link:"#/reel/tot/"},{id:"tot",projectIndex:0,startAt:39,link:"#/folio/tot/"},{id:"ikaf",projectIndex:1,startAt:55,link:"#/folio/ikaf/"},{id:"borgia",projectIndex:2,startAt:69,link:"#/folio/borgia/"},{id:"gs",projectIndex:3,startAt:89,link:"#/folio/gs/"},{id:"tl",projectIndex:4,startAt:103,link:"#/folio/tl/"},{id:"greetings",projectIndex:5,startAt:118,link:"#/folio/greetings/"},{id:"ikaf2",projectIndex:6,startAt:133,link:"#/folio/ikaf2/"},{id:"outro",projectIndex:7,startAt:164,link:"#/folio/about/"},{id:"end",startAt:500}],P=O.length,Q=[0,28,44,57,71,92,105,123,137],R=0,S=38,T=173,U=!1,V=2,W=8,X=0,Y=-1,Z=CONFIG.debug?O[0].startAt:O[1].startAt,$=!1,_=!1,ab=function(b){N=b?b:null,t=a("#reel"),u=a("#video")[0],u.muted=CONFIG.debug,v=a("#play-pause"),w=a(".cta-start-text"),v.on("click",function(){u.paused?(i.play(),ob()):u.pause()}),u.addEventListener("playing",mb),u.addEventListener("timeupdate",vb),u.addEventListener("waiting",ib),u.addEventListener("ended",function(){i.on.videoComplete.dispatch()}),CONFIG.isMobile?(u.addEventListener("progress",eb),u.addEventListener("canplaythrough",fb),u.addEventListener("loadstart",gb),bb=setTimeout(db,1e3)):(v&&(v.remove(),v=null),u.addEventListener("canplaythrough",nb),i.play()),B=!0,M=a(".video-overlay")},bb=0,cb=0,db=function(){cb++,u.src="https://vod.infomaniak.com/redirect/silvremarchal_1_vod/infomaniak_encoding-12980/mp4-226/mainediting_008_vhsscratch_prepinfomaniak.mp4?idTry="+cb,u.load(),bb=setTimeout(db,2500)},eb=function(a){hb(a)},fb=function(a){hb(a)},gb=function(a){hb(a)},hb=function(){clearTimeout(bb),u.pause(),u.removeEventListener("loadstart",gb),u.removeEventListener("canplaythrough",fb),u.removeEventListener("progress",eb),v.css("visibility","visible"),i.on.mobileCTAReady.dispatch()},ib=function(){G=!1,i.on.bufferEmpty.dispatch()},jb=0,kb=function(){jb=u.currentTime,u.addEventListener("timeupdate",lb),G=!1,i.on.bufferEmpty.dispatch()},lb=function(){var a=Math.abs(jb-u.currentTime);a>.01&&(jb=0,u.removeEventListener("timeupdate",lb),i.on.bufferFull.dispatch())},mb=function(){u.removeEventListener("playing",mb),i.on.playStarted.dispatch(),K(),D=!0,pb(),N&&(i.seekToChapter(N,!1),i.on.readyToPlayAfterSeek.dispatch())},nb=function(){u.removeEventListener("canplaythrough",nb)},ob=function(){b.to(w,.3,{delay:.2,autoAlpha:0})},pb=function(){v&&b.to(v,.2,{delay:1.3,autoAlpha:0,onComplete:function(){v&&(v.remove(),v=null)}})},qb=function(){L!=O[0]&&i.on.changeChapter.dispatch(L)},rb=function(){for(var b=a(".timeline-menu a"),c=0;c<b.length;c++)a(b[c]).attr("id-chapter")==L.id?a(b[c]).addClass("active"):a(b[c]).removeClass("active")},sb=0,tb=1,ub=function(){F=u.currentTime,G&&F==E&&!C&&(sb++,sb>tb&&(i.on.bufferEmpty.dispatch(),G=!1));var a=u.buffered.length,b=0,c=0;if(a>0){var d=0;if(a>1)if(F>u.buffered.start(a-1))d=a-1;else for(var e=1;a>e;e++)u.buffered.start(e)>F&&(d=e-1);var f=(u.buffered.start(d),u.buffered.end(d));b=f-X,b=Math.max(b,0),c=b/J,c=Math.min(c,1),i.on.bufferProgress.dispatch(c),G||b>J&&u.play()}!G&&F>E&&!C&&(i.on.bufferFull.dispatch(),G=!0,sb=0),E=F},vb=function(){X=u.currentTime;for(var a=P-2;a>=0;a--){var b=O[a],c=O[a+1];if(X>=b.startAt&&X<c.startAt){(null==L||L.id!=b.id)&&(L=b,rb(),qb(),a>0&&(Y=Q[a]),gmdDuration="undefined"!=typeof b.gmdDuration?b.gmdDuration:W);break}}X>31&&i.createTimeline(),X>Z&&!$&&($=!0,i.on.enableOverlayClicks.dispatch()),X<Q[0]&&R>0&&(R=0),X>S&&!_&&(_=!0,i.on.showHeader.dispatch()),X>T&&T+V>X&&(Jb(),i.on.highlightButtonsHeader.dispatch());var d;if(z){var e=u.currentTime/u.duration;d=Number(x)+(LAYOUT.viewportW-Number(x))*e}else d=0;h&&h.attr("width",d),gmdDuration>0&&(X>Y&&Y+gmdDuration>X?wb():xb())},wb=function(){U||(U=!0,i.on.playGmd.dispatch())},xb=function(a){U&&(a="undefined"!=typeof a?a:!1,i.on.hideGmd.dispatch(a),U=!1)},yb=function(a){return a>=u.seekable.start(0)&&a<u.seekable.end(0)},zb=function(a){var b=yb(a);b&&(jb=u.currentTime,u.currentTime=a,kb(null))},Ab=function(){clearTimeout(Ib),Kb(!1)},Bb=function(){clearTimeout(Ib),Lb()},Cb=function(a){var b=a.pageX;if(m>b);else{var c=(Number(b)-Number(m))/(Number(LAYOUT.viewportW)-Number(m)),d=c*u.duration;zb(d)}},Db=function(a){var b=(a.pageX-m)/(LAYOUT.viewportW-m);0>b&&(b=0),Lb()},Eb=!1,Fb=function(){Eb||(a("body").append(A),Eb=!0)},Gb=function(){a(".timeline").on("mouseover",Ab),a(".timeline").on("mousedown",Cb),a(".timeline").on("mouseout",Bb),a("#bgTimeline").on("click",Db)},Hb=function(){Eb=!1,clearTimeout(Ib),a(".timeline").remove()};i.createTimeline=function(){y||(Fb(),a(".timeline").prepend(s),d=a("#timelineP1"),e=a("#timelineP2"),k=e.attr("x"),x=Number(k)+Math.cos(Nb(-52))*j,l=e.attr("y"),f=a("#timelineP3"),g=a("#bgTimeline"),h=a("#bgProgress"),g.attr("width",n.wBg),h.attr("width",0),Kb(!0),b.to(n,1,{delay:1,wBg:LAYOUT.viewportW,ease:Linear.easeNone,onUpdate:function(){g.attr("width",n.wBg)},onComplete:function(){z=!0}}),setTimeout(Lb,2500,!0),y=!0,Gb())};var Ib,Jb=function(){null===Ib&&(Kb(),Ib=setTimeout(Lb,2500))},Kb=function(c){Ib=null,c?(n.p2Rotation=-52,a(".timeline").css("bottom",60),Mb()):(o&&o.pause(),p&&p.pause(),q&&q.pause(),r&&r.pause(),o=b.to(a(".timeline"),.4,{css:{bottom:0},ease:Power3.easeInOut}),p=b.to(n,.4,{p2Rotation:-52,p1Width:91,pHeight:5,ease:Power3.easeInOut,onUpdate:Mb}),r=b.to(s,.4,{autoAlpha:1,delay:.2})),q=b.to(a("#timelineBg"),.5,{autoAlpha:1}),i.resize()},Lb=function(c){Ib=null,o&&o.pause(),p&&p.pause(),q&&q.pause(),r&&r.pause();var d=c?.7:.5,e=c?Power2.easeInOut:Power3.easeOut;o=b.to(a(".timeline"),d,{delay:.2,css:{bottom:-32},ease:e}),p=b.to(n,d,{delay:.2,p2Rotation:0,p1Width:92.5,pHeight:8,ease:e,onUpdate:Mb}),q=b.to(a("#timelineBg"),d,{delay:.2,autoAlpha:0}),r=b.to(s,d,{autoAlpha:0}),b.to(n,2,{delay:3,bgTimelineOpacity:.25,onUpdate:function(){a("#bgTimeline").css("fill-opacity",n.bgTimelineOpacity)}})},Mb=function(){var a=parseInt(k)+1,b=parseInt(l)+2;e&&(e.attr("transform","rotate("+n.p2Rotation+","+a+","+b+")"),m=Number(k)+Math.cos(Nb(n.p2Rotation))*j,f.attr("x",m),f.attr("y",parseInt(Number(l)+Math.sin(Nb(n.p2Rotation))*j)),f.attr("width",Number(LAYOUT.viewportW)-Number(m)),d.attr("height",n.pHeight),d.attr("width",n.p1Width),e.attr("height",n.pHeight),f.attr("height",n.pHeight))},Nb=function(a){return a*(Math.PI/180)};return i});