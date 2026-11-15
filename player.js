const IC={home:'M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10',search:'M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5',heart:'M12 21s-8-5.5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 5.5-8 11-8 11z',clock:'M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2',grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',gear:'M12 9a3 3 0 100 6 3 3 0 000-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2',back:'M9 5l7 7-7 7',prev:'M9 5l7 7-7 7',next:'M15 5l-7 7 7 7',play:'M7 4l13 8-13 8z',pause:'M7 4h4v16H7zM13 4h4v16h-4z',reload:'M20 12a8 8 0 11-3-6.2M20 4v5h-5',fs:'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',vol:'M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 010 6',mute:'M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6',plus:'M12 5v14M5 12h14',trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',link:'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',morocco:'M12 3l2.6 6.2 6.4.5-4.9 4.2 1.5 6.3L12 16.9 6.4 20.2l1.5-6.3L3 9.7l6.4-.5z',arab:'M20 14.5A8.5 8.5 0 119.5 4a7 7 0 0010.5 10.5z',news:'M4 5h13v14H4zM17 9h3v8a2 2 0 01-2 2M7 9h7M7 13h7M7 16h4',sports:'M12 3a9 9 0 100 18 9 9 0 000-18zM5.6 5.6c3.5 3 3.5 10.8 0 12.8M18.4 5.6c-3.5 3-3.5 10.8 0 12.8M3 12h18',movies:'M4 5h16v14H4zM10 9l5 3-5 3z',kids:'M12 3a9 9 0 100 18 9 9 0 000-18zM8.5 14.5a4.5 4.5 0 007 0M9 9.5v.5M15 9.5v.5',docs:'M12 3a9 9 0 100 18 9 9 0 000-18zM15.5 8.5l-2 5-5 2 2-5z',fun:'M9 18V6l10-2v12M9 18a3 3 0 11-6 0 3 3 0 016 0zM19 16a3 3 0 11-6 0 3 3 0 016 0z',religion:'M4 20v-7h16v7M7 13a5 5 0 0110 0M12 3v3M2 20h20',intl:'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',other:'M5 12h.01M12 12h.01M19 12h.01'};
const ic=n=>`<svg viewBox="0 0 24 24" width="22" height="22" fill="${n=='play'||n=='pause'?'currentColor':'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const up=u=>location.protocol=='https:'?u.replace(/^http:/i,'https:'):u;

const Player=(()=>{
const $=i=>document.getElementById(i);
let v,hls,L=[],i=0,P=[],k=0,rc=0,tk=0,tm,ht,fsm=false,wl,played=false,mr=0,hp;
const on=()=>!$('pl').hidden,sh=(id,f)=>{$(id).hidden=!f};
const loadHls=()=>window.Hls?Promise.resolve():hp||(hp=new Promise((r,j)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.light.min.js';s.onload=r;s.onerror=()=>{hp=null;j()};document.head.appendChild(s)}));
const tg=()=>{$('tg').innerHTML=ic(v.paused?'play':'pause')};
const svl=()=>{$('svb').textContent=App.sv()?'توفير':'تلقائي'};
function lay(){const p=$('pl'),w=innerWidth>innerHeight;p.classList.toggle('full',fsm||w);p.classList.toggle('rot',fsm&&!w)}
function showCt(){const c=$('ct');c.classList.remove('h');clearTimeout(ht);ht=setTimeout(()=>{if(!v.paused)c.classList.add('h')},3500)}
function clr(){clearTimeout(tm);if(hls){hls.destroy();hls=null}v.pause();v.removeAttribute('src');v.load()}
function dead(){clr();sh('ld',0);$('em').textContent='تعذر تشغيل هذه القناة: الرابط متوقف أو محمي أو لا يسمح به المتصفح.';sh('er',1);App.health(L[i].id,0)}
function nx(){if(played){if(rc<3){rc++;run(k)}else dead()}else run(k+1)}
function plan(c){const nat=/maybe|probably/.test(v.canPlayType('application/vnd.apple.mpegurl'));
 const f=x=>{if(!x)return[];x=up(x);return/\.m3u8?(\?|#|$)/i.test(x)?(nat?[[x,'n'],[x,'h']]:[[x,'h'],[x,'n']]):/\.(mp4|webm|mp3|aac|ogg)(\?|#|$)/i.test(x)?[[x,'n']]:[[x,'n'],[x,'h']]};
 return[...f(c.url),...f(c.bk)]}
function run(n){
 clr();k=n;if(n>=P.length)return dead();
 const [u,e]=P[n],my=++tk;played=false;mr=0;
 $('lt').textContent=P.length>1?'محاولة '+(n+1)+' من '+P.length:'';sh('ld',1);sh('er',0);
 tm=setTimeout(()=>{if(my===tk)nx()},10000);
 if(e=='n'){v.src=u;v.play().catch(()=>{});return}
 loadHls().then(()=>{if(my!==tk)return;if(!Hls.isSupported())return nx();
  hls=new Hls({startLevel:0,capLevelToPlayerSize:true,maxBufferLength:12,maxMaxBufferLength:20,backBufferLength:0,manifestLoadingMaxRetry:1,levelLoadingMaxRetry:1,fragLoadingMaxRetry:2});
  hls.on(Hls.Events.MANIFEST_PARSED,()=>{hls.autoLevelCapping=App.sv()?0:-1;v.play().catch(()=>{})});
  hls.on(Hls.Events.ERROR,(_,d)=>{if(my!==tk||!d.fatal)return;if(d.type==='mediaError'&&!mr){mr=1;hls.recoverMediaError()}else nx()});
  hls.loadSource(u);hls.attachMedia(v)}).catch(()=>{if(my===tk)nx()})
}
function go(n){i=Math.max(0,Math.min(n,L.length-1));const c=L[i];rc=0;P=plan(c);
 $('pn').textContent=$('pt').textContent=c.name;$('ps').textContent=App.cat(c);$('pg').innerHTML=App.logo(c);$('pf').classList.toggle('on',App.isFav(c.id));
 const r=[];for(let j=1;j<=Math.min(30,L.length-1);j++){const x=(i+j)%L.length;r.push(`<div class="rw" data-p="go" data-i="${x}">${App.logo(L[x])}<b>${App.esc(L[x].name)}</b></div>`)}
 $('rl').innerHTML=r.join('');$('pl').scrollTop=0;App.mark(c);run(0);showCt()}
async function fs(){
 if(fsm){fsm=false;try{if(document.fullscreenElement)await document.exitFullscreen()}catch(e){}try{screen.orientation.unlock()}catch(e){}lay();return}
 fsm=true;lay();
 try{await $('pl').requestFullscreen();await screen.orientation.lock('landscape')}catch(e){}
}
const rel=()=>{try{wl&&wl.release()}catch(e){}wl=null};
const wlk=async()=>{try{wl=await navigator.wakeLock.request('screen')}catch(e){}};
function close(){if(!on())return;clr();fsm=false;lay();$('pl').hidden=true;document.body.classList.remove('lock');try{if(document.fullscreenElement)document.exitFullscreen();screen.orientation.unlock()}catch(e){}rel();App.closed()}
function init(){
 v=$('v');const pl=$('pl');
 v.addEventListener('playing',()=>{clearTimeout(tm);played=true;sh('ld',0);sh('er',0);App.health(L[i].id,1);tg()});
 v.addEventListener('waiting',()=>{sh('ld',1);clearTimeout(tm);const my=tk;tm=setTimeout(()=>{if(my===tk)nx()},15000)});
 v.addEventListener('canplay',()=>sh('ld',0));
 v.addEventListener('error',()=>{if(!hls&&on())nx()});
 v.addEventListener('ended',()=>{if(!isFinite(v.duration))nx()});
 v.addEventListener('play',tg);v.addEventListener('pause',tg);
 v.addEventListener('timeupdate',()=>{const s=$('sk'),f=isFinite(v.duration)&&v.duration>0;s.hidden=!f;$('lv').hidden=f;if(f)s.value=v.currentTime/v.duration*1000});
 v.addEventListener('volumechange',()=>{$('vol').value=v.muted?0:v.volume;$('mu').innerHTML=ic(v.muted||!v.volume?'mute':'vol')});
 $('sk').oninput=e=>{v.currentTime=e.target.value/1000*v.duration};
 $('vol').oninput=e=>{v.muted=false;v.volume=+e.target.value};
 pl.addEventListener('pointerdown',e=>{if(!e.target.closest('.vb'))return;const c=$('ct');if(e.target.closest('#ct button,#ct input')||c.classList.contains('h'))showCt();else c.classList.add('h')});
 pl.addEventListener('click',e=>{const b=e.target.closest('[data-p]');if(!b)return;const a=b.dataset.p;
  if(a=='back'){fsm?fs():history.back()}
  else if(a=='toggle'){v.paused?v.play().catch(()=>{}):v.pause()}
  else if(a=='next'||a=='prev'){if(L.length>1)go((i+(a=='next'?1:-1)+L.length)%L.length)}
  else if(a=='go')go(+b.dataset.i);
  else if(a=='reload')go(i);
  else if(a=='mute')v.muted=!v.muted;
  else if(a=='sv'){App.setSv(!App.sv());svl();if(hls)hls.autoLevelCapping=App.sv()?0:-1}
  else if(a=='fav'){b.classList.toggle('on',App.fav(L[i].id))}
  else if(a=='fs')fs()});
 addEventListener('resize',lay);addEventListener('orientationchange',lay);
 addEventListener('popstate',()=>{if(!on())return;if(fsm){fs();history.pushState({p:1},'')}else close()});
 document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&fsm){fsm=false;try{screen.orientation.unlock()}catch(e){}lay()}});
 document.addEventListener('visibilitychange',()=>{if(!on())return;if(document.hidden)v.pause();else wlk()});
 addEventListener('online',()=>{if(on()&&!$('er').hidden)go(i)});
 tg();svl();$('mu').innerHTML=ic('vol')
}
return{init,isOpen:on,close,
 open(l,idx){L=l;$('pl').hidden=false;document.body.classList.add('lock');history.pushState({p:1},'');lay();$('pf').innerHTML=ic('heart');svl();wlk();go(idx)}}
})();
