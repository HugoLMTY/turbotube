import{h as N,a as X,b as Y,Q as Z}from"./dom.fca40210.js";import{k as S,c as d,h,r as w,l as I,o as H,m as R,n as U,p as D,g as Q,q as k,i as K,t as q,u as M,w as x,v as G,x as ee,y as P,a as te,d as oe,z as ne,A as le,B as ie,C,f as _,D as re,E as ae}from"./index.c0b99ffa.js";import{s as se,g as ue,a as ce,b as de,c as E}from"./scroll.4c9675a7.js";var fe=S({name:"QToolbarTitle",props:{shrink:Boolean},setup(e,{slots:v}){const o=d(()=>"q-toolbar__title ellipsis"+(e.shrink===!0?" col-shrink":""));return()=>h("div",{class:o.value},N(v.default))}}),ve=S({name:"QToolbar",props:{inset:Boolean},setup(e,{slots:v}){const o=d(()=>"q-toolbar row no-wrap items-center"+(e.inset===!0?" q-toolbar--inset":""));return()=>h("div",{class:o.value,role:"toolbar"},N(v.default))}});function he(){const e=w(!I.value);return e.value===!1&&H(()=>{e.value=!0}),{isHydrated:e}}const J=typeof ResizeObserver!="undefined",j=J===!0?{}:{style:"display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;",url:"about:blank"};var F=S({name:"QResizeObserver",props:{debounce:{type:[String,Number],default:100}},emits:["resize"],setup(e,{emit:v}){let o=null,t,l={width:-1,height:-1};function s(a){a===!0||e.debounce===0||e.debounce==="0"?u():o===null&&(o=setTimeout(u,e.debounce))}function u(){if(o!==null&&(clearTimeout(o),o=null),t){const{offsetWidth:a,offsetHeight:i}=t;(a!==l.width||i!==l.height)&&(l={width:a,height:i},v("resize",l))}}const{proxy:m}=Q();if(m.trigger=s,J===!0){let a;const i=g=>{t=m.$el.parentNode,t?(a=new ResizeObserver(s),a.observe(t),u()):g!==!0&&D(()=>{i(!0)})};return H(()=>{i()}),R(()=>{o!==null&&clearTimeout(o),a!==void 0&&(a.disconnect!==void 0?a.disconnect():t&&a.unobserve(t))}),U}else{let g=function(){o!==null&&(clearTimeout(o),o=null),i!==void 0&&(i.removeEventListener!==void 0&&i.removeEventListener("resize",s,k.passive),i=void 0)},b=function(){g(),t&&t.contentDocument&&(i=t.contentDocument.defaultView,i.addEventListener("resize",s,k.passive),u())};const{isHydrated:a}=he();let i;return H(()=>{D(()=>{t=m.$el,t&&b()})}),R(g),()=>{if(a.value===!0)return h("object",{class:"q--avoid-card-border",style:j.style,tabindex:-1,type:"text/html",data:j.url,"aria-hidden":"true",onLoad:b})}}}}),me=S({name:"QHeader",props:{modelValue:{type:Boolean,default:!0},reveal:Boolean,revealOffset:{type:Number,default:250},bordered:Boolean,elevated:Boolean,heightHint:{type:[String,Number],default:50}},emits:["reveal","focusin"],setup(e,{slots:v,emit:o}){const{proxy:{$q:t}}=Q(),l=K(M,q);if(l===q)return console.error("QHeader needs to be child of QLayout"),q;const s=w(parseInt(e.heightHint,10)),u=w(!0),m=d(()=>e.reveal===!0||l.view.value.indexOf("H")!==-1||t.platform.is.ios&&l.isContainer.value===!0),a=d(()=>{if(e.modelValue!==!0)return 0;if(m.value===!0)return u.value===!0?s.value:0;const n=s.value-l.scroll.value.position;return n>0?n:0}),i=d(()=>e.modelValue!==!0||m.value===!0&&u.value!==!0),g=d(()=>e.modelValue===!0&&i.value===!0&&e.reveal===!0),b=d(()=>"q-header q-layout__section--marginal "+(m.value===!0?"fixed":"absolute")+"-top"+(e.bordered===!0?" q-header--bordered":"")+(i.value===!0?" q-header--hidden":"")+(e.modelValue!==!0?" q-layout--prevent-focus":"")),z=d(()=>{const n=l.rows.value.top,p={};return n[0]==="l"&&l.left.space===!0&&(p[t.lang.rtl===!0?"right":"left"]=`${l.left.size}px`),n[2]==="r"&&l.right.space===!0&&(p[t.lang.rtl===!0?"left":"right"]=`${l.right.size}px`),p});function c(n,p){l.update("header",n,p)}function y(n,p){n.value!==p&&(n.value=p)}function V({height:n}){y(s,n),c("size",n)}function O(n){g.value===!0&&y(u,!0),o("focusin",n)}x(()=>e.modelValue,n=>{c("space",n),y(u,!0),l.animate()}),x(a,n=>{c("offset",n)}),x(()=>e.reveal,n=>{n===!1&&y(u,e.modelValue)}),x(u,n=>{l.animate(),o("reveal",n)}),x(l.scroll,n=>{e.reveal===!0&&y(u,n.direction==="up"||n.position<=e.revealOffset||n.position-n.inflectionPoint<100)});const L={};return l.instances.header=L,e.modelValue===!0&&c("size",s.value),c("space",e.modelValue),c("offset",a.value),R(()=>{l.instances.header===L&&(l.instances.header=void 0,c("size",0),c("offset",0),c("space",!1))}),()=>{const n=X(v.default,[]);return e.elevated===!0&&n.push(h("div",{class:"q-layout__shadow absolute-full overflow-hidden no-pointer-events"})),n.push(h(F,{debounce:0,onResize:V})),h("header",{class:b.value,style:z.value,onFocusin:O},n)}}}),ge=S({name:"QPageContainer",setup(e,{slots:v}){const{proxy:{$q:o}}=Q(),t=K(M,q);if(t===q)return console.error("QPageContainer needs to be child of QLayout"),q;G(ee,!0);const l=d(()=>{const s={};return t.header.space===!0&&(s.paddingTop=`${t.header.size}px`),t.right.space===!0&&(s[`padding${o.lang.rtl===!0?"Left":"Right"}`]=`${t.right.size}px`),t.footer.space===!0&&(s.paddingBottom=`${t.footer.size}px`),t.left.space===!0&&(s[`padding${o.lang.rtl===!0?"Right":"Left"}`]=`${t.left.size}px`),s});return()=>h("div",{class:"q-page-container",style:l.value},N(v.default))}});const{passive:A}=k,be=["both","horizontal","vertical"];var pe=S({name:"QScrollObserver",props:{axis:{type:String,validator:e=>be.includes(e),default:"vertical"},debounce:[String,Number],scrollTarget:se},emits:["scroll"],setup(e,{emit:v}){const o={position:{top:0,left:0},direction:"down",directionChanged:!1,delta:{top:0,left:0},inflectionPoint:{top:0,left:0}};let t=null,l,s;x(()=>e.scrollTarget,()=>{a(),m()});function u(){t!==null&&t();const b=Math.max(0,ce(l)),z=de(l),c={top:b-o.position.top,left:z-o.position.left};if(e.axis==="vertical"&&c.top===0||e.axis==="horizontal"&&c.left===0)return;const y=Math.abs(c.top)>=Math.abs(c.left)?c.top<0?"up":"down":c.left<0?"left":"right";o.position={top:b,left:z},o.directionChanged=o.direction!==y,o.delta=c,o.directionChanged===!0&&(o.direction=y,o.inflectionPoint=o.position),v("scroll",{...o})}function m(){l=ue(s,e.scrollTarget),l.addEventListener("scroll",i,A),i(!0)}function a(){l!==void 0&&(l.removeEventListener("scroll",i,A),l=void 0)}function i(b){if(b===!0||e.debounce===0||e.debounce==="0")u();else if(t===null){const[z,c]=e.debounce?[setTimeout(u,e.debounce),clearTimeout]:[requestAnimationFrame(u),cancelAnimationFrame];t=()=>{c(z),t=null}}}const{proxy:g}=Q();return x(()=>g.$q.lang.rtl,u),H(()=>{s=g.$el.parentNode,m()}),R(()=>{t!==null&&t(),a()}),Object.assign(g,{trigger:i,getPosition:()=>o}),U}}),ye=S({name:"QLayout",props:{container:Boolean,view:{type:String,default:"hhh lpr fff",validator:e=>/^(h|l)h(h|r) lpr (f|l)f(f|r)$/.test(e.toLowerCase())},onScroll:Function,onScrollHeight:Function,onResize:Function},setup(e,{slots:v,emit:o}){const{proxy:{$q:t}}=Q(),l=w(null),s=w(t.screen.height),u=w(e.container===!0?0:t.screen.width),m=w({position:0,direction:"down",inflectionPoint:0}),a=w(0),i=w(I.value===!0?0:E()),g=d(()=>"q-layout q-layout--"+(e.container===!0?"containerized":"standard")),b=d(()=>e.container===!1?{minHeight:t.screen.height+"px"}:null),z=d(()=>i.value!==0?{[t.lang.rtl===!0?"left":"right"]:`${i.value}px`}:null),c=d(()=>i.value!==0?{[t.lang.rtl===!0?"right":"left"]:0,[t.lang.rtl===!0?"left":"right"]:`-${i.value}px`,width:`calc(100% + ${i.value}px)`}:null);function y(r){if(e.container===!0||document.qScrollPrevented!==!0){const f={position:r.position.top,direction:r.direction,directionChanged:r.directionChanged,inflectionPoint:r.inflectionPoint.top,delta:r.delta.top};m.value=f,e.onScroll!==void 0&&o("scroll",f)}}function V(r){const{height:f,width:T}=r;let $=!1;s.value!==f&&($=!0,s.value=f,e.onScrollHeight!==void 0&&o("scrollHeight",f),L()),u.value!==T&&($=!0,u.value=T),$===!0&&e.onResize!==void 0&&o("resize",r)}function O({height:r}){a.value!==r&&(a.value=r,L())}function L(){if(e.container===!0){const r=s.value>a.value?E():0;i.value!==r&&(i.value=r)}}let n=null;const p={instances:{},view:d(()=>e.view),isContainer:d(()=>e.container),rootRef:l,height:s,containerHeight:a,scrollbarWidth:i,totalWidth:d(()=>u.value+i.value),rows:d(()=>{const r=e.view.toLowerCase().split(" ");return{top:r[0].split(""),middle:r[1].split(""),bottom:r[2].split("")}}),header:P({size:0,offset:0,space:!1}),right:P({size:300,offset:0,space:!1}),footer:P({size:0,offset:0,space:!1}),left:P({size:300,offset:0,space:!1}),scroll:m,animate(){n!==null?clearTimeout(n):document.body.classList.add("q-body--layout-animate"),n=setTimeout(()=>{n=null,document.body.classList.remove("q-body--layout-animate")},155)},update(r,f,T){p[r][f]=T}};if(G(M,p),E()>0){let T=function(){r=null,f.classList.remove("hide-scrollbar")},$=function(){if(r===null){if(f.scrollHeight>t.screen.height)return;f.classList.add("hide-scrollbar")}else clearTimeout(r);r=setTimeout(T,300)},B=function(W){r!==null&&W==="remove"&&(clearTimeout(r),T()),window[`${W}EventListener`]("resize",$)},r=null;const f=document.body;x(()=>e.container!==!0?"add":"remove",B),e.container!==!0&&B("add"),te(()=>{B("remove")})}return()=>{const r=Y(v.default,[h(pe,{onScroll:y}),h(F,{onResize:V})]),f=h("div",{class:g.value,style:b.value,ref:e.container===!0?void 0:l,tabindex:-1},r);return e.container===!0?h("div",{class:"q-layout-container overflow-hidden",ref:l},[h(F,{onResize:O}),h("div",{class:"absolute-full",style:z.value},[h("div",{class:"scroll",style:c.value},[f])])]):f}}});const we=ae("div",null,"tubinator v0.1",-1),Se=oe({__name:"MainLayout",setup(e){return H(()=>{}),(v,o)=>{const t=ne("router-view");return le(),ie(ye,{view:"lHh lPr lFf",class:"bg-neutral-lower"},{default:C(()=>[_(me,null,{default:C(()=>[_(ve,{class:"not-selectable"},{default:C(()=>[_(Z,{size:"sm",name:"mdi-car-turbocharger"}),_(fe,null,{default:C(()=>[re(" TurboTube ")]),_:1}),we]),_:1})]),_:1}),_(ge,null,{default:C(()=>[_(t)]),_:1})]),_:1})}}});export{Se as default};
