/* Motor compartilhado das fichas. Lê window.CHAR (definido em char.js de cada
   personagem) e monta a ficha inteira: abas, cálculos, pips, salvamento local,
   descansos, exportação/importação. Textos com {chave} viram números da ficha. */
(function(){
'use strict';
const C = window.CHAR;
if(!C){ document.body.textContent = 'char.js não carregou.'; return; }

const $ = id => document.getElementById(id);
const mod = v => Math.floor((v-10)/2);
const sg = n => (n>=0?'+':'−')+Math.abs(n);
const cap = s => s.charAt(0).toUpperCase()+s.slice(1);
const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const STORAGE_KEY = C.id+'-sheet-v1';
const THEME_KEY = C.id+'-theme';
const TAB_KEY = C.id+'-tab';

const LEVEL = C.level;
const PROF = C.prof || (Math.ceil(LEVEL/4) + 1);
const ABILS = ['str','dex','con','int','wis','cha'];
const ABIL_PT = {str:'For',dex:'Des',con:'Con',int:'Int',wis:'Sab',cha:'Car'};
const ABIL_FULL = {str:'Força',dex:'Destreza',con:'Constituição',int:'Inteligência',wis:'Sabedoria',cha:'Carisma'};
const SKILLS = [
  ['Acrobacia','dex'],['Adestrar Animais','wis'],['Arcanismo','int'],['Atletismo','str'],
  ['Enganação','cha'],['Furtividade','dex'],['História','int'],['Intimidação','cha'],
  ['Intuição','wis'],['Investigação','int'],['Medicina','wis'],['Natureza','int'],
  ['Percepção','wis'],['Persuasão','cha'],['Prestidigitação','dex'],['Religião','int'],['Sobrevivência','wis'],
];
const ARMOR = {
  none:       {n:'Nenhuma (10 + Des)',                          base:0, cap:99, stealth:false},
  padded:     {n:'Acolchoada (11 + Des) · leve',                base:1, cap:99, stealth:true },
  leather:    {n:'Couro (11 + Des) · leve',                     base:1, cap:99, stealth:false},
  studded:    {n:'Couro Batido (12 + Des) · leve',              base:2, cap:99, stealth:false},
  hide:       {n:'Gibão de Peles (12 + Des, máx 2) · média',    base:2, cap:2,  stealth:false},
  chain:      {n:'Camisão de Malha (13 + Des, máx 2) · média',  base:3, cap:2,  stealth:false},
  scale:      {n:'Brunea (14 + Des, máx 2) · média',            base:4, cap:2,  stealth:true },
  breastplate:{n:'Peitoral (14 + Des, máx 2) · média',          base:4, cap:2,  stealth:false},
  halfplate:  {n:'Meia Armadura (15 + Des, máx 2) · média',     base:5, cap:2,  stealth:true },
};
const ARMOR_KEYS = C.armorOptions || Object.keys(ARMOR);
const SLOTS = C.spellcasting ? C.spellcasting.slots : [];
const RES = C.resources || [];

const BASE = {
  scores: Object.assign({}, C.scores),
  hp:{cur:'',max:C.hpMax ? String(C.hpMax) : '',temp:''},
  comp:{cur: C.companion ? String(C.companion.hp) : '', max: C.companion ? String(C.companion.hp) : ''},
  slots:{used: SLOTS.map(()=>0)},
  res: Object.fromEntries(RES.map(r=>[r.id,0])),
  hd:{used:0},
  death:{succ:0,fail:0},
  armor: C.armorDefault || 'none', shield: !!C.shieldDefault,
  coins: Object.assign({cp:'0',sp:'0',ep:'0',gp:'0'}, C.coins || {}),
  items: C.items || '',
  personality: C.personality || '',
  notes:'',
  savedAt:''
};

// ---- utilidades ----
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function merge(base, extra){
  const out = clone(base);
  if(!extra || typeof extra !== 'object') return out;
  for(const k of Object.keys(out)){
    if(!(k in extra)) continue;
    const b = out[k], e = extra[k];
    if(b && typeof b === 'object' && !Array.isArray(b)){
      if(e && typeof e === 'object') out[k] = Object.assign({}, b, e);
    } else if(e !== undefined && e !== null){
      out[k] = e;
    }
  }
  return out;
}
function migrate(p){
  if(!p || typeof p !== 'object') return p;
  const legacyArmor = {'0|0':'none','1|0':'leather','2|0':'studded','2|2':'hide','3|2':'chain'};
  if(typeof p.armor === 'string' && legacyArmor[p.armor]) p.armor = legacyArmor[p.armor];
  if(p.slots && typeof p.slots.used === 'number'){            // versão antiga: um único nível
    const used = SLOTS.map(()=>0); const lvl = SLOTS.findIndex(n=>n>0);
    if(lvl>=0) used[lvl] = p.slots.used; p.slots = {used};
  }
  if(p.slots && Array.isArray(p.slots.used)){
    p.slots.used = SLOTS.map((n,i)=>Math.min(n, p.slots.used[i]||0));
  }
  if(p.curse && typeof p.curse.used === 'number'){ p.res = Object.assign({}, p.res, {curse:p.curse.used}); }
  if(p.fam && !p.comp) p.comp = p.fam;
  return p;
}
const ph = s => String(s).replace(/\{([a-zA-Z0-9_]+)\}/g, (_,k)=>`<span data-v="${k}"></span>`);
const USE = { action:'Ação', bonus:'Ação bônus', reaction:'Reação', free:'Sem ação', passive:'Passiva', ritual:'Ritual', rest:'Descanso', social:'Fora de combate' };
const USE_ORDER = ['action','bonus','reaction','free','ritual','rest','social','passive'];
const USE_HINT = {
  action:'Gasta a sua ação do turno. Só uma por turno.',
  bonus:'Gasta a ação bônus. Só uma por turno, e só se algo conceder.',
  reaction:'Gasta a reação (uma por rodada), fora do seu turno ou dentro dele.',
  free:'Não gasta ação: acontece junto com outra coisa ou é comunicação.',
  ritual:'Fora de combate: leva 10 minutos a mais e não gasta espaço de magia.',
  rest:'Acontece durante ou no fim de um descanso.',
  social:'Uso narrativo, fora do combate.',
  passive:'Sempre ativa — já está somada nos números da ficha ou vale o tempo todo.',
};
const useList = u => (Array.isArray(u) ? u : [u]).filter(Boolean);
const useTags = u => useList(u).map(k=>`<span class="tag use u-${k}">${USE[k]||k}</span>`).join('');
function inferSpellUse(sp){
  if(sp.use) return useList(sp.use);
  const t = (sp.time||'').toLowerCase(), sub = (sp.sub||'').toLowerCase(); const out = [];
  if(t.includes('ação bônus')) out.push('bonus'); else if(t.includes('reação')) out.push('reaction'); else out.push('action');
  if(sub.includes('ritual')) out.push('ritual');
  return out;
}
function tagHtml(t){
  if(!t) return '';
  const [cls, txt] = t.includes(':') ? t.split(':') : ['', t];
  return `<span class="tag ${cls}">${txt}</span>`;
}
function card(title, sub, body, tag, id, use){
  return `<details class="card"${id?` id="${id}"`:''}><summary><span><span class="t">${title}${useTags(use)}${tagHtml(tag)}</span>${sub?`<span class="s">${ph(sub)}</span>`:''}</span></summary><div class="card-body">${body}</div></details>`;
}
function spellCard(sp){
  const body = `<dl class="stats"><dt>Tempo</dt><dd>${sp.time}</dd><dt>Alcance</dt><dd>${sp.range}</dd><dt>Componentes</dt><dd>${sp.comp}</dd><dt>Duração</dt><dd>${sp.dur}</dd></dl>`
    + sp.desc.map(p=>'<p>'+ph(p)+'</p>').join('')
    + (sp.mine ? '<div class="mine">'+ph(sp.mine)+'</div>' : '');
  return card(sp.name, sp.sub, body, sp.tag, 's-'+slug(sp.name), inferSpellUse(sp));
}
function featCard(f){
  return card(f.name, f.sub, f.desc.map(p=>'<p>'+ph(p)+'</p>').join('') + (f.mine ? '<div class="mine">'+ph(f.mine)+'</div>' : ''), f.tag, 'f-'+slug(f.name), f.use);
}
// Índice "como usar": agrupa características e magias por tipo de uso, com atalho para o card.
function useIndex(){
  const entries = [];
  (C.features||[]).forEach(g=>g.items.forEach(f=>useList(f.use).forEach(k=>entries.push({k, name:f.name, id:'f-'+slug(f.name), tab:'tracos'}))));
  (C.spells||[]).forEach(sp=>inferSpellUse(sp).forEach(k=>entries.push({k, name:sp.name, id:'s-'+slug(sp.name), tab:'magias', spell:true})));
  const groups = USE_ORDER.filter(k=>entries.some(e=>e.k===k));
  if(!groups.length) return '';
  return `<div class="box"><h2>Como usar</h2><p class="small-note">Toque num nome para abrir a descrição. Magias aparecem em itálico.</p>${groups.map(k=>`<h3>${USE[k]}</h3><p class="small-note" style="margin:0 0 4px;">${USE_HINT[k]}</p><div class="chips">${entries.filter(e=>e.k===k).map(e=>`<button type="button" class="chip${e.spell?' spell':''}" data-jump="${e.id}" data-tab="${e.tab}">${e.name}</button>`).join('')}</div>`).join('')}</div>`;
}
function track(label, sub, pipsId){
  return `<div class="track"><span class="lbl">${ph(label)}${sub?`<small>${ph(sub)}</small>`:''}</span><span class="pips" id="${pipsId}"></span></div>`;
}

// ---- montagem ----
function build(){
  const sc = C.spellcasting;
  const slotTracks = suffix => SLOTS.map((n,i)=> n>0 ? track('Espaços — '+(i+1)+'º nível', sc.slotNote || (sc.slotRecharge==='short' ? 'recupera em descanso curto' : 'recupera em descanso longo'), 'pipsSlot'+i+suffix) : '').join('');
  const resTracks = RES.map(r=>track(r.name, r.sub, 'pipsRes_'+r.id)).join('');
  const attackRows = (C.attacks||[]).map(a=>`<tr><td>${a.name}</td><td>{atk_${a.id}}</td><td>{dmg_${a.id}} ${a.type}</td><td>${a.range||''}</td></tr>`).join('');

  const html = `
<main>
<header class="header">
  <div><h1>${C.name}</h1><div class="meta">${ph(C.subtitle)}</div></div>
  <div class="toolbar no-print">
    <button class="small" type="button" id="btnTheme" aria-label="Alternar tema">Tema</button>
    <button class="small" type="button" id="btnData">Dados</button>
  </div>
</header>

<section class="tab" id="tab-combate" data-title="Combate">
  <div class="box">
    <div class="grid g4">
      <div class="stat"><div class="v" id="ac">--</div><div class="l">CA</div></div>
      <div class="stat"><div class="v" id="ini">--</div><div class="l">Iniciativa</div></div>
      <div class="stat"><div class="v">${C.speed||'9m'}</div><div class="l">Desloc.</div></div>
      <div class="stat"><div class="v">{profS}</div><div class="l">Prof.</div></div>
    </div>
    <p class="small-note" id="acNote" style="margin:6px 0 0;"></p>
  </div>
  <div class="box">
    <h2>Pontos de Vida</h2>
    <div class="hp-row">
      <div><label for="hpCur">Atual</label><input type="text" inputmode="numeric" id="hpCur" placeholder="—"></div>
      <div><label for="hpMax">Máximo</label><input type="text" inputmode="numeric" id="hpMax" placeholder="—"></div>
      <div><label for="hpTemp">Temporário</label><input type="text" inputmode="numeric" id="hpTemp" placeholder="—"></div>
    </div>
    <div class="hp-adjust no-print">
      <button class="icon" type="button" id="btnDmg" aria-label="Aplicar dano">−</button>
      <input type="text" inputmode="numeric" id="hpAmt" value="1" aria-label="Quantidade">
      <button class="icon" type="button" id="btnHeal" aria-label="Aplicar cura">+</button>
    </div>
    <p class="small-note">${ph(C.hpNote || 'Dano consome PV temporários primeiro. PV temporários não se somam — fica o maior.')}</p>
  </div>
  <div class="box no-print"><div class="grid g2"><button type="button" id="btnShort">Descanso Curto</button><button type="button" id="btnLong">Descanso Longo</button></div></div>
  <div class="box">
    <h2>Recursos</h2>
    ${sc ? slotTracks('') : ''}
    ${resTracks}
    ${track('Dados de Vida', 'd'+C.hitDie+' · gastos · descanso curto: cada dado cura 1d'+C.hitDie+' {conS}', 'pipsHd')}
    ${track('Morte — Sucessos', '', 'pipsDeathS')}
    ${track('Morte — Falhas', '', 'pipsDeathF')}
  </div>
  <div class="box">
    <h2>Ataques</h2>
    <table class="attack-table"><thead><tr><th>Nome</th><th>Bônus</th><th>Dano / Tipo</th><th>Alcance</th></tr></thead><tbody>${ph(attackRows)}</tbody></table>
    ${C.attackNote ? '<p class="small-note">'+ph(C.attackNote)+'</p>' : ''}
    ${(C.attackCards||[]).map(k=>card(k.title, k.sub, ph(k.body), null, null, k.use||'action')).join('')}
  </div>
  ${C.companion ? `<div class="box">
    <h2>${C.companion.title}</h2>
    ${C.companion.note ? '<p class="small-note">'+C.companion.note+'</p>' : ''}
    <div class="grid g2" style="margin:6px 0;">
      <div><label for="compCur">PV atuais</label><input type="text" inputmode="numeric" id="compCur"></div>
      <div><label for="compMax">PV máximos</label><input type="text" inputmode="numeric" id="compMax"></div>
    </div>
    ${card('Bloco de estatísticas', C.companion.sub, ph(C.companion.body))}
  </div>` : ''}
  ${C.turnCards && C.turnCards.length ? `<div class="box"><h2>O que fazer no turno</h2>${C.turnCards.map(k=>card(k.title, k.sub, ph(k.body))).join('')}</div>` : ''}
</section>

<section class="tab" id="tab-magias" data-title="Magias">
  ${sc ? `<div class="box">
    <h2>${sc.title || 'Conjuração'}</h2>
    <div class="grid g3">
      <div class="stat"><div class="v">{dc}</div><div class="l">CD Magia</div></div>
      <div class="stat"><div class="v">{spellAtk}</div><div class="l">Atq. Magia</div></div>
      <div class="stat"><div class="v">${ABIL_PT[sc.ability]}</div><div class="l">Atributo</div></div>
    </div>
    <div style="margin-top:8px;">${slotTracks('b')}</div>
    <p class="small-note">CD = 8 + {prof} + {${sc.ability}} · Ataque = {prof} + {${sc.ability}}. ${ph(sc.note||'')}</p>
  </div>` : ''}
  ${(C.spellSections||[]).map(sec=>`<div class="box"><h2>${sec.title}</h2>${sec.note?'<p class="small-note">'+ph(sec.note)+'</p>':''}${(C.spells||[]).filter(s=>s.list===sec.id).map(spellCard).join('')}</div>`).join('')}
</section>

<section class="tab" id="tab-atributos" data-title="Atributos">
  <div class="box">
    <h2>Atributos</h2>
    <div class="grid abils">
      ${ABILS.map(a=>`<div class="abil"><div class="name">${ABIL_PT[a]}</div><input type="number" inputmode="numeric" id="s${cap(a)}" aria-label="${ABIL_FULL[a]}"><div class="mod" id="m${cap(a)}">--</div></div>`).join('')}
    </div>
    <p class="small-note">${C.scoresNote || ''} Modificador = (valor − 10) ÷ 2, arredondado para baixo.</p>
  </div>
  <div class="box">
    <h2>Testes de Resistência</h2>
    ${ABILS.map(a=>{ const p = (C.saves||[]).includes(a); return `<div class="skill-row${p?' prof':''}"><span><span class="dot${p?' on':''}"></span>${ABIL_FULL[a]}</span><span id="sv${cap(a)}">--</span></div>`; }).join('')}
    <p class="small-note">${C.savesNote || 'Rola-se 1d20 + modificador contra a CD do efeito.'}</p>
  </div>
  <div class="box">
    <h2>Perícias</h2>
    <div id="skillList"></div>
    <p class="small-note" style="margin-top:8px;">Percepção passiva: <b>{pp_percepcao}</b> · Intuição passiva: <b>{pp_intuicao}</b> · Investigação passiva: <b>{pp_investigacao}</b></p>
    ${C.skillsNote ? '<p class="small-note">'+ph(C.skillsNote)+'</p>' : ''}
  </div>
  <div class="box">
    <h2>Proficiências &amp; Idiomas</h2>
    <dl class="stats">${(C.proficiencies||[]).map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
    ${C.proficienciesNote ? '<p class="small-note">'+C.proficienciesNote+'</p>' : ''}
  </div>
</section>

<section class="tab" id="tab-tracos" data-title="Traços">
  ${useIndex()}
  ${(C.features||[]).map(g=>`<div class="box"><h2>${g.group}</h2>${g.src?'<p class="meta-line">'+ph(g.src)+'</p>':''}${g.items.map(featCard).join('')}</div>`).join('')}
</section>

<section class="tab" id="tab-mais" data-title="Equipamento e anotações">
  <div class="box">
    <h2>Equipamento</h2>
    <label for="armor">Armadura</label>
    <select id="armor">${ARMOR_KEYS.map(k=>`<option value="${k}">${ARMOR[k].n}</option>`).join('')}</select>
    <label class="check"><input type="checkbox" id="shield"> Escudo (+2 CA)</label>
    <div class="grid g4" style="margin-top:8px;">
      <div><label for="cCp">PC</label><input type="text" inputmode="numeric" id="cCp"></div>
      <div><label for="cSp">PP</label><input type="text" inputmode="numeric" id="cSp"></div>
      <div><label for="cEp">PE</label><input type="text" inputmode="numeric" id="cEp"></div>
      <div><label for="cGp">PO</label><input type="text" inputmode="numeric" id="cGp"></div>
    </div>
    <label for="items" style="margin-top:8px;">Itens</label>
    <textarea id="items"></textarea>
  </div>
  <div class="box">
    <h2>Personalidade</h2>
    <textarea id="personality" class="personality" placeholder="Traços, ideais, vínculos, defeitos…"></textarea>
  </div>
  <div class="box">
    <h2>Anotações</h2>
    <textarea id="notes" style="min-height:140px;"></textarea>
    <p class="saved" id="savedAt"></p>
  </div>
</section>
</main>

<nav class="tabbar no-print" aria-label="Seções da ficha"><div class="tabbar-inner">
  <button type="button" data-tab="combate"><span class="ico">⚔</span>Combate</button>
  <button type="button" data-tab="magias"><span class="ico">✦</span>Magias</button>
  <button type="button" data-tab="atributos"><span class="ico">◈</span>Atributos</button>
  <button type="button" data-tab="tracos"><span class="ico">❖</span>Traços</button>
  <button type="button" data-tab="mais"><span class="ico">☰</span>Mais</button>
</div></nav>
<button id="top" class="no-print" type="button" aria-label="Voltar ao topo">↑</button>
<div id="toast" role="status" aria-live="polite"></div>
<div class="modal no-print" id="dataModal"><div class="modal-inner">
  <h2>Dados da ficha</h2>
  <p class="small-note">A ficha é salva automaticamente neste aparelho. Use os botões abaixo para levar os dados a outro aparelho ou guardar uma cópia.</p>
  <textarea id="dataText" aria-label="JSON da ficha"></textarea>
  <div class="grid g2" style="margin-top:8px;">
    <button type="button" id="btnCopy">Copiar código</button>
    <button type="button" id="btnDownload">Baixar arquivo</button>
    <button type="button" id="btnOpenFile">Abrir arquivo</button>
    <button type="button" id="btnLoadText">Carregar do texto</button>
    <button type="button" id="btnPrint">Imprimir / PDF</button>
    <button type="button" id="btnReset">Restaurar padrão</button>
  </div>
  <button type="button" class="primary" style="width:100%; margin-top:8px;" id="btnClose">Fechar</button>
  <input type="file" id="fileInput" style="display:none" accept=".json,.txt,application/json">
</div></div>`;
  document.body.innerHTML = ph(html);   // troca {chaves} restantes em toda a página
}

// ---- estado ----
let S = clone(BASE);
let storageOk = true;
function loadLocal(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); if(raw) S = merge(BASE, migrate(JSON.parse(raw))); }
  catch(e){ storageOk = false; }
}
let saveTimer = null;
function save(){
  S.savedAt = new Date().toISOString();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(()=>{
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); storageOk = true; }catch(e){ storageOk = false; }
    showSavedAt();
  }, 150);
}
function showSavedAt(){
  const el = $('savedAt');
  if(!storageOk){ el.textContent = 'Não foi possível salvar neste navegador — use "Dados" para exportar.'; return; }
  el.textContent = S.savedAt ? 'Salvo automaticamente · ' + new Date(S.savedAt).toLocaleString('pt-BR') : '';
}
let toastTimer = null;
function toast(msg){
  const t = $('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 1800);
}

// ---- cálculos ----
function skillLevel(name){ return (C.skills||{})[name] || ''; }
function skillBonus(name){
  const s = SKILLS.find(x=>x[0]===name); const lv = skillLevel(name);
  let b = mod(S.scores[s[1]]);
  if(lv==='expert') b += 2*PROF; else if(lv==='prof') b += PROF; else if(C.jackOfAllTrades) b += Math.floor(PROF/2);
  return b;
}
function computed(){
  const sc = S.scores;
  const armor = ARMOR[S.armor] || ARMOR.none;
  const ac = 10 + armor.base + Math.min(mod(sc.dex), armor.cap) + (S.shield?2:0);
  const c = { level:LEVEL, prof:PROF, profS:sg(PROF), ac, acShield:ac+5, ini:sg(mod(sc.dex) + (C.jackOfAllTrades?Math.floor(PROF/2):0)) };
  ABILS.forEach(a=>{ c[a] = mod(sc[a]); c[a+'S'] = sg(mod(sc[a])); c['save_'+a] = sg(mod(sc[a]) + ((C.saves||[]).includes(a)?PROF:0)); });
  SKILLS.forEach(([n])=>{ c['sk_'+slug(n)] = sg(skillBonus(n)); c['pp_'+slug(n)] = 10+skillBonus(n); });
  if(C.spellcasting){
    const m = mod(sc[C.spellcasting.ability]);
    c.dc = 8+PROF+m; c.spellAtk = sg(PROF+m); c.spellMod = m; c.spellModS = sg(m);
  }
  (C.attacks||[]).forEach(a=>{
    const m = a.ability ? mod(sc[a.ability]) : 0;
    c['atk_'+a.id] = a.save ? 'CD '+c.dc+' '+a.save : sg(m + (a.prof===false?0:PROF) + (a.bonus||0));
    const dm = (a.useMod===false ? 0 : m) + (a.dmgBonus||0);
    c['dmg_'+a.id] = a.dice + (dm ? ' '+sg(dm) : '');
  });
  if(C.extraVars) Object.assign(c, C.extraVars(c, S));
  return c;
}

function buildSkills(){
  const el = $('skillList'); el.innerHTML='';
  SKILLS.forEach(([name,ab])=>{
    const lv = skillLevel(name);
    const row = document.createElement('div');
    row.className = 'skill-row'+(lv?' prof':'');
    const dot = lv==='expert' ? '<span class="dot on"></span><span class="dot on" style="margin-left:-3px"></span>' : '<span class="dot'+(lv?' on':'')+'"></span>';
    row.innerHTML = `<span>${dot}${name} <span class="ab">(${ABIL_PT[ab]})</span></span><span>${sg(skillBonus(name))}</span>`;
    el.appendChild(row);
  });
}
function pips(containerId, total, used, onToggle, failStyle){
  const el = $(containerId); if(!el) return; el.innerHTML='';
  for(let i=0;i<total;i++){
    const p = document.createElement('button');
    p.type = 'button';
    p.className = 'pip'+(failStyle?' fail':'')+(i<used?' on':'');
    p.setAttribute('aria-label', (i+1)+' de '+total+(i<used?' (usado)':''));
    p.addEventListener('click', ()=>{ onToggle(i); save(); render(); });
    el.appendChild(p);
  }
}
const toggleTo = (cur, i) => (i+1===cur) ? i : i+1;
const setIfIdle = (id, v) => { const el = $(id); if(el && document.activeElement !== el) el.value = v; };

function render(){
  const sc = S.scores;
  ABILS.forEach(a=>{ setIfIdle('s'+cap(a), sc[a]); $('m'+cap(a)).textContent = sg(mod(sc[a])); $('sv'+cap(a)).textContent = sg(mod(sc[a]) + ((C.saves||[]).includes(a)?PROF:0)); });
  const c = computed();
  document.querySelectorAll('[data-v]').forEach(el=>{ const v = c[el.dataset.v]; el.textContent = (v===undefined?'?':v); });
  $('ac').textContent = c.ac;
  $('ini').textContent = c.ini;
  const armor = ARMOR[S.armor] || ARMOR.none;
  $('acNote').textContent = armor.n.split(' ·')[0] + (S.shield?' + escudo':'') + (armor.stealth?' · desvantagem em Furtividade':'') + (C.acNoteExtra ? ' · '+C.acNoteExtra.replace('{acShield}', c.acShield) : '');
  buildSkills();

  SLOTS.forEach((n,i)=>{ if(n<=0) return; const t = j=>{ S.slots.used[i] = toggleTo(S.slots.used[i], j); }; pips('pipsSlot'+i, n, S.slots.used[i], t); pips('pipsSlot'+i+'b', n, S.slots.used[i], t); });
  RES.forEach(r=>{ const total = typeof r.total==='function' ? r.total(c, S) : r.total; pips('pipsRes_'+r.id, total, Math.min(total, S.res[r.id]||0), i=>{ S.res[r.id] = toggleTo(S.res[r.id]||0, i); }); });
  pips('pipsHd', LEVEL, S.hd.used, i=>{ S.hd.used = toggleTo(S.hd.used, i); });
  pips('pipsDeathS', 3, S.death.succ, i=>{ S.death.succ = toggleTo(S.death.succ, i); });
  pips('pipsDeathF', 3, S.death.fail, i=>{ S.death.fail = toggleTo(S.death.fail, i); }, true);

  setIfIdle('hpCur', S.hp.cur); setIfIdle('hpMax', S.hp.max); setIfIdle('hpTemp', S.hp.temp);
  setIfIdle('compCur', S.comp.cur); setIfIdle('compMax', S.comp.max);
  $('armor').value = S.armor; $('shield').checked = S.shield;
  setIfIdle('cCp', S.coins.cp); setIfIdle('cSp', S.coins.sp); setIfIdle('cEp', S.coins.ep); setIfIdle('cGp', S.coins.gp);
  setIfIdle('items', S.items); setIfIdle('personality', S.personality); setIfIdle('notes', S.notes);
  showSavedAt();
}

// ---- abas ----
function setTab(name, scroll){
  document.querySelectorAll('.tab').forEach(s=>s.classList.toggle('active', s.id==='tab-'+name));
  document.querySelectorAll('.tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.tab===name));
  try{ localStorage.setItem(TAB_KEY, name); }catch(e){}
  if(scroll) window.scrollTo({top:0});
}

// ---- PV ----
const num = v => { const n = parseInt(String(v).trim(),10); return Number.isNaN(n) ? null : n; };
function adjustHp(sign){
  const amt = Math.abs(num($('hpAmt').value) ?? 1);
  if(!amt) return;
  let cur = num(S.hp.cur); const max = num(S.hp.max); let temp = num(S.hp.temp) || 0;
  if(cur === null){ toast('Preencha os PV atuais primeiro.'); $('hpCur').focus(); return; }
  if(sign < 0){
    let dmg = amt;
    if(temp > 0){ const t = Math.min(temp, dmg); temp -= t; dmg -= t; }
    cur = Math.max(0, cur - dmg); toast('−'+amt+' PV');
  } else {
    cur = (max !== null) ? Math.min(max, cur + amt) : cur + amt; toast('+'+amt+' PV');
  }
  S.hp.cur = String(cur); S.hp.temp = temp > 0 ? String(temp) : '';
  save(); render();
}

// ---- descansos ----
function shortRest(){
  RES.forEach(r=>{ if(r.recharge==='short') S.res[r.id] = 0; });
  if(C.spellcasting && C.spellcasting.slotRecharge==='short') S.slots.used = SLOTS.map(()=>0);
  save(); render(); toast(C.shortRestMsg || 'Descanso curto concluído.');
}
function longRest(){
  if(!confirm('Descanso longo: recuperar PV, espaços de magia, recursos e metade dos dados de vida?')) return;
  RES.forEach(r=>{ S.res[r.id] = 0; });
  S.slots.used = SLOTS.map(()=>0);
  S.hd.used = Math.max(0, S.hd.used - Math.max(1, Math.floor(LEVEL/2)));
  S.death.succ = 0; S.death.fail = 0;
  if(S.hp.max) S.hp.cur = S.hp.max;
  S.hp.temp = '';
  save(); render(); toast('Descanso longo concluído.');
}

// ---- tema ----
function applyTheme(t){ const h = document.documentElement; if(t) h.setAttribute('data-theme', t); else h.removeAttribute('data-theme'); }
function currentTheme(){ return document.documentElement.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); }
function toggleTheme(){ const next = currentTheme()==='dark' ? 'light' : 'dark'; applyTheme(next); try{ localStorage.setItem(THEME_KEY, next); }catch(e){} }

// ---- exportar / importar ----
function openData(){ $('dataText').value = JSON.stringify(S, null, 2); $('dataModal').classList.add('show'); }
function closeData(){ $('dataModal').classList.remove('show'); }
function copyData(){
  const txt = JSON.stringify(S);
  const fallback = ()=>{ $('dataText').select(); try{ document.execCommand('copy'); toast('Código copiado.'); }catch(e){ toast('Selecione e copie manualmente.'); } };
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(txt).then(()=>toast('Código copiado.')).catch(fallback); else fallback();
}
function downloadData(){
  const blob = new Blob([JSON.stringify(S,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = C.id+'.json';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
function load(txt){
  try{
    const parsed = JSON.parse(txt);
    if(!parsed || typeof parsed !== 'object') throw new Error('bad');
    S = merge(BASE, migrate(parsed)); save(); render(); closeData(); toast('Ficha carregada.');
  }catch(e){ alert('JSON inválido.'); }
}
function resetSheet(){
  if(!confirm('Restaurar a ficha para os valores iniciais? As anotações e PV atuais serão perdidos.')) return;
  S = clone(BASE); save(); render(); closeData(); toast('Ficha restaurada.');
}

// ---- eventos ----
function bind(){
  ABILS.forEach(a=>{
    const inp = $('s'+cap(a));
    inp.addEventListener('input', e=>{ const v = parseInt(e.target.value,10); if(Number.isNaN(v)) return; S.scores[a] = Math.max(1, Math.min(30, v)); save(); render(); });
    inp.addEventListener('blur', render);
  });
  $('armor').addEventListener('change', e=>{ S.armor = e.target.value; save(); render(); });
  $('shield').addEventListener('change', e=>{ S.shield = e.target.checked; save(); render(); });
  const text = (id, fn) => { const el = $(id); if(el) el.addEventListener('input', e=>{ fn(e.target.value); save(); }); };
  text('hpCur', v=>S.hp.cur=v.trim()); text('hpMax', v=>S.hp.max=v.trim()); text('hpTemp', v=>S.hp.temp=v.trim());
  text('compCur', v=>S.comp.cur=v.trim()); text('compMax', v=>S.comp.max=v.trim());
  text('cCp', v=>S.coins.cp=v); text('cSp', v=>S.coins.sp=v); text('cEp', v=>S.coins.ep=v); text('cGp', v=>S.coins.gp=v);
  text('items', v=>S.items=v); text('personality', v=>S.personality=v); text('notes', v=>S.notes=v);
  $('btnDmg').onclick = ()=>adjustHp(-1); $('btnHeal').onclick = ()=>adjustHp(1);
  $('btnShort').onclick = shortRest; $('btnLong').onclick = longRest;
  $('btnTheme').onclick = toggleTheme; $('btnData').onclick = openData; $('btnClose').onclick = closeData;
  $('btnCopy').onclick = copyData; $('btnDownload').onclick = downloadData; $('btnPrint').onclick = ()=>window.print();
  $('btnOpenFile').onclick = ()=>$('fileInput').click(); $('btnLoadText').onclick = ()=>load($('dataText').value); $('btnReset').onclick = resetSheet;
  $('dataModal').addEventListener('click', e=>{ if(e.target===$('dataModal')) closeData(); });
  $('fileInput').addEventListener('change', e=>{ const f = e.target.files[0]; if(!f) return; const r = new FileReader(); r.onload = ev=>load(ev.target.result); r.readAsText(f); e.target.value=''; });
  $('top').onclick = ()=>window.scrollTo({top:0,behavior:'smooth'});
  document.querySelectorAll('.tabbar button').forEach(b=>b.addEventListener('click', ()=>setTab(b.dataset.tab, true)));
  document.querySelectorAll('[data-jump]').forEach(b=>b.addEventListener('click', ()=>{
    const el = $(b.dataset.jump); if(!el) return;
    setTab(b.dataset.tab, false); el.open = true; el.scrollIntoView({block:'start', behavior:'smooth'});
  }));
  window.addEventListener('scroll', ()=>{ $('top').classList.toggle('show', window.scrollY>500); }, {passive:true});
  window.addEventListener('pagehide', ()=>{ try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); }catch(e){} });
}

// ---- início ----
try{ const t = localStorage.getItem(THEME_KEY); if(t) applyTheme(t); }catch(e){}
build();
bind();
loadLocal();
render();
let startTab = 'combate';
try{ const t = localStorage.getItem(TAB_KEY); if(t && $('tab-'+t)) startTab = t; }catch(e){}
setTab(startTab, false);
if('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();
