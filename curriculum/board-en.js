/**
 * 보드 설정에 영어 덮어쓰기를 입힌다 (영어 화면에서만 불러온다)
 * 모듈 id·코드·배열 순서는 그대로 두고 글자만 바꾸므로 과정표 저장값과 #plan 링크가 두 언어에서 같다.
 */
import { TOOLS_EN } from './tools.en.js';

const TEXT = ['t', 'st', 'desc', 'ex', 'out', 'pub', 'pri', 'fl', 'kw'];
const tool = s => TOOLS_EN[s] || s;

export function englishBoard(cfg, { modules = {}, candidates = {}, presets = {}, axes = {} }) {
  const out = { ...cfg, ...axes };
  out.base = { ...cfg.base, ...(axes.base || {}) };
  out.modules = cfg.modules.map(m => {
    const e = modules[m.id] || {};
    const n = { ...m, s: (m.s || []).map(tool) };
    for (const k of TEXT) if (e[k] != null) n[k] = e[k];
    return n;
  });
  out.candidates = (cfg.candidates || []).map(c => ({ ...c, ...(candidates[c.id] || {}) }));
  out.presets = Object.fromEntries(Object.entries(cfg.presets || {}).map(([k, p]) => [k, { ...p, name: presets[k] || p.name }]));
  out.featured = (cfg.featured || []).map(tool);
  return out;
}

// 보드 페이지의 고정 문구(data-i18n)·제목을 영어로 바꾼다. prefix: 'cur' | 'vibe'
export async function englishPage(prefix) {
  const [{ BOARD_UI_EN, BOARD_META_EN }, { applyDict }] = await Promise.all([import('./board-ui.en.js'), import('../i18n.js')]);
  const dict = { ...BOARD_UI_EN };
  for (const [k, v] of Object.entries(BOARD_UI_EN)) if (k.startsWith(prefix + '_')) dict[k] = v;
  applyDict(dict);
  const meta = BOARD_META_EN[prefix];
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.desc);
  document.getElementById('inquiry')?.setAttribute('title', 'Copies a summary of your plan and opens the CDSA training inquiry form');
}
