import{useState,useMemo}from"react";function useAppDialogs(){const[e,t]=useState(!1),[s,u]=useState(!1),[o,a]=useState(!1),[r,p]=useState(),[l,i,m,n,S,c]=useMemo(()=>[e=>{p(e),t(!0)},()=>t(!1),()=>u(!0),()=>u(!1),()=>a(!0),()=>a(!1)],[]);return{selectedCoupon:r,dialog:[e,l,i],result:[s,m,n],form:[o,S,c]}}export default useAppDialogs;