/**
 * AI 바이브코딩 교육과정 설계 보드 — 만드는 방식 × 구조 단계
 * 화면 동작은 /curriculum/board.js 공용 엔진이 맡고, 여기서는 축·대상·데이터 설정만 넘긴다.
 * 영어 화면이면 data.en.js·axes.en.js·시나리오 영어 제목을 입힌다.
 */
import { initBoard } from '../curriculum/board.js';
import { VIBE_SCENARIOS } from '../scenarios-data.js';
import { MODULES, CANDIDATES, PRESETS } from './data.js';
import { AXES } from './axes.js';
import { EN, mountLangButton } from '../i18n.js';

const scenarioTitle = Object.fromEntries(VIBE_SCENARIOS.map(s => [s.id, s.title]));

let cfg = {
  modules: MODULES,
  candidates: CANDIDATES,
  presets: PRESETS,
  heroPreset: 'intro',
  storageKey: 'vibeboard.v1',
  ...AXES,
  related: m => (m.sc || []).map(id => scenarioTitle[id]).filter(Boolean)
};

if (EN) {
  const [{ englishBoard }, d, a, sc] = await Promise.all([
    import('../curriculum/board-en.js'), import('./data.en.js'), import('./axes.en.js'), import('../scenarios-data.en.js')
  ]);
  for (const [id, s] of Object.entries(sc.SCENARIOS_EN)) if (s.title) scenarioTitle[id] = s.title;
  await (await import('../curriculum/board-en.js')).englishPage('vibe');
  cfg = englishBoard(cfg, { modules: d.MODULES_EN, candidates: d.CANDIDATES_EN, presets: d.PRESETS_EN, axes: a.AXES_EN });
}

mountLangButton(document.getElementById('themeToggleBtn'));
initBoard(cfg);
