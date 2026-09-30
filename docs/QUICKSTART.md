# Try the structured inquiry example

## What this gives a developer

A service-website visitor can describe the project, budget, and timing in one form. The included Cloudflare Pages handler checks the request and formats those details for the configured business inbox, with the visitor's email as the reply address.

This is a reusable website-and-inquiry example. It does not connect to banks, operate a machine, or implement an AI chatbot, payments, or accounts.

## Try it without configuring an email service

With Node 24 installed, run:

```sh
npm ci
npm run example
npm test
npm run dev
```

`npm run example` runs the real contact handler with a fake email binding and prints sample project details. It makes no network call and sends no real message. `npm test` covers request checks, HTML escaping, configured delivery targets, and provider failure responses.

`npm run dev` opens the frontend development server. Its browser form needs the Pages backend to send an inquiry; the Vite-only preview does not provide that backend.

For a complete local Pages environment, use `npm run dev:pages`. Configure your own sender, recipient, and provider secret in an ignored `.dev.vars` file only if you intentionally want to test real email delivery. A real provider configuration can send real email and consume provider quota. Keep the sample `.env.example` blank.

## Expected offline result

The example reports that no real email was sent, then prints fields including:

```text
Name: Demo Customer
Email: customer@example.com
Business: Example Services
Project type: Website + request flow
Budget: $2,500 - $3,500
Timeline: Flexible
```

The handler also supports a Resend path when its sender, recipient, and server-side key are configured. Tests cover that path using fake responses, not a live provider. Successful local tests do not prove real delivery or that the form is ready for unattended production use.

## Before hosting it publicly

Replace the sample business copy and policies, set your own site URL, configure your hosting project, and review abuse protection and operational monitoring for your use case. Keep secrets server-side. Preserve the included font license. This standalone starter is MIT-licensed; the original project remains private.
