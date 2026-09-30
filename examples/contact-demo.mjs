import assert from 'node:assert/strict';
import { onRequest } from '../functions/api/contact.ts';

// This example runs the real handler against a fake email binding.
// It never contacts an email provider or sends an actual message.
globalThis.fetch = async () => { throw new Error('External network disabled in this example'); };
const delivered = [];
const response = await onRequest({
  request: new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Demo Customer', email: 'customer@example.com', business: 'Example Services',
      projectType: 'Website + request flow', budget: '$2,500 - $3,500', timeline: 'Flexible',
      message: 'I want a website that helps customers explain the work they need.',
    }),
  }),
  env: {
    CONTACT_FROM_EMAIL: 'inquiries@example.com', CONTACT_TO_EMAIL: 'owner@example.com',
    EMAIL: { async send(message) { delivered.push(message); return { messageId: 'demo-only' }; } },
  },
});
assert.equal(response.status, 200);
assert.deepEqual(await response.json(), { ok: true });
assert.equal(delivered.length, 1);
console.log('Offline example passed. No real email was sent.');
console.log('The configured owner would receive these inquiry details:');
console.log(delivered[0].text);
