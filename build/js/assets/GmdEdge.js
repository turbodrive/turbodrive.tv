define(function(){return window.AdobeEdge=window.AdobeEdge||{},AdobeEdge.yepnope||(!function(a,b,c){function d(a){return"[object Function]"==q.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=r.shift();s=1,a?a.t?o(function(){("c"==a.t?m.injectCss:m.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):s=0}function i(a,c,d,e,f,i,j){function k(b){if(!n&&g(l.readyState)&&(t.r=n=1,!s&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&o(function(){v.removeChild(l)},50);for(var d in A[c])A[c].hasOwnProperty(d)&&A[c][d].onload()}}var j=j||m.errorTimeout,l=b.createElement(a),n=0,q=0,t={t:d,s:c,e:f,a:i,x:j};1===A[c]&&(q=1,A[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,q)},r.splice(e,0,t),"img"!=a&&(q||2===A[c]?(v.insertBefore(l,u?null:p),o(k,j)):A[c].push(l))}function j(a,b,c,d,f){return s=0,b=b||"j",e(a)?i("c"==b?x:w,a,b,this.i++,c,d,f):(r.splice(this.i++,0,a),1==r.length&&h()),this}function k(){var a=m;return a.loader={load:j,i:0},a}var l,m,n=b.documentElement,o=a.setTimeout,p=b.getElementsByTagName("script")[0],q={}.toString,r=[],s=0,t="MozAppearance"in n.style,u=t&&!!b.createRange().compareNode,v=u?n:p.parentNode,n=a.opera&&"[object Opera]"==q.call(a.opera),n=!!b.attachEvent&&!n,w=t?"object":n?"script":"img",x=n?"script":w,y=Array.isArray||function(a){return"[object Array]"==q.call(a)},z=[],A={},B={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}};m=function(a){function b(a){var b,c,d,a=a.split("!"),e=z.length,f=a.pop(),g=a.length,f={url:f,origUrl:f,prefixes:a};for(c=0;g>c;c++)d=a[c].split("="),(b=B[d.shift()])&&(f=b(f,d));for(c=0;e>c;c++)f=z[c](f);return f}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(A[i.url]?i.noexec=!0:A[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),A[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(l=function(){var a=[].slice.call(arguments);m.apply(this,a),n()}),g(a,l,b,0,j);else if(Object(a)===a)for(i in h=function(){var b,c=0;for(b in a)a.hasOwnProperty(b)&&c++;return c}(),a)a.hasOwnProperty(i)&&(!c&&!--h&&(d(l)?l=function(){var a=[].slice.call(arguments);m.apply(this,a),n()}:l[i]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),n()}}(m[i])),g(a[i],l,b,i,j))}else!c&&n()}var h,i,j=!!a.test,k=a.load||a.both,l=a.callback||f,m=l,n=a.complete||f;c(j?a.yep:a.nope,!!k),k&&c(k)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(y(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):y(j)?m(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},m.addPrefix=function(a,b){B[a]=b},m.addFilter=function(a){z.push(a)},m.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",l=function(){b.removeEventListener("DOMContentLoaded",l,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k,l,n=b.createElement("script"),e=e||m.errorTimeout;n.src=a;for(l in d)n.setAttribute(l,d[l]);c=j?h:c||f,n.onreadystatechange=n.onload=function(){!k&&g(n.readyState)&&(k=1,c(),n.onload=n.onreadystatechange=null)},o(function(){k||(k=1,c(1))},e),i?n.onload():p.parentNode.insertBefore(n,p)},a.yepnope.injectCss=function(a,c,d,e,g,i){var j,e=b.createElement("link"),c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(p.parentNode.insertBefore(e,p),o(c,0))}}(this,document),AdobeEdge.yepnope=window.yepnope),function(a){function b(a){var b,c=y.style;for(i=0;i<a.length;i++)if(b=a[i],void 0!==c[b])return!0;return!1}function c(){return y.cssText="background-color:rgba(150,255,150,.5)",0==(""+y.style.backgroundColor).indexOf("rgba")?!0:!1}function d(a){if(a=""+a,!B&&0==a.indexOf("rgba")){var b=a.lastIndexOf(",");b>0&&(a="rgb("+a.substring(5,b)+")")}return a}function e(){for(var a=0;a<AdobeEdge._preloaders.length;a++)AdobeEdge._preloaders[a]()}function f(){AdobeEdge._playWhenReady=!0;for(var a=0;a<AdobeEdge._readyplayers.length;a++)AdobeEdge._readyplayers[a]()}function g(b){x[b]&&(b=x[b]),AdobeEdge.preload.got[b]=!0,b==AdobeEdge.preload.last&&(!AdobeEdge.bootstrapLoading||AdobeEdge._playWhenReady?AdobeEdge.okToLaunchComposition(a):C=!0,AdobeEdge.preload.busy=!1,0<AdobeEdge.preload.q.length&&(b=AdobeEdge.preload.q.pop(),AdobeEdge.requestResources(b.files,b.callback)))}function h(a,b){AdobeEdge.preload=AdobeEdge.preload||[],AdobeEdge.preload.q=AdobeEdge.preload.q||[],b||!v()?D=a:AdobeEdge.preload.busy?AdobeEdge.preload.q.push({files:a,callback:g}):AdobeEdge.requestResources(a,g)}function j(a){var b={};return b.num=parseFloat(a),"string"==typeof a&&(b.units=a.match(/[a-zA-Z%]+$/)),b.units&&"object"==typeof b.units&&(b.units=b.units[0]),b}function k(a){var b=a;return"auto"!==a&&((a=j(a))&&a.units||(b+="px")),b}function l(a,b){if(-1!=String(a.className).indexOf(b))return a;for(var c=a.childNodes,d=0;d<c.length;d++){var e=l(c[d],b);if(0!=e)return e}return!1}function m(a){return a.parentElement}function n(a){return a=a.getBoundingClientRect(),{left:a.left+window.pageXOffset,top:a.top+window.pageYOffset}}function o(a){return a.offsetWidth}function p(a){return a.offsetHeight}function q(a){return/center-wrapper/.test(m(a).className)}function r(a){if(!q(a)){var b=document.createElement("div"),c=document.createElement("div");b.className="flow-wrapper",c.className="center-wrapper",b.style.width="1px",b.appendChild(c),m(a).insertBefore(b,a),c.appendChild(a)}}function s(a,b){if(!q(a)){var c=function(){var c=q(a),d=m(c?m(m(a)):a),e=o(d),f=p(d),g=o(a),h=p(a),i=window.innerHeight,j=1,k=a.style;(d="body"===d.nodeName.toLowerCase())&&(f=i),e=Math.round(e),f=Math.round(f),e/=g,f/=h,"both"===b?j=Math.min(e,f):"height"===b?j=f:"width"===b&&(j=e),void 0!==O&&(j=Math.min(j,parseInt(O,10)/g)),void 0!==N&&(j=Math.max(j,parseInt(N,10)/g)),f="scale("+j+")",k.transformOrigin="0 0",k.oTransformOrigin="0 0",k.msTransformOrigin="0 0",k.webkitTransformOrigin="0 0",k.mozTransformOrigin="0 0",k.oTransformOrigin="0 0",k.transform=f,k.oTransform=f,k.msTransform=f,k.webkitTransform=f,k.mozTransform=f,k.oTransform=f,(!d||c)&&(m(a).style.height=Math.round(h*j)+"px",m(a).style.width=Math.round(g*j)+"px"),c&&(c=m(m(a)),c.style.height=Math.round(h*j+n(a).top-n(c).top))};r(a),window.addEventListener("resize",function(){c()}),c()}}function t(a,b){q(a)&&(a=m(a));var c=a.style;/^both$|^horizontal$/.test(b)&&(c.position="absolute",c.marginLeft="auto",c.marginRight="auto",c.left="0",c.right="0"),/^both$|^vertical$/.test(b)&&(c.position="absolute",c.marginTop="auto",c.marginBottom="auto",c.top="0",c.bottom="0")}function u(b,c,e){var f,g,h,i=document.getElementsByTagName("body")[0],m=e||l(i,a);m?"absolute"!=m.style.position&&"relative"!=m.style.position&&(m.style.position="relative"):m=i,P&&(m.style.height=P),Q&&(m.style.width=Q),/^height$|^width$|^both$/.test(L)&&c&&!e&&s(m,L),/^vertical$|^horizontal$|^both$/.test(M)&&c&&!e&&t(m,M);for(var n=0;n<b.length;n++){if(e=b[n],"image"===e.type?(i=document.createElement("img"),i.src=e.fill[1]):i=document.createElement("div"),i.id=e.id,h=i.style,"text"==e.type&&((f=e.font)&&(f[0]&&""!==f[0]&&(h.fontFamily=f[0]),"object"!=typeof f[1]&&(f[1]=[f[1]]),f[1][1]||(f[1][1]="px"),f[1][0]&&""!==f[1][0]&&(h.fontSize=f[1][0]+f[1][1]),f[2]&&""!==f[2]&&(h.color=d(f[2])),f[3]&&""!==f[3]&&(h.fontWeight=f[3]),f[4]&&""!==f[4]&&(h.textDecoration=e.font[4]),f[5]&&""!==f[5]&&(h.fontStyle=e.font[5])),e.align&&"auto"!=e.align&&(h.textAlign=e.align),e.position&&(h.position=e.position),(!e.rect[2]||0>=e.rect[2])&&(!e.rect[3]||0>=e.rect[3])&&(h.whiteSpace="nowrap"),i.innerHTML=e.text),c&&(i.className=c),h.position="absolute",f=e.rect[0],g=e.rect[1],e.transform&&e.transform[0]){var o=e.transform[0][0],p=j(o);if(p&&p.units&&(o=p.num,"%"==p.units&&e.rect[2])){var p=e.rect[2],q=j(e.rect[2]);q&&q.units&&(p=q.num,"%"==q.units&&(p=p/100*m.offsetWidth)),o=o/100*p,0<m.offsetWidth&&(o=o/m.offsetWidth*100)}(p=j(f))&&(f=p.num),f+=o,p.units||(p.units="px"),f+=p.units,1<e.transform[0].length&&(o=e.transform[0][1],(p=j(o))&&p.units&&(o=p.num,"%"==p.units&&e.rect[3]&&(p=e.rect[3],(q=j(e.rect[3]))&&q.units&&(p=q.num,"%"==q.units&&(p=p/100*m.offsetHeight)),o=o/100*p,0<m.offsetHeight&&(o=o/m.offsetHeight*100))),(p=j(g))&&(g=p.num),g+=o,p.units||(p.units="px"),g+=p.units)}if(h.left=k(f),h.top=k(g),h.width=k(e.rect[2]),h.height=k(e.rect[3]),e.linkURL&&(R[i.id]=e,i.onclick=function(){var a=R[this.id];a.linkTarget?window.open(a.linkURL,a.linkTarget):window.location.href=a.linkURL},h.cursor="pointer"),m.appendChild(i),e.c)for(h=0;h<e.c.length;h++)u(e.c[h],c,i)}}function v(){return z?J&&!A?!1:!0:!1}function w(){window.AdobeEdge.loaded=!0,S({event:"begin"}),v()?(F&&F.dom&&F.dom.length&&u(F.dom,"edgePreload"+a),D&&!H&&(h(D),D=void 0)):E&&E.dom&&(I&&I({event:"done",progress:1,reason:"downlevel"}),u(E.dom))}var x,y=document.createElement("div"),z=b(["transformProperty","WebkitTransform","MozTransform","OTransform","msTransform"]),A=!!document.createElementNS&&!!document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect,B=c(),C=(window.JSON&&window.JSON.parse&&window.JSON.stringify,!1);AdobeEdge._preloaders=AdobeEdge._preloaders||[],AdobeEdge._preloaders.push(function(){D&&(h(D),D=void 0)}),AdobeEdge._readyplayers=AdobeEdge._readyplayers||[],AdobeEdge._readyplayers.push(function(){C&&AdobeEdge.okToLaunchComposition(a)}),AdobeEdge.requestResources=AdobeEdge.requestResources||function(a,b){AdobeEdge.yepnope.errorTimeout=4e3,AdobeEdge.preload.busy=!0,AdobeEdge.preload.got=AdobeEdge.preload.got||{};var c,d,e=a.length,f=[];for(c=0;e>c;c++){if(d=a[c],"string"==typeof d)0===d.indexOf("//")&&0===window.location.href.indexOf("file://")&&(d="http:"+d),url=d,d={load:url};else if(d.load&&0===d.load.indexOf("//")&&0===window.location.href.indexOf("file://")&&(d.load="http:"+d.load),url=d.yep||d.load,d.callback){var g=d.callback;d.callback=function(a,c,d){g(a,c,d)&&b(a,c,d)}}d.callback||(d.callback=b),AdobeEdge.preload.got[url]||(f.push(d),AdobeEdge.preload.last=url)}f.length&&AdobeEdge.yepnope(f)};var D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R={},S=function(a){a?S&&setTimeout(S,20):a={event:"loading",progress:0},I&&I(a)},T=[];window.AdobeEdge.bootstrapListeners||(window.AdobeEdge.bootstrapListeners=[]),window.AdobeEdge.bootstrapCallback=function(a){if(window.AdobeEdge.bootstrapListeners.push(a),0<T.length)for(var b=0;b<T.length;b++)a(T[b])},window.AdobeEdge.preloadComplete||(window.AdobeEdge.preloadComplete={}),window.AdobeEdge.preloadComplete[a]=function(a){AdobeEdge.$_(".edgePreload"+a).css("display","none"),S=null,I&&I({event:"done",progress:1,reason:"complete"}),T.push(a);for(var b=window.AdobeEdge.bootstrapListeners.length,c=0;b>c;c++)try{window.AdobeEdge.bootstrapListeners[c](a)}catch(d){}},window.AdobeEdge=window.AdobeEdge||{},window.AdobeEdge.framework="jquery",document.addEventListener?window.addEventListener("load",w,!1):document.attachEvent&&window.attachEvent("onload",w),J=!1,G=!1,x={"edge_includes/jquery-2.0.3.min":"edge_includes/jquery-2.0.3.min","edge_includes/edge.3.0.0.min.js":"edge_includes/edge.3.0.0.min.js"},K=[{load:"edge_includes/jquery-2.0.3.min",callback:function(){return window.jQuery?!0:(yepnope({load:"edge_includes/jquery-2.0.3.min",callback:g}),!1)}},{load:"edge_includes/edge.3.0.0.min.js",callback:function(){return window.AdobeEdge?!0:(yepnope({load:"edge_includes/edge.3.0.0.min.js",callback:g}),!1)}},{load:"js/assets/gmdpng_edge.js"},{load:"js/assets/gmdpng_edgeActions.js"}],AdobeEdge.bootstrapLoading&&(H=!0,AdobeEdge.loadResources=e,AdobeEdge.playWhenReady=f),h(K,G);var L="none",M="none",N="0",O=void 0,Q="300px",P="300px";F={dom:[]},E={dom:[]}}("gmd-edge"),{}});