import Performance from"/static/html/components/component_modules/performance/performance.mjs";import colors from"/static/html/components/component_modules/colors/colors.mjs";let performance=Performance();export default async(e,o="time",t="black",...n)=>{if(!0===e)if(t=await colors(t),"string"==typeof n[n.length-1]){let e=!1;switch(o){case"end":case"stat":e=!0}"object"==typeof o?(o.hasOwnProperty("end")&&!0===o.end&&(e=!0),o.hasOwnProperty("assert")&&!0===o.assert&&console.assert(!1,"%c%O"+n[n.length-1],"color:"+t,performance.now(e,n[n.length-1],o),"[(",...n.slice(0,n.length-1),"*)",o,"]")):"end"===o&&(e=!0),"stat"===o?console.log("%c"+n[n.length-1],"color:"+t,"[(",performance.allMark,"*)",o,"]"):"assert"===o?console.assert(!1,"%c%O"+n[n.length-1],"color:"+t,performance.now(e,n[n.length-1],o),"[(",...n.slice(0,n.length-1),"*)",o,"]"):console.log("%c%O"+n[n.length-1],"color:"+t,performance.now(e,n[n.length-1],o),"[(",...n.slice(0,n.length-1),"*)",o,"]")}else console.log("%c"+o,"color:"+t,"---\x3e",...n)};