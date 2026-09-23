// Firestore 보안 규칙 테스트 — 로컬 에뮬레이터 전용 (운영 DB에 접속하지 않는다)
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

console.log('── 작성(create)');
await t('비로그인 정상 글 (authorId=null)', true, create('anon1', post()));
await t('로그인 uid1 정상 글 (authorId=uid1)', true, create('u1post', post({ author: 'uid1', authorId: 'uid1' }), 'uid1'));
await t('비로그인이 authorId=uid1 사칭', false, create('x1', post({ authorId: 'uid1' })));
await t('uid2 가 authorId=uid1 사칭', false, create('x2', post({ authorId: 'uid1' }), 'uid2'));
await t('likes=999 로 시작', false, create('x3', post({ likes: 999 })));
await t('허용 안 된 필드 isAdmin 추가', false, create('x4', post({ isAdmin: true })));
await t('category 에 HTML 주입 문자열', false, create('x5', post({ category: 'web" onmouseover="alert(1)' })));
await t('제목 101자', false, create('x6', post({ title: 'a'.repeat(101) })));
await t('createdAt 을 클라이언트 값으로 위조', false, create('x7', post({ createdAt: '2020-01-01' }), undefined, false));
await t('댓글이 미리 채워진 글', false, create('x8', post({ comments: [cmt()] })));
await t('cliCommand 필드 누락', false, create('x9', (({ cliCommand, ...r }) => r)(post())));

console.log('── 읽기(read)');
await t('비로그인 목록 읽기', true, read('vibestacks'));
await t('규칙에 없는 다른 컬렉션(posts) 읽기', false, read('posts'));

console.log('── 좋아요(update)');
await t('비로그인 좋아요 +1 (increment)', true, like('anon1'));
await t('likes 를 1000 으로 직접 설정', false, update('anon1', { likes: 1000 }));
await t('좋아요 +1 과 함께 제목 변경', false, update('anon1', { likes: 2, title: '해킹' }));

console.log('── 댓글(update)');
await t('비로그인 댓글 추가 (arrayUnion) — 첫 댓글', true, comment('anon1', cmt({ text: '첫 댓글' })));
await t('비로그인 댓글 추가 — 두 번째 댓글', true, comment('anon1', cmt({ text: '두번째' })));
await t('댓글 배열을 빈 배열로 덮어쓰기', false, update('anon1', { comments: [] }));
await t('기존 댓글 내용 변조 + 1개 추가', false, update('anon1', { comments: [cmt({ text: '변조됨' }), cmt({ text: '두번째' }), cmt({ text: '새 댓글' })] }));
await t('1000자 초과 댓글', false, comment('anon1', cmt({ text: 'a'.repeat(1001) })));
await t('허용 안 된 필드가 든 댓글', false, comment('anon1', cmt({ admin: true })));

console.log('── 본문 수정(update)');
await t('비로그인이 남의 글 제목 덮어쓰기 (기존 update:true 구멍)', false, update('anon1', { title: '해킹됨' }));
await t('작성자 uid1 이 본인 글 제목 수정', true, update('u1post', { title: '수정된 제목' }, 'uid1'));
await t('작성자 uid1 이 본인 글 likes 조작', false, update('u1post', { likes: 50 }, 'uid1'));
await t('uid2 가 uid1 글 수정', false, update('u1post', { title: '남의 글' }, 'uid2'));

console.log('── 삭제(delete)');
await t('비로그인이 uid1 글 삭제', false, del('u1post'));
await t('uid2 가 uid1 글 삭제', false, del('u1post', 'uid2'));
await t('로그인 사용자가 비로그인 글 삭제', false, del('anon1', 'uid2'));
await t('작성자 uid1 이 본인 글 삭제', true, del('u1post', 'uid1'));

console.log(`\n결과: ${pass} 통과 / ${fail} 실패`);
process.exit(fail ? 1 : 0);
