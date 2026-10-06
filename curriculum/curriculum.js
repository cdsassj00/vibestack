/**
 * AI 업무활용 교육과정 설계 보드 — 업무 영역 × AI 활용 방법
 * 화면 동작은 ./board.js 공용 엔진이 맡고, 여기서는 축·직무·데이터 설정만 넘긴다.
 * 영어 화면이면 data.en.js·axes.en.js 덮어쓰기를 입힌다.
 */
import { initBoard } from './board.js';
import { MODULES, CANDIDATES, PRESETS } from './data.js';
import { AXES } from './axes.js';
import { EN, mountLangButton } from '../i18n.js';

let cfg = {
  modules: MODULES,
  candidates: CANDIDATES,
  presets: PRESETS,
  heroPreset: 'intro',
  storageKey: 'aiboard.v2',
  ...AXES,
};

if (EN) {
  const [{ englishBoard }, d, a] = await Promise.all([import('./board-en.js'), import('./data.en.js'), import('./axes.en.js')]);
  await (await import('./board-en.js')).englishPage('cur');
  cfg = englishBoard(cfg, { modules: d.MODULES_EN, candidates: d.CANDIDATES_EN, presets: d.PRESETS_EN, axes: a.AXES_EN });
}

mountLangButton(document.getElementById('themeToggleBtn'));
initBoard(cfg);
