webpackJsonp([1],{"C/Or":function(t,n){},Lm8X:function(t,n){},NHnr:function(t,n,r){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var e=r("7+uW"),i=r("mtWM"),o=r.n(i),s=r("/ocq"),a={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",[n("span",[n("svg",{attrs:{viewBox:"25 25 50 50"}},[n("circle",{attrs:{cx:"50",cy:"50",r:"20",fill:"none"}})])])])},staticRenderFns:[]};var c=r("VU/8")({name:"loading"},a,!1,function(t){r("C/Or")},"data-v-e69c5b38",null).exports,l={name:"home",components:{loading:c},data:function(){return{slist:[]}},created:function(){this.$_GetList()},computed:{controlOrder:function(){return"/detail/"+this.$_GetIds()},controlRandom:function(){return"/detail/"+this.util.arrShuffle(this.$_GetIds())}},methods:{$_CompleteNum:function(t){return t+=1,this.util.fillZero(t,2)},$_GetIds:function(){for(var t=[],n=0;n<this.slist.length;n++)t.push(this.slist[n].id);return t},$_GetList:function(){var t=this;t.axios.get(t.util.baseUrl+"/slist").then(function(n){console.log(n.data),t.slist=n.data}).catch(function(t){console.error(t)})}}},u={render:function(){var t=this,n=t.$createElement,r=t._self._c||n;return r("div",{staticClass:"home"},[0===t.slist.length?r("loading"):t._e(),t._v(" "),r("h1",{staticClass:"songs_title"},[t._v("推荐歌单")]),t._v(" "),t.slist.length>1?r("ul",{staticClass:"songs_control"},[r("li",[r("router-link",{attrs:{to:t.controlOrder}},[t._v("顺序播放")])],1),t._v(" "),r("li",[r("router-link",{attrs:{to:t.controlRandom}},[t._v("随机播放")])],1)]):t._e(),t._v(" "),r("ul",{staticClass:"songs_list"},t._l(t.slist,function(n,e){return r("li",{key:e},[r("router-link",{attrs:{to:"/detail/"+n.id}},[r("span",[t._v(t._s(t.$_CompleteNum(e)))]),t._v(" "),r("h4",[t._v(t._s(n.name))]),t._v(" "),r("small",[t._v(t._s(n.artist)+" - "+t._s(n.album))])])],1)})),t._v(" "),r("a",{staticClass:"copyright",attrs:{href:"https://github.com/iflycn/music"}},[t._v("Gito Player @ Github.com")])],1)},staticRenderFns:[]};var d=r("VU/8")(l,u,!1,function(t){r("ZzTr")},"data-v-68732e9d",null).exports,f={name:"detail",components:{loading:c},data:function(){return{controls:{ids:[],timer:-1,isPaused:!0,line:.001,duration:0,currentTime:0},song:{id:-1,name:"未知",artist:"未知",url:"",picUrl:r("aBLL"),lyric:[]}}},computed:{rangeStyle:function(){var t=1+~~(this.controls.currentTime/this.controls.duration*100);return"linear-gradient(to right, hsla(0, 0%, 100%, 0.2), #fff "+t+"%, hsla(0, 0%, 100%, 0.2) "+t+"%, hsla(0, 0%, 100%, 0.2))"},rangeTxt:function(){var t=~~this.controls.currentTime,n=~~this.controls.duration;return this.util.fillZero(~~(t/60%60),2)+":"+this.util.fillZero(t%60,2)+"/"+this.util.fillZero(~~(n/60%60),2)+":"+this.util.fillZero(n%60,2)},lyricTop:function(){return"-"+2*~~this.controls.line+"em"},bgStyle:function(){return"url("+this.song.picUrl+")"}},created:function(){var t=this.$route.params.id;console.log("[PARAMS] detail?id="+t),this.controls.ids=t.split(","),this.$_GetDetail(this.controls.ids[0])},destroyed:function(){clearInterval(this.controls.timer)},watch:{"controls.duration":function(){this.controls.duration>0&&console.warn("Can NOT autoplay on mobile, wait to find another way.")},"controls.currentTime":function(){this.controls.currentTime>=this.controls.duration&&(this.$_SongPause(),this.controls.ids.length>1&&this.$_SongNext())},"song.id":function(){var t=this;this.song.lyric.length>0&&(this.song.lyric=this.$_FormatLrc(this.song.lyric)),clearInterval(this.controls.timer),this.controls.timer=setInterval(function(){t.controls.line=t.$_StartTimer()},1e3)}},methods:{$_StartTimer:function(){var t=this.$refs.audio.duration,n=this.$refs.audio.currentTime;this.controls.duration=t,this.controls.currentTime=n;var r=[].concat(this.song.lyric);if(r.push({time:1e3*t}),n<r[0].time/1e3)return.001;for(var e=0;e<r.length-1;e++)if(n>=r[e].time/1e3&&n<r[e+1].time/1e3)return e},$_SongPlay:function(){this.controls.duration>0&&(this.$refs.audio.play(),this.controls.isPaused=!1)},$_SongPause:function(){this.$refs.audio.pause(),this.controls.isPaused=!0},$_SongToggle:function(){this.controls.isPaused?this.$_SongPlay():this.$_SongPause()},$_SongLoad:function(){this.$refs.audio.load()},$_SongJump:function(){this.controls.currentTime<this.controls.duration&&(this.$refs.audio.currentTime=this.controls.currentTime)},$_SongNext:function(){this.controls.duration=0,this.controls.ids.splice(0,1),this.controls.ids.push(this.song.id),this.$_GetDetail(this.controls.ids[0])},$_FormatLrc:function(t){t=t.replace(/(\[\d{2,}:\d{2}(?:\.\d{2,3})?]){2,}(.*)(\n)/g,function(t,n,r){return t.replace(r+"\n","").replace(/(\[\d{2,}:\d{2}(?:\.\d{2,3})?])/g,"$1"+r+"\n")}).split("\n");for(var n=/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g,r=[],e=0;e<t.length;e++){var i=n.exec(t[e]),o=t[e].replace(n,"").trim();i&&o&&r.push({time:60*i[1]*1e3+1e3*i[2]+10*(i[3]||0),txt:o})}return r.sort(function(t,n){return t.time-n.time}),r},$_GetDetail:function(t){var n=this;n.axios.get(n.util.baseUrl+"/detail?id="+t).then(function(t){console.log(t.data),n.song=t.data}).catch(function(t){console.error(t)})}}},h={render:function(){var t=this,n=t.$createElement,r=t._self._c||n;return r("div",{staticClass:"detail"},[0===t.controls.duration?r("loading"):t._e(),t._v(" "),r("div",{staticClass:"song_wrap"},[r("div",{staticClass:"song_disc",class:{song_needle:t.controls.isPaused},on:{click:function(n){t.$_SongToggle()}}},[r("div",{staticClass:"song_turn circling",class:{paused:t.controls.isPaused}},[r("img",{staticClass:"song_cover",attrs:{src:t.song.picUrl}})]),t._v(" "),r("span",{staticClass:"song_play",class:{song_pause:!t.controls.isPaused}})])]),t._v(" "),r("div",{staticClass:"song_range"},[r("small",[t._v(t._s(t.rangeTxt))]),t._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:t.controls.currentTime,expression:"controls.currentTime"}],style:{background:t.rangeStyle},attrs:{type:"range",max:t.controls.duration},domProps:{value:t.controls.currentTime},on:{input:function(n){t.$_SongJump()},__r:function(n){t.$set(t.controls,"currentTime",n.target.value)}}})]),t._v(" "),r("div",{staticClass:"lyric"},[r("h3",[t._v(t._s(t.song.name)+" - "+t._s(t.song.artist))]),t._v(" "),r("div",{staticClass:"lyric_txt"},[r("ul",{style:{marginTop:t.lyricTop}},t._l(t.song.lyric,function(n,e){return r("li",{key:e,class:{hover:t.controls.line===e}},[t._v(t._s(n.txt))])}))])]),t._v(" "),r("audio",{ref:"audio",attrs:{src:t.song.url,preload:""}}),t._v(" "),r("div",{staticClass:"song_bg",style:{backgroundImage:t.bgStyle}})],1)},staticRenderFns:[]};var g=r("VU/8")(f,h,!1,function(t){r("fCvT")},"data-v-8fa0c16a",null).exports;e.a.use(s.a);var m=new s.a({routes:[{path:"/",name:"home",component:d},{path:"/detail/:id",name:"detail",component:g}],scrollBehavior:function(){return{x:0,y:0}}}),p=r("pFYg"),v=r.n(p),_={baseUrl:"https://www.easy-mock.com/mock/5b06a51ba3065411030dc3c2/music",isMobile:function(){var t=!1,n=["iphone","ipod","ipad","android","mobile","blackberry","webos","incognito","webmate","bada","nokia","lg","ucweb","skyfire"],r=navigator.userAgent.toLowerCase();for(var e in n)-1!=r.indexOf(n[e])&&(t=!0);return t},isIE678:function(){return!1},isIE:function(){return!!window.VBArray},isOpera:function(){return!!window.opera},isFirefox:function(){return!!window.GeckoActiveXObject},isSafari:function(){return!(!navigator.vendor||!navigator.vendor.match(/Apple/))},isChrome:function(){return!(!window.chrome||!window.google)},isOdd:function(t){return!!(1&~~t)},isArray:function(t){return null!=t&&"object"===(void 0===t?"undefined":v()(t))&&"splice"in t&&"join"in t},isNaN:function(t){return t!=t},isNull:function(t){return null===t},isUndefined:function(t){return void 0===t},byteLen:function(t,n){n=n||2;var r=new Array(n+1).join("-");return t.replace(/[^\x00-\xff]/g,r).length},strFormat:function(t,n){var r=Array.prototype.slice.call(arguments,1);return t.replace(/\\?\#{([^{}]+)\}/gm,function(t,e){return"\\"==t.charAt(0)?t.slice(1):Number(e)>=0?r[Number(e)]:n&&void 0!==n[e]?n[e]:""})},fillZero:function(t,n){return((1<<n).toString(2)+t).slice(-n)},randomColor:function(){return"#"+fillZero((~~(Math.random()*(1<<24))).toString(16),6)},arrShuffle:function(t){for(var n=1;n<t.length;n++){var r=Math.floor(Math.random()*(n+1)),e=[t[r],t[n]];t[n]=e[0],t[r]=e[1]}return t},escapeHTML:function(t){return(t=""+t).replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;").replace(/"/g,"&#34;").replace(/'/g,"&#39;")},unescapeHTML:function(t){return(t=""+t).replace(/&#39;/g,"'").replace(/&#34;/g,'"').replace(/&#62;/g,">").replace(/&#60;/g,"<").replace(/&#38;/g,"&")},urlJump:function(t){location.href=t},getVar:function(t){var n=new RegExp("(^|)"+t+"=([^&]*)(&|$)","gi").exec(String(location.href));return n?n[2]:""}},y={name:"app",beforeCreate:function(){console.log("%c Gito Player @ Github.com/iflycn/music","margin:1em 0;padding:1em;color:#fff;border-radius:.2em;background:#3caaf7")}},$={render:function(){var t=this.$createElement,n=this._self._c||t;return n("div",{staticClass:"main"},[n("transition",{attrs:{name:"fade-in",mode:"out-in"}},[n("keep-alive",{attrs:{include:"home"}},[n("router-view")],1)],1)],1)},staticRenderFns:[]};var b=r("VU/8")(y,$,!1,function(t){r("Lm8X")},null,null).exports;e.a.config.productionTip=!1,e.a.prototype.axios=o.a,e.a.prototype.util=_,new e.a({el:"#app",render:function(t){return t(b)},router:m,components:{app:b},template:"<app/>"})},ZzTr:function(t,n){},aBLL:function(t,n,r){t.exports=r.p+"static/img/disc_default.ec9c241.png"},fCvT:function(t,n){}},["NHnr"]);