(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function r(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=r(n);fetch(n.href,o)}})();const de="modulepreload",ue=function(t){return"/Dashboard/"+t},U={},Q=function(e,r,s){let n=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),i=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));n=Promise.allSettled(r.map(c=>{if(c=ue(c),c in U)return;U[c]=!0;const h=c.endsWith(".css"),v=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${v}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":de,h||(d.as="script"),d.crossOrigin="",d.href=c,i&&d.setAttribute("nonce",i),document.head.appendChild(d),h)return new Promise((g,b)=>{d.addEventListener("load",g),d.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(a){const i=new Event("vite:preloadError",{cancelable:!0});if(i.payload=a,window.dispatchEvent(i),!i.defaultPrevented)throw a}return n.then(a=>{for(const i of a||[])i.status==="rejected"&&o(i.reason);return e().catch(o)})};var z={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z=function(t){const e=[];let r=0;for(let s=0;s<t.length;s++){let n=t.charCodeAt(s);n<128?e[r++]=n:n<2048?(e[r++]=n>>6|192,e[r++]=n&63|128):(n&64512)===55296&&s+1<t.length&&(t.charCodeAt(s+1)&64512)===56320?(n=65536+((n&1023)<<10)+(t.charCodeAt(++s)&1023),e[r++]=n>>18|240,e[r++]=n>>12&63|128,e[r++]=n>>6&63|128,e[r++]=n&63|128):(e[r++]=n>>12|224,e[r++]=n>>6&63|128,e[r++]=n&63|128)}return e},fe=function(t){const e=[];let r=0,s=0;for(;r<t.length;){const n=t[r++];if(n<128)e[s++]=String.fromCharCode(n);else if(n>191&&n<224){const o=t[r++];e[s++]=String.fromCharCode((n&31)<<6|o&63)}else if(n>239&&n<365){const o=t[r++],a=t[r++],i=t[r++],c=((n&7)<<18|(o&63)<<12|(a&63)<<6|i&63)-65536;e[s++]=String.fromCharCode(55296+(c>>10)),e[s++]=String.fromCharCode(56320+(c&1023))}else{const o=t[r++],a=t[r++];e[s++]=String.fromCharCode((n&15)<<12|(o&63)<<6|a&63)}}return e.join("")},ee={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const r=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,s=[];for(let n=0;n<t.length;n+=3){const o=t[n],a=n+1<t.length,i=a?t[n+1]:0,c=n+2<t.length,h=c?t[n+2]:0,v=o>>2,d=(o&3)<<4|i>>4;let g=(i&15)<<2|h>>6,b=h&63;c||(b=64,a||(g=64)),s.push(r[v],r[d],r[g],r[b])}return s.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(Z(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):fe(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const r=e?this.charToByteMapWebSafe_:this.charToByteMap_,s=[];for(let n=0;n<t.length;){const o=r[t.charAt(n++)],i=n<t.length?r[t.charAt(n)]:0;++n;const h=n<t.length?r[t.charAt(n)]:64;++n;const d=n<t.length?r[t.charAt(n)]:64;if(++n,o==null||i==null||h==null||d==null)throw new pe;const g=o<<2|i>>4;if(s.push(g),h!==64){const b=i<<4&240|h>>2;if(s.push(b),d!==64){const he=h<<6&192|d;s.push(he)}}}return s},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class pe extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const me=function(t){const e=Z(t);return ee.encodeByteArray(e,!0)},te=function(t){return me(t).replace(/\./g,"")},ge=function(t){try{return ee.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function be(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ye=()=>be().__FIREBASE_DEFAULTS__,Ee=()=>{if(typeof process>"u"||typeof z>"u")return;const t=z.__FIREBASE_DEFAULTS__;if(t)return JSON.parse(t)},ve=()=>{if(typeof document>"u")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&ge(t[1]);return e&&JSON.parse(e)},x=()=>{try{return ye()||Ee()||ve()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},Wt=t=>{var e,r;return(r=(e=x())===null||e===void 0?void 0:e.emulatorHosts)===null||r===void 0?void 0:r[t]},re=()=>{var t;return(t=x())===null||t===void 0?void 0:t.config},Gt=t=>{var e;return(e=x())===null||e===void 0?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _e{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,r)=>{this.resolve=e,this.reject=r})}wrapCallback(e){return(r,s)=>{r?this.reject(r):this.resolve(s),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(r):e(r,s))}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ne(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function Kt(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(ne())}function qt(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function Jt(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function Yt(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Xt(){const t=ne();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function we(){try{return typeof indexedDB=="object"}catch{return!1}}function Ie(){return new Promise((t,e)=>{try{let r=!0;const s="validate-browser-context-for-indexeddb-analytics-module",n=self.indexedDB.open(s);n.onsuccess=()=>{n.result.close(),r||self.indexedDB.deleteDatabase(s),t(!0)},n.onupgradeneeded=()=>{r=!1},n.onerror=()=>{var o;e(((o=n.error)===null||o===void 0?void 0:o.message)||"")}}catch(r){e(r)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Se="FirebaseError";class E extends Error{constructor(e,r,s){super(r),this.code=e,this.customData=s,this.name=Se,Object.setPrototypeOf(this,E.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,se.prototype.create)}}class se{constructor(e,r,s){this.service=e,this.serviceName=r,this.errors=s}create(e,...r){const s=r[0]||{},n=`${this.service}/${e}`,o=this.errors[e],a=o?De(o,s):"Error",i=`${this.serviceName}: ${a} (${n}).`;return new E(n,i,s)}}function De(t,e){return t.replace(Ce,(r,s)=>{const n=e[s];return n!=null?String(n):`<${s}?>`})}const Ce=/\{\$([^}]+)}/g;function Qt(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function N(t,e){if(t===e)return!0;const r=Object.keys(t),s=Object.keys(e);for(const n of r){if(!s.includes(n))return!1;const o=t[n],a=e[n];if(j(o)&&j(a)){if(!N(o,a))return!1}else if(o!==a)return!1}for(const n of s)if(!r.includes(n))return!1;return!0}function j(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(t){const e=[];for(const[r,s]of Object.entries(t))Array.isArray(s)?s.forEach(n=>{e.push(encodeURIComponent(r)+"="+encodeURIComponent(n))}):e.push(encodeURIComponent(r)+"="+encodeURIComponent(s));return e.length?"&"+e.join("&"):""}function er(t){const e={};return t.replace(/^\?/,"").split("&").forEach(s=>{if(s){const[n,o]=s.split("=");e[decodeURIComponent(n)]=decodeURIComponent(o)}}),e}function tr(t){const e=t.indexOf("?");if(!e)return"";const r=t.indexOf("#",e);return t.substring(e,r>0?r:void 0)}function rr(t,e){const r=new Ae(t,e);return r.subscribe.bind(r)}class Ae{constructor(e,r){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=r,this.task.then(()=>{e(this)}).catch(s=>{this.error(s)})}next(e){this.forEachObserver(r=>{r.next(e)})}error(e){this.forEachObserver(r=>{r.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,r,s){let n;if(e===void 0&&r===void 0&&s===void 0)throw new Error("Missing Observer.");Oe(e,["next","error","complete"])?n=e:n={next:e,error:r,complete:s},n.next===void 0&&(n.next=C),n.error===void 0&&(n.error=C),n.complete===void 0&&(n.complete=C);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?n.error(this.finalError):n.complete()}catch{}}),this.observers.push(n),o}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let r=0;r<this.observers.length;r++)this.sendOne(r,e)}sendOne(e,r){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{r(this.observers[e])}catch(s){typeof console<"u"&&console.error&&console.error(s)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function Oe(t,e){if(typeof t!="object"||t===null)return!1;for(const r of e)if(r in t&&typeof t[r]=="function")return!0;return!1}function C(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nr(t){return t&&t._delegate?t._delegate:t}class w{constructor(e,r,s){this.name=e,this.instanceFactory=r,this.type=s,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const m="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Be{constructor(e,r){this.name=e,this.container=r,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const r=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(r)){const s=new _e;if(this.instancesDeferred.set(r,s),this.isInitialized(r)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:r});n&&s.resolve(n)}catch{}}return this.instancesDeferred.get(r).promise}getImmediate(e){var r;const s=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),n=(r=e==null?void 0:e.optional)!==null&&r!==void 0?r:!1;if(this.isInitialized(s)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:s})}catch(o){if(n)return null;throw o}else{if(n)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(Re(e))try{this.getOrInitializeService({instanceIdentifier:m})}catch{}for(const[r,s]of this.instancesDeferred.entries()){const n=this.normalizeInstanceIdentifier(r);try{const o=this.getOrInitializeService({instanceIdentifier:n});s.resolve(o)}catch{}}}}clearInstance(e=m){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(r=>"INTERNAL"in r).map(r=>r.INTERNAL.delete()),...e.filter(r=>"_delete"in r).map(r=>r._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=m){return this.instances.has(e)}getOptions(e=m){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:r={}}=e,s=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(s))throw Error(`${this.name}(${s}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const n=this.getOrInitializeService({instanceIdentifier:s,options:r});for(const[o,a]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(o);s===i&&a.resolve(n)}return n}onInit(e,r){var s;const n=this.normalizeInstanceIdentifier(r),o=(s=this.onInitCallbacks.get(n))!==null&&s!==void 0?s:new Set;o.add(e),this.onInitCallbacks.set(n,o);const a=this.instances.get(n);return a&&e(a,n),()=>{o.delete(e)}}invokeOnInitCallbacks(e,r){const s=this.onInitCallbacks.get(r);if(s)for(const n of s)try{n(e,r)}catch{}}getOrInitializeService({instanceIdentifier:e,options:r={}}){let s=this.instances.get(e);if(!s&&this.component&&(s=this.component.instanceFactory(this.container,{instanceIdentifier:Te(e),options:r}),this.instances.set(e,s),this.instancesOptions.set(e,r),this.invokeOnInitCallbacks(s,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,s)}catch{}return s||null}normalizeInstanceIdentifier(e=m){return this.component?this.component.multipleInstances?e:m:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Te(t){return t===m?void 0:t}function Re(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const r=this.getProvider(e.name);if(r.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);r.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const r=new Be(e,this);return this.providers.set(e,r),r}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var l;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(l||(l={}));const Me={debug:l.DEBUG,verbose:l.VERBOSE,info:l.INFO,warn:l.WARN,error:l.ERROR,silent:l.SILENT},Pe=l.INFO,Le={[l.DEBUG]:"log",[l.VERBOSE]:"log",[l.INFO]:"info",[l.WARN]:"warn",[l.ERROR]:"error"},$e=(t,e,...r)=>{if(e<t.logLevel)return;const s=new Date().toISOString(),n=Le[e];if(n)console[n](`[${s}]  ${t.name}:`,...r);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class ke{constructor(e){this.name=e,this._logLevel=Pe,this._logHandler=$e,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in l))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Me[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,l.DEBUG,...e),this._logHandler(this,l.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,l.VERBOSE,...e),this._logHandler(this,l.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,l.INFO,...e),this._logHandler(this,l.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,l.WARN,...e),this._logHandler(this,l.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,l.ERROR,...e),this._logHandler(this,l.ERROR,...e)}}const He=(t,e)=>e.some(r=>t instanceof r);let V,W;function xe(){return V||(V=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Fe(){return W||(W=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const oe=new WeakMap,M=new WeakMap,ae=new WeakMap,A=new WeakMap,F=new WeakMap;function Ue(t){const e=new Promise((r,s)=>{const n=()=>{t.removeEventListener("success",o),t.removeEventListener("error",a)},o=()=>{r(f(t.result)),n()},a=()=>{s(t.error),n()};t.addEventListener("success",o),t.addEventListener("error",a)});return e.then(r=>{r instanceof IDBCursor&&oe.set(r,t)}).catch(()=>{}),F.set(e,t),e}function ze(t){if(M.has(t))return;const e=new Promise((r,s)=>{const n=()=>{t.removeEventListener("complete",o),t.removeEventListener("error",a),t.removeEventListener("abort",a)},o=()=>{r(),n()},a=()=>{s(t.error||new DOMException("AbortError","AbortError")),n()};t.addEventListener("complete",o),t.addEventListener("error",a),t.addEventListener("abort",a)});M.set(t,e)}let P={get(t,e,r){if(t instanceof IDBTransaction){if(e==="done")return M.get(t);if(e==="objectStoreNames")return t.objectStoreNames||ae.get(t);if(e==="store")return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return f(t[e])},set(t,e,r){return t[e]=r,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function je(t){P=t(P)}function Ve(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...r){const s=t.call(O(this),e,...r);return ae.set(s,e.sort?e.sort():[e]),f(s)}:Fe().includes(t)?function(...e){return t.apply(O(this),e),f(oe.get(this))}:function(...e){return f(t.apply(O(this),e))}}function We(t){return typeof t=="function"?Ve(t):(t instanceof IDBTransaction&&ze(t),He(t,xe())?new Proxy(t,P):t)}function f(t){if(t instanceof IDBRequest)return Ue(t);if(A.has(t))return A.get(t);const e=We(t);return e!==t&&(A.set(t,e),F.set(e,t)),e}const O=t=>F.get(t);function Ge(t,e,{blocked:r,upgrade:s,blocking:n,terminated:o}={}){const a=indexedDB.open(t,e),i=f(a);return s&&a.addEventListener("upgradeneeded",c=>{s(f(a.result),c.oldVersion,c.newVersion,f(a.transaction),c)}),r&&a.addEventListener("blocked",c=>r(c.oldVersion,c.newVersion,c)),i.then(c=>{o&&c.addEventListener("close",()=>o()),n&&c.addEventListener("versionchange",h=>n(h.oldVersion,h.newVersion,h))}).catch(()=>{}),i}const Ke=["get","getKey","getAll","getAllKeys","count"],qe=["put","add","delete","clear"],B=new Map;function G(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(B.get(e))return B.get(e);const r=e.replace(/FromIndex$/,""),s=e!==r,n=qe.includes(r);if(!(r in(s?IDBIndex:IDBObjectStore).prototype)||!(n||Ke.includes(r)))return;const o=async function(a,...i){const c=this.transaction(a,n?"readwrite":"readonly");let h=c.store;return s&&(h=h.index(i.shift())),(await Promise.all([h[r](...i),n&&c.done]))[0]};return B.set(e,o),o}je(t=>({...t,get:(e,r,s)=>G(e,r)||t.get(e,r,s),has:(e,r)=>!!G(e,r)||t.has(e,r)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(r=>{if(Ye(r)){const s=r.getImmediate();return`${s.library}/${s.version}`}else return null}).filter(r=>r).join(" ")}}function Ye(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const L="@firebase/app",K="0.10.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const u=new ke("@firebase/app"),Xe="@firebase/app-compat",Qe="@firebase/analytics-compat",Ze="@firebase/analytics",et="@firebase/app-check-compat",tt="@firebase/app-check",rt="@firebase/auth",nt="@firebase/auth-compat",st="@firebase/database",ot="@firebase/data-connect",at="@firebase/database-compat",it="@firebase/functions",ct="@firebase/functions-compat",lt="@firebase/installations",ht="@firebase/installations-compat",dt="@firebase/messaging",ut="@firebase/messaging-compat",ft="@firebase/performance",pt="@firebase/performance-compat",mt="@firebase/remote-config",gt="@firebase/remote-config-compat",bt="@firebase/storage",yt="@firebase/storage-compat",Et="@firebase/firestore",vt="@firebase/vertexai-preview",_t="@firebase/firestore-compat",wt="firebase",It="10.14.1";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $="[DEFAULT]",St={[L]:"fire-core",[Xe]:"fire-core-compat",[Ze]:"fire-analytics",[Qe]:"fire-analytics-compat",[tt]:"fire-app-check",[et]:"fire-app-check-compat",[rt]:"fire-auth",[nt]:"fire-auth-compat",[st]:"fire-rtdb",[ot]:"fire-data-connect",[at]:"fire-rtdb-compat",[it]:"fire-fn",[ct]:"fire-fn-compat",[lt]:"fire-iid",[ht]:"fire-iid-compat",[dt]:"fire-fcm",[ut]:"fire-fcm-compat",[ft]:"fire-perf",[pt]:"fire-perf-compat",[mt]:"fire-rc",[gt]:"fire-rc-compat",[bt]:"fire-gcs",[yt]:"fire-gcs-compat",[Et]:"fire-fst",[_t]:"fire-fst-compat",[vt]:"fire-vertex","fire-js":"fire-js",[wt]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I=new Map,Dt=new Map,k=new Map;function q(t,e){try{t.container.addComponent(e)}catch(r){u.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,r)}}function H(t){const e=t.name;if(k.has(e))return u.debug(`There were multiple attempts to register component ${e}.`),!1;k.set(e,t);for(const r of I.values())q(r,t);for(const r of Dt.values())q(r,t);return!0}function sr(t,e){const r=t.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),t.container.getProvider(e)}function or(t){return t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ct={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},p=new se("app","Firebase",Ct);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class At{constructor(e,r,s){this._isDeleted=!1,this._options=Object.assign({},e),this._config=Object.assign({},r),this._name=r.name,this._automaticDataCollectionEnabled=r.automaticDataCollectionEnabled,this._container=s,this.container.addComponent(new w("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw p.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ar=It;function ie(t,e={}){let r=t;typeof e!="object"&&(e={name:e});const s=Object.assign({name:$,automaticDataCollectionEnabled:!1},e),n=s.name;if(typeof n!="string"||!n)throw p.create("bad-app-name",{appName:String(n)});if(r||(r=re()),!r)throw p.create("no-options");const o=I.get(n);if(o){if(N(r,o.options)&&N(s,o.config))return o;throw p.create("duplicate-app",{appName:n})}const a=new Ne(n);for(const c of k.values())a.addComponent(c);const i=new At(r,s,a);return I.set(n,i),i}function ir(t=$){const e=I.get(t);if(!e&&t===$&&re())return ie();if(!e)throw p.create("no-app",{appName:t});return e}function _(t,e,r){var s;let n=(s=St[t])!==null&&s!==void 0?s:t;r&&(n+=`-${r}`);const o=n.match(/\s|\//),a=e.match(/\s|\//);if(o||a){const i=[`Unable to register library "${n}" with version "${e}":`];o&&i.push(`library name "${n}" contains illegal characters (whitespace or "/")`),o&&a&&i.push("and"),a&&i.push(`version name "${e}" contains illegal characters (whitespace or "/")`),u.warn(i.join(" "));return}H(new w(`${n}-version`,()=>({library:n,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ot="firebase-heartbeat-database",Bt=1,y="firebase-heartbeat-store";let T=null;function ce(){return T||(T=Ge(Ot,Bt,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(y)}catch(r){console.warn(r)}}}}).catch(t=>{throw p.create("idb-open",{originalErrorMessage:t.message})})),T}async function Tt(t){try{const r=(await ce()).transaction(y),s=await r.objectStore(y).get(le(t));return await r.done,s}catch(e){if(e instanceof E)u.warn(e.message);else{const r=p.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});u.warn(r.message)}}}async function J(t,e){try{const s=(await ce()).transaction(y,"readwrite");await s.objectStore(y).put(e,le(t)),await s.done}catch(r){if(r instanceof E)u.warn(r.message);else{const s=p.create("idb-set",{originalErrorMessage:r==null?void 0:r.message});u.warn(s.message)}}}function le(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rt=1024,Nt=30*24*60*60*1e3;class Mt{constructor(e){this.container=e,this._heartbeatsCache=null;const r=this.container.getProvider("app").getImmediate();this._storage=new Lt(r),this._heartbeatsCachePromise=this._storage.read().then(s=>(this._heartbeatsCache=s,s))}async triggerHeartbeat(){var e,r;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Y();return((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((r=this._heartbeatsCache)===null||r===void 0?void 0:r.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o)?void 0:(this._heartbeatsCache.heartbeats.push({date:o,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(a=>{const i=new Date(a.date).valueOf();return Date.now()-i<=Nt}),this._storage.overwrite(this._heartbeatsCache))}catch(s){u.warn(s)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)===null||e===void 0?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const r=Y(),{heartbeatsToSend:s,unsentEntries:n}=Pt(this._heartbeatsCache.heartbeats),o=te(JSON.stringify({version:2,heartbeats:s}));return this._heartbeatsCache.lastSentHeartbeatDate=r,n.length>0?(this._heartbeatsCache.heartbeats=n,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(r){return u.warn(r),""}}}function Y(){return new Date().toISOString().substring(0,10)}function Pt(t,e=Rt){const r=[];let s=t.slice();for(const n of t){const o=r.find(a=>a.agent===n.agent);if(o){if(o.dates.push(n.date),X(r)>e){o.dates.pop();break}}else if(r.push({agent:n.agent,dates:[n.date]}),X(r)>e){r.pop();break}s=s.slice(1)}return{heartbeatsToSend:r,unsentEntries:s}}class Lt{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return we()?Ie().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const r=await Tt(this.app);return r!=null&&r.heartbeats?r:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var r;if(await this._canUseIndexedDBPromise){const n=await this.read();return J(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:n.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var r;if(await this._canUseIndexedDBPromise){const n=await this.read();return J(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!==null&&r!==void 0?r:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...e.heartbeats]})}else return}}function X(t){return te(JSON.stringify({version:2,heartbeats:t})).length}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $t(t){H(new w("platform-logger",e=>new Je(e),"PRIVATE")),H(new w("heartbeat",e=>new Mt(e),"PRIVATE")),_(L,K,t),_(L,K,"esm2017"),_("fire-js","")}$t("");var kt="firebase",Ht="10.14.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */_(kt,Ht,"app");const xt={apiKey:"AIzaSyB5A3fOdivvr4NOSjcGMIdb9O8oCO1sV98",authDomain:"malaz-cleaning.firebaseapp.com",databaseURL:"https://malaz-cleaning-default-rtdb.firebaseio.com",projectId:"malaz-cleaning",storageBucket:"malaz-cleaning.firebasestorage.app",messagingSenderId:"22958458751",appId:"1:22958458751:web:1d0e572ee5a5ab118cbc4a",measurementId:"G-RQJCLN7L4X"},Ft=ie(xt);async function Ut(){const{getAuth:t}=await Q(async()=>{const{getAuth:e}=await import("./index.esm-D7DwGbC5.js");return{getAuth:e}},[]);return t(Ft)}async function S(){const{createUserWithEmailAndPassword:t,signInWithEmailAndPassword:e,signOut:r,onAuthStateChanged:s,onIdTokenChanged:n}=await Q(async()=>{const{createUserWithEmailAndPassword:o,signInWithEmailAndPassword:a,signOut:i,onAuthStateChanged:c,onIdTokenChanged:h}=await import("./index.esm-D7DwGbC5.js");return{createUserWithEmailAndPassword:o,signInWithEmailAndPassword:a,signOut:i,onAuthStateChanged:c,onIdTokenChanged:h}},[]);return{createUserWithEmailAndPassword:t,signInWithEmailAndPassword:e,signOut:r,onAuthStateChanged:s,onIdTokenChanged:n}}const zt=new Set(["admin@malaz.com","ayman@malaz.com","abdo@malaz.com","yousef@malaz.com"]);let R=null;async function D(){return R||(R=await Ut()),R}async function jt(t,e){try{const r=await D(),{createUserWithEmailAndPassword:s}=await S(),n=await s(r,t,e);return{idToken:await n.user.getIdToken(),email:n.user.email}}catch(r){return{error:{message:r.message}}}}async function Vt(t,e){try{const r=await D(),{signInWithEmailAndPassword:s}=await S(),n=await s(r,t,e);return{idToken:await n.user.getIdToken(),email:n.user.email}}catch(r){return{error:{message:r.message}}}}async function cr(){const t=await D(),{onAuthStateChanged:e,onIdTokenChanged:r}=await S();return new Promise(s=>{e(t,async n=>{if(n){const o=await n.getIdToken();localStorage.setItem("authToken",o)}else localStorage.removeItem("authToken");s()}),typeof r=="function"&&r(t,async n=>{if(n){const o=await n.getIdToken();localStorage.setItem("authToken",o)}else localStorage.removeItem("authToken")})})}const lr={async signup(){throw new Error("إنشاء حساب جديد غير مسموح")},async login(t,e){const r=t.trim().toLowerCase();if(!zt.has(r))throw new Error("هذا الحساب غير مسموح بالدخول");try{const s=await Vt(r,e);if(s.error){if(s.error.message.includes("user-not-found")){const n=await jt(r,e);if(n.error)throw new Error(n.error.message||"خطأ في إنشاء الحساب");return{idToken:n.idToken,email:n.email}}throw new Error(s.error.message||"خطأ في تسجيل الدخول")}return{idToken:s.idToken,email:s.email}}catch(s){throw console.error("Login error:",s),s}},setToken(t){localStorage.setItem("authToken",t)},getToken(){return localStorage.getItem("authToken")},getUserEmail(){return localStorage.getItem("userEmail")||""},getUserName(){const t=this.getUserEmail();return t?t.split("@")[0]:this.isAuthenticated()?"المدير":"مستخدم"},updateUserData(t){t&&localStorage.setItem("userEmail",t.trim().toLowerCase())},isAuthenticated(){return!!this.getToken()},async logout(){localStorage.removeItem("authToken"),localStorage.removeItem("userEmail");try{const{signOut:t}=await S(),e=await D();await t(e)}catch(t){console.error("Logout error:",t)}window.location.href="login.html"}};export{w as C,se as E,E as F,ke as L,ar as S,or as _,lr as a,sr as b,Gt as c,Wt as d,ir as e,tr as f,nr as g,N as h,cr as i,ge as j,ne as k,Xt as l,Qt as m,Zt as n,l as o,Kt as p,er as q,Yt as r,Jt as s,qt as t,H as u,_ as v,rr as w};
