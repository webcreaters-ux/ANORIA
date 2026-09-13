/* ANORIA 2026 — Advanced RPG systems layer */
(()=>{
  const KEY='anoria-advanced-v1';
  const A=JSON.parse(localStorage.getItem(KEY)||'{"kills":0,"critical":0,"steps":0,"potions":0,"achievements":[],"loot":[]}');
  const saveA=()=>localStorage.setItem(KEY,JSON.stringify(A));
  const esc=s=>String(s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const achievement=(id,name,desc)=>{if(A.achievements.includes(id))return;A.achievements.push(id);saveA(); if(typeof burst==='function')burst(35); if(typeof openModal==='function')openModal(`<h2>🏆 Achievement Unlocked</h2><h3>${esc(name)}</h3><p>${esc(desc)}</p><button class="primary" onclick="closeModal()">Continue</button>`)};
  window.anoriaCodex=()=>{
    const ach=A.achievements.length;
    openModal(`<h2>📚 ANORIA Codex</h2><div class="codex-grid"><article><b>⚔️ Battles</b><strong>${A.kills}</strong><small>Enemies defeated</small></article><article><b>💥 Criticals</b><strong>${A.critical}</strong><small>Critical strikes</small></article><article><b>👣 Exploration</b><strong>${A.steps}</strong><small>Moves made</small></article><article><b>🏆 Achievements</b><strong>${ach}/8</strong><small>Milestones</small></article></div><h3>Milestones</h3><ul><li>${A.kills>=1?'✅':'◻️'} First Blood</li><li>${A.kills>=10?'✅':'◻️'} Shadow Hunter</li><li>${A.critical>=5?'✅':'◻️'} Starbreaker</li><li>${A.steps>=50?'✅':'◻️'} Realm Walker</li><li>${state.shards>=3?'✅':'◻️'} Shard Keeper</li><li>${state.gold>=500?'✅':'◻️'} Royal Treasury</li><li>${state.level>=5?'✅':'◻️'} Citadel Bound</li><li>${state.enemy===null&&state.questDone>=5?'✅':'◻️'} Dawnbringer</li></ul>`);
  };
  function inject(){
    const actions=document.querySelector('.actions'); if(actions&&!document.getElementById('codex-btn')){const b=document.createElement('button');b.id='codex-btn';b.innerHTML='📚<span>Codex</span>';b.onclick=anoriaCodex;actions.appendChild(b)}
    if(!document.getElementById('level-badge')){const h=document.createElement('div');h.id='level-badge';h.innerHTML='LV 1';document.getElementById('scene').appendChild(h)}
  }
  const baseMove=window.movePlayer;
  window.movePlayer=function(dx,dy){if(typeof baseMove==='function')baseMove(dx,dy);A.steps++;saveA();if(A.steps>=50)achievement('walker','Realm Walker','You have crossed 50 steps in Anoria.');};
  const baseWin=window.winCombat;
  window.winCombat=function(){A.kills++; if(state.enemy&&state.enemy.boss)achievement('king','Nightfall Broken','You defeated the Night King.'); if(A.kills===1)achievement('blood','First Blood','Your first enemy has fallen.'); if(A.kills>=10)achievement('hunter','Shadow Hunter','Defeat ten enemies.'); const roll=Math.random(); if(roll>.55){const loot=['Moonleaf Potion','Star Crystal','Ancient Coin','Frost Rune','Obsidian Shard'][Math.floor(Math.random()*5)];A.loot.push(loot);state.inventory.push(loot);if(typeof burst==='function')burst(20)} saveA(); if(typeof baseWin==='function')baseWin();};
  const baseAbility=window.ability;
  window.ability=function(kind){const before=state.enemy&&state.enemy.hp;if(typeof baseAbility==='function')baseAbility(kind);if(kind==='slash'&&before!==undefined&&state.enemy&&state.enemy.hp<before){if(Math.random()<.18){A.critical++;saveA();if(A.critical>=5)achievement('breaker','Starbreaker','Land five critical strikes.')}}};
  const oldRender=window.renderLevel;
  window.renderLevel=function(){if(typeof oldRender==='function')oldRender();const b=document.getElementById('level-badge');if(b)b.textContent=`LV ${state.level} · ${state.xp} XP`;};
  window.addEventListener('load',()=>{inject();setTimeout(()=>{const b=document.getElementById('level-badge');if(b)b.textContent=`LV ${state.level} · ${state.xp} XP`;},900)});
})();
