# Plan: pierwsze wdrożenie Trzy na Cloudflare Workers

> Zatwierdzony przez autora 2026-11-17 w trybie planowania (lekcja m1l5). Odhaczane w trakcie wykonania.

## Context

Lekcja m1l5: decyzja o platformie jest już zapisana w `context/foundation/infrastructure.md` (Cloudflare Workers, plan Paid). Teraz pierwsze wdrożenie produkcyjne i automatyczne wdrażanie po merge'u. Użytkownik założył konto Cloudflare (Paid) i projekt Supabase we Frankfurcie.

Decyzje użytkownika:

- **Automatyczne wdrożenie: GitHub Actions, dopiero po zielonym CI** (lint, `astro check`, build, test smoke). Nie Workers Builds, bo ten wdrażałby niezależnie od wyniku CI.
- **Pierwsze wdrożenie robi agent z tej sesji**, tokenem API od użytkownika podanym przez bezpieczny formularz (nigdy w czacie).

To wdrożenie Workera (`wrangler deploy`), nie Pages; te komendy w Cloudflare nie są wymienne.

## Stan wyjściowy (sprawdzony)

- `wrangler.jsonc`: `name: "10x-astro-starter"`, `main: "@astrojs/cloudflare/entrypoints/server"`, `assets` z `./dist`, `observability.enabled: true`.
- Wersje z `package-lock.json`: `wrangler@4.156.0`, `@astrojs/cloudflare@14.4.3`, `astro@7.4.4`.
- `astro.config.mjs`: `SUPABASE_URL`, `SUPABASE_KEY` jako sekrety serwerowe w `env.schema` (opcjonalne). Build w CI przechodzi bez nich, więc są potrzebne tylko w działającym Workerze.
- `.github/workflows/ci.yml`: joby `ci` i `smoke` na push/PR do `main`; brak kroku wdrożenia.
- Szablon maila: `supabase/templates/magic_link.html` (link `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email`).

## Kroki

### A. Zmiany w kodzie (gałąź `feat/deploy`, jeden PR)

- [x] `wrangler.jsonc`: `name` z `10x-astro-starter` na `trzy` (nazwa Workera i adres `trzy.<subdomena>.workers.dev`).
- [x] `.github/workflows/ci.yml`: nowy job `deploy`:
  - `needs: [ci, smoke]`, uruchamiany tylko przy `push` do `main` (nie przy PR).
  - `concurrency: { group: production-deploy, cancel-in-progress: false }`, żeby dwa merge'e nie wdrażały się naraz.
  - Kroki: `actions/checkout@v4`, `actions/setup-node@v4` (Node 26, cache npm), `npm ci`, `npm run build`, `npx wrangler deploy`.
  - Env: `CLOUDFLARE_API_TOKEN` i `CLOUDFLARE_ACCOUNT_ID` z sekretów repozytorium.
  - `npx wrangler` bierze dokładnie wersję z lockfile'a (lekcja „przypinaj wersje”), bez dodatkowej akcji `wrangler-action`.
- [x] `context/deployment/deploy-plan.md`: zatwierdzony plan (ślad audytowy dla kolejnych lekcji). Prompt kursu podaje też ścieżkę `context/changes/deployment/deployment-plan.md`; trzymamy się ścieżki z reguł lekcji, czytanej przez planowanie roadmapy.
- [x] `context/foundation/infrastructure.md`: w „Operational Story” zapisać decyzję „wdrożenie z GitHub Actions po zielonym CI” zamiast „do rozstrzygnięcia”.
- [x] `AGENTS.md`, sekcja Komendy: dopisać `npx wrangler deploy` i `npx wrangler tail trzy` (jedna linia).

### B. Bramki ręczne (robi użytkownik; agent podaje dokładne miejsce w panelu)

- [x] **Cloudflare, subdomena workers.dev:** Workers & Pages → ustawić subdomenę konta (jednorazowo).
- [x] **Cloudflare, token API:** My Profile → API Tokens → szablon „Edit Cloudflare Workers”, ograniczony do jednego konta, bez DNS i rozliczeń. Ten sam token:
  - podany agentowi przez bezpieczny formularz (host `api.cloudflare.com`),
  - dodany w GitHub → Settings → Secrets → Actions jako `CLOUDFLARE_API_TOKEN`, plus `CLOUDFLARE_ACCOUNT_ID` (identyfikator konta, nie sekret).
- [x] **Supabase (po pierwszym wdrożeniu, gdy znamy adres):** Authentication → URL Configuration:
  - Site URL: `https://trzy.<subdomena>.workers.dev`,
  - Redirect URLs: ten sam adres.
- [x] **Supabase, szablony maili:** Authentication → Email Templates → „Magic Link” i „Confirm signup”: treść z `supabase/templates/magic_link.html`, temat „Twój link do logowania w Trzy”.
- [x] **Sekrety Workera:** Cloudflare → Workers & Pages → `trzy` → Settings → Variables and Secrets: `SUPABASE_URL` (Project URL) i `SUPABASE_KEY` (klucz publiczny anon/publishable, nigdy `service_role`). Wartości wpisuje tylko użytkownik.

### C. Pierwsze wdrożenie (agent, z tej sesji)

- [x] `npx wrangler whoami`: potwierdzenie tokenu i identyfikatora konta.
- [x] `npm run build`, potem `npx wrangler deploy` z gałęzi `feat/deploy`; zanotować adres Workera i identyfikator wersji.
- [x] Do czasu wpisania sekretów strona pokazuje baner „Supabase nie jest skonfigurowany”; to oczekiwany stan pośredni.

### D. Weryfikacja na produkcji (po sekretach i konfiguracji Supabase)

- [ ] `curl` na `/`, `/auth/signin`, `/auth/check-email`: 200; `/dashboard` bez sesji: 302 do `/auth/signin`.
- [x] Logowanie end-to-end przez użytkownika: wpisuje swój e-mail na `/auth/signin`, dostaje mail, „Otwórz Trzy” → „Tak, wchodzę” → zalogowany. To jedyny test z prawdziwą skrzynką.
- [ ] `npx wrangler tail trzy` podczas logowania: w logach nie ma e-maili ani treści (reguła 6).
- [ ] `npx wrangler deployments list`: widać wersję do ewentualnego `npx wrangler rollback`.

### E. Automatyczne wdrażanie

- [ ] PR `feat/deploy` → CI zielone (job `deploy` na PR się nie uruchamia) → merge.
- [ ] Po merge'u job `deploy` na `main` wdraża sam; sprawdzić jego log i ponowić krok D (bez maila).

## Ryzyka do pilnowania

- **Wbudowany serwer pocztowy Supabase ma bardzo niski limit wysyłki** (kilka maili na godzinę, do testów). Wystarczy dla autora; przed testerami potrzebny własny SMTP. Do odnotowania w rejestrze ryzyk, poza zakresem tego wdrożenia.
- Kolejność ma znaczenie: Worker musi istnieć, zanim w panelu da się ustawić jego sekrety, a adres Workera musi być znany, zanim ustawimy Site URL w Supabase.
- Sieć sesji może blokować `api.cloudflare.com`; bezpieczny formularz na token odblokowuje ten host.

## Poza zakresem

Własna domena, środowisko podglądów dla PR, cron (poranny mail), własny SMTP, tłumaczenie reszty ekranów startera.

## Dziennik wykonania

- 2026-11-17: token API wymagał dodania uprawnień Workers Scripts: Edit, Workers KV Storage: Edit (adapter Astro tworzy KV `SESSION` na sesje) i Account Settings: Read. `wrangler whoami` nie działa z tokenem bez listy kont; wystarcza `CLOUDFLARE_ACCOUNT_ID`.
- 2026-11-17: subdomena `lukasz-boltryk.workers.dev` utworzona przez otwarcie Workers & Pages w panelu.
- 2026-11-17: pierwsze wdrożenie z gałęzi `feat/deploy`, wersja `83a33a83-3d21-47a6-8a86-cf3692edfef9`, adres https://trzy.lukasz-boltryk.workers.dev. `/`, `/auth/signin`, `/auth/check-email`: 200; `/dashboard` bez sesji: 302 do `/auth/signin`; baner „Supabase nie jest skonfigurowany” do czasu ustawienia sekretów.
- 2026-11-24: Supabase blokuje edycję szablonów maili bez własnego SMTP, a domyślny szablon zużywa kod przy otwarciu linku (sprzeczne z D16). Podpięty SMTP Gmaila (hasło aplikacji, `smtp.gmail.com:465`, nadawca „Trzy”); szablon z `supabase/templates/magic_link.html` w „Magic Link” i „Confirm signup”. Przy własnej domenie: przejście na Resend (tylko ustawienia Supabase).
- 2026-11-24: pierwsze logowanie nie działało: `SUPABASE_URL` zawierał `/rest/v1`, więc zapytania szły pod `/rest/v1/auth/v1/otp` (404 w logach Auth). Poprawne: sam adres projektu `https://<ref>.supabase.co`. Baner „nie skonfigurowany” zniknął mimo złej wartości, bo sprawdza tylko obecność zmiennej.
- 2026-11-24: logowanie magic linkiem na produkcji działa end-to-end (mail z Gmaila, „Otwórz Trzy” → „Tak, wchodzę” → zalogowany). Token API Cloudflare zrotowany; nowa wartość w sekretach GitHuba.
