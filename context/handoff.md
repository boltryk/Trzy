# Handoff: stan projektu Trzy (2026-11-28)

Punkt startowy dla nowej sesji agenta. Czytaj razem z `CLAUDE.md` (tryb nauki), `AGENTS.md`, `context/foundation/` i `context/deployment/deploy-plan.md`. Aktualizuj przy każdej zmianie sesji; starsze wersje są w historii gita.

## Termin

Certyfikacja 6.12.2026 (decyzja D13), zostało 8 dni. Wymagania obowiązkowe: kontrola dostępu, CRUD sensowny dla domeny, logika biznesowa, dokumenty kontekstowe, co najmniej jeden test z perspektywy użytkownika; mile widziany publiczny URL.

| Wymaganie                      | Stan                                                                                             |
| ------------------------------ | ------------------------------------------------------------------------------------------------ |
| Kontrola dostępu               | ✅ magic link (FR-001), PR #8, #9                                                                |
| Dokumenty kontekstowe          | ✅ `prd.md`, `tech-stack.md`, `infrastructure.md`, `lessons.md` (4 lekcje), `AGENTS.md`          |
| Test z perspektywy użytkownika | ✅ `scripts/smoke.mjs` (12 kroków logowania) w CI                                                |
| Publiczny URL                  | ✅ https://trzy.lukasz-boltryk.workers.dev, auto-deploy po merge'u do `main`                     |
| **CRUD sensowny dla domeny**   | ❌ zrzuty i pozycje (FR-003–FR-013)                                                              |
| **Logika biznesowa**           | ❌ „Uporządkuj”: limit 3, twarde terminy, walidacja `source_text` (reguły 1, 4, 7 w `AGENTS.md`) |

## Kurs (lekcje)

- Moduł 1 (m1l1–m1l5) zamknięty. Z m1l4 zrobiony przegląd `/10x-rule-review` dla `AGENTS.md` (poprawki w #14).
- Następne: **m2l1** `/10x-roadmap` → `context/foundation/roadmap.md`, celem rdzeń MVP (zrzut → „Uporządkuj” → Dzisiaj); **m2l2** `/10x-new` → `/10x-plan` → `/10x-plan-review` → `/10x-implement` dla pierwszego strumienia; **m2l3** `/10x-impl-review`.
- Materiały kursu nie są w repo (D14). W nowym kontenerze, z `NODE_USE_ENV_PROXY=1`:
  1. `mkdir -p .claude` (bez tego `get` nie ma gdzie pisać),
  2. `npx @przeprogramowani/10x-cli@latest auth --method email --email <mail autora>`; autor klika link w mailu, sesja CLI ważna kilka godzin,
  3. `npx @przeprogramowani/10x-cli@latest get <lekcja> --course 10xdevs4 --tool claude-code --lang pl --no-course-rules`. Flaga `--no-course-rules` zostawia `CLAUDE.md` nietknięty; paczka zawiera skille wszystkich lekcji do wskazanej włącznie.

## Otwarte PR i gałęzie

Brak (poza tym PR-em). Ostatnie zmergowane: #13 lekcja nr 4, #14 `AGENTS.md`, #15 log kodu błędu Supabase, #16 tryb nauki w `CLAUDE.md`, #17 backlog `logSafeError` + formatowanie `backlog.md`.

## Wdrożenie (stan 2026-11-28)

- Job `deploy` działa: po merge'ach #13–#17 zakończony sukcesem (sprawdzone w Actions, przebieg dla #15). `/auth/signin` 200, `/dashboard` bez sesji 302 do `/auth/signin`.
- Do zrobienia (lekcja nr 4): potwierdzić na produkcji log z #15. `npx wrangler tail trzy`, kliknąć zużyty link, oczekiwane `auth.confirm.failed { code: "otp_expired", status: 403 }`, bez e-maila i tokenu. Wynik dopisać do dziennika w `deploy-plan.md`.
- Token Cloudflare w środowisku sesji wygasł po rotacji: do `wrangler tail` z sesji potrzebny nowy (formularz), albo autor uruchamia `tail` u siebie.

## Środowisko sesji chmurowej

- Sesja może startować z innym repozytorium (np. `boltryk/10x`). Trzy trzeba wtedy dołączyć z prawem zapisu (`add_repo`, `access: push`) i klonować do `/home/user/trzy`.
- Środowisko „Default”: dozwolone hosty `10x-toolkit-api.przeprogramowani.workers.dev` i `trzy.lukasz-boltryk.workers.dev`; sekret sieciowy dla `api.cloudflare.com` (wrangler z `CLOUDFLARE_API_TOKEN=proxy-injected` i `CLOUDFLARE_ACCOUNT_ID`).
- Node w CLI 10x i wrangler potrzebuje `NODE_USE_ENV_PROXY=1`, żeby przejść przez proxy.
- PR, CI i komentarze przez narzędzia GitHub MCP (`gh` działa tylko do wyszukiwania). Sesja nie może ponawiać jobów CI ani czytać sekretów Actions.
- Klon `--depth 1` śledzi tylko `main`: po pushu nowej gałęzi zrób `git fetch origin +refs/heads/<gałąź>:refs/remotes/origin/<gałąź>`, inaczej hook sesji zgłasza „niewypchnięty commit”.
- Pierwsza edycja pliku `.md`, który nie przeszedł przez prettiera, przeformatuje cały plik (lint-staged). Formatowanie dawaj osobnym commitem przed zmianą treści (jak w #17).
- Strony platform (vercel.com, fly.io itd.) są zablokowane; dokumentację Cloudflare czytać z `raw.githubusercontent.com/cloudflare/cloudflare-docs`.

## Tryb pracy z autorem

Obowiązują zasady z sekcji „Współpraca z autorem: tryb nauki” w `CLAUDE.md` (plan do akceptacji, małe kroki, pytanie kontrolne, schemat na stronie „Mapa projektu Trzy”, przegląd PR w porcjach, merge robi autor). Wszystko po polsku, bez wtrąceń po angielsku.

## Ryzyka do pamiętania

- Termin: rdzeń MVP (CRUD + „Uporządkuj”) nie jest rozpoczęty, a zostało 8 dni. Roadmapę ciąć do minimum spełniającego wymagania.
- RODO: brak polityki prywatności i decyzji o dozwolonych dostawcach modeli (OpenRouter) — przed pierwszym testerem.
- SMTP: Gmail z hasłem aplikacji; przy własnej domenie przejście na Resend (tylko ustawienia Supabase).
- Plan Workers Paid jest wymagany (10 ms CPU na darmowym).
- Supabase CLI w CI przypięty do 2.122.1; sekcja `[inbucket]` w `supabase/config.toml` do zamiany na `[local_smtp]` przy przejściu na v3.
