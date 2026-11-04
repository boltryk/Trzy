---
starter_id: 10x-astro-starter
package_manager: npm
project_name: trzy
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-workers
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: first-class
  path_taken: standard
  quality_override: false
  self_check_answers: null
  has_auth: true
  has_payments: false
  has_realtime: false
  has_ai: true
  has_background_jobs: false
---

## Why this stack

A solo developer shipping a mobile-first web MVP in five after-hours weeks, with magic-link login, per-user data isolation and an AI step that turns a free-text dump into at most three items for today, needs an agent-friendly starter that handles auth, database and deploy out of the box. The 10x Astro Starter (Astro, React, TypeScript, Tailwind, Supabase, Cloudflare) is the recommended default for a JavaScript/TypeScript web app, clears all four agent-friendly gates and matches the stack already chosen in the project's decision log. Scaffolding confidence is first-class, so expect mostly smooth setup with occasional manual steps. Auth and AI flags are set; payments and realtime are out of scope. The day reset and 14-day archive can run lazily on first open, so no background jobs are flagged. Deployment targets Cloudflare Workers (the runtime the starter is configured for), with GitHub Actions auto-deploying on merge to main.
