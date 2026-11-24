# Handoff: stan projektu Trzy (2026-11-24)

Punkt startowy dla nowej sesji agenta. Czytaj razem z `AGENTS.md`, `context/foundation/` i `context/deployment/deploy-plan.md`. Aktualizuj przy każdej zmianie sesji; starsze wersje są w historii gita.

## Termin

Certyfikacja 6.12.2026 (decyzja D13). Wymagania obowiązkowe: kontrola dostępu, CRUD sensowny dla domeny, logika biznesowa, dokumenty kontekstowe, co najmniej jeden test z perspektywy użytkownika; mile widziany publiczny URL.

| Wymaganie                      | Stan                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| Kontrola dostępu               | ✅ magic link (FR-001), PR #8, #9                                                                |
| Dokumenty kontekstowe          | ✅ `prd.md`, `tech-stack.md`, `infrastructure.md`, `lessons.md`, `AGENTS.md`                     |
| Test z perspektywy użytkownika | ✅ `scripts/smoke.mjs` (12 kroków logowania) w CI                                                |
| Publiczny URL                  | 🟡 https://trzy.lukasz-boltryk.workers.dev działa, czeka na sekrety Supabase                     |
| **CRUD sensowny dla domeny**   | ❌ zrzuty i pozycje (FR-003–FR-013)                                                              |
| **Logika biznesowa**           | ❌ „Uporządkuj”: limit 3, twarde terminy, walidacja `source_text` (reguły 1, 4, 7 w `AGENTS.md`) |

## Kurs (lekcje)

- Moduł 1 (m1l1–m1l5): zrobione poza domknięciem wdrożenia z m1l5.
- Następne: **m2l1** `/10x-roadmap` → `context/foundation/roadmap.md`; **m2l2** `/10x-new` → `/10x-plan` → `/10x-plan-review` → `/10x-implement` dla pierwszego strumienia; **m2l3** `/10x-impl-review`.
- Materiały kursu nie są w repo (D14). W nowym kontenerze: `npx @przeprogramowani/10x-cli@latest get <lekcja> --course 10xdevs4 --tool claude-code --lang pl` (w sesji chmurowej z `NODE_USE_ENV_PROXY=1`), potem blok reguł z `CLAUDE.md` przenieść do `CLAUDE.local.md`, a `CLAUDE.md` przywrócić do `@AGENTS.md`. Logowanie CLI: `auth --method email` (magic link na maila autora).

## Otwarte PR i gałęzie

- **#11** `chore/infrastructure`: `infrastructure.md`. Gotowy do merge'a.
- **`feat/deploy`** (na #11): nazwa Workera `trzy`, job `deploy` w CI (po `ci` i `smoke`, tylko push do `main`), `context/deployment/deploy-plan.md` z dziennikiem, ten plik. Merge dopiero po ustawieniu sekretów GitHuba, inaczej job `deploy` padnie.

## Co czeka na autora (bramki ręczne)

Szczegóły i dokładne ścieżki w panelach: `context/deployment/deploy-plan.md`, sekcja B.

1. Supabase → Authentication → URL Configuration: Site URL i Redirect URL `https://trzy.lukasz-boltryk.workers.dev`.
2. Supabase → Email Templates „Magic Link” i „Confirm signup”: treść z `supabase/templates/magic_link.html`.
3. Cloudflare → Workers & Pages → `trzy` → Variables and Secrets: `SUPABASE_URL`, `SUPABASE_KEY` (klucz anon/publishable, nigdy `service_role`).
4. GitHub → Settings → Secrets → Actions: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.

Potem agent: weryfikacja produkcji (sekcja D planu), logowanie end-to-end mailem autora, merge `feat/deploy`, kontrola joba `deploy`.

## Środowisko sesji chmurowej

- Środowisko „Default”: dozwolone hosty `10x-toolkit-api.przeprogramowani.workers.dev` i `trzy.lukasz-boltryk.workers.dev`; token Cloudflare zapisany jako sekret sieciowy dla `api.cloudflare.com` (agent go nie widzi; wrangler z `CLOUDFLARE_API_TOKEN=proxy-injected` i `CLOUDFLARE_ACCOUNT_ID`).
- Node w CLI 10x i wrangler potrzebuje `NODE_USE_ENV_PROXY=1`, żeby przejść przez proxy.
- `gh pr create` nie działa (GraphQL zablokowany); PR przez `gh api repos/boltryk/Trzy/pulls`. Sesja nie może ponawiać jobów CI ani czytać sekretów Actions.
- Strony platform (vercel.com, fly.io itd.) są zablokowane; dokumentację Cloudflare czytać z `raw.githubusercontent.com/cloudflare/cloudflare-docs`.

## Tryb pracy z autorem

Autor chce rozumieć, co się dzieje (tryb nauki): plan w punktach do akceptacji przed zmianą, małe kroki z diffem i wyjaśnieniem, pytanie kontrolne po kroku, infografiki (strona „Mapa projektu Trzy” w artefaktach autora), przegląd PR przed merge'em. Commituj i wypychaj każdy krok na gałąź roboczą; merge robi autor.

## Ryzyka do pamiętania

- Wbudowana poczta Supabase: kilka maili na godzinę. Przed testerami własny SMTP.
- Plan Workers Paid jest wymagany (10 ms CPU na darmowym).
- RODO: brak polityki prywatności i decyzji o dozwolonych dostawcach modeli (OpenRouter) — przed pierwszym testerem.
- Supabase CLI w CI przypięty do 2.122.1; sekcja `[inbucket]` w `supabase/config.toml` do zamiany na `[local_smtp]` przy przejściu na v3.
