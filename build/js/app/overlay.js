define(["jquery","TweenMax","signals"],function(a,b,c){var d,e=a(".loader-overlay"),f=a(".loader-text"),g=a(".video-overlay"),h=a(".getmore-overlay"),i=a(".landscape-alert-overlay"),j=a(".miniloader-overlay"),k=a(".progress-load"),l=["loader","getMoreDetails","landscapeAlert","miniloader"],m={LOADER:l[0],GETMOREDETAILS:l[1],LANDSCAPE_ALERT:l[2],MINI_LOADER:l[3]},n=m.LOADER,o=!1,p=!1,q=224;m.on={clickMainOverlay:new c.Signal,gmdLoaded:new c.Signal};var r=function(){g.css("opacity",1),g.css("visibility","show")};g.click(function(){m.on.clickMainOverlay.dispatch()});var s=function(a){switch(a){case m.LOADER:return e;case m.GETMOREDETAILS:return h;case m.LANDSCAPE_ALERT:return i;case m.MINI_LOADER:return j}return null};document.gmdReady=function(a){d=a,m.on.gmdLoaded.dispatch()},m.loadGmd=function(){o||(o=!0,void 0===d&&require(["assets/GmdEdge"],function(){}))},m.gmdLoaded=function(){return Boolean(d)},m.onBufferFull=function(){j.css("pointer-events","none"),p=!1,m.hide(m.MINI_LOADER)},m.onBufferEmpty=function(){j.css("pointer-events","auto"),p=!0,m.show(m.MINI_LOADER,.8)},m.onBufferProgress=function(a){if(p){var c=q*a;b.to(k,.4,{width:c,ease:Power1.easeInOut})}},m.show=function(c,e){r(),null===e&&(e=1);var h=s(c),i=.5;c==m.MINI_LOADER&&(i=.2),c==m.GETMOREDETAILS?(b.set(h,{autoAlpha:1}),d.play()):(b.set(h,{backgroundColor:"rgba(0,0,0,"+e+")"}),b.to(h,i,{autoAlpha:1})),c==m.LOADER&&(b.set(k,{width:1}),b.fromTo(f,.5,{autoAlpha:0,marginTop:60},{delay:.2,marginTop:0,autoAlpha:1})),c==m.LANDSCAPE_ALERT||c==m.LOADER?a(g).addClass("overlay-total"):a(g).removeClass("overlay-total"),n=c},m.hide=function(c,d,e){var f="undefined"!=typeof d&&d?0:.8;if(c==m.MINI_LOADER&&(f=.8),null===e&&(e=!1),null==c)for(var h=0;h<l.length;h++)m.hide(l[h],d,e);else b.to(s(c),f,{delay:0,autoAlpha:0,onComplete:function(){a(g).removeClass("overlay-total"),e&&g.css("visibility","hidden")}});c==n&&(n="")},m.enableClicks=function(){g.css("cursor","pointer"),g.css("pointer-events","auto")},m.disableClicks=function(){g.css("cursor","auto"),g.css("pointer-events","none")},m.disable=function(){m.hide(null,!1,!0),m.disableClicks()},m.updateProgress=function(a){var c=q*a;b.to(k,.4,{width:c,ease:Power1.easeInOut})};var t=!1;return m.pauseGmd=function(){d&&d.isPlaying()&&(d.stop(),t=!0)},m.resumeGmd=function(){d&&t&&(d.play(),t=!1)},m});