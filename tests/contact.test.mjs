import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { onRequest } from '../functions/api/contact.ts';

const realFetch = globalThis.fetch;
let unexpectedNetwork = false;

beforeEach(() => {
  unexpectedNetwork = false;
  globalThis.fetch = async () => {
    unexpectedNetwork = true;
    throw new Error('Network disabled in tests');
  };
});

afterEach(() => {
  globalThis.fetch = realFetch;
  assert.equal(unexpectedNetwork, false, 'Tests must not make real network requests');
});

const validInquiry = {
  name: 'Demo Customer',
  email: 'customer@example.com',
  business: 'Example Services',
  projectType: 'Website + request flow',
  budget: '$2,500 - $3,500',
  timeline: 'Flexible',
  message: 'Please discuss an inquiry form for my sample website.',
};

function configuredBinding(sendFailure) {
  const delivered = [];
  return {
    delivered,
    env: {
      CONTACT_FROM_EMAIL: 'inquiries@example.com',
      CONTACT_TO_EMAIL: 'owner@example.com',
      EMAIL: {
        async send(message) {
          if (sendFailure) throw sendFailure;
          delivered.push(message);
          return { messageId: 'fake-binding-message' };
        },
      },
    },
  };
}

function requestFor(payload, { method = 'POST', type = 'application/json', raw } = {}) {
  return new Request('http://localhost/api/contact', {
    method,
    headers: { 'Content-Type': type },
    ...(method === 'GET' || method === 'HEAD' ? {} : { body: raw ?? JSON.stringify(payload) }),
  });
}

async function invoke(payload = validInquiry, options = {}) {
  const binding = options.binding ?? configuredBinding();
  const response = await onRequest({ request: requestFor(payload, options), env: options.env ?? binding.env });
  return { response, result: await response.json(), delivered: binding.delivered };
}

test('unsupported methods and missing delivery configuration fail without sending', async () => {
  const method = await invoke(validInquiry, { method: 'GET' });
  assert.equal(method.response.status, 405);
  assert.equal(method.delivered.length, 0);
  const config = await invoke(validInquiry, { env: {} });
  assert.equal(config.response.status, 500);
  assert.equal(config.result.ok, false);
  assert.equal(config.delivered.length, 0);
});

test('wrong content type and oversized requests fail before delivery', async () => {
  const type = await invoke(validInquiry, { type: 'text/plain' });
  assert.equal(type.response.status, 415);
  assert.equal(type.delivered.length, 0);
  const size = await invoke(validInquiry, { raw: 'x'.repeat(12_001) });
  assert.equal(size.response.status, 413);
  assert.equal(size.delivered.length, 0);
});

test('malformed JSON and non-object JSON return readable errors without sending', async () => {
  for (const raw of ['{', 'null', '[]', '"hello"', '42', 'true']) {
    const result = await invoke(validInquiry, { raw });
    assert.equal(result.response.status, 400, raw);
    assert.equal(result.result.error, 'Invalid request.');
    assert.equal(result.delivered.length, 0);
  }
});

test('required fields and email are validated before provider calls', async () => {
  for (const override of [{ name: '' }, { email: '' }, { message: '' }, { email: 'invalid' }, { name: { nested: 'wrong' } }]) {
    const result = await invoke({ ...validInquiry, ...override });
    assert.equal(result.response.status, 400);
    assert.equal(result.result.ok, false);
    assert.equal(result.delivered.length, 0);
  }
});

test('filled honeypot does not trigger email delivery', async () => {
  const result = await invoke({ ...validInquiry, companyWebsite: 'spam' });
  assert.equal(result.response.status, 200);
  assert.deepEqual(result.result, { ok: true });
  assert.equal(result.delivered.length, 0);
});

test('valid inquiry goes only to the configured owner with customer reply address', async () => {
  const result = await invoke({ ...validInquiry, to: 'ignored@example.com', email: '  customer@example.com  ' });
  assert.equal(result.response.status, 200);
  assert.deepEqual(result.result, { ok: true });
  assert.equal(result.delivered.length, 1);
  const message = result.delivered[0];
  assert.equal(message.to, 'owner@example.com');
  assert.equal(message.from, 'inquiries@example.com');
  assert.equal(message.replyTo, 'customer@example.com');
  assert.match(message.text, /Project type: Website \+ request flow/);
  assert.match(message.text, /Timeline: Flexible/);
  assert.ok(!message.text.includes('ignored@example.com'));
});

test('customer markup is escaped in the email HTML', async () => {
  const result = await invoke({ ...validInquiry, name: '<img src=x onerror=alert(1)>', message: '<script>alert("demo")</script> & details' });
  assert.equal(result.response.status, 200);
  assert.equal(result.delivered.length, 1);
  const html = result.delivered[0].html;
  assert.ok(!html.includes('<script>'));
  assert.ok(!html.includes('<img'));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('&amp; details'));
});

test('binding failure returns a generic JSON error without exposing provider detail', async () => {
  const result = await invoke(validInquiry, { binding: configuredBinding(new Error('private provider detail')) });
  assert.equal(result.response.status, 502);
  assert.deepEqual(result.result, { ok: false, error: 'Email could not be sent right now.' });
  assert.equal(result.delivered.length, 0);
});

function resendEnv() {
  return {
    RESEND_API_KEY: 'TEST_ONLY_NOT_A_CREDENTIAL',
    RESEND_FROM_EMAIL: 'inquiries@example.com',
    CONTACT_TO_EMAIL: 'owner@example.com',
  };
}

test('mock Resend delivery uses configured recipients and handles accepted delivery', async () => {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    calls.push(options);
    return new Response('{"id":"fake-message"}', { status: 200 });
  };
  const result = await invoke(validInquiry, { env: resendEnv() });
  assert.equal(result.response.status, 200);
  assert.equal(calls.length, 1);
  const payload = JSON.parse(calls[0].body);
  assert.deepEqual(payload.to, ['owner@example.com']);
  assert.equal(payload.reply_to, 'customer@example.com');
});

test('mock Resend rejection and connection failures do not report success', async () => {
  for (const fakeResponse of [async () => new Response('{}', { status: 429 }), async () => { throw new Error('private provider detail'); }]) {
    let calls = 0;
    globalThis.fetch = async (url) => {
      assert.equal(url, 'https://api.resend.com/emails');
      calls++;
      return fakeResponse();
    };
    const result = await invoke(validInquiry, { env: resendEnv() });
    assert.equal(result.response.status, 502);
    assert.equal(result.result.ok, false);
    assert.equal(result.result.error, 'Email could not be sent right now.');
    assert.equal(calls, 1);
  }
});
