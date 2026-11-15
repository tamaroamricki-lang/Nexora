const CFG={URL:'channels.json',VER:'2.0.0',PAGE:36,TTL:432e5,CAP:20000};
const $=s=>document.querySelector(s);
const S={g(k,d){try{const x=localStorage.getItem('nova_'+k);return x==null?d:JSON.parse(x)}catch(e){return d}},s(k,x){try{localStorage.setItem('nova_'+k,JSON.stringify(x))}catch(e){}}};
const DB=(()=>{let p;const o=()=>p||(p=new Promise((r,j)=>{try{const q=indexedDB.open('nova',1);q.onupgradeneeded=()=>q.result.createObjectStore('k');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)}catch(e){j(e)}}));
 const t=(m,f)=>o().then(d=>new Promise((r,j)=>{const q=f(d.transaction('k',m).objectStore('k'));q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)})).catch(()=>undefined);
 return{get:k=>t('readonly',s=>s.get(k)),set:(k,v)=>t('readwrite',s=>s.put(v,k)),del:k=>t('readwrite',s=>s.delete(k))}})();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>String(s||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي');
const str=x=>typeof x=='string'?x.trim():'';
const h36=s=>{let h=5381;for(let i=0;i<s.length;i++)h=((h*33)^s.charCodeAt(i))>>>0;return h.toString(36)};
const DEF=[['morocco','القنوات المغربية'],['arab','القنوات العربية'],['news','القنوات الإخبارية'],['sports','القنوات الرياضية'],['movies','الأفلام والمسلسلات'],['kids','قنوات الأطفال'],['docs','القنوات الوثائقية'],['fun','القنوات الترفيهية'],['religion','القنوات الدينية'],['intl','القنوات الدولية'],['other','قنوات أخرى']].map(([id,name])=>({id,name,icon:''}));
const ALIAS=[['news|اخبار','news'],['sport|رياض','sports'],['movie|film|series|فيلم|افلام|مسلسل','movies'],['kid|cartoon|اطفال','kids'],['doc|وثائق','docs'],['relig|islam|quran|دين|قران','religion'],['entertain|music|ترفيه|منوع','fun'],['morocc|maroc|مغرب','morocco'],['arab|عرب','arab']];
let CATS=DEF,ALL=[],IDX=new Map(),CNT={},SD={},BASE={categories:[],channels:[]},lists={},favs=S.g('fav',[]),rec=S.g('rec',[]),vw=S.g('views',{}),hl=S.g('hl',{}),cfg=Object.assign({sv:0,hd:1,th:'dark'},S.g('cfg',{})),SRC=S.g('src',[]),ready=0,busy=0,tt,ht2;

const st=c=>{const h=hl[c.id];return h&&Date.now()-h[1]<(h[0]==0?864e5:216e5)?h[0]:-1};
const stx=s=>s==1?'● مباشر':s==0?'لا يستجيب':s==2?'متاح':'';
const vis=a=>cfg.hd?a.filter(c=>st(c)!==0):a;
const saveHl=()=>{clearTimeout(ht2);ht2=setTimeout(()=>{const k=Object.keys(hl);if(k.length>4000)k.sort((a,b)=>hl[a][1]-hl[b][1]).slice(0,k.length-3000).forEach(x=>delete hl[x]);S.s('hl',hl)},1500)};
const url=x=>/^https?:\/\//i.test(str(x))?str(x):'';
function nc(c,cat,pre){const u=url(c.url||c.streamUrl),n=str(c.name);if(!u||!n)return null;const lg=str(c.logo),cc=str(c.country);
 return{id:pre?pre+h36(u):str(c.id)||'b'+h36(u),name:n,logo:/^(javascript|data):/i.test(lg)?'':lg,cc:/^[A-Za-z]{2}$/.test(cc)?cc.toUpperCase():'',cat:cat||str(c.category)||'other',url:u,bk:url(c.backupUrl||c.bk),feat:c.featured===true}}
function normBase(j){if(!j||!Array.isArray(j.channels))return null;
 return{categories:(Array.isArray(j.categories)?j.categories:[]).filter(c=>c&&c.id&&c.name).map(c=>({id:String(c.id),name:String(c.name),icon:str(c.icon)})),channels:j.channels.map(c=>c&&typeof c=='object'?nc(c,'',''):null).filter(Boolean)}}
function m3u(t){const out=[];let m=null;
 for(const l of t.split(/\r?\n/)){const s=l.trim(),at=r=>(s.match(r)||[])[1]||'';
  if(/^#EXTINF/i.test(s))m={name:s.split(',').slice(1).join(',').trim(),logo:at(/tvg-logo="([^"]*)"/i),category:at(/group-title="([^"]*)"/i),country:at(/tvg-country="([^"]*)"/i)};
  else if(s&&s[0]!='#'&&m){m.url=s;out.push(m);m=null}}
 return out}
function mapCat(x){x=norm(x);if(!x)return'other';const k=CATS.find(k=>k.id==x||norm(k.name)==x);if(k)return k.id;const a=ALIAS.find(([r])=>new RegExp(r).test(x));return a?a[1]:'other'}
function parse(t,s){const T=t.trim();let a;
 if(T[0]=='{'||T[0]=='['){const j=JSON.parse(T);a=Array.isArray(j)?j:j.channels}else if(/#EXTINF/i.test(T))a=m3u(T);else throw 1;
 if(!Array.isArray(a))throw 1;const seen=new Set(),o=[],mc={};
 for(const c of a){if(o.length>=CFG.CAP)break;if(!c||typeof c!='object')continue;let cat=s.cat;if(cat=='*'){const g=str(c.category);cat=mc[g]||(mc[g]=mapCat(g))}
  const x=nc(c,cat,'u');if(x&&!seen.has(x.id)){seen.add(x.id);o.push(x)}}
 if(!o.length)throw 2;return o}
async function get(u,ms){const a=new AbortController(),t=setTimeout(()=>a.abort(),ms||30000);try{const r=await fetch(u,{signal:a.signal,cache:'no-cache'});if(!r.ok)throw 0;return await r.text()}finally{clearTimeout(t)}}
function rebuild(){const m=new Map(),add=c=>{if(!m.has(c.url))m.set(c.url,c)};BASE.channels.forEach(add);SRC.forEach(s=>(SD[s.id]||[]).forEach(add));
 ALL=[...m.values()];IDX=new Map();CNT={};ALL.forEach(c=>{IDX.set(c.id,c);CNT[c.cat]=(CNT[c.cat]||0)+1});
 CATS=BASE.categories.length?BASE.categories.slice():DEF.slice();Object.keys(CNT).forEach(k=>{if(!CATS.some(x=>x.id==k))CATS.push({id:k,name:k})})}
async function loadBase(){try{const j=JSON.parse(await get(CFG.URL));const b=normBase(j);if(!b)throw 0;BASE=b;DB.set('base',j);S.s('upd',Date.now())}catch(e){}}
async function syncAll(f){let ch=0;for(const s of SRC){if(s.t!='list'||(!f&&Date.now()-s.ts<CFG.TTL))continue;
 try{const a=parse(await get(s.url,45000),s);SD[s.id]=a;s.n=a.length;s.ts=Date.now();await DB.set('s:'+s.id,a);ch=1}catch(e){}}
 if(ch)S.s('src',SRC)}
async function refresh(m){if(busy)return;if(!navigator.onLine){if(m)toast('لا يوجد اتصال بالإنترنت');return}
 busy=1;if(m){toast('جارٍ التحديث…');for(const k in hl)if(hl[k][0]==0)delete hl[k];saveHl()}
 const n=ALL.length;try{await loadBase();await syncAll(m)}finally{busy=0}
 rebuild();if(m){toast('تم التحديث');if(!Player.isOpen())draw(1)}else if(ALL.length!=n&&!Player.isOpen())draw(1)}
async function addSrc(cat,mode,u,name,logo){
 u=str(u);if(!/^https?:\/\//i.test(u))throw new Error('الرابط يجب أن يبدأ بـ https://');if(cat=='*')mode='list';
 const s={id:'s'+h36(cat+u+Date.now()),cat,url:u,t:mode,name:str(name),ts:Date.now()};let a;
 if(mode=='one'){if(!s.name)throw new Error('اكتب اسم القناة.');a=[nc({name:s.name,url:u,logo},cat,'u')]}
 else{let t;try{t=await get(u,45000)}catch(e){throw new Error('تعذر تحميل الرابط. تأكد أنه صحيح وأن الموقع يسمح بقراءته من المتصفح (CORS).')}
  await new Promise(r=>setTimeout(r,30));
  try{a=parse(t,s)}catch(e){throw new Error('الملف ليس قائمة M3U أو JSON صالحة، أو لا يحتوي قنوات بروابط http/https.')}}
 s.n=a.length;SD[s.id]=a;await DB.set('s:'+s.id,a);SRC.push(s);S.s('src',SRC);rebuild();return a.length}

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('on'),2800)}
const cn=id=>(CATS.find(c=>c.id==id)||{name:id}).name;
const icn=k=>IC[k.icon]?k.icon:IC[k.id]?k.id:'other';
const ctry=c=>{if(!/^[A-Z]{2}$/.test(c))return c;let n=c;try{n=new Intl.DisplayNames(['ar'],{type:'region'}).of(c)}catch(e){}return n};
const ini=n=>n.split(/\s+/).slice(0,2).map(w=>[...w][0]).join('').toUpperCase();
const logo=c=>`<div class="lg"><span>${esc(ini(c.name))}</span>${c.logo&&!cfg.sv?`<img src="${esc(c.logo)}" alt="" loading="lazy" decoding="async" onerror="this.remove()">`:''}</div>`;
const upd=()=>{const t=S.g('upd',0);return t?new Date(t).toLocaleString('ar'):'لم يتم بعد'};
const byId=id=>IDX.get(id);
const card=c=>{const s=st(c);return`<article class="card" data-a="play" data-id="${esc(c.id)}">${logo(c)}<button class="fav${favs.includes(c.id)?' on':''}" data-a="fav" data-id="${esc(c.id)}" aria-label="المفضلة">${ic('heart')}</button><h3>${esc(c.name)}</h3><p>${esc(cn(c.cat))}${c.cc?' · '+esc(c.cc):''}</p><span class="st s${s}">${stx(s)}</span></article>`};
const grid=(k,a,h)=>{lists[k]=a;return`<div class="${h?'hs':'grid'}" data-list="${k}" data-i="${CFG.PAGE}">${a.slice(0,h?20:CFG.PAGE).map(card).join('')}</div>`+(!h&&a.length>CFG.PAGE?`<i class="more" data-k="${k}"></i>`:'')};
const sec=(t,h)=>`<section><h2>${t}</h2>${h}</section>`;
const empty=(t,p,a,b)=>`<div class="em"><h3>${t}</h3><p>${p}</p>${a?`<button class="bt" data-a="${a}">${b}</button>`:''}</div>`;
const lst=(k,a,msg)=>a.length?grid(k,a):empty(msg||'لا توجد قنوات','');

const IO=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const m=e.target,g=m.previousElementSibling,l=lists[m.dataset.k],n=+g.dataset.i;
 g.insertAdjacentHTML('beforeend',l.slice(n,n+CFG.PAGE).map(card).join(''));g.dataset.i=n+CFG.PAGE;
 if(n+CFG.PAGE>=l.length){IO.unobserve(m);m.remove()}else{IO.unobserve(m);IO.observe(m)}scan()}),{rootMargin:'800px'});
const io=()=>document.querySelectorAll('.more').forEach(m=>IO.observe(m));

const PQ=[];let pr=0;
async function ping(u){const a=new AbortController(),t=setTimeout(()=>a.abort(),5000);try{await fetch(up(u),{mode:'no-cors',cache:'no-store',credentials:'omit',signal:a.signal});return 1}catch(e){return 0}finally{clearTimeout(t);a.abort()}}
function scan(){if(!cfg.hd)return;document.querySelectorAll('.card').forEach(e=>{const c=byId(e.dataset.id);if(c&&st(c)<0&&!c._q&&PQ.length<300){c._q=1;PQ.push(c)}});pump()}
function pump(){while(pr<6&&PQ.length&&!Player.isOpen()&&navigator.onLine){const c=PQ.shift();pr++;ping(c.url).then(ok=>{pr--;c._q=0;if(st(c)!==1){hl[c.id]=[ok?2:0,Date.now()];saveHl()}mark(c);pump()})}}
function mark(c){const s=st(c);document.querySelectorAll('.card[data-id="'+CSS.escape(c.id)+'"]').forEach(e=>{if(s==0&&cfg.hd)e.remove();else{const t=e.querySelector('.st');t.className='st s'+s;t.textContent=stx(s)}})}

const V={
 home(){
  if(!ALL.length)return empty('لا توجد قنوات بعد','أضف رابط قائمة قنوات (M3U أو JSON) من زر + أعلى الشاشة.','goSrc','إضافة قنوات');
  const A=vis(ALL),f=A.filter(c=>c.feat).slice(0,20),r=rec.map(byId).filter(Boolean).slice(0,15),m=A.filter(c=>vw[c.id]).sort((a,b)=>vw[b.id]-vw[a.id]).slice(0,15);
  return`<div class="hero" data-a="live"><span class="lv">مباشر</span><h1>شاهد القنوات المباشرة</h1><p>${ALL.length} قناة في قوائمك</p><button class="bt">ابدأ المشاهدة</button></div>
  <p class="upd">آخر تحديث: ${upd()} <button data-a="refresh" class="lk">تحديث</button></p>`
  +(f.length?sec('القنوات المميزة',grid('f',f,1)):'')+(r.length?sec('شوهدت مؤخراً',grid('r',r,1)):'')
  +sec('التصنيفات',`<div class="chips">${CATS.filter(k=>CNT[k.id]).map(k=>`<a href="#cat/${encodeURIComponent(k.id)}">${esc(k.name)} · ${CNT[k.id]}</a>`).join('')}</div>`)
  +(m.length?sec('الأكثر مشاهدة',grid('m',m,1)):'')+sec('كل القنوات',lst('a',A))},
 cats(){return sec('التصنيفات',`<div class="tiles">${CATS.map(k=>`<a class="tile" href="#cat/${encodeURIComponent(k.id)}">${ic(icn(k))}<b>${esc(k.name)}</b><small>${CNT[k.id]||0} قناة</small></a>`).join('')}</div>`)},
 cat(id){return sec(esc(cn(id)),lst('c',vis(ALL.filter(c=>c.cat==id))))},
 fav(){const a=favs.map(byId).filter(Boolean);return sec('المفضلة',a.length?grid('fv',a):empty('لا توجد قنوات مفضلة','اضغط على القلب في أي قناة لإضافتها هنا.'))},
 recent(){const a=rec.map(byId).filter(Boolean);return sec('آخر المشاهدات',a.length?grid('rc',a):empty('لم تشاهد أي قناة بعد','القنوات التي تشاهدها ستظهر هنا.'))},
 search(){const cs=[...new Set(ALL.map(c=>c.cc).filter(Boolean))].sort();
  return`<div class="sb" style="margin-top:12px"><input id="q" type="search" placeholder="ابحث عن قناة بالعربية أو الإنجليزية" autocomplete="off"><div class="fl"><select id="fc"><option value="">كل التصنيفات</option>${CATS.map(k=>`<option value="${esc(k.id)}">${esc(k.name)}</option>`).join('')}</select><select id="fn"><option value="">كل الدول</option>${cs.map(c=>`<option value="${esc(c)}">${esc(ctry(c))}</option>`).join('')}</select></div></div><div id="res"></div>`},
 sources(){
  const row=s=>`<div class="sr"><div><b>${esc(s.t=='one'?s.name:(()=>{try{return new URL(s.url).host}catch(e){return s.url}})())}</b><small>${s.t=='one'?'قناة واحدة':'قائمة · '+(s.n||0)+' قناة'}</small></div><button data-a="s_del" data-id="${s.id}" aria-label="حذف">${ic('trash')}</button></div>`;
  const box=(id,name,icon,desc)=>{const l=SRC.filter(s=>s.cat==id);return`<div class="sc"><div class="sh"><span class="si">${ic(icon)}</span><div><b>${esc(name)}</b><small>${desc}${l.length?' · '+l.length+' رابط':''}</small></div><button class="pb" data-a="s_new" data-id="${esc(id)}" aria-label="إضافة إلى ${esc(name)}">${ic('plus')}</button></div>${l.map(row).join('')}</div>`};
  return`<section><h2>إضافة القنوات</h2><p class="upd">أضف رابط قائمة قنوات (M3U أو JSON) أو قناة واحدة. تُحفظ على هذا الجهاز وتُحدَّث تلقائياً كل 12 ساعة. أضف روابط تملك حق استخدامها فقط.</p>`
  +box('*','رابط شامل لكل القنوات','link','يوزّع القنوات على التصنيفات تلقائياً')+CATS.map(k=>box(k.id,k.name,icn(k),'قائمة أو قناة واحدة')).join('')+'</section>'},
 settings(){const t=cfg.th,tg=(k,n,d)=>`<button class="tgl" data-a="tg" data-id="${k}"><span>${n}<small>${d}</small></span><i class="sw${cfg[k]?' on':''}"></i></button>`;
  return sec('الإعدادات',`<div class="set"><h4>المظهر</h4><div class="seg">${[['dark','داكن'],['amoled','أسود كامل'],['light','فاتح']].map(([k,n])=>`<button data-a="theme" data-id="${k}" class="${t==k?'on':''}">${n}</button>`).join('')}</div>
  <h4>الأداء واستهلاك البيانات</h4>${tg('sv','توفير البيانات','أدنى جودة للبث وبدون شعارات')}${tg('hd','إخفاء القنوات التي لا تستجيب','فحص خفيف جداً للقنوات الظاهرة فقط')}
  <h4>القنوات</h4><p class="upd">آخر تحديث: ${upd()}<br>عدد القنوات: ${ALL.length}</p><button class="bt" data-a="refresh">تحديث القنوات والقوائم الآن</button> <a class="bt ghost" href="#sources" style="display:inline-block">إضافة قنوات</a>
  <h4>البيانات</h4><button class="bt ghost" data-a="clr" data-id="rec">مسح سجل المشاهدة</button> <button class="bt ghost" data-a="clr" data-id="fav">مسح المفضلة</button> <button class="bt ghost" data-a="clr" data-id="hl">مسح نتائج الفحص</button>
  <h4>حول التطبيق · الإصدار ${CFG.VER}</h4><p class="tx">NOVA TV مشغّل قنوات للبث المجاني والمصرّح به فقط، ولا يتجاوز DRM ولا القيود الجغرافية، لذلك قد لا تعمل بعض الروابط.</p>
  <h4>الخصوصية</h4><p class="tx">لا يجمع التطبيق أي بيانات شخصية. المفضلة والسجل والقوائم تُحفظ على جهازك فقط. عند التشغيل يتصل جهازك مباشرة بخادم الجهة التي تبث القناة.</p></div>`)}
};
function bindSearch(){let t;const f=()=>{const q=norm($('#q').value.trim()),c=$('#fc').value,n=$('#fn').value;
 const a=vis(ALL).filter(x=>(!c||x.cat==c)&&(!n||x.cc==n)&&(!q||(x._s||(x._s=norm(x.name+' '+cn(x.cat)+' '+x.cc))).includes(q)));
 $('#res').innerHTML=a.length?`<p class="upd">${a.length} نتيجة</p>`+grid('s',a):empty('لا توجد نتائج','جرّب كلمة أخرى.');io();scan()};
 ['#q','#fc','#fn'].forEach(s=>{$(s).oninput=$(s).onchange=()=>{clearTimeout(t);t=setTimeout(f,220)}});f()}
function draw(keep){const[v,a]=(location.hash.slice(1)||'home').split('/');let h;
 try{h=!ready?'<div class="sk"><i></i><i></i><i></i></div>':(V[v]||V.home)(decodeURIComponent(a||''))}catch(e){h=empty('حدث خطأ غير متوقع','أعد تحميل الصفحة.','refresh','تحديث')}
 $('#view').innerHTML=h;if(ready&&v=='search')bindSearch();io();scan();
 document.querySelectorAll('#tabs button').forEach(b=>b.classList.toggle('on',b.dataset.go==(v=='cat'?'cats':v||'home')));
 if(!keep)scrollTo(0,0)}
function fav(id){const k=favs.indexOf(id);k<0?favs.unshift(id):favs.splice(k,1);S.s('fav',favs);
 document.querySelectorAll('.fav[data-id="'+CSS.escape(id)+'"]').forEach(b=>b.classList.toggle('on',k<0));
 if(location.hash.slice(1).split('/')[0]=='fav')draw(1);toast(k<0?'أُضيفت إلى المفضلة':'أُزيلت من المفضلة');return k<0}
function mkRecent(c){rec=[c.id,...rec.filter(x=>x!=c.id)].slice(0,30);vw[c.id]=(vw[c.id]||0)+1;S.s('rec',rec);S.s('views',vw)}
function theme(){const b=document.body.classList;b.remove('amoled','light');if(cfg.th!='dark')b.add(cfg.th)}
window.App={toast,logo,esc,mark:mkRecent,fav,isFav:id=>favs.includes(id),cat:c=>cn(c.cat)+(c.cc?' · '+ctry(c.cc):''),sv:()=>cfg.sv,setSv:v=>{cfg.sv=v?1:0;S.s('cfg',cfg)},
 health(id,s){hl[id]=[s,Date.now()];saveHl()},
 closed(){document.querySelectorAll('.card').forEach(e=>{const c=byId(e.dataset.id);c&&mark(c)});pump()}};

function dlg(cat){const k=cat=='*'?{name:'الرابط الشامل'}:CATS.find(c=>c.id==cat)||{name:cat},o=$('#dlg');if(o)o.remove();
 document.body.insertAdjacentHTML('beforeend',`<div id="dlg" data-cat="${esc(cat)}" data-mode="list"><div class="bx"><h3>إضافة إلى: ${esc(k.name)}</h3>${cat=='*'?'':'<div class="seg"><button data-a="s_mode" data-id="list" class="on">قائمة قنوات</button><button data-a="s_mode" data-id="one">قناة واحدة</button></div>'}<input id="du" type="url" dir="ltr" placeholder="https://..." autocomplete="off"><input id="dn" placeholder="اسم القناة" hidden><input id="dl" type="url" dir="ltr" placeholder="رابط الشعار (اختياري)" hidden><p class="upd" id="dh">الصق رابط قائمة M3U أو JSON.</p><p class="err" id="de" hidden></p><div class="fl"><button class="bt" data-a="s_save">حفظ</button><button class="bt ghost" data-a="s_close">إلغاء</button></div></div></div>`)}
async function srcAct(a,id,t){const w=$('#dlg');
 if(a=='s_new')dlg(id);else if(a=='s_close')w.remove();
 else if(a=='s_mode'){const one=id=='one';w.dataset.mode=id;$('#dn').hidden=$('#dl').hidden=!one;$('#dh').textContent=one?'الصق رابط البث المباشر (m3u8 أو mp4).':'الصق رابط قائمة M3U أو JSON.';w.querySelectorAll('.seg button').forEach(b=>b.classList.toggle('on',b.dataset.id==id))}
 else if(a=='s_save'){const e=$('#de');e.hidden=true;t.disabled=true;t.textContent='جارٍ التحميل…';
  try{const n=await addSrc(w.dataset.cat,w.dataset.mode,$('#du').value,$('#dn').value,$('#dl').value);w.remove();toast('تمت إضافة '+n+' قناة');draw(1)}
  catch(x){e.textContent=x.message||'تعذر الحفظ.';e.hidden=false;t.disabled=false;t.textContent='حفظ'}}
 else if(a=='s_del'){if(!t.dataset.sure){t.dataset.sure=1;t.classList.add('on');toast('اضغط مرة أخرى للحذف');return}
  SRC=SRC.filter(s=>s.id!=id);delete SD[id];DB.del('s:'+id);S.s('src',SRC);rebuild();draw(1)}}

document.addEventListener('click',e=>{
 const t=e.target.closest('[data-a],[data-go]');if(!t||t.closest('#pl'))return;
 if(t.dataset.go){location.hash='#'+t.dataset.go;return}
 const a=t.dataset.a,id=t.dataset.id;
 if(a=='fav')fav(id);
 else if(a=='play'){const l=lists[t.closest('[data-list]').dataset.list];Player.open(l,l.findIndex(c=>c.id==id))}
 else if(a=='live'){const A=vis(ALL);if(A.length)Player.open(A,Math.max(0,A.findIndex(c=>c.feat)))}
 else if(a=='refresh')refresh(true);
 else if(a=='goSrc')location.hash='#sources';
 else if(a=='theme'){cfg.th=id;S.s('cfg',cfg);theme();draw(1)}
 else if(a=='tg'){cfg[id]=cfg[id]?0:1;S.s('cfg',cfg);draw(1)}
 else if(a=='clr'){if(!t.dataset.sure){t.dataset.sure=1;t.textContent='اضغط مرة أخرى للتأكيد';return}
  if(id=='rec'){rec=[];vw={};S.s('rec',rec);S.s('views',vw)}else if(id=='fav'){favs=[];S.s('fav',favs)}else{hl={};S.s('hl',hl)}
  toast('تم المسح');draw(1)}
 else if(a&&a.startsWith('s_'))srcAct(a,id,t)});
(async function(){
 document.querySelectorAll('[data-ic]').forEach(b=>{b.innerHTML=ic(b.dataset.ic)});
 $('#tabs').innerHTML=[['home','home','الرئيسية'],['cats','grid','التصنيفات'],['fav','heart','المفضلة'],['recent','clock','المشاهدات']].map(([k,i,n])=>`<button data-go="${k}">${ic(i)}<span>${n}</span></button>`).join('');
 theme();Player.init();
 addEventListener('hashchange',()=>draw());
 addEventListener('online',()=>{refresh();pump()});
 addEventListener('error',()=>{});addEventListener('unhandledrejection',e=>e.preventDefault());
 setTimeout(()=>$('#sp').classList.add('out'),1100);setTimeout(()=>$('#sp').remove(),1600);
 const b=normBase(await DB.get('base'));if(b)BASE=b;
 await Promise.all(SRC.map(async s=>{SD[s.id]=(await DB.get('s:'+s.id))||[]}));
 rebuild();ready=1;draw(1);
 refresh()
})();
