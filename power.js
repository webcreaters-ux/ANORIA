/* ANORIA POWER CORE — independent enhancement layer */
(()=>{
  const KEY='anoria-power-v2';
  const P=Object.assign({combo:0,bestCombo:0,stamina:100,kills:0,dodges:0,lastDay:'',dailyProgress:0,dailyDone:false},JSON.parse(localStorage.getItem(KEY)||'{}'));
  const save=()=>localStorage.setItem(KEY,JSON.stringify(P));
  const $=s=>document.querySelector(s);
  const day=()=>new Date().toISOString().slice(0,10);
  if(P.lastDay!==day()){P.lastDay=day();P.dailyProgress=0;P.dailyDone=false;save()}
  const toast=text=>{const e=document.createElement('div');e.className='power-toast';e.textContent=text;document.body.appendChild(e);setTimeout(()=>e.remove(),1600)};
  const css=document.createElement('style');css.textContent=`
    .power-toast{position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:9999;padding:10px 18px;border:1px solid #e8c77a66;border-radius:999px;background:#070a14ef;color:#e8c77a;font:700 12px Cinzel;box-shadow:0 0 30px #0008;animation:pt 1.6s ease forwards;pointer-events:none}
    .power-damage{position:absolute;z-index:60;color:#fff;font:900 23px Cinzel;text-shadow:0 2px 12px #000;pointer-events:none;animation:du .8s ease forwards}
    #power-hud{position:absolute;right:18px;bottom:18px;z-index:12;width:150px;padding:8px 10px;border:1px solid #ffffff18;border-radius:9px;background:#080b18d9;font-size:9px;color:#aeb4cb;backdrop-filter:blur(5px)}
    #power-hud b{color:#e8c77a}#power-stamina{height:4px;background:#ffffff12;border-radius:4px;overflow:hidden;margin-top:5px}#power-stamina i{display:block;height:100%;width:100%;background:#75c9ff;transition:.15s}
    #power-map{position:absolute;right:18px;top:105px;width:120px;height:72px;z-index:10;border:1px solid #ffffff18;border-radius:8px;background:#05071199;overflow:hidden}#power-map i{position:absolute;width:7px;height:7px;border-radius:50%;background:#e8c77a;box-shadow:0 0 9px #e8c77a;left:50%;top:55%}
    .power-shake{animation:ps .22s linear}.power-dodge{animation:pd .32s ease}
    @keyframes du{to{transform:translateY(-42px) scale(.7);opacity:0}}@keyframes pt{0%{opacity:0;transform:translate(-50%,-10px)}15%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0}}@keyframes ps{25%{transform:translate(3px,-2px)}50%{transform:translate(-3px,2px)}75%{transform:translate(2px,1px)}}@keyframes pd{50%{transform:translateX(34px) rotate(10deg);filter:brightness(1.8)}}
    .power-btn{background:#ffffff0b!important;border:1px solid #e8c77a44!important;border-radius:9px!important;padding:9px 12px!important;min-width:44px!important}
    @media(max-width:800px){#power-hud{right:8px;bottom:8px;width:125px}#power-map{right:8px;top:92px;width:100px;height:60px}}
  `;document.head.appendChild(css);
  function setup(){
    const scene=$('#scene');if(!scene)return;
    if(!$('#power-hud')){const h=document.createElement('div');h.id='power-hud';h.innerHTML='<div>COMBO <b id="power-combo">0×</b></div><div>STAMINA <b id="power-stamina-text">100</b></div><div id="power-stamina"><i></i></div>';scene.appendChild(h)}
    if(!$('#power-map')){const m=document.createElement('div');m.id='power-map';m.title='ANORIA Live Tracker';m.innerHTML='<i></i>';scene.appendChild(m)}
    const actions=document.querySelector('.actions');
    if(actions&&!document.querySelector('.power-dodge-btn')){const b=document.createElement('button');b.className='power-btn power-dodge-btn';b.textContent='◆';b.title='Dodge (Q)';b.onclick=dodge;actions.appendChild(b)}
    if(actions&&!document.querySelector('.power-core-btn')){const b=document.createElement('button');b.className='power-btn power-core-btn';b.textContent='⚡';b.title='Power Core';b.onclick=panel;actions.appendChild(b)}
    update();
  }
  function update(){const c=$('#power-combo'),t=$('#power-stamina-text'),b=$('#power-stamina i');if(c)c.textContent=P.combo+'×';if(t)t.textContent=Math.round(P.stamina);if(b)b.style.width=P.stamina+'%'}
  function damageFX(n){const s=$('#scene');if(!s)return;const e=document.createElement('div');e.className='power-damage';e.textContent='−'+n;e.style.left=(55+Math.random()*15)+'%';e.style.top=(35+Math.random()*18)+'%';s.appendChild(e);setTimeout(()=>e.remove(),850);s.classList.remove('power-shake');void s.offsetWidth;s.classList.add('power-shake')}
  function attack(){
    const enemy=$('#enemy'),combat=$('#combat-hud');if(!combat||combat.classList.contains('hidden')){P.combo=0;update();return}
    const n=8+Math.floor(Math.random()*28);P.combo=Math.min(99,P.combo+1);P.bestCombo=Math.max(P.bestCombo,P.combo);damageFX(n);if(P.combo%5===0)toast('🔥 '+P.combo+' HIT COMBO!');save();update()
  }
  function dodge(){if(P.stamina<20){toast('Not enough stamina');return}P.stamina-=20;P.dodges++;const p=$('#player');p?.classList.add('power-dodge');setTimeout(()=>p?.classList.remove('power-dodge'),350);toast('◆ PERFECT DODGE');save();update()}
  document.addEventListener('click',e=>{const b=e.target.closest('.abilities button');if(b){attack()}const mv=e.target.closest('.dpad button');if(mv&&P.stamina>=3){P.stamina-=3;save();update()}},true);
  document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='q')dodge();if(k==='f')document.documentElement.requestFullscreen?.();if(k==='e'&&!$('#dialogue')?.classList.contains('hidden'))return});
  setInterval(()=>{if(P.stamina<100){P.stamina=Math.min(100,P.stamina+.8);update()}},120);
  function panel(){if(typeof openModal!=='function')return;openModal(`<h2>⚡ ANORIA Power Core</h2><div class="codex-grid"><article><b>Best Combo</b><strong>${P.bestCombo}×</strong><small>Highest battle chain</small></article><article><b>Dodges</b><strong>${P.dodges}</strong><small>Perfect escapes</small></article><article><b>Daily Hunt</b><strong>${P.dailyProgress}/7</strong><small>Defeat 7 enemies</small></article><article><b>Core</b><strong>ONLINE</strong><small>Power systems active</small></article></div><h3>⚔️ Controls</h3><p><b>Q</b> Dodge · <b>F</b> Fullscreen · D-pad movement · Combat buttons build combos.</p><p>Daily Hunt resets automatically each day. Keep playing to build your best combo.</p><button class="primary" onclick="closeModal()">Return to Realm</button>`)}
  window.addEventListener('load',()=>setTimeout(setup,80));setTimeout(setup,300);
})();
