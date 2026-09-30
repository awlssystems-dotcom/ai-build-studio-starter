# Contributing

This starter is available under the MIT License. Contributions should be compatible with that license; fonts and third-party packages retain their own licenses.

Useful contributions include clearer setup instructions, realistic service-website examples, accessible form behavior, and fixes to inquiry validation or provider error handling.

## Check a change locally

Use Node 24 for the included TypeScript example and tests:

```sh
npm ci
npm test
npm run example
npm run build
```

The automated tests and example use fake provider responses and sample `example.com` addresses. They must not send real email, use real keys, or upload personal customer data.

Keep changes focused and explain the problem, changed behavior, and validation in your pull request. Include a reproducible example when reporting a problem. Redact personal information and credentials from screenshots and logs.

If you discover a credential or security issue, do not place it in a public issue. Use the repository's private vulnerability-reporting channel if it has been configured. Otherwise, wait for the maintainer to provide a private reporting route.
