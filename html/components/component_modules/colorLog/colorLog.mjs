export default(e,a,...r)=>{switch(a=a||"black"){case"success":a="Green";break;case"info":a="DodgerBlue";break;case"error":a="Red";break;case"warning":a="Orange";break;case"events-out":a="blue";break;case"violet":a="violet"}console.log("%c"+e,"color:"+a,...r)};