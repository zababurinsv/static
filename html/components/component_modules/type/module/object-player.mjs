export default()=>new Promise(async(s,t)=>{let r={};try{r[""]=(()=>(isEmpty(r.staticProperty.class)&&(r.staticProperty.class=new Class),r.staticProperty.class)),isEmpty(r.staticProperty.class)&&(r.staticProperty.class=new Class),(t=>{s(t)})(r.staticProperty.class)}catch(s){(s=>{t(s)})({_:"type",error:s})}});