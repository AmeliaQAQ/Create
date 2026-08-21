'use strict';

const STORAGE_KEY = 'create-oc-workspace-v1';
const USE_SERVER_PROXY = typeof location !== 'undefined' && /^https?:$/.test(location.protocol);

const ICONS = {
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><path d="M2 12h20"></path><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  sparkles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 4.8L19 10l-5.1 2.2L12 17l-1.9-4.8L5 10l5.1-2.2z"></path><path d="M19 15l.9 2.3L22 18l-2.1.7L19 21l-.9-2.3L16 18l2.1-.7z"></path><path d="M5 3l.7 1.8L7.5 5.5l-1.8.7L5 8l-.7-1.8L2.5 5.5l1.8-.7z"></path></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
  upload: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="18" x2="20" y2="18"></line><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none"></circle><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none"></circle><circle cx="9" cy="18" r="2" fill="currentColor" stroke="none"></circle></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path></svg>',
  forward: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="5 4 15 12 5 20"></polyline><line x1="19" y1="4" x2="19" y2="20"></line></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
  save: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  zap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
  wand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 4V2"></path><path d="M15 16v-2"></path><path d="M8 9h2"></path><path d="M20 9h2"></path><path d="M17.8 11.8L19 13"></path><path d="M15 9h.01"></path><path d="M17.8 6.2L19 5"></path><path d="M3 21l9-9"></path><path d="M12.2 6.2L11 5"></path></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
};

const STORY_TYPES = ['恋爱', '组队打反派', '救赎', '日常', '悬疑', '冒险'];

const STORY_SYSTEM = `你是一位严格遵守设定的中文小说作者。
你必须只使用用户提供的全部设定来写故事：不得新增、修改或猜测任何未提供的世界观、角色背景、能力、关系、势力、事件或规则；设定里没有的信息一律视为未提供，不要自行填补。
你必须杜绝 OOC：每个角色的言行、性格、说话风格、恐惧执念、能力与弱点、与其他角色的关系都必须严格符合设定。
你必须避免 AI 味过重的表达：不用"仿佛""不禁""宛如""命运的齿轮""嘴角勾起一抹""眼中闪过一丝""内心涌起""空气中弥漫着"等套话；不写空洞排比、口号式升华、总结式感悟；用具体动作、对话和环境细节推进故事。
严格遵循用户给出的篇幅、基调、结局和额外限制。直接输出故事正文，不要输出任何解释、大纲、备注或标题。`;

const CHECK_SYSTEM = `你是OC设定审核员。对照用户给出的设定，逐项检查故事正文是否存在以下问题：
1. 编造或超出设定的世界观、角色背景、能力、关系、势力或事件；
2. 角色 OOC：性格、说话风格、能力使用、行为逻辑、恐惧执念与设定不符；
3. 违反用户要求的篇幅、基调、结局或额外限制。
逐条输出：位置（引用原文片段）、问题、修改建议。如果没有问题，只输出"设定检查通过"。不要给与设定无关的风格建议。`;

const IMPORT_SYSTEM = `你是一个OC设定整理助手。用户会粘贴一份完整的OC故事素材。请把它整理成严格的JSON，禁止编造、扩写或遗漏原文没有的内容。
返回结构必须如下，字段缺失时用空字符串或空数组：
{
  "world": {"era":"", "factions":"", "rules":"", "magic":"", "conflict":"", "raw":""},
  "ocCount": 0,
  "ocs": [{"name":"", "appearance":"", "personality":"", "background":"", "abilities":"", "fears":"", "relationships":"", "speech":"", "extra":""}],
  "npcs": [{"role":"", "name":"", "appearance":"", "personality":"", "background":"", "abilities":"", "relationships":"", "speech":"", "extra":""}],
  "story": {"types":[], "otherType":"", "conflict":"", "length":"", "tone":"", "ending":"", "customEnding":"", "restrictions":""}
}
规则：
1. 原样保留用户提供的信息，不解释、不概括、不增删。
2. 一个OC一条记录；没有名字也保留一条记录，名字为空字符串。
3. 用户没有提供反派或NPC时，npcs返回空数组。
4. story.types只能从这些值中选择：恋爱、组队打反派、救赎、日常、悬疑、冒险；没有匹配的写进otherType。
5. 只输出JSON，不要输出Markdown、解释或多余文字。`;

const $ = (sel) => document.querySelector(sel);

function defaultState() {
  return {
    settings: {
      apiKey: '',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      temperature: 0.8,
      maxTokens: 6000
    },
    world: { era: '', factions: '', rules: '', magic: '', conflict: '', raw: '' },
    ocCount: 0,
    ocs: [],
    npcNone: false,
    npcs: [],
    story: {
      types: [],
      otherType: '',
      conflict: '',
      length: '',
      tone: '',
      ending: '',
      customEnding: '',
      restrictions: ''
    },
    gen: {
      pov: '全知视角',
      style: '自然细腻',
      customStyle: '',
      chapters: false,
      chapterCount: 3,
      extra: ''
    },
    currentStory: '',
    storyTab: 'read',
    serverConfigured: false,
    history: []
  };
}

function deepMerge(base, over) {
  if (Array.isArray(base)) return over;
  if (base && typeof base === 'object' && over && typeof over === 'object') {
    const out = { ...base };
    for (const key of Object.keys(over)) {
      out[key] = deepMerge(base[key], over[key]);
    }
    return out;
  }
  return over;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return deepMerge(defaultState(), JSON.parse(raw));
  } catch (err) {
    return defaultState();
  }
}

let state = loadState();
let currentStory = state.currentStory || '';
let toastTimer = null;

function saveState() {
  try {
    state.currentStory = currentStory;
    state.storyTab = state.storyTab || 'read';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('saveState failed', err);
  }
}

function esc(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function getByPath(path, obj = state) {
  return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function setByPath(path, value) {
  const parts = path.split('.');
  let obj = state;
  for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
  obj[parts[parts.length - 1]] = value;
}

function mountIcons(root = document) {
  root.querySelectorAll('.ic[data-icon]').forEach((el) => {
    el.innerHTML = ICONS[el.dataset.icon] || '';
  });
}

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

function emptyOc(index) {
  return {
    id: 'oc-' + Date.now() + '-' + index,
    name: '',
    appearance: '',
    personality: '',
    background: '',
    abilities: '',
    fears: '',
    relationships: '',
    speech: '',
    extra: ''
  };
}

function emptyNpc(index) {
  return {
    id: 'npc-' + Date.now() + '-' + index,
    role: '',
    name: '',
    appearance: '',
    personality: '',
    background: '',
    abilities: '',
    relationships: '',
    speech: '',
    extra: ''
  };
}

function normalizeOc(raw, index) {
  const r = raw || {};
  return {
    id: 'oc-' + Date.now() + '-' + index,
    name: r.name || r['名字'] || '',
    appearance: r.appearance || r['外貌'] || '',
    personality: r.personality || r['性格'] || '',
    background: r.background || r['身世背景'] || r['背景'] || '',
    abilities: r.abilities || r['能力弱点'] || r['能力'] || '',
    fears: r.fears || r['恐惧执念'] || '',
    relationships: r.relationships || r['与其他OC的关系'] || r['关系'] || '',
    speech: r.speech || r.speakingStyle || r['说话风格'] || '',
    extra: r.extra || r['补充'] || ''
  };
}

function normalizeNpc(raw, index) {
  const r = raw || {};
  return {
    id: 'npc-' + Date.now() + '-' + index,
    role: r.role || r['定位'] || '',
    name: r.name || r['名字'] || '',
    appearance: r.appearance || r['外貌'] || '',
    personality: r.personality || r['性格'] || '',
    background: r.background || r['身世背景'] || r['背景'] || '',
    abilities: r.abilities || r['能力弱点'] || r['能力'] || '',
    relationships: r.relationships || r['与OC的关系'] || r['关系'] || '',
    speech: r.speech || r.speakingStyle || r['说话风格'] || '',
    extra: r.extra || r['补充'] || ''
  };
}

function bindStatic() {
  document.querySelectorAll('[data-bind]').forEach((el) => {
    el.value = getByPath(el.dataset.bind) ?? '';
  });
  document.querySelectorAll('[data-bind-check]').forEach((el) => {
    el.checked = !!getByPath(el.dataset.bindCheck);
  });
}

function syncVisibility() {
  const chapterRow = $('#chapter-row');
  if (chapterRow) chapterRow.hidden = !state.gen.chapters;
  const customEnding = $('#custom-ending-wrap');
  if (customEnding) customEnding.hidden = state.story.ending !== '自定义';
  const none = $('#npc-none');
  if (none) none.checked = state.npcNone;
  const list = $('#npc-list');
  if (list) list.hidden = state.npcNone;
  const add = $('#npc-add');
  if (add) add.hidden = state.npcNone;
}

function renderOCs() {
  const list = $('#oc-list');
  if (!list) return;
  const countInput = $('#oc-count');
  if (countInput) countInput.value = state.ocCount;
  list.innerHTML = state.ocs.map((oc, i) => `
    <article class="oc-card" data-idx="${i}">
      <div class="card-head">
        <span class="badge">OC ${i + 1}</span>
        <input class="name-input" data-field="name" value="${esc(oc.name)}" placeholder="名字" aria-label="OC ${i + 1} 名字">
        <button class="icon-btn remove-oc" data-idx="${i}" title="删除角色" aria-label="删除角色"><span class="ic" data-icon="trash"></span></button>
      </div>
      <div class="grid-2">
        <label class="field"><span>外貌</span><textarea data-field="appearance" rows="2">${esc(oc.appearance)}</textarea></label>
        <label class="field"><span>性格</span><textarea data-field="personality" rows="2">${esc(oc.personality)}</textarea></label>
        <label class="field"><span>身世背景</span><textarea data-field="background" rows="2">${esc(oc.background)}</textarea></label>
        <label class="field"><span>能力与弱点</span><textarea data-field="abilities" rows="2">${esc(oc.abilities)}</textarea></label>
        <label class="field"><span>恐惧与执念</span><textarea data-field="fears" rows="2">${esc(oc.fears)}</textarea></label>
        <label class="field"><span>与其他OC的关系</span><textarea data-field="relationships" rows="2">${esc(oc.relationships)}</textarea></label>
        <label class="field"><span>说话风格</span><textarea data-field="speech" rows="2">${esc(oc.speech)}</textarea></label>
        <label class="field"><span>补充</span><textarea data-field="extra" rows="2">${esc(oc.extra)}</textarea></label>
      </div>
    </article>
  `).join('');
  mountIcons(list);
}

function renderNPCs() {
  const list = $('#npc-list');
  if (!list) return;
  syncVisibility();
  list.innerHTML = state.npcs.map((npc, i) => `
    <article class="npc-card" data-idx="${i}">
      <div class="card-head">
        <span class="badge">NPC ${i + 1}</span>
        <input class="name-input" data-field="name" value="${esc(npc.name)}" placeholder="名字" aria-label="NPC ${i + 1} 名字">
        <button class="icon-btn remove-npc" data-idx="${i}" title="删除" aria-label="删除"><span class="ic" data-icon="trash"></span></button>
      </div>
      <div class="grid-2">
        <label class="field"><span>定位 / 身份</span><input data-field="role" value="${esc(npc.role)}" placeholder="例如：幕后反派 / 情报贩子"></label>
        <label class="field"><span>外貌</span><textarea data-field="appearance" rows="2">${esc(npc.appearance)}</textarea></label>
        <label class="field"><span>性格</span><textarea data-field="personality" rows="2">${esc(npc.personality)}</textarea></label>
        <label class="field"><span>身世背景</span><textarea data-field="background" rows="2">${esc(npc.background)}</textarea></label>
        <label class="field"><span>能力与弱点</span><textarea data-field="abilities" rows="2">${esc(npc.abilities)}</textarea></label>
        <label class="field"><span>与OC的关系</span><textarea data-field="relationships" rows="2">${esc(npc.relationships)}</textarea></label>
        <label class="field"><span>说话风格</span><textarea data-field="speech" rows="2">${esc(npc.speech)}</textarea></label>
        <label class="field"><span>补充</span><textarea data-field="extra" rows="2">${esc(npc.extra)}</textarea></label>
      </div>
    </article>
  `).join('');
  mountIcons(list);
}

function renderStoryTypes() {
  const wrap = $('#type-chips');
  if (!wrap) return;
  const all = [...STORY_TYPES, '其他'];
  wrap.innerHTML = all.map((type) => `
    <label class="chip ${state.story.types.includes(type) ? 'active' : ''}">
      <input type="checkbox" value="${type}" ${state.story.types.includes(type) ? 'checked' : ''}>
      <span>${type}</span>
    </label>
  `).join('');
}

function renderReadiness() {
  const wrap = $('#readiness');
  if (!wrap) return;
  const worldFields = ['era', 'factions', 'rules', 'magic', 'conflict'];
  const worldFilled = worldFields.filter((k) => (state.world[k] || '').trim()).length;
  const ocFilled = state.ocs.filter((oc) => (oc.name || '').trim()).length;
  const storyFields = ['conflict', 'length', 'tone', 'ending'];
  const storyFilled = storyFields.filter((k) => {
    const val = state.story[k];
    if (k === 'ending') return val === '自定义' ? !!(state.story.customEnding || '').trim() : !!val;
    return !!(val || '').trim();
  }).length;
  const apiOk = !!(state.settings.apiKey || '').trim() || state.serverConfigured;

  let worldCls = 'warn';
  if (worldFilled === worldFields.length) worldCls = 'ok';
  else if (worldFilled === 0) worldCls = 'danger';

  let ocCls = 'danger';
  if (state.ocCount > 0 && ocFilled >= state.ocCount) ocCls = 'ok';
  else if (ocFilled > 0) ocCls = 'warn';

  let storyCls = 'warn';
  if (storyFilled >= 2 && state.story.types.length) storyCls = 'ok';
  else if (storyFilled === 0) storyCls = 'danger';

  const apiCls = apiOk ? 'ok' : 'warn';
  const items = [
    ['世界观 ' + worldFilled + '/' + worldFields.length, worldCls],
    ['OC ' + ocFilled + '/' + (state.ocCount || 0), ocCls],
    ['故事设定 ' + storyFilled + '/' + storyFields.length, storyCls],
    [state.serverConfigured ? 'API 服务' : 'API Key', apiCls]
  ];
  wrap.innerHTML = items.map(([label, cls]) => `
    <span class="pill ${cls}"><span class="ic" data-icon="${cls === 'ok' ? 'check' : 'alert'}"></span>${label}</span>
  `).join('');
  mountIcons(wrap);
}

function renderHistory() {
  const list = $('#history-list');
  if (!list) return;
  if (!state.history.length) {
    list.innerHTML = '<div class="empty-state">还没有保存的故事</div>';
    return;
  }
  list.innerHTML = state.history.map((item) => `
    <div class="history-item">
      <div class="history-main">
        <div class="history-title">${esc(item.title)}</div>
        <div class="history-meta">${esc(item.createdAt)} · ${esc(item.meta)}</div>
      </div>
      <button class="ghost-btn sm" data-load="${esc(item.id)}">打开</button>
      <button class="icon-btn" data-del="${esc(item.id)}" title="删除" aria-label="删除"><span class="ic" data-icon="trash"></span></button>
    </div>
  `).join('');
  mountIcons(list);
}

function renderStoryView() {
  const read = $('#story-read');
  const edit = $('#story-edit');
  if (!read || !edit) return;
  document.querySelectorAll('[data-storytab]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.storytab === state.storyTab);
  });
  if (state.storyTab === 'edit') {
    read.hidden = true;
    edit.hidden = false;
    if (document.activeElement !== edit) edit.value = currentStory;
  } else {
    read.hidden = false;
    edit.hidden = true;
    read.textContent = currentStory || '尚未生成';
    read.classList.toggle('empty', !currentStory.trim());
  }
}

function renderAll() {
  bindStatic();
  syncVisibility();
  renderOCs();
  renderNPCs();
  renderStoryTypes();
  renderReadiness();
  renderHistory();
  renderStoryView();
}

function showView(name) {
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.toggle('active', view.id === 'view-' + name);
  });
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });
  if (name === 'generate') renderStoryView();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function changeOcCount(delta, value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    state.ocCount = Math.max(0, Math.min(12, Math.round(value)));
  } else {
    state.ocCount = Math.max(0, Math.min(12, state.ocCount + delta));
  }
  while (state.ocs.length < state.ocCount) state.ocs.push(emptyOc(state.ocs.length));
  if (state.ocs.length > state.ocCount) state.ocs.length = state.ocCount;
  $('#oc-count').value = state.ocCount;
  saveState();
  renderOCs();
  renderReadiness();
}

function valueOrNotProvided(value) {
  return (value || '').trim() || '未提供';
}

function buildSettingsText() {
  const lines = [];
  lines.push('【世界观】');
  lines.push('时代：' + valueOrNotProvided(state.world.era));
  lines.push('势力：' + valueOrNotProvided(state.world.factions));
  lines.push('规则：' + valueOrNotProvided(state.world.rules));
  lines.push('魔法/科技：' + valueOrNotProvided(state.world.magic));
  lines.push('世界冲突：' + valueOrNotProvided(state.world.conflict));
  if ((state.world.raw || '').trim()) {
    lines.push('世界观原始素材：\n' + state.world.raw.trim());
  }

  lines.push('');
  lines.push('【参与故事 OC 总数】' + state.ocCount);
  state.ocs.forEach((oc, i) => {
    lines.push('');
    lines.push('【OC ' + (i + 1) + '】');
    lines.push('名字：' + valueOrNotProvided(oc.name));
    lines.push('外貌：' + valueOrNotProvided(oc.appearance));
    lines.push('性格：' + valueOrNotProvided(oc.personality));
    lines.push('身世背景：' + valueOrNotProvided(oc.background));
    lines.push('能力与弱点：' + valueOrNotProvided(oc.abilities));
    lines.push('恐惧与执念：' + valueOrNotProvided(oc.fears));
    lines.push('与其他OC的关系：' + valueOrNotProvided(oc.relationships));
    lines.push('说话风格：' + valueOrNotProvided(oc.speech));
    if ((oc.extra || '').trim()) lines.push('补充：' + oc.extra.trim());
  });

  lines.push('');
  lines.push('【反派 / NPC】');
  if (state.npcNone) lines.push('无（不要自行创作反派或NPC）');
  else if (!state.npcs.length) lines.push('未提供（不要自行创作）');
  else {
    state.npcs.forEach((npc, i) => {
      lines.push('');
      lines.push('【NPC ' + (i + 1) + '】');
      lines.push('定位：' + valueOrNotProvided(npc.role));
      lines.push('名字：' + valueOrNotProvided(npc.name));
      lines.push('外貌：' + valueOrNotProvided(npc.appearance));
      lines.push('性格：' + valueOrNotProvided(npc.personality));
      lines.push('身世背景：' + valueOrNotProvided(npc.background));
      lines.push('能力与弱点：' + valueOrNotProvided(npc.abilities));
      lines.push('与OC的关系：' + valueOrNotProvided(npc.relationships));
      lines.push('说话风格：' + valueOrNotProvided(npc.speech));
      if ((npc.extra || '').trim()) lines.push('补充：' + npc.extra.trim());
    });
  }

  const types = state.story.types.slice();
  const otherType = (state.story.otherType || '').trim();
  if (otherType && !types.includes(otherType)) types.push(otherType);
  lines.push('');
  lines.push('【故事类型与核心冲突】');
  lines.push('故事类型：' + (types.length ? types.join('、') : '未提供'));
  lines.push('核心冲突：' + valueOrNotProvided(state.story.conflict));

  let ending = valueOrNotProvided(state.story.ending);
  if (state.story.ending === '自定义' && (state.story.customEnding || '').trim()) {
    ending = state.story.customEnding.trim();
  }
  lines.push('');
  lines.push('【篇幅、基调、结局与创作限制】');
  lines.push('篇幅：' + valueOrNotProvided(state.story.length));
  lines.push('基调：' + valueOrNotProvided(state.story.tone));
  lines.push('结局：' + ending);
  lines.push('额外限制：' + valueOrNotProvided(state.story.restrictions));
  return lines.join('\n');
}

function buildUserPrompt(settingsText, mode) {
  const g = state.gen;
  const pov = g.pov || '全知视角';
  const style = g.style === '自定义' && (g.customStyle || '').trim() ? g.customStyle.trim() : (g.style || '自然细腻');
  const lines = [settingsText, '', '【本次生成要求】', '叙述视角：' + pov, '文风：' + style];
  if (g.chapters) lines.push('分章节，共 ' + Math.max(1, Number(g.chapterCount) || 1) + ' 章');
  if ((g.extra || '').trim()) lines.push('追加要求：' + g.extra.trim());
  if (mode === 'continue') {
    lines.push('', '【已有故事正文】', currentStory.trim() || '（尚无正文）', '', '请紧接已有正文的结尾继续写，不重复已出现的情节，保持设定、视角、文风一致，直接输出续写正文。');
  } else {
    lines.push('', '请严格按照以上全部设定直接输出故事正文。');
  }
  return lines.join('\n');
}

function buildChatUrl(base) {
  let url = (base || 'https://api.openai.com/v1').trim().replace(/\/+$/, '');
  if (!/\/chat\/completions$/.test(url)) url += '/chat/completions';
  return url;
}

async function callChat(messages, opts = {}) {
  const settings = state.settings;
  if (!(settings.apiKey || '').trim() && !state.serverConfigured) throw new Error('未配置 API Key');
  const payload = {
    model: settings.model || 'gpt-4o-mini',
      messages,
      temperature: opts.temperature ?? (Number(settings.temperature) || 0.8),
      max_tokens: opts.maxTokens ?? (Number(settings.maxTokens) || 6000)
  };
  let res;
  if (USE_SERVER_PROXY) {
    const body = { baseUrl: settings.baseUrl, ...payload };
    if ((settings.apiKey || '').trim()) body.apiKey = settings.apiKey.trim();
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } else {
    res = await fetch(buildChatUrl(settings.baseUrl), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + settings.apiKey.trim()
      },
      body: JSON.stringify(payload)
    });
  }
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error('请求失败（' + res.status + '）');
  }
  if (!res.ok) {
    throw new Error((data && data.error && data.error.message) || '请求失败（' + res.status + '）');
  }
  return (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || '';
}

function setBusy(busy, label) {
  ['#btn-generate', '#btn-regen', '#btn-continue', '#btn-check'].forEach((id) => {
    const el = $(id);
    if (el) el.disabled = busy;
  });
  const gen = $('#btn-generate');
  if (!gen) return;
  if (busy) {
    if (!gen.dataset.original) gen.dataset.original = gen.innerHTML;
    gen.innerHTML = '<span class="spinner"></span><span>' + label + '</span>';
  } else if (gen.dataset.original) {
    gen.innerHTML = gen.dataset.original;
    delete gen.dataset.original;
    mountIcons(gen);
  }
}

async function generateStory(mode) {
  if (!(state.settings.apiKey || '').trim() && !state.serverConfigured) {
    toast('请先在 API 设置中填写 Key');
    openSettings();
    return;
  }
  if (state.ocCount === 0 || !state.ocs.length) {
    toast('请先填写 OC 档案');
    showView('ocs');
    return;
  }
  const settingsText = buildSettingsText();
  const userPrompt = buildUserPrompt(settingsText, mode);
  setBusy(true, mode === 'continue' ? '续写中…' : '生成中…');
  try {
    const text = await callChat(
      [{ role: 'system', content: STORY_SYSTEM }, { role: 'user', content: userPrompt }],
      { temperature: Number(state.settings.temperature) || 0.8, maxTokens: Number(state.settings.maxTokens) || 4000 }
    );
    if (mode === 'continue') {
      const base = currentStory.trim();
      currentStory = base ? base + '\n\n' + text.trim() : text.trim();
    } else {
      currentStory = text.trim();
    }
    saveState();
    renderStoryView();
    toast(mode === 'continue' ? '续写完成' : '故事生成完成');
  } catch (err) {
    toast('生成失败：' + err.message);
  } finally {
    setBusy(false);
  }
}

async function checkStory() {
  if (!currentStory.trim()) {
    toast('还没有故事可检查');
    return;
  }
  setBusy(true, '检查中…');
  try {
    const text = await callChat(
      [{ role: 'system', content: CHECK_SYSTEM }, { role: 'user', content: buildSettingsText() + '\n\n【故事正文】\n' + currentStory }],
      { temperature: 0.2, maxTokens: 1600 }
    );
    $('#check-result').textContent = text;
    $('#check-dialog').showModal();
  } catch (err) {
    toast('检查失败：' + err.message);
  } finally {
    setBusy(false);
  }
}

async function copyStory() {
  if (!currentStory.trim()) {
    toast('还没有故事可复制');
    return;
  }
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(currentStory);
    } else {
      const ta = document.createElement('textarea');
      ta.value = currentStory;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    toast('已复制到剪贴板');
  } catch (err) {
    toast('复制失败');
  }
}

function downloadStory() {
  if (!currentStory.trim()) {
    toast('还没有故事可下载');
    return;
  }
  const blob = new Blob([currentStory], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const now = new Date();
  const stamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  a.href = url;
  a.download = 'create-oc-' + stamp + '.md';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function saveToHistory() {
  if (!currentStory.trim()) {
    toast('还没有故事可保存');
    return;
  }
  const firstLine = currentStory.split('\n').find((line) => line.trim()) || '';
  const title = firstLine.length > 24 ? firstLine.slice(0, 24) + '…' : firstLine;
  const meta = [state.story.types.join('/'), state.story.length].filter(Boolean).join(' · ') || '未分类';
  state.history.unshift({
    id: 'h' + Date.now(),
    title: title || 'OC 故事',
    text: currentStory,
    createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
    meta
  });
  state.history = state.history.slice(0, 30);
  saveState();
  renderHistory();
  toast('已保存到历史');
}

function openSettings() {
  $('#settings-key').value = state.settings.apiKey || '';
  $('#settings-base').value = state.settings.baseUrl || 'https://api.openai.com/v1';
  $('#settings-model').value = state.settings.model || 'gpt-4o-mini';
  $('#settings-temp').value = state.settings.temperature ?? 0.8;
  $('#temp-val').textContent = state.settings.temperature ?? 0.8;
  $('#settings-max').value = state.settings.maxTokens ?? 4000;
  const note = $('#server-config-note');
  if (note) note.hidden = !state.serverConfigured;
  $('#settings-dialog').showModal();
}

async function fetchServerConfig() {
  if (!USE_SERVER_PROXY) return;
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return;
    const cfg = await res.json();
    state.serverConfigured = !!cfg.serverConfigured;
    if (state.serverConfigured) {
      if (cfg.baseUrl) state.settings.baseUrl = cfg.baseUrl;
      if (cfg.model) state.settings.model = cfg.model;
      if (typeof cfg.temperature === 'number') state.settings.temperature = cfg.temperature;
      if (typeof cfg.maxTokens === 'number') state.settings.maxTokens = cfg.maxTokens;
    }
    saveState();
    renderReadiness();
  } catch (err) {
    // 本地直接打开文件时没有 /api/config，忽略即可
  }
}

function saveSettings() {
  state.settings.apiKey = $('#settings-key').value.trim();
  state.settings.baseUrl = ($('#settings-base').value.trim() || 'https://api.openai.com/v1').replace(/\/+$/, '');
  state.settings.model = $('#settings-model').value.trim() || 'gpt-4o-mini';
  state.settings.temperature = Number($('#settings-temp').value) || 0.8;
  state.settings.maxTokens = Number($('#settings-max').value) || 4000;
  saveState();
  $('#settings-dialog').close();
  renderReadiness();
  toast('设置已保存');
}

async function testConnection() {
  const btn = $('#btn-test');
  btn.disabled = true;
  try {
    const text = await callChat([{ role: 'user', content: '只回复两个字：成功' }], { temperature: 0, maxTokens: 10 });
    toast('连接成功：' + (text || '').slice(0, 20));
  } catch (err) {
    toast('连接失败：' + err.message);
  } finally {
    btn.disabled = false;
  }
}

function extractJson(text) {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1] : text;
  return JSON.parse(body);
}

function applyImportData(data) {
  if (data.world && typeof data.world === 'object') {
    ['era', 'factions', 'rules', 'magic', 'conflict', 'raw'].forEach((key) => {
      if (typeof data.world[key] === 'string') state.world[key] = data.world[key];
    });
  }
  if (Array.isArray(data.ocs)) {
    state.ocs = data.ocs.map(normalizeOc);
    state.ocCount = state.ocs.length;
  }
  if (Array.isArray(data.npcs)) {
    state.npcs = data.npcs.map(normalizeNpc);
    state.npcNone = state.npcs.length === 0;
  }
  if (data.story && typeof data.story === 'object') {
    state.story.types = Array.isArray(data.story.types) ? data.story.types.filter(Boolean) : [];
    ['otherType', 'conflict', 'length', 'tone', 'ending', 'customEnding', 'restrictions'].forEach((key) => {
      if (typeof data.story[key] === 'string') state.story[key] = data.story[key];
    });
  }
}

function setImportStatus(message, isError) {
  const el = $('#import-status');
  if (!el) return;
  el.textContent = message;
  el.classList.toggle('error', !!isError);
  el.classList.toggle('ok', !isError && !!message);
}

async function runImport() {
  const text = $('#import-text').value.trim();
  if (!text) {
    setImportStatus('请先粘贴素材', true);
    return;
  }
  if (!(state.settings.apiKey || '').trim() && !state.serverConfigured) {
    setImportStatus('需要先在 API 设置中填写 Key', true);
    return;
  }
  const btn = $('#btn-import-run');
  btn.disabled = true;
  setImportStatus('整理中…');
  try {
    const out = await callChat(
      [{ role: 'system', content: IMPORT_SYSTEM }, { role: 'user', content: text }],
      { temperature: 0.1, maxTokens: 4000 }
    );
    const data = extractJson(out);
    applyImportData(data);
    saveState();
    renderAll();
    toast('设定已整理并填入');
    $('#import-dialog').close();
  } catch (err) {
    setImportStatus('整理失败：' + err.message, true);
  } finally {
    btn.disabled = false;
  }
}

function clearAllSettings() {
  if (!confirm('确定清空当前全部设定吗？API 设置和历史记录会保留。')) return;
  const settings = state.settings;
  const history = state.history;
  state = { ...defaultState(), settings, history };
  currentStory = '';
  saveState();
  renderAll();
  toast('已清空设定');
}

function onGlobalInput(e) {
  const el = e.target;
  if (el.dataset.bind) {
    setByPath(el.dataset.bind, el.value);
    if (el.dataset.bind === 'story.ending') syncVisibility();
    if (el.dataset.bind.startsWith('story.') || el.dataset.bind.startsWith('world.')) renderReadiness();
    saveState();
    return;
  }
  if (el.dataset.bindCheck) {
    setByPath(el.dataset.bindCheck, el.checked);
    if (el.dataset.bindCheck === 'gen.chapters') syncVisibility();
    saveState();
    return;
  }
  if (el.dataset.field) {
    const card = el.closest('.oc-card, .npc-card');
    if (!card) return;
    const idx = Number(card.dataset.idx);
    if (card.classList.contains('oc-card')) state.ocs[idx][el.dataset.field] = el.value;
    else state.npcs[idx][el.dataset.field] = el.value;
    if (el.dataset.field === 'name') renderReadiness();
    saveState();
  }
}

function onGlobalChange(e) {
  const el = e.target;
  if (el.dataset.bind) {
    setByPath(el.dataset.bind, el.value);
    if (el.dataset.bind === 'story.ending') syncVisibility();
    saveState();
  }
  if (el.id === 'npc-none') {
    state.npcNone = el.checked;
    saveState();
    renderNPCs();
    renderReadiness();
  }
  if (el.id === 'oc-count') {
    changeOcCount(0, Number(el.value));
  }
}

function onTypeChange(e) {
  const input = e.target;
  if (input.type !== 'checkbox') return;
  const val = input.value;
  if (input.checked) {
    if (!state.story.types.includes(val)) state.story.types.push(val);
  } else {
    state.story.types = state.story.types.filter((t) => t !== val);
  }
  saveState();
  renderStoryTypes();
  renderReadiness();
}

function onOcListClick(e) {
  const btn = e.target.closest('.remove-oc');
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  state.ocs.splice(idx, 1);
  state.ocCount = state.ocs.length;
  saveState();
  renderOCs();
  renderReadiness();
}

function onNpcListClick(e) {
  const btn = e.target.closest('.remove-npc');
  if (!btn) return;
  const idx = Number(btn.dataset.idx);
  state.npcs.splice(idx, 1);
  saveState();
  renderNPCs();
}

function onHistoryClick(e) {
  const loadBtn = e.target.closest('[data-load]');
  if (loadBtn) {
    const item = state.history.find((h) => h.id === loadBtn.dataset.load);
    if (item) {
      currentStory = item.text;
      state.storyTab = 'read';
      saveState();
      renderStoryView();
      showView('generate');
      toast('已打开历史故事');
    }
    return;
  }
  const delBtn = e.target.closest('[data-del]');
  if (delBtn) {
    state.history = state.history.filter((h) => h.id !== delBtn.dataset.del);
    saveState();
    renderHistory();
    toast('已删除');
  }
}

function init() {
  mountIcons();
  bindStatic();
  syncVisibility();
  renderOCs();
  renderNPCs();
  renderStoryTypes();
  renderReadiness();
  renderHistory();
  renderStoryView();

  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  $('#oc-inc').addEventListener('click', () => changeOcCount(1));
  $('#oc-dec').addEventListener('click', () => changeOcCount(-1));
  $('#oc-list').addEventListener('click', onOcListClick);

  $('#npc-add').addEventListener('click', () => {
    state.npcs.push(emptyNpc(state.npcs.length));
    saveState();
    renderNPCs();
  });
  $('#npc-list').addEventListener('click', onNpcListClick);
  $('#type-chips').addEventListener('change', onTypeChange);

  document.querySelectorAll('[data-storytab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.storyTab = btn.dataset.storytab;
      saveState();
      renderStoryView();
    });
  });

  $('#btn-generate').addEventListener('click', () => generateStory('new'));
  $('#btn-regen').addEventListener('click', () => generateStory('regen'));
  $('#btn-continue').addEventListener('click', () => generateStory('continue'));
  $('#btn-check').addEventListener('click', checkStory);
  $('#btn-copy').addEventListener('click', copyStory);
  $('#btn-download').addEventListener('click', downloadStory);
  $('#btn-save').addEventListener('click', saveToHistory);
  $('#history-list').addEventListener('click', onHistoryClick);

  $('#btn-settings').addEventListener('click', openSettings);
  $('#btn-save-settings').addEventListener('click', saveSettings);
  $('#btn-test').addEventListener('click', testConnection);
  $('#settings-temp').addEventListener('input', (e) => {
    $('#temp-val').textContent = e.target.value;
  });

  $('#btn-import').addEventListener('click', () => {
    setImportStatus('');
    $('#import-dialog').showModal();
  });
  $('#btn-import-run').addEventListener('click', runImport);
  $('#btn-import-clear').addEventListener('click', clearAllSettings);
  $('#btn-close-check').addEventListener('click', () => $('#check-dialog').close());

  document.querySelectorAll('.modal-head .icon-btn[value="cancel"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dialog = btn.closest('dialog');
      if (dialog) dialog.close();
    });
  });

  document.addEventListener('input', onGlobalInput);
  document.addEventListener('change', onGlobalChange);

  $('#story-edit').addEventListener('input', (e) => {
    currentStory = e.target.value;
    saveState();
  });

  fetchServerConfig();
}

init();
