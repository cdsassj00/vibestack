/**
 * AI 업무활용 교육과정 설계 보드 — 업무 영역 × AI 활용 방법
 * 화면 동작은 ./board.js 공용 엔진이 맡고, 여기서는 축·직무·데이터 설정만 넘긴다.
 */
import { initBoard } from './board.js';
import { MODULES, CANDIDATES, PRESETS } from './data.js';
import { AXES } from './axes.js';

initBoard({
  modules: MODULES,
  candidates: CANDIDATES,
  presets: PRESETS,
  heroPreset: 'intro',
  storageKey: 'aiboard.v2',
  ...AXES,
});
