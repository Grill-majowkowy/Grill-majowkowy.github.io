import{au as o,av as s,aw as r,ax as i,ay as m}from"./index-CuWcK0Nd.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const w=()=>{const t=window;t.addEventListener("statusTap",()=>{o(()=>{const n=document.elementFromPoint(t.innerWidth/2,t.innerHeight/2);if(!n)return;const e=s(n);e&&new Promise(a=>r(e,a)).then(()=>{i(async()=>{e.style.setProperty("--overflow","hidden"),await m(e,300),e.style.removeProperty("--overflow")})})})})};export{w as startStatusTap};
