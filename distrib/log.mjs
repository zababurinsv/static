// import fs from "fs";

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

function formatted_date(time)
{
    var result="";
    var d = new Date(time);
    result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() +
        " "+ d.getHours()+":"+d.getMinutes()+":"+
        d.getSeconds()+" "+d.getMilliseconds();
    return result;
}


// let originalLog = console.log;
// console.log = function(str, str2 = '', str3 = '', str4 = '', str5 = '', str6 = ''){
//     let log = {}
//     log = `${formatted_date(Date.now())}:${str}: ${str2} ${str3} ${str4} ${str5} ${str6}`
//     originalLog(formatted_date(Date.now()), str, str2, str3, str4, str5, str6);
// }

export default function log(str, str2 = '', str3 = '', str4 = '', str5 = '', str6 = '') {

    console.log(str, str2, str3, str4, str5, str6)
}