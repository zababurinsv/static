import isEmpty from"/static/html/components/component_modules/isEmpty/isEmpty_t.mjs";import Class from"/static/html/components/component_modules/stjs/module-class.mjs";let object={staticProperty:{}};object.staticProperty.class=void 0;export default(t={_:"json"})=>new Promise(async(t,s)=>{object.class=(()=>(isEmpty(object.staticProperty.class)&&(object.staticProperty.class=new Class),object.staticProperty.class)),isEmpty(object.staticProperty.class)&&(object.staticProperty.class=new Class),(s=>{t(s)})(object.staticProperty.class)});