import http from 'k6/http';
import { check, fail } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ONLY isolated staging. Never use production or real accounts.
// Required K6_BASE_URL, K6_EMAIL, K6_PASSWORD, K6_BEARER_TOKEN.
// Synthetic account should already have its own 28-day plan.
const base = __ENV.K6_BASE_URL;
const email = __ENV.K6_EMAIL;
const password = __ENV.K6_PASSWORD;
const token = __ENV.K6_BEARER_TOKEN;
if (!base || !email || !password || !token) {
  fail('Missing staging-only K6_BASE_URL/EMAIL/PASSWORD/BEARER_TOKEN');
}
if (!base.startsWith('http://127.0.0.1:') && !base.startsWith('http://localhost:')) {
  fail('Safety gate: this example only targets an isolated local staging host');
}
if (!email.endsWith('@example.invalid')) {
  fail('Safety gate: only synthetic example.invalid accounts are allowed');
}

const loginMs = new Trend('n01_login_ms');
const planMs = new Trend('n02_plan_ms');
const loginGood = new Rate('n01_login_good');
const planGood = new Rate('n02_plan_good');
const healthGood = new Rate('n03_health_good');

export const options = {
  scenarios: {
    login: { executor: 'per-vu-iterations', vus: 10, iterations: 10, exec: 'login' },
    plan: { executor: 'shared-iterations', vus: 10, iterations: 100, exec: 'plan' },
    health: { executor: 'shared-iterations', vus: 1, iterations: 60, exec: 'health' },
  },
  thresholds: {
    // N01: login p95 <= 2s, success >=99% (100 synthetic requests).
    n01_login_ms: ['p(95)<=2000'],
    n01_login_good: ['rate>=0.99'],
    // N02: existing plan read p95 <= 10s, success >=99%.
    n02_plan_ms: ['p(95)<=10000'],
    n02_plan_good: ['rate>=0.99'],
    // N03 technical readiness proxy, NOT full 30-day journey availability.
    n03_health_good: ['rate>=0.995'],
  },
};

export function login() {
  const res = http.post(base + '/api/auth/login',
    JSON.stringify({ email, password }),
    { headers: { 'Content-Type': 'application/json' }, tags: { nfr: 'N01' } });
  loginMs.add(res.timings.duration);
  loginGood.add(res.status === 200);
  check(res, { 'N01 synthetic login returns 200': r => r.status === 200 });
}
export function plan() {
  const res = http.get(base + '/api/plan/current',
    { headers: { Authorization: 'Bearer ' + token }, tags: { nfr: 'N02' } });
  planMs.add(res.timings.duration);
  let ok = res.status === 200;
  if (ok) {
    try { ok = !!JSON.parse(res.body).plan; } catch (_) { ok = false; }
  }
  planGood.add(ok);
  check(res, { 'N02 existing own plan is returned': () => ok });
}
export function health() {
  const res = http.get(base + '/api/health', { tags: { nfr: 'N03-proxy' } });
  const ok = res.status === 200 && String(res.body).includes('"database":"ok"');
  healthGood.add(ok);
  check(res, { 'N03 staging readiness is up': () => ok });
}
