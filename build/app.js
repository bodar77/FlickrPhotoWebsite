var cb=cb||{};cb.Flickr=function(){this.appid="9b217b1f476896d402cabd129e91974a",this.userid="67942935@N04",this.albumnid,this.tree,this.photoCollection=[],this.menuItemLookup={},this.photos,this.init()},cb.Flickr.prototype={init:function(){},ajaxJsonCall:function(o,t){var e,i,s,n;for(s=t.length,i=0;s>i;i++)n+="&"+t[i].key+"="+t[i].value;e="https://api.flickr.com/services/rest/?&method=",$.getJSON(e+o+n+"&format=json&jsoncallback=?")},getCollectionTree:function(o){var t=o,e=this;$.getJSON("https://api.flickr.com/services/rest/?method=flickr.collections.getTree&api_key="+this.appid+"&user_id="+this.userid+"&format=json&nojsoncallback=1",function(o){e.tree=o;var i,s,n=0;for(i=o.collections.collection,s=i.length,n;s>n;n++){var c,l,h=0;for(e.menuItemLookup[i[n].id]=i[n],e.menuItemLookup[i[n].id].photos={},l=i[n].set,c=l.length,h;c>h;h++)e.menuItemLookup[i[n].id].photos[l[h].id]=l[h],e.menuItemLookup[i[n].id].photos[l[h].id].photos={},e.menuItemLookup[l[h].id]=e.menuItemLookup[i[n].id].photos[l[h].id],e.photoCollection.push(l[h].id),console.log("--"+l[h].title)}"fail"!=o.stat&&t(e.menuItemLookup)})},getPhotosByPhotoId:function(o,t){var e=this;$.getJSON("https://api.flickr.com/services/rest/?&method=flickr.photosets.getPhotos&api_key="+this.appid+"&photoset_id="+o+"&format=json&jsoncallback=?",function(o){e.photoCollection=o.photoset,"fail"!=o.stat&&t.call(this,o)})}};
var cb=cb||{};cb.ImageViewer=function(){this.view=document.getElementById("slider"),this.pressed=!1,this.isDragDelta=50,this.clickDurationDelta=1e3,this.clickStartTime,this.clickEndTime,this.documentCache=$("body"),this.screen={width:0,height:0,mousex:0,mousey:0,distancex:0,distancey:0,isLandscape:!0},this.init(),this.addHandlers()},cb.ImageViewer.prototype={init:function(){},getMetrix:function(){var e=this.documentCache;this.screen.width=e.width(),this.screen.height=$(window).height(),this.screen.isLandscape=this.screen.width>this.screen.height},xpos:function(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientX:e.clientX},ypos:function(e){return e.targetTouches&&e.targetTouches.length>=1?e.targetTouches[0].clientY:e.clientY},addHandlers:function(){var e=$(this.view),t="ontouchstart"in document;t&&(this.view.addEventListener("touchstart",$.proxy(this.handleTouchStart,this),!1),this.view.addEventListener("touchmove",$.proxy(this.handleTouchMove,this),!1),this.view.addEventListener("touchend",$.proxy(this.handleTouchEnd,this),!1)),e.on("mousedown",$.proxy(this.handleTouchStart,this)),e.on("mousemove",$.proxy(this.handleTouchMove,this)),e.on("mouseup",$.proxy(this.handleTouchEnd,this))},removeHandlers:function(){},addOverlay:function(){},removeOverlay:function(){},addImageView:function(e){$(document).scrollTop(0,0);var t,i=$(".image-viewer");i.length>0&&i.remove();var s=cb.flickr.menuItemLookup[e],n=$("body"),c='<div class="image-viewer" >';c+='<div class="image-close"><button class="button-close"></button></div>',c+='<div class="image-left"><button class="button-left"></button></div>',c+='<div class="image-right"><button class="button-right"></button></div>',c+="<picture>",c+='<source srcset="https://farm'+s.farm+".staticflickr.com/"+s.server+"/"+s.id+"_"+s.secret+'_b.jpg" media="(min-width: 670px)">',c+='<img id="'+s.id+'" srcset="https://farm'+s.farm+".staticflickr.com/"+s.server+"/"+s.id+"_"+s.secret+'_c.jpg" alt="">',c+="</picture>",c+="</div>",n.append(c),picturefill(),i=$(".image-viewer img"),this.getMetrix(),t=this.screen.height-$(this.view).height(),this.screen.isLandscape&&i.height(t),this.documentCache.height(t),this.documentCache.css("overflow","hidden"),this.handleClose(),this.handleImageNavigation(e)},handleTouchStart:function(e){this.clickStartTime=Date.now(),this.pressed=!0,this.screen.mousex=this.xpos(e),this.screen.mousey=this.ypos(e)},handleTouchMove:function(e){this.pressed&&(this.screen.distancex=this.screen.mousex-this.xpos(e),this.screen.distancey=this.screen.mousey-this.ypos(e))},handleTouchEnd:function(e){var t,i;this.pressed=!1,this.clickEndTime=Date.now(),t=this.clickDurationDelta<this.clickEndTime-this.clickStartTime,t||(i=this.screen.distancex>this.isDragDelta||this.screen.distancey>this.isDragDelta||this.screen.distancex<-this.isDragDelta||this.screen.distancey<-this.isDragDelta,this.screen.distancex=0,this.screen.distancey=0,i||this.handleImageClicked(e))},handleImageNavigation:function(e){var t,i,s,n=this;t=$(".button-left"),i=$(".button-right"),t.length>0&&(s=cb.flickr.menuItemLookup[e],t.on("click",function(e){n.addImageView(s.previous.id)}),i.on("click",function(e){n.addImageView(s.next.id)}))},handleClose:function(){var e=$(".image-close"),t=this;e.length>0&&e.on("click",function(e){$(".image-viewer").remove(),t.documentCache.removeAttr("style")})},handleImageClicked:function(e){var t;t=e.target.id,this.addImageView(t)}};
var cb=cb||{};cb.ImgManager=function(){this.init()},cb.ImgManager.prototype={init:function(){},loadCategoryImages:function(e,t){var i=document.getElementById("slider"),r=t;i.innerHTML="",cb.flickr.getPhotosByPhotoId(e,function(t){var c,o,m,s,n=0,a=t.photoset.photo.length,p=t.photoset.photo,d=document.createDocumentFragment(),u=document.getElementById("main-image");for(n;a>n;n++)o=p[n],cb.flickr.menuItemLookup[o.id]=o,cb.flickr.menuItemLookup[e].photos[o.id]=o,0!==n&&(cb.flickr.menuItemLookup[e].photos[p[n].id].previous=p[n-1]),p[n+1]&&(cb.flickr.menuItemLookup[e].photos[p[n].id].next=p[n+1]),cb.flickr.menuItemLookup[e].photos[p[n].id].parentId=e,m=document.createElement("div"),m.className="item",0===n&&(m.id="item1",s="<picture>",s+='<source srcset="https://farm'+o.farm+".staticflickr.com/"+o.server+"/"+o.id+"_"+o.secret+'_b.jpg" media="(min-width: 1300px)">',s+='<source srcset="https://farm'+o.farm+".staticflickr.com/"+o.server+"/"+o.id+"_"+o.secret+'_z.jpg" media="(min-width: 620px)">',s+='<img id="'+o.id+'" class="cbp-sideimage" src="https://farm'+o.farm+".staticflickr.com/"+o.server+"/"+o.id+"_"+o.secret+'_n.jpg" alt="">',s+="</picture>"),c="<picture>",c+='<source srcset="https://farm'+o.farm+".staticflickr.com/"+o.server+"/"+o.id+"_"+o.secret+'_q.jpg" media="(min-width: 700px)">',c+='<img id="'+o.id+'" src="https://farm'+o.farm+".staticflickr.com/"+o.server+"/"+o.id+"_"+o.secret+'_s.jpg" alt="">',c+="</picture>",m.innerHTML=c,d.appendChild(m);u.innerHTML=s,i.appendChild(d);new cb.Slider;r&&r()})}};
var cb=cb||{};cb.Menu=function(){this.collections={},this.menuItemLookup={},this.init(),this.addHandlers()},cb.Menu.prototype={init:function(){this.createMenu()},createMenu:function(){var e=this;cb.flickr.getCollectionTree(function(t){console.log(t);var n,a,i,o,d;n=document.createDocumentFragment(),a=document.createElement("ul");for(d in t)if(t.hasOwnProperty(d)&&d.indexOf("-")>-1){var c,r,l,u,m,p,f,h=0;for(c=t[d],l=c.set,r=l.length,m=document.createElement("li"),p=document.createTextNode(c.title),u=document.createElement("ul"),m.appendChild(p),m.appendChild(u),a.appendChild(m),h;r>h;h++){var s,g;s=document.createElement("li"),s.setAttribute("data-id",l[h].id),g=document.createTextNode(l[h].title),s.appendChild(g),u.appendChild(s)}}n.appendChild(a),o=document.getElementById("menu"),o.appendChild(n),e.addHandlers(),f=t[cb.flickr.photoCollection[e.getRandomInt(0,r)]],i=$.Event("menuAvailiable"),i.menuData=f,$(document).trigger(i)})},addHandlers:function(){$("ul").on("click",function(e){e.preventDefault(),e.stopPropagation();var t=$(e.target),n=cb.flickr.menuItemLookup[t.attr("data-id")];e.target&&t.length>0&&t.attr("data-id")&&t.attr("data-id").length>0&&(cb.imgmanager.loadCategoryImages(t.attr("data-id"),function(){picturefill()}),cb.view.updateTitleDescription(n.title,n.description))})},removeHandlers:function(){$("ul").off("click")},getRandomInt:function(e,t){return Math.floor(Math.random()*(t-e))+e}};
var cb=cb||{};cb.Slider=function(){var t=this;return this.view=document.getElementById("slider"),this.container=$(".cbp-container"),this.overlay=document.getElementById("overlay"),this.screenWidth,this.screenHeight,this.max,$(window).on("resize",$.proxy(this.resize,this)),this.screenSize(),this.screenWidth>this.container.width()?(this.container.width("100%"),!1):(this.imgCount=$(".item").length,this.offset=this.min=0,this.pressed=!1,this.timeConstant=325,this.velocity,this.amplitude,this.ticker,this.init(),this.addHandlers(),this.indicator=document.getElementById("indicator"),this.relative=(innerWidth-30)/this.max,this.xform="transform",void["webkit","Moz","O","ms"].every(function(e){var i=e+"Transform";return"undefined"!=typeof t.view.style[i]?(xform=i,!1):!0}))},cb.Slider.prototype={init:function(){this.container.width(parseInt(getComputedStyle(document.getElementById("item1")).width,10)*this.imgCount),this.snap=parseInt(getComputedStyle(document.getElementById("item1")).width,10),this.overlay.style.left=2*this.snap+"px"},addHandlers:function(){var t=$(this.view),e="ontouchstart"in document;e?(this.view.addEventListener("touchstart",$.proxy(this.tap,this),!1),this.view.addEventListener("touchmove",$.proxy(this.drag,this),!1),this.view.addEventListener("touchend",$.proxy(this.release,this),!1)):(t.on("mousedown",$.proxy(this.tap,this)),t.on("mousemove",$.proxy(this.drag,this)),t.on("mouseup",$.proxy(this.release,this)))},removeHandlers:function(){var t=$(this.view),e="ontouchstart"in document;e?(this.view.removeventListener("touchstart",$.proxy(this.tap,this),!1),this.view.removeventListener("touchmove",$.proxy(this.drag,this),!1),this.view.removeventListener("touchend",$.proxy(this.release,this),!1)):(t.off("mousedown",$.proxy(this.tap,this)),t.off("mousemove",$.proxy(this.drag,this)),t.off("mouseup",$.proxy(this.release,this)))},xpos:function(t){return t.targetTouches&&t.targetTouches.length>=1?t.targetTouches[0].clientX:t.clientX},screenSize:function(){var t=$(document);this.screenWidth=t.width(),this.screenHeight=t.height(),this.max=parseInt(getComputedStyle(document.getElementById("slider")).width,10)-window.innerWidth,this.relative=(window.innerWidth-30)/this.max},scroll:function(t){this.offset=t>this.max?this.max:t<this.min?this.min:t,this.view.style[xform]="translateX("+-this.offset+"px)",this.indicator.style[xform]="translateX("+this.offset*this.relative+"px)"},track:function(){var t,e,i,s;t=Date.now(),e=t-this.timestamp,this.timestamp=t,i=this.offset-this.frame,this.frame=this.offset,s=1e3*i/(1+e),this.velocity=.5*s+.2*this.velocity},autoScroll:function(){var t,e;this.amplitude&&(t=Date.now()-this.timestamp,e=-this.amplitude*Math.exp(-t/this.timeConstant),e>.5||-.5>e?(this.scroll(this.target+e),requestAnimationFrame($.proxy(this.autoScroll,this))):this.scroll(this.target))},tap:function(t){return this.pressed=!0,this.reference=this.xpos(t),this.velocity=this.amplitude=0,this.frame=this.offset,this.timestamp=Date.now(),clearInterval(this.ticker),this.ticker=setInterval($.proxy(this.track,this),100),t.preventDefault(),t.stopPropagation(),!1},drag:function(t){var e,i;return this.pressed&&(e=this.xpos(t),i=this.reference-e,(i>2||-2>i)&&(this.reference=e,this.scroll(this.offset+i))),t.preventDefault(),t.stopPropagation(),!1},release:function(t){return this.pressed=!1,clearInterval(this.ticker),this.target=this.offset,(this.velocity>10||this.velocity<-10)&&(this.amplitude=.8*this.velocity,this.target=this.offset+this.amplitude),this.target=Math.round(this.target/this.snap)*this.snap,this.amplitude=this.target-this.offset,this.timestamp=Date.now(),requestAnimationFrame($.proxy(this.autoScroll,this)),t.preventDefault(),t.stopPropagation(),!1},resized:function(){this.init(),this.autoScroll(),this.offset=0,this.view.style[xform]="translateX(0px)",this.indicator.style[xform]="translateX(0px)",this.screenSize(),this.screenWidth>this.container.width()?(this.container.width("100%"),this.removeHandlers()):this.addHandlers(),this.view.classList.contains("disabled")&&this.view.classList.remove("disabled")},resize:function(t){var e=this;clearTimeout(this.resizeFinished),this.resizeFinished=setTimeout($.proxy(this.resized,e),2e3),this.view.classList.contains("disabled")||this.view.classList.add("disabled")}};
var cb=cb||{};window.onload=function(){cb.flickr=new cb.Flickr,cb.imageviewer=new cb.ImageViewer,cb.imgmanager=new cb.ImgManager,cb.view=new cb.View},window.onerror=function(e,c,n){};
var cb=cb||{};cb.View=function(){this.title=document.getElementsByClassName("cbp-article-title")[0],this.description=document.getElementsByClassName("cbp-article-description")[0],this.init()},cb.View.prototype={init:function(){this.loadMenu(),this.loadImages()},loadMenu:function(){cb.menu=new cb.Menu},loadImages:function(){var t=this;$(document).on("menuAvailiable",function(i){cb.imgmanager.loadCategoryImages(i.menuData.id,function(){t.updateTitleDescription(i.menuData.title,i.menuData.description),picturefill()})})},updateTitleDescription:function(t,i){this.title.innerHTML=t,this.description.innerHTML=i}};