'use strict';

const CACHE_NAME = 'flipbee-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js'
];

/* ── Install: 앱 셸 프리캐시 ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

/* ── Activate: 이전 캐시 삭제 ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

/* ── Fetch: network-first + 캐시 fallback (오프라인 지원) ── */
self.addEventListener('fetch', event => {
  /* GET 요청만 처리 */
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isAllowedCDN = url.origin === 'https://cdn.jsdelivr.net';

  /* 허용되지 않은 외부 origin 차단 — 데이터 유출 방지 */
  if (!isSameOrigin && !isAllowedCDN) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        /* 정상 응답만 캐시 */
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        /* 오프라인: 캐시에서 제공 */
        return caches.match(event.request);
      })
  );
});
