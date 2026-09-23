// Firestore 보안 규칙 테스트 — 로컬 에뮬레이터 전용 (운영 DB에 접속하지 않는다)
// 사이트가 Firestore를 쓰지 않으므로 모든 요청이 차단되는지 확인한다.
// 실행 (Java 21 필요):
//   firebase emulators:exec --only firestore --project demo-vibestack "node tests/firestore-rules.test.mjs"
const PROJECT = process.env.GCLOUD_PROJECT || 'demo-vibestack';
const HOST = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
if (!PROJECT.startsWith('demo-')) {
  console.error(`demo- 로 시작하는 프로젝트 ID로만 실행하세요 (현재: ${PROJECT})`);
  process.exit(1);
}
const ROOT = `projects/${PROJECT}/databases/(default)/documents`;
const BASE = `http://${HOST}/v1/${ROOT}`;
const name = id => `${ROOT}/vibestacks/${id}`;

const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url');
const token = uid => { const now = Math.floor(Date.now() / 1000);
  return `${b64({ alg: 'none', typ: 'JWT' })}.${b64({ iss: `https://securetoken.google.com/${PROJECT}`, aud: PROJECT, sub: uid, user_id: uid, iat: now, exp: now + 3600, auth_time: now, firebase: { sign_in_provider: 'password', identities: {} } })}.`; };

const val = v => v === null ? { nullValue: null }
  : typeof v === 'string' ? { stringValue: v }
  : Number.isInteger(v) ? { integerValue: String(v) }
  : typeof v === 'boolean' ? { booleanValue: v }
  : Array.isArray(v) ? { arrayValue: { values: v.map(val) } }
  : { mapValue: { fields: fields(v) } };
const fields = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, val(v)]));

async function commit(writes, uid) {
  const r = await fetch(`${BASE}:commit`, { method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(uid ? { Authorization: `Bearer ${token(uid)}` } : {}) },
    body: JSON.stringify({ writes }) });
  return r.status === 200;
}
// addDoc(..., { createdAt: serverTimestamp() }) 와 같은 요청
const create = (id, data, uid, serverTime = true) => commit([{
  update: { name: name(id), fields: fields(data) },
  ...(serverTime ? { updateTransforms: [{ fieldPath: 'createdAt', setToServerValue: 'REQUEST_TIME' }] } : {}),
  currentDocument: { exists: false } }], uid);
// updateDoc(ref, { field: value })
const update = (id, data, uid) => commit([{ update: { name: name(id), fields: fields(data) },
  updateMask: { fieldPaths: Object.keys(data) }, currentDocument: { exists: true } }], uid);
// updateDoc(ref, { likes: increment(1) })
const like = (id, uid) => commit([{ update: { name: name(id), fields: {} }, updateMask: { fieldPaths: [] },
  updateTransforms: [{ fieldPath: 'likes', increment: { integerValue: '1' } }], currentDocument: { exists: true } }], uid);
// updateDoc(ref, { comments: arrayUnion(c) })
const comment = (id, c, uid) => commit([{ update: { name: name(id), fields: {} }, updateMask: { fieldPaths: [] },
  updateTransforms: [{ fieldPath: 'comments', appendMissingElements: { values: [val(c)] } }], currentDocument: { exists: true } }], uid);
const del = (id, uid) => commit([{ delete: name(id) }], uid);
const read = async (path, uid) => (await fetch(`${BASE}/${path}`, { headers: uid ? { Authorization: `Bearer ${token(uid)}` } : {} })).status === 200;

const post = (o = {}) => ({ title: '엑셀 병합 앱', category: 'office', techStack: 'Python', summary: '요약', prompt: '프롬프트 본문',
  cliCommand: '', author: '익명', authorId: null, likes: 0, comments: [], ...o });
const cmt = (o = {}) => ({ author: '홍길동', text: '좋아요', createdAt: new Date().toISOString(), ...o });

let pass = 0, fail = 0;
async function t(label, expectAllow, p) {
  const ok = await p;
  const good = ok === expectAllow;
  good ? pass++ : fail++;
  console.log(`${good ? 'PASS' : 'FAIL'}  [기대:${expectAllow ? '허용' : '차단'} / 실제:${ok ? '허용' : '차단'}]  ${label}`);
}

// 사이트는 Firestore를 쓰지 않는다. 예전 갤러리 요청을 포함해 모든 읽기·쓰기가 막혀야 한다.
console.log('── 작성(create)');
await t('비로그인 정상 글 작성', false, create('anon1', post()));
await t('로그인 uid1 정상 글 작성', false, create('u1post', post({ author: 'uid1', authorId: 'uid1' }), 'uid1'));
await t('다른 컬렉션(posts)에 작성', false, commit([{ update: { name: `${ROOT}/posts/p1`, fields: fields({ a: 1 }) } }]));

console.log('── 읽기(read)');
await t('비로그인 갤러리 목록 읽기', false, read('vibestacks'));
await t('로그인 uid1 갤러리 목록 읽기', false, read('vibestacks', 'uid1'));
await t('비로그인 글 하나 읽기', false, read('vibestacks/anon1'));
await t('다른 컬렉션(posts) 읽기', false, read('posts'));

console.log('── 수정·삭제(update·delete)');
await t('비로그인 좋아요 +1', false, like('anon1'));
await t('비로그인 댓글 추가', false, comment('anon1', cmt()));
await t('로그인 uid1 제목 수정', false, update('u1post', { title: '수정' }, 'uid1'));
await t('로그인 uid1 삭제', false, del('u1post', 'uid1'));

console.log(`\n결과: ${pass} 통과 / ${fail} 실패`);
process.exit(fail ? 1 : 0);
