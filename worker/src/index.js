/**
 * VibeStack Worker — 경로별로 기능을 나눈다.
 *   /mcp  교육과정 데이터 MCP 서버 (읽기 전용, 누구나 또는 MCP_TOKEN 키)
 *   /ai   보드의 AI 과정 구성이 부르는 OpenRouter 중계 (허용한 사이트 주소만, 키는 Worker 비밀값)
 */
import { handleMcp } from './mcp.js';
import { handleAi } from './ai.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/mcp' || pathname === '/mcp/') return handleMcp(request, env);
    if (pathname === '/ai' || pathname === '/ai/') return handleAi(request, env);
    if (pathname === '/' || pathname === '') {
      return new Response('VibeStack Worker. MCP 서버 주소는 /mcp 입니다.\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }
    return new Response('Not Found', { status: 404 });
  }
};
