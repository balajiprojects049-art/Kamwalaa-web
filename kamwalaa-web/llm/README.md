LLM configuration and usage

This folder contains a minimal example for controlling the LLM model used by your backend or serverless functions.

Files:
- `llm-config.json` — sample JSON toggles and defaults.

Suggested usage (Node.js):

1. Prefer using an environment variable `LLM_MODEL` in production (Railway/Vercel).
2. Use `llm-config.json` as a fallback for local development or to show defaults.

Example:

```javascript
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./llm/llm-config.json', 'utf8'));
const model = process.env.LLM_MODEL || config.defaultModel;

// Use `model` when calling the LLM provider client
```

Deployment:
- Railway: `railway env set LLM_MODEL claude-haiku-4.5`
- Vercel: `vercel env add LLM_MODEL production`

Notes:
- This repository does not contain a backend that calls an LLM. If you want, I can add a small example backend `kamwalaa-backend/` that demonstrates calling Anthropic/Claude with `LLM_MODEL` configured.
