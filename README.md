# AI Build Studio Starter

A reusable React and TypeScript service website starter, extracted from AI Build Studio. It includes responsive pages, demonstration quote calculations, and structured project inquiry forms with a Cloudflare Pages Function.

Project code and placeholder SVG artwork are available under the MIT License in `LICENSE`. IBM Plex fonts retain their included SIL Open Font License. Third-party packages retain their respective licenses.

## Included

- React 19, Vite, TypeScript, and client-side navigation.
- Home, services, examples, packages, contact, privacy, and terms pages.
- Demonstration quote calculator and structured project inquiry form.
- JSON contact handler with input checks, a honeypot, and HTML escaping.
- Email delivery through a configured binding or Resend; no credentials included.
- Optional analytics configured with empty environment variables.
- Generic SVG placeholders and IBM Plex fonts with their license.
- Offline contact-handler example and focused automated request/delivery checks.

This is a website starter. It does not implement an AI chatbot, authentication, payments, a customer dashboard, or the CallBack HVAC product. The service descriptions and prices are sample marketing content, not included backend features or business promises.

## Local setup

Use Node 24. The offline example and tests use its built-in TypeScript support.

```sh
npm ci
npm test
npm run example
npm run dev
npm run build
npm run preview
```

For a local Pages environment, `npm run dev:pages` builds and starts Wrangler locally. Do not submit a real inquiry unless you intentionally configured your own email service: that path can send email.

The Vite-only frontend server does not run the contact backend. `npm run example` runs the real handler against a fake email binding, with no real messages or network calls. Read [the quickstart](docs/QUICKSTART.md) for the expected output and delivery configuration.

The request tests cover invalid data, the honeypot, recipient configuration, HTML escaping, and mocked provider success and failure. Passing them does not prove actual provider delivery or production readiness.

## Configure before launching

1. Replace the demonstration copy, pricing, privacy policy, and terms.
2. Replace `https://example.com` in `src/App.tsx`, `scripts/copy-routes.mjs`, and `index.html` with your own site URL.
3. Configure `CONTACT_TO_EMAIL` and your email provider's sender settings and server-side credential. Keep real secrets in your provider's secret store or an ignored local `.dev.vars` file. Never put a real key in `.env.example` or a `VITE_` variable.
4. Keep the optional analytics variables blank unless you intentionally configure your own analytics.
5. Review email abuse protection, request limits, provider behavior, and applicable privacy requirements for your deployment. The included honeypot is not a complete abuse defense.

There is no deploy script targeting the original business website. Create and configure your own hosting project if you choose to deploy.

## Scope of this starter

The original repository and its Git history are excluded. This candidate omits private strategy documents, original photographs, the founder portrait, commercial screenshots, original account verification files, business contact details, and the credential from the old `.env.example`.

Third-party packages retain their respective licenses. IBM Plex fonts are covered by `public/fonts/OFL-IBM-Plex.txt`. No endorsement or right to use another business's branding is granted.
