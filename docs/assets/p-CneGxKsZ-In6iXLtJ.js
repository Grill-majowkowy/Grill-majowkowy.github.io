import{am as a,an as s,ao as r,ap as i,aq as m}from"./index-MsbW8HC1.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const p=()=>{const t=window;t.addEventListener("statusTap",()=>{a(()=>{const n=document.elementFromPoint(t.innerWidth/2,t.innerHeight/2);if(!n)return;const e=s(n);e&&new Promise(o=>r(e,o)).then(()=>{i(async()=>{e.style.setProperty("--overflow","hidden"),await m(e,300),e.style.removeProperty("--overflow")})})})})};export{p as startStatusTap};
