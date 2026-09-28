/**
 * AI 바이브코딩 교육과정 설계 보드 — 만드는 방식 × 구조 단계
 * 화면 동작은 /curriculum/board.js 공용 엔진이 맡고, 여기서는 축·대상·데이터 설정만 넘긴다.
 */
import { initBoard } from '../curriculum/board.js';
import { VIBE_SCENARIOS } from '../scenarios-data.js';
import { MODULES, CANDIDATES, PRESETS } from './data.js';
import { AXES } from './axes.js';

const scenarioTitle = Object.fromEntries(VIBE_SCENARIOS.map(s => [s.id, s.title]));

initBoard({
  modules: MODULES,
  candidates: CANDIDATES,
  presets: PRESETS,
  heroPreset: 'intro',
  storageKey: 'vibeboard.v1',
  ...AXES,
  related: m => (m.sc || []).map(id => scenarioTitle[id]).filter(Boolean)
});
