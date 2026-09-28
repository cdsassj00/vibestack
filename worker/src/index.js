/**
 * VibeStack Worker — 경로별로 기능을 나눈다.
 *   /mcp  교육과정 데이터 MCP 서버 (읽기 전용)
 *   /ai   (예정) OpenRouter 중계. 사이트 주소에서 온 요청만 받고 키는 Worker 비밀값에만 둔다.
 */
import { handleMcp } from './mcp.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/mcp' || pathname === '/mcp/') return handleMcp(request, env);
    if (pathname === '/' || pathname === '') {
      return new Response('VibeStack Worker. MCP 서버 주소는 /mcp 입니다.\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    return new Response('Not Found', { status: 404 });
  }
};
