System.register(["./index-legacy-Dbitp5GY.js"],function(e,t){"use strict";var n,r,s,o,a;return{setters:[e=>{n=e.ad,r=e.ae,s=e.af,o=e.ag,a=e.ah}],execute:function(){
/*!
			 * (C) Ionic http://ionicframework.com - MIT License
			 */
e("startStatusTap",()=>{const e=window;e.addEventListener("statusTap",()=>{n(()=>{const t=document.elementFromPoint(e.innerWidth/2,e.innerHeight/2);if(!t)return;const n=r(t);n&&new Promise(e=>s(n,e)).then(()=>{o(async()=>{n.style.setProperty("--overflow","hidden"),await a(n,300),n.style.removeProperty("--overflow")})})})})})}}});
