// English overlay for vibecoding/data.js — joins the translated parts. Keyed by id. See docs/translation-guide.md.
import { EN as A } from './en/modules-a.js';
import { EN as B, CANDIDATES_EN, PRESETS_EN } from './en/modules-b.js';

export const MODULES_EN = { ...A, ...B };
export { CANDIDATES_EN, PRESETS_EN };
