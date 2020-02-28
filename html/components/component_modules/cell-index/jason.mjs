var Jason=function(t,e){var i={$type:"div",class:"jason",slot:"jason",_body:null,_styles:null,$init:function(){e?this._update(e):this.classList.add("hidden"),this.style.minHeight=window.innerHeight},$update:function(){var t=this._body;t.background?"string"==typeof t.background?/http/.test(t.background)?(this.style.backgroundImage="url("+t.background+")",this.style.backgroundSize="cover"):this.style.backgroundColor=t.background:"html"===t.background.type&&this.querySelector(".webcontainer")._update(t.background):t.style&&t.style.background&&("string"==typeof t.style.background?/http/.test(t.style.background)?(this.style.backgroundImage="url("+t.style.background+")",this.style.backgroundSize="cover"):this.style.backgroundColor=t.style.background:"html"===t.style.background.type&&this.querySelector(".webcontainer")._update(t.style.background)),this._styles&&this.querySelector("style")._update(this._styles)},_draw:function(t){this._body=t,this.querySelector(".sections")._update(this._body),this.querySelector(".layers")._update(this._body),this.querySelector(".header")._update(this._body),this.querySelector(".footer")._update(this._body)},_update:function(t){var e=this;t&&t.$jason&&t.$jason.head&&"mixin"===t.$jason.head.type?e.classList.add("hidden"):(Mixin.loaded=[],Mixin.parse(t).then(function(t){var i=t.$jason.head,s=t.$jason.body;if(s?(e.classList.remove("hidden"),e._draw(s)):e.classList.add("hidden"),i){if(i.templates&&i.templates.body&&i.data){var n=ST.transform(i.templates.body,i.data);n?(e.classList.remove("hidden"),e._draw(n)):e.classList.add("hidden")}i.styles&&(e._styles=i.styles)}}).catch(function(t){console.log("Error",t),e.classList.add("hidden")}))},$components:[Css,Header,Sections,Layers,Footer,WebContainer]};return t&&Object.keys(t).forEach(function(e){"class"===e?(console.assert(!1),i.class="jason"+t[e]):i[e]=t[e]}),i};Components={slider:function(t){var e=void 0;return t.style&&(e={width:t.style.width?t.style.width+"px":void 0,height:t.style.height?t.style.height+"px":void 0}),Utils.clean({$type:"input",type:"range",value:t.value,class:t.className,style:Utils.clean(e)})},textfield:function(t){var e=void 0;return t.style&&(e={background:t.style.background,width:t.style.width?t.style.width+"px":void 0,height:t.style.height?t.style.height+"px":void 0,padding:t.style.padding?t.style.padding+"px":void 0,paddingLeft:t.style.padding_left?t.style.padding_left+"px":void 0,paddingRight:t.style.padding_right?t.style.padding_right+"px":void 0,paddingTop:t.style.padding_top?t.style.padding_top+"px":void 0,paddingBottom:t.style.padding_bottom?t.style.padding_bottom+"px":void 0,color:t.style.color,fontFamily:t.style.font,fontSize:t.style.size?t.style.size+"px":void 0,textAlign:t.style.align}),Utils.clean({$type:"input",type:t.type,value:t.value,class:t.className,style:Utils.clean(e),placeholder:t.placeholder})},textarea:function(t){var e=void 0;return t.style&&(e={background:t.style.background,width:t.style.width?t.style.width+"px":void 0,height:t.style.height?t.style.height+"px":void 0,padding:t.style.padding?t.style.padding+"px":void 0,paddingLeft:t.style.padding_left?t.style.padding_left+"px":void 0,paddingRight:t.style.padding_right?t.style.padding_right+"px":void 0,paddingTop:t.style.padding_top?t.style.padding_top+"px":void 0,paddingBottom:t.style.padding_bottom?t.style.padding_bottom+"px":void 0,color:t.style.color,fontFamily:t.style.font,fontSize:t.style.size?t.style.size+"px":void 0,textAlign:t.style.align}),Utils.clean({$type:"textarea",value:t.value,class:t.className,style:Utils.clean(e),placeholder:t.placeholder})},button:function(t){var e=void 0;return t.style&&(e={background:t.style.background,width:t.style.width?t.style.width+"px":void 0,height:t.style.height?t.style.height+"px":void 0,padding:t.style.padding?t.style.padding+"px":void 0,paddingLeft:t.style.padding_left?t.style.padding_left+"px":void 0,paddingRight:t.style.padding_right?t.style.padding_right+"px":void 0,paddingTop:t.style.padding_top?t.style.padding_top+"px":void 0,paddingBottom:t.style.padding_bottom?t.style.padding_bottom+"px":void 0,borderRadius:t.style.corner_radius?t.style.corner_radius+"px":void 0,fontFamily:t.style.font,fontSize:t.style.size?t.style.size+"px":void 0,textAlign:t.style.align,lineHeight:t.style.height?t.style.height+"px":void 0,color:t.style.color}),t.url?Utils.clean({$type:"span",$components:[{$type:"img",src:t.url,class:t.className,style:Utils.clean(e)}]}):Utils.clean({$type:"span",$components:[{$type:"button",$text:t.text,class:t.className,style:Utils.clean(e)}]})},image:function(t){var e=void 0;return t.style&&(e={background:t.style.background,width:t.style.width?t.style.width+"px":void 0,height:t.style.height?t.style.height+"px":void 0,padding:t.style.padding?t.style.padding+"px":void 0,paddingLeft:t.style.padding_left?t.style.padding_left+"px":void 0,paddingRight:t.style.padding_right?t.style.padding_right+"px":void 0,paddingTop:t.style.padding_top?t.style.padding_top+"px":void 0,paddingBottom:t.style.padding_bottom?t.style.padding_bottom+"px":void 0,borderRadius:t.style.corner_radius?t.style.corner_radius+"px":void 0,color:t.style.color}),Utils.clean({$type:"img",src:t.url,class:t.className,style:Utils.clean(e)})},label:function(t){var e=void 0;return t.style&&(e={background:t.style.background,width:t.style.width?t.style.width+"px":void 0,height:t.style.height?t.style.height+"px":void 0,padding:t.style.padding?t.style.padding+"px":void 0,paddingLeft:t.style.padding_left?t.style.padding_left+"px":void 0,paddingRight:t.style.padding_right?t.style.padding_right+"px":void 0,paddingTop:t.style.padding_top?t.style.padding_top+"px":void 0,paddingBottom:t.style.padding_bottom?t.style.padding_bottom+"px":void 0,borderRadius:t.style.corner_radius?t.style.corner_radius+"px":void 0,fontFamily:t.style.font,fontSize:t.style.size?t.style.size+"px":void 0,textAlign:t.style.align,lineHeight:t.style.height?t.style.height+"px":void 0,color:t.style.color}),Utils.clean({$type:"p",$text:t.text,class:t.className,style:Utils.clean(e)})},space:function(t){var e=void 0;return t.style&&(e={background:t.style.background,width:t.style.width?t.style.width+"px":void 0,height:t.style.height?t.style.height+"px":void 0,padding:t.style.padding?t.style.padding+"px":void 0,paddingLeft:t.style.padding_left?t.style.padding_left+"px":void 0,paddingRight:t.style.padding_right?t.style.padding_right+"px":void 0,paddingTop:t.style.padding_top?t.style.padding_top+"px":void 0,paddingBottom:t.style.padding_bottom?t.style.padding_bottom+"px":void 0}),Utils.clean({class:t.className,"data-flex":!0,style:Utils.clean(e)})}};var Css={$type:"style",$text:"",_cssText:"",$update:function(){this.$text=this._cssText},_update:function(t){var e={};for(var i in t){var s={},n=t[i];n.background&&!/http/.test(n.background)&&(s["background-color"]=n.background),n.background&&/http/.test(n.background)&&(s["background-image"]="url("+n.background+")",s["background-size"]="cover"),n.color&&(s.color=n.color),n.bottom&&(s.bottom=n.bottom+"px",s.position="absolute"),n.left&&(s.left=n.left+"px",s.position="absolute"),n.right&&(s.right=n.right+"px",s.position="absolute"),n.top&&(s.top=n.top+"px",s.position="absolute"),n.padding&&(s.padding=n.padding+"px"),n.padding_left&&(s["padding-left"]=n.padding_left+"px"),n.padding_right&&(s["padding-right"]=n.padding_right+"px"),n.padding_top&&(s["padding-top"]=n.padding_top+"px"),n.padding_bottom&&(s["padding-bottom"]=n.padding_bottom+"px"),n.width&&(s.width=n.width+"px"),n.height&&(s.height=n.height+"px"),n.size&&(s["font-size"]=n.size+"px"),n.font&&(s["font-family"]=n.font),n.corner_radius&&(s["border-radius"]=n.corner_radius),n.align&&(s["text-align"]=n.align,s["align-items"]=n.align);var l={};Object.keys(s).forEach(function(t){l[t]=Utils.units(s[t])}),e[i]=l}var o=Object.keys(e).map(function(t){return"#jason ."+t+" {\n"+(Object.keys(e[t]).map(function(i){return"\t"+i+": "+e[t][i]+";"}).join("\n")+"\n")+"}"}).join("\n");this._cssText=o}},Footer={$type:"nav",class:"footer nav nav-justified",_title:null,_items:[],_footer:null,_style:null,_tpl:{tabs:function(t){return{class:"nav-item",$components:[{$type:"img",src:t.image,$init:function(){Style.node(this)}},{$text:t.text,class:"letter"}]}}},_update:function(t){t.footer&&(this._footer=t.footer)},$update:function(){if(this._footer.tabs)this._footer.tabs.items&&(this._footer.tabs.style&&(this._style=this._footer.tabs.style),this.$components=this._footer.tabs.items.map(this._tpl.tabs));else if(this._footer.input){this._footer.input.style&&(this._style=this._footer.input.style);var t=this._footer.input,e=[];if(t.left&&t.left.image){var i={$type:"img",src:t.left.image};t.left.style&&(i.style=Style.transform(t.left.style)),e.push({class:"input-item button-item",$components:[i]})}if(t.textfield){var s={$type:"input"};t.textfield.placeholder&&(s.placeholder=t.textfield.placeholder),t.textfield.style&&(s.style=Style.transform(t.textfield.style)),e.push({class:"input-item textfield",$components:[s]})}if(t.right&&t.right.text){var n={$type:"span",$text:t.right.text};t.right.style&&(n.style=Style.transform(t.right.style)),e.push({class:"input-item button-item",$components:[n]})}this.$components=e}Style.node(this)}},Header={$type:"nav",class:"header nav nav-justified",_title:null,_menu:null,_style:null,_update:function(t){t.header&&(t.header.title&&("string"==typeof t.header.title?this._title={type:"label",text:t.header.title}:this._title=t.header.title),t.header.menu&&(this._menu=t.header.menu),t.header.style&&(this._style=t.header.style))},$update:function(){var t,e;if(Style.node(this),this._menu?(this._menu.image?t={class:"nav-item",$components:[{$type:"img",src:this._menu.image,class:"icon float-right"}]}:this._menu&&this._menu.text&&(t={class:"nav-item",$components:[{$type:"span",$text:this._menu.text,class:"icon nav-item float-right"}]}),this._menu.style&&(t.style=Style.transform(this._menu.style))):t={class:"nav-item",$components:[{$type:"span",$text:"",class:"icon float-right"}]},this._title){var i=this._title;if(i.type){var s={};if(i.style){var n=Style.transform(i.style);for(var l in n)s[l]=Utils.units(n[l])}"label"===i.type?(e={$type:"h5",$text:i.text,class:"nav-item"},s&&(e.style=s)):"image"===i.type&&(e={class:"nav-item",$components:[{$type:"img",src:i.url}]},s&&(e.$components[0].style=s))}}else e={$type:"h5",$text:"",class:"nav-item"};this.$components=[{$type:"span",$text:"",class:"nav-item"},e,t]}},Item={build:function(t,e){return t.components?Item.layout(t,e):Item.components(t,e)},layout:function(t,e){var i={};t&&t.style&&(t.style.background&&!/http/.test(t.style.background)&&(i.backgroundColor=t.style.background),t.style.background&&/http/.test(t.style.background)&&(i.backgroundImage="url("+t.style.background+")"),t.style.background&&/http/.test(t.style.background)&&(i.backgroundSize="cover"),t.style.padding&&(i.padding=t.style.padding+"px"),t.style.width&&(i.width=t.style.width+"px"),t.style.height&&(i.height=t.style.height+"px"),t.style.align&&(i.textAlign=t.style.align),t.style.align&&(i.alignItems=t.style.align),e&&"vertical"==e.type&&t.style.height||e&&"horizontal"==e.type&&t.style.width?i.flexGrow="0":i.flexGrow="1",e&&"vertical"==e.type&&e.style&&e.style.spacing&&(i.marginBottom=e.style.spacing+"px"),e&&"horizontal"==e.type&&e.style&&e.style.spacing&&(i.marginRight=e.style.spacing+"px"));var s={style:i,class:t.type+" layout",$components:t.components?t.components.map(function(e){return Item.build(e,t)}):[]};return t.href&&(s.onclick=function(e){"web"===t.href.view?window.location.href=t.href.url:window.location.href=t.href.url.replace(/\.json$/,"")+"/edit"}),s},components:function(t,e){var i,s=Components[t.type];s?(t.class&&(t.className=t.class),i=s(t)):i="spacing"===t.class?{class:t.class}:{$text:t.type};var n={};return e&&"vertical"===e.type&&e.style&&e.style.spacing?n.marginBottom=e.style.spacing+"px":e&&"horizontal"===e.type&&e.style&&e.style.spacing&&(n.marginRight=e.style.spacing+"px"),i.style?Object.keys(n).forEach(function(t){i.style[t]=n[t]}):i.style=n,i}},Layers={_items:[],class:"layers hidden",_update:function(t){t.layers&&(this.classList.remove("hidden"),this._items=t.layers)},$update:function(){this.$components=this._items.map(Layers.tpl)},tpl:function(t){var e={};if("image"===t.type?(e.$type="img",t.url&&(e.src=t.url)):"label"===t.type&&(e.$type="span",t.text&&(e.$text=t.text)),t.class&&(e.class=t.class),t.style){for(var i in t.style)/^[0-9]+$/.test(t.style[i])?t.style[i]=t.style[i]+"px":/.*%[ ]*[+-][ ]*[0-9]+[ ]*/.test(t.style[i])?t.style[i]=("calc("+t.style[i]+"px)").split("+").join(" + ").split("-").join(" - "):t.style[i]=t.style[i];e.style=Style.transform(t.style),null!=t.style.top&&(e.style.top=t.style.top),null!=t.style.left&&(e.style.left=t.style.left),null!=t.style.right&&(e.style.right=t.style.right),null!=t.style.bottom&&(e.style.bottom=t.style.bottom),e.style.position="absolute"}return e}};Mixin={cache:{},plugin:function(t,e,i){return e&&e.length>0?Function("new_val","with(this) {this"+e+"=new_val; return this;}").bind(t)(i):(Object.keys(i).forEach(function(e){t[e]=i[e]}),t)},remote:function(t){return new Promise(function(e,i){var s=ST.select(t,function(t,e){return"@"===t&&!/^[ ]*\$document/.test(e)}),n=s.paths(),l=s.values();if(l.length>0){var o=[];l.forEach(function(t,e){if(/@/.test(t)){var i=t.split("@");o.push(i[0]),l[e]=i[1]}else o.push("")});var a=l.map(function(t,e){return new Promise(function(e,i){if(Mixin.cache[t]){var s=Mixin.cache[t];e(JSON.parse(JSON.stringify(s)))}else fetch(t).then(function(t){return t.json()}).then(function(i){Mixin.cache[t]=i,e(JSON.parse(JSON.stringify(i)))})})}),d=t;Promise.all(a).then(function(t){n.forEach(function(e,i){var s=t[i];""!=o[i]&&(s=Function("with(this) { return this."+o[i]+";}").bind(s)());d=Mixin.plugin(d,e,s)}),Mixin.loaded=Mixin.loaded.concat(l),e(d)})}else e(t)})},local:function(t){return new Promise(function(e,i){var s=ST.select(t,function(t,e){return"@"===t&&/\$document\./.test(e)}),n=s.paths(),l=s.values();n.forEach(function(e,i){var s=l[i],n=Function("with(this) { return "+s+";}").bind({$document:t})();if(n instanceof Object&&n.constructor===Object){var o=Function("with(this) {return this"+e+";}").bind(t);Object.keys(n).forEach(function(t){o(e)[t]=n[t]})}else{o=Function("new_val","with(this) {this"+e+"=new_val; return this;}").bind(t);t=o(n)}}),e(t)})},parse:function(t){return ST.select(t,function(t,e){return"@"===t&&!/\$document\./.test(e)&&-1===Mixin.loaded.indexOf(e)}).values().length>0?Mixin.remote(t).then(Mixin.parse):Mixin.local(t)}};var Section={build:function(t){var e=[],i=Section.header(t);i&&(e=e.concat(i));var s=Section.items(t);return s&&(e=e.concat({class:"section-items",$components:s})),e},header:function(t){if(t.header){var e={class:"section-header"};return t.header.style&&(e.style={},t.header.style.background&&(e.style.backgroundColor=t.header.style.background),t.header.style.padding&&(e.style.padding=t.header.style.padding),t.header.style.width&&(e.style.width=t.header.style.width),t.header.style.height&&(e.style.height=t.header.style.height)),e.$components=[Item.build(t.header)],e}return null},items:function(t){return t.items?t.items.map(function(t){var e={};return t.style&&(t.style.background&&(e.backgroundColor=t.style.background),t.style.padding&&(e.padding=t.style.padding+"px"),t.style.width&&(e.width=t.style.width+"px"),t.style.height&&(e.height=t.style.height+"px")),{class:"section-item",$components:[Item.build(t)],style:e}}):null}},Sections={class:"sections hidden",_update:function(t){var e=t.sections;e&&e.length>0?(this.classList.remove("hidden"),this.$components=e.map(function(t){var e={};e.class=t.type+" section",t.style&&(e.style=Style.transform(t.style));var i=Section.build(t);return i&&(e.$components=i),e})):this.$components=[]}},Style={tpl:function(t){var e={};return t.color&&(e.color=t.color),t.background&&/http/.test(t.background)?(e.backgroundImage="url("+t.background+")",e.backgroundSize="cover"):e.backgroundColor=t.background,t.padding&&(e.padding=t.padding),t.width&&(e.width=t.width),t.height&&(e.height=t.height,e.lineHeight=t.height),t.font&&(e.fontFamily=t.font),t.size&&(e.fontSize=t.size),t.corner_radius&&(e.borderRadius=t.corner_radius),t.align&&(e.textAlign=t.align,e.alignItems=t.align),e},node:function(t){if(t._style){var e=Style.tpl(t._style);for(var i in e)t.style[i]=Utils.units(e[i])}},transform:function(t){return Style.tpl(t)}},Utils={units:function(t){return/^[0-9]+$/.test(t)?t+"px":/\(.*%[ ]*[+-][ ]*[0-9]+px[ ]*/.test(t)?"calc("+t+")":t},transformer:function(t){var e={};for(var i in o)try{void 0!==o[i]&&(e[i]=o[i])}catch(t){}return e},clean:function(t){return t?(Object.keys(t).forEach(function(e){void 0===t[e]&&delete t[e]}),0===Object.keys(t).length?null:t):t}},WebContainer={$type:"iframe",class:"webcontainer hidden",height:"100%",width:"100%",_update:function(t){t.style&&(this.style=t.style),t.url?(this.classList.remove("hidden"),this.src=t.url):t.text&&(this.classList.remove("hidden"),this.$html=t.text)}};