---
bootstrapped_at: 2026-11-04T21:10:12Z
starter_id: 10x-astro-starter
starter_name: "10x Astro Starter (Astro + Supabase + Cloudflare)"
project_name: trzy
language_family: js
package_manager: npm
cwd_strategy: git-clone
bootstrapper_confidence: first-class
phase_3_status: ok
audit_command: "npm audit --json"
---

# Bootstrap verification: trzy

## Hand-off

```yaml
starter_id: 10x-astro-starter
package_manager: npm
project_name: trzy
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-pages
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
```

> A solo developer shipping a mobile-first web MVP in five after-hours weeks, with magic-link login, per-user data isolation and an AI step that turns a free-text dump into at most three items for today, needs an agent-friendly starter that handles auth, database and deploy out of the box. The 10x Astro Starter (Astro, React, TypeScript, Tailwind, Supabase, Cloudflare) is the recommended default for a JavaScript/TypeScript web app, clears all four agent-friendly gates and matches the stack already chosen in the project's decision log. Scaffolding confidence is first-class, so expect mostly smooth setup with occasional manual steps. Auth and AI flags are set; payments and realtime are out of scope. The day reset and 14-day archive can run lazily on first open, so no background jobs are flagged. Deployment uses the starter default, Cloudflare Pages, with GitHub Actions auto-deploying on merge to main.

## Pre-scaffold verification

| Signal      | Value | Severity | Notes |
| ----------- | ----- | -------- | ----- |
| npm package | not run | — | `cmd_template` starts with `git clone`; no `create-*` package to check |
| GitHub repo | przeprogramowani/10x-astro-starter last commit 2026-10-29 (`d85617c` „chore: bump Node to 26 and lint-staged to 17”) | fresh | GitHub API not available for this repo in the session; date taken from the cloned default branch HEAD instead of `pushed_at` |

## Scaffold log

**Resolved invocation**: `git clone https://github.com/przeprogramowani/10x-astro-starter .bootstrap-scaffold && cd .bootstrap-scaffold && npm install` (run with `GIT_LFS_SKIP_SMUDGE=1`)
**Strategy**: git-clone
**Exit code**: 0
**Files moved**: 47 files + `node_modules/` as one directory
**Conflicts (.scaffold siblings)**: `AGENTS.md.scaffold`, `CLAUDE.md.scaffold`, `README.md.scaffold`
**.gitignore handling**: append-merged (28 lines) with a `# from 10x-astro-starter` separator
**context/ from scaffold**: none shipped
**.bootstrap-scaffold cleanup**: deleted (upstream `.git/` removed before move-up; only the already-merged `.gitignore` remained before deletion)

Files moved: `.env.example`, `.github/workflows/ci.yml`, `.husky/pre-commit`, `.nvmrc`, `.prettierrc.json`, `.vscode/extensions.json`, `.vscode/settings.json`, `.vscode/launch.json`, `astro.config.mjs`, `components.json`, `eslint.config.js`, `node_modules/ (whole dir)`, `package-lock.json`, `package.json`, `public/template.png`, `public/favicon.png`, `public/.assetsignore`, `scripts/smoke.mjs`, `src/env.d.ts`, `src/middleware.ts`, `src/components/Topbar.astro`, `src/components/Banner.astro`, `src/components/Welcome.astro`, `src/components/ui/button.tsx`, `src/components/ui/LibBadge.astro`, `src/components/auth/SignUpForm.tsx`, `src/components/auth/PasswordToggle.tsx`, `src/components/auth/SignInForm.tsx`, `src/components/auth/SubmitButton.tsx`, `src/components/auth/FormField.tsx`, `src/components/auth/ServerError.tsx`, `src/layouts/Layout.astro`, `src/styles/global.css`, `src/lib/utils.ts`, `src/lib/config-status.ts`, `src/lib/supabase.ts`, `src/pages/dashboard.astro`, `src/pages/index.astro`, `src/pages/auth/signup.astro`, `src/pages/auth/signin.astro`, `src/pages/auth/confirm-email.astro`, `src/pages/api/auth/signin.ts`, `src/pages/api/auth/signout.ts`, `src/pages/api/auth/signup.ts`, `supabase/config.toml`, `supabase/.gitignore`, `tsconfig.json`, `wrangler.jsonc`

## Post-scaffold audit

**Tool**: npm audit --json
**Summary**: 0 CRITICAL, 0 HIGH, 13 MODERATE, 0 LOW
**Direct vs transitive**: 0/0/6/0 direct of total 0/0/13/0. All findings are in the lint toolchain (eslint, typescript-eslint and plugins) via `minimatch`; dev dependencies only.

#### CRITICAL findings
none

#### HIGH findings
none

#### MODERATE findings
- `@eslint/config-array` >=0.23.0 — transitive; via minimatch; fix available: True
- `@eslint/js` >=10.0.1 — direct; via eslint; fix available: True
- `@typescript-eslint/eslint-plugin` >=6.16.0 — transitive; via @typescript-eslint/parser, @typescript-eslint/type-utils, @typescript-eslint/utils; fix available: True
- `@typescript-eslint/parser` >=6.16.0 — transitive; via @typescript-eslint/typescript-estree; fix available: True
- `@typescript-eslint/type-utils` >=6.16.0 — transitive; via @typescript-eslint/typescript-estree, @typescript-eslint/utils; fix available: True
- `@typescript-eslint/typescript-estree` >=6.16.0 — transitive; via minimatch; fix available: True
- `@typescript-eslint/utils` >=6.16.0 — transitive; via @typescript-eslint/typescript-estree; fix available: True
- `eslint` >=10.0.0-alpha.0 — direct; via @eslint/config-array, minimatch; fix available: True
- `eslint-plugin-astro` >=2.0.0 — direct; via @typescript-eslint/parser, eslint, eslint-plugin-jsx-a11y, typescript-eslint; fix available: True
- `eslint-plugin-jsx-a11y`  — direct; via eslint; fix available: True
- `eslint-plugin-react`  — direct; via eslint; fix available: True
- `minimatch` 7.0.0 - 11.0.0 — transitive; minimatch has potential denial of service via globparts amplification (https://github.com/advisories/GHSA-g3hv-75wg-m249); fix available: True
- `typescript-eslint` * — direct; via @typescript-eslint/eslint-plugin, @typescript-eslint/parser, @typescript-eslint/typescript-estree, @typescript-eslint/utils; fix available: True

#### LOW / INFO findings
none

## Hints recorded but not acted on

| Hint                       | Value        |
| -------------------------- | ------------ |
| bootstrapper_confidence    | first-class  |
| quality_override           | false        |
| path_taken                 | standard     |
| self_check_answers         | null         |
| team_size                  | solo         |
| deployment_target          | cloudflare-pages |
| ci_provider                | github-actions |
| ci_default_flow            | auto-deploy-on-merge |
| has_auth                   | true         |
| has_payments               | false        |
| has_realtime               | false        |
| has_ai                     | true         |
| has_background_jobs        | false        |

Additional observation (not a hint): the starter pins Node 26.13.0 in `.nvmrc`; this environment ran `npm install` on Node v22.23.4 without errors.

## Next steps

Next: a future skill will set up agent context (CLAUDE.md, AGENTS.md). For now, your project is scaffolded and verified — happy hacking.

Useful manual steps in the meantime:
- `git init` (if you have not already) to start your own repo history.
- Review any `.scaffold` siblings the conflict policy created and decide which version of each file to keep.
- Address audit findings per your project's risk tolerance — the full breakdown is in this log.
