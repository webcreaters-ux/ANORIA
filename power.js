/* ANORIA POWER CORE — progression, combo, stamina, dodge, minimap, daily challenge, damage FX */
(()=>{
  const KEY='anoria-power-v1';
  const P=Object.assign({combo:0,bestCombo:0,stamina:100,crystals:0,days:0,daily:null,lastDay:'',kills:0,dodges:0},JSON.parse(localStorage.getItem(KEY)||'{}'));
  const saveP=()=>localStorage.setItem(KEY,JSON.stringify(P));
  const $=s=>document.querySelector(s);
  const flash=(text,cls='power-toast')=>{let e=document.createElement('div');e.className=cls;e.textContent=text;document.body.appendChild(e);setTimeout(()=>e.remove(),1600)};
  function day(){return new Date().toISOString().slice(0,10)};
  function daily(){
    if(P.lastDay!==day()){
      P.lastDay=day();P.daily={target:7,progress:0,reward:75,done:false};P.days++;saveP();
    }
  }
  daily();
  function style(){
    const s=document.createElement('style');s.textContent=`
      .power-toast{position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:9999;padding:10px 18px;border:1px solid #e8c77a66;border-radius:999px;background:#070a14eF;color:#e8c77a;font:700 12px Cinzel;box-shadow:0 0 30px #0008;animation:powerToast 1.6s ease forwards;pointer-events:none}
      .damage-fx{position:absolute;z-index:60;color:#fff;font:900 24px Cinzel;text-shadow:0 2px 12px #000;pointer-events:none;animation:damageUp .8s ease forwards}
      #power-hud{position:absolute;right:18px;bottom:18px;z-index:12;width:150px;padding:8px 10px;border:1px solid #ffffff18;border-radius:9px;background:#080b18b8;font-size:9px;color:#aeb4cb;backdrop-filter:blur(5px)}
      #power-hud b{color:#e8c77a}#stamina-bar{height:4px;background:#ffffff12;border-radius:4px;overflow:hidden;margin-top:5px}#stamina-bar i{display:block;height:100%;width:100%;background:#75c9ff;transition:.15s}
      #mini-map{position:absolute;right:18px;top:105px;width:120px;height:72px;z-index:10;border:1px solid #ffffff18;border-radius:8px;background:#05071199;overflow:hidden}
      #mini-map span{position:absolute;width:7px;height:7px;border-radius:50%;background:#e8c77a;box-shadow:0 0 9px #e8c77a}
      .power-shake{animation:powerShake .25s linear}.power-crit{filter:brightness(1.8) saturate(1.4)}
      @keyframes damageUp{to{transform:translateY(-42px) scale(.7);opacity:0}}@keyframes powerToast{0%{opacity:0;transform:translate(-50%,-10px)}15%,80%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,-8px)}}@keyframes powerShake{25%{transform:translate(3px,-2px)}50%{transform:translate(-3px,2px)}75%{transform:translate(2px,1px)}}
      @media(max-width:800px){#power-hud{right:8px;bottom:8px;width:125px}#mini-map{right:8px;top:92px;width:100px;height:60px}}
    `;document.head.appendChild(s);
  }
  style();
  function hud(){
    if($('#power-hud'))return;
    const e=document.createElement('div');e.id='power-hud';e.innerHTML='<div>COMBO <b id="combo-value">0×</b></div><div>STAMINA <b id="stamina-value">100</b></div><div id="stamina-bar"><i></i></div>';
    $('#scene')?.appendChild(e);
    const m=document.createElement('div');m.id='mini-map';m.title='Live realm tracker';m.innerHTML='<span id="mini-player"></span>';$(`#scene`)?.appendChild(m);
  }
  hud();
  function update(){
    const c=$('#combo-value'),v=$('#stamina-value'),b=$('#stamina-bar i');if(c)c.textContent=P.combo+'×';if(v)v.textContent=Math.round(P.stamina);if(b)b.style.width=P.stamina+'%';
    const mp=$('#mini-player');if(mp&&window.state?.position){mp.style.left=state.position.x+'%';mp.style.top=(100-state.position.y)+'%'}
  }
  setInterval(()=>{if(!window.state?.paused&&P.stamina<100){P.stamina=Math.min(100,P.stamina+.8);update()}},120);
  const originalMove=window.movePlayer;
  if(originalMove)window.movePlayer=function(dx,dy){if(P.stamina<5){flash('Too tired — recover stamina');return}P.stamina=Math.max(0,P.stamina-1.8);originalMove(dx,dy);update()};
  const originalAbility=window.ability;
  if(originalAbility)window.ability=function(kind){
    const before=window.state?.enemy?.hp||0;originalAbility(kind);const after=window.state?.enemy?.hp||0;const damage=Math.max(0,before-after);
    if(damage>0){P.combo++;P.bestCombo=Math.max(P.bestCombo,P.combo);if(P.combo%5===0)flash('🔥 '+P.combo+' HIT COMBO!');damageNumber(damage,kind==='slash'&&Math.random()<.2)}
    else if(kind==='heal'||kind==='guard')P.combo=0;saveP();update();
  };
  function damageNumber(n,crit){
    const s=$('#scene');if(!s)return;const e=document.createElement('div');e.className='damage-fx'+(crit?' power-crit':'');e.textContent=(crit?'CRIT ':'−')+n;e.style.left=(55+Math.random()*15)+'%';e.style.top=(35+Math.random()*18)+'%';s.appendChild(e);setTimeout(()=>e.remove(),850);if(crit)flash('⚡ CRITICAL STRIKE!')
    s.classList.remove('power-shake');void s.offsetWidth;s.classList.add('power-shake');
  }
  const originalWin=window.winCombat;
  if(originalWin)window.winCombat=function(){P.kills++;if(P.daily&&!P.daily.done){P.daily.progress++;if(P.daily.progress>=P.daily.target){P.daily.done=true;flash('🏆 Daily Hunt complete +75 Gold');if(window.state)state.gold+=P.daily.reward}}}originalWin();P.combo=Math.min(P.combo+1,99);saveP();update()};
  function dodge(){if(!window.state||state.combat||P.stamina<20)return;P.stamina-=20;P.dodges++;const p=$('#player');p?.classList.add('power-dodge');if(p)setTimeout(()=>p.classList.remove('power-dodge'),350);flash('◆ DODGE');saveP();update()}
  document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e'&&!state?.combat)$('#interact-btn')?.click();if(e.key.toLowerCase()==='q')dodge();if(e.key.toLowerCase()==='f')document.documentElement.requestFullscreen?.()});
  const d=document.createElement('button');d.textContent='◆';d.title='Dodge';d.className='power-dodge-btn';d.onclick=dodge;document.querySelector('.actions')?.appendChild(d);
  const codex=window.anoriaCodex;
  window.anoriaPower=()=>{
    openModal(`<h2>⚡ ANORIA Power Core</h2><div class="codex-grid"><article><b>Best Combo</b><strong>${P.bestCombo}×</strong><small>Highest chain</small></article><article><b>Enemies</b><strong>${P.kills}</strong><small>Defeated</small></article><article><b>Dodges</b><strong>${P.dodges}</strong><small>Perfect escapes</small></article><article><b>Realm Days</b><strong>${P.days}</strong><small>Daily sessions</small></article></div><h3>☀️ Daily Hunt</h3><p>Defeat ${P.daily?.target||7} enemies. Progress: <b>${P.daily?.progress||0}/${P.daily?.target||7}</b></p><p>${P.daily?.done?'🏆 Completed — return tomorrow for a new challenge.':'Reward: '+(P.daily?.reward||75)+' Gold'}</p><button class="primary" onclick="closeModal()">Return to Realm</button>`);
  };
  const b=document.createElement('button');b.textContent='⚡';b.title='Power Core';b.className='power-dodge-btn';b.onclick=()=>window.anoriaPower();document.querySelector('.actions')?.appendChild(b);
  const ps=document.createElement('style');ps.textContent='.power-dodge-btn{background:#ffffff0b!important;border:1px solid #e8c77a44!important;border-radius:9px!important;padding:9px 12px!important;min-width:44px!important}.power-dodge{animation:powerDodge .35s ease!important}@keyframes powerDodge{50%{transform:translateX(34px) rotate(12deg);filter:brightness(1.8)}}';document.head.appendChild(ps);
  setTimeout(update,300);
})();
