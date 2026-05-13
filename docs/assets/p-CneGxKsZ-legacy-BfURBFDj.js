System.register(["./index-legacy-CKvyU18T.js"],function(e,t){"use strict";var n,r,s,i,o;return{setters:[e=>{n=e.af,r=e.ag,s=e.ah,i=e.ai,o=e.aj}],execute:function(){
/*!
			 * (C) Ionic http://ionicframework.com - MIT License
			 */
e("startStatusTap",()=>{const e=window;e.addEventListener("statusTap",()=>{n(()=>{const t=document.elementFromPoint(e.innerWidth/2,e.innerHeight/2);if(!t)return;const n=r(t);n&&new Promise(e=>s(n,e)).then(()=>{i(async()=>{n.style.setProperty("--overflow","hidden"),await o(n,300),n.style.removeProperty("--overflow")})})})})})}}});
