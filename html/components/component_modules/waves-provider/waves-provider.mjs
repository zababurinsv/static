import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty.mjs";import Class from"/static/html/components/component_modules/waves-provider/module/class.mjs";export default(s={_:"type"})=>new Promise(async(s,t)=>{let o={staticProperty:{}};o.staticProperty.class=void 0;try{o.class=(()=>(isEmpty(o.staticProperty.class)&&(o.staticProperty.class=new Class),o.staticProperty.class)),isEmpty(o.staticProperty.class)&&(o.staticProperty.class=new Class),(t=>{s(t)})(o.staticProperty.class)}catch(s){(s=>{t(s)})({_:"type",error:s})}});