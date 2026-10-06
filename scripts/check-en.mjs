// 영어 번역 덮어쓰기 파일 검사: node scripts/check-en.mjs <원본 data.js> <영어 파일> [id,id,...]
// 원본과 같은 id·배열 길이·실습 예시 표시((외부망)(반입)(신규))·구성도 형식을 지키는지, 한글이 남았는지 본다.
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const [src, en, only] = process.argv.slice(2);
const load = f => import(pathToFileURL(path.resolve(f)).href);
const S = await load(src);
const E = await load(en);
const EN = E.EN || E.MODULES_EN || {};
const want = only ? only.split(',') : S.MODULES.map(m => m.id);
const byId = Object.fromEntries(S.MODULES.map(m => [m.id, m]));
const HANGUL = /[가-힣]/;
const MARK = /\s*(\((외부망|반입|신규)\))+\s*$/;
const errs = [];
const hangul = (where, s) => { if (typeof s === 'string' && HANGUL.test(s.replace(MARK, ''))) errs.push(`${where}: 한글이 남음 "${s}"`); };

for (const id of want) {
  const m = byId[id];
  const e = EN[id];
  if (!m) { errs.push(`${id}: 원본에 없음`); continue; }
  if (!e) { errs.push(`${id}: 번역 없음`); continue; }
  for (const k of ['t', 'desc']) if (!e[k]) errs.push(`${id}.${k}: 비어 있음`); else hangul(`${id}.${k}`, e[k]);
  if (m.out) { if (!e.out) errs.push(`${id}.out: 비어 있음`); else hangul(`${id}.out`, e.out); }
  if (m.st) {
    if (!e.st) errs.push(`${id}.st: 비어 있음`);
    else { hangul(`${id}.st`, e.st); if (e.st.length > 22) errs.push(`${id}.st: 22자 초과 "${e.st}"`); }
  }
  for (const k of ['ex', 'pub', 'pri']) {
    const a = m[k] || [], b = e[k] || [];
    if (a.length !== b.length) errs.push(`${id}.${k}: 개수 다름 ${a.length} vs ${b.length}`);
  }
  (m.ex || []).forEach((x, i) => {
    const y = (e.ex || [])[i] || '';
    hangul(`${id}.ex[${i}]`, y);
    const mx = (x.match(MARK) || [''])[0].trim(), my = (y.match(MARK) || [''])[0].trim();
    if (mx !== my) errs.push(`${id}.ex[${i}]: 표시 다름 "${mx}" vs "${my}"`);
  });
  for (const k of ['pub', 'pri']) (e[k] || []).forEach((p, i) => { hangul(`${id}.${k}[${i}].j`, p.j); hangul(`${id}.${k}[${i}].c`, p.c); if (!p.j || !p.c) errs.push(`${id}.${k}[${i}]: j·c 필요`); });
  if (e.kw) e.kw.forEach((k, i) => hangul(`${id}.kw[${i}]`, k));
  if (m.fl) {
    if (!e.fl) errs.push(`${id}.fl: 없음`);
    else {
      hangul(`${id}.fl.box`, e.fl.box);
      if (e.fl.e.length !== m.fl.e.length) errs.push(`${id}.fl.e: 개수 다름`);
      e.fl.e.forEach((s, i) => {
        hangul(`${id}.fl.e[${i}]`, s);
        const ok = /^[XCU]:[^>]+ > [XCU]:[^:]+( : .+)?$/.test(s);
        if (!ok) errs.push(`${id}.fl.e[${i}]: 형식 오류 "${s}"`);
        const a = m.fl.e[i].match(/^([XCU]):.*> ([XCU]):/), b = s.match(/^([XCU]):.*> ([XCU]):/);
        if (a && b && (a[1] !== b[1] || a[2] !== b[2])) errs.push(`${id}.fl.e[${i}]: 열 문자 다름`);
        s.split(' > ').forEach(part => { const node = part.split(' : ')[0].slice(2); if (node.length > 16) errs.push(`${id}.fl.e[${i}]: 노드 이름 16자 초과 "${node}"`); });
      });
    }
  }
}
for (const id of Object.keys(EN)) if (!byId[id]) errs.push(`${id}: 원본에 없는 id`);

if (E.CANDIDATES_EN) for (const c of S.CANDIDATES) { const x = E.CANDIDATES_EN[c.id]; if (!x) errs.push(`후보 ${c.id}: 번역 없음`); else { hangul(`후보 ${c.id}.t`, x.t); hangul(`후보 ${c.id}.why`, x.why); } }
if (E.PRESETS_EN) for (const k of Object.keys(S.PRESETS)) { if (!E.PRESETS_EN[k]) errs.push(`예시 과정 ${k}: 번역 없음`); else hangul(`예시 과정 ${k}`, E.PRESETS_EN[k]); }

if (errs.length) { console.log(errs.join('\n')); console.log(`\n${errs.length}건`); process.exit(1); }
console.log(`통과: 모듈 ${want.length}개${E.CANDIDATES_EN ? ', 후보' : ''}${E.PRESETS_EN ? ', 예시 과정' : ''}`);
