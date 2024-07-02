import{d as v,y as b,c as P,w,o as S,A as _,a4 as $,ad as E}from"./index.c0b99ffa.js";const M=["src"],Y=v({__name:"YoutubePlayer",props:{video:{type:Object,default:null},zen:{type:Boolean,default:!1}},emits:["video:playing","video:paused","video:ended"],setup(g,{emit:y}){const c=y,i=g,d={glowingStates:[null,"shadow-primary-sparest","shadow-secondary-sparest","shadow-accent-sparest"]},e=b({ready:!1,player:null,playing:!1,glow:d.glowingStates[0]}),m=t=>{switch(t.data){case window.YT.PlayerState.PLAYING:e.playing=!0,e.glow="GLOW MY QUEEN",c("video:playing",!0);break;case window.YT.PlayerState.PAUSED:e.playing=!1,c("video:paused",!0);break;case window.YT.PlayerState.ENDED:console.log("Video has ended"),e.playing=!1,c("video:ended",!0);break;default:e.playing=!1}},p=()=>{try{e.player=new window.YT.Player("youtube-player",{events:{onStateChange:m}})}catch(t){console.log({err:t})}},h=P(()=>{var s,n,l;if(!((s=i.video)!=null&&s.videoId))return;const t="https://www.youtube.com/embed/",o={autoplay:1,enablejsapi:1,playsinline:1,fs:1},a=`${t}${i.video.videoId}?${(l=(n=Object.entries(o))==null?void 0:n.map(r=>`${r[0]}=${r[1]}`))==null?void 0:l.join("&")}`;return console.log({mapped:a}),a});return w(()=>e.glow,()=>{const{glowingStates:t}=d;if(!e.playing){e.glow=t[0];return}const o=()=>{const a=["primary","secondary","accent","success","danger","warning"],s=["-lowest","-lower","-low","-medium","-high","-higher","-highest"],n=["-spare","-sparer","-sparest"],l=s[Math.floor(Math.random()*(s==null?void 0:s.length))],r=a[Math.floor(Math.random()*(a==null?void 0:a.length))],f=n[Math.floor(Math.random()*(n==null?void 0:n.length))],u=`shadow-${r}${r==="accent"?"":l}${f}`;return u===e.glow?o():u};setTimeout(()=>{e.glow=o()},500)}),w(()=>i.video,()=>{p()}),S(()=>{var a;const t=document.createElement("script");t.src="https://www.youtube.com/iframe_api";const o=document.getElementsByTagName("script")[0];!o||((a=o.parentNode)==null||a.insertBefore(t,o),window.onYouTubeIframeAPIReady=()=>{console.log({ready:!0}),e.ready=!0,p()})}),(t,o)=>(_(),$("iframe",{id:"youtube-player",class:E(`rounded smooth-slowest ${e.glow}`),type:"text/html",src:h.value,style:{width:"100%","max-width":"100vw","max-height":"calc(100vh - 110px)","aspect-ratio":"16 / 9"},frameborder:"0"},null,10,M))}});export{Y as default};
