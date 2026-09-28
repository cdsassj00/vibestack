/**
 * AI 과정 구성 설정 — 브라우저는 Cloudflare Worker(worker/)의 /ai 만 부른다.
 * Worker가 OpenRouter 키(비밀값)로 모델을 부르므로 키는 브라우저로 내려오지 않는다.
 * 모델 이름은 worker/wrangler.toml 의 OPENROUTER_MODEL 에서 바꾼다.
 */
export const AI_CONFIG = {
  endpoint: 'https://vibestack.sjshin.workers.dev/ai',
  timeoutMs: 90000
};
