# Trzy – zasady dla agentów kodujących

Trzy to asystent dnia: „Masz dziś trzy rzeczy. Reszta może poczekać.” Użytkownik wpisuje wszystko, co ma w głowie, AI proponuje podział, człowiek zatwierdza. Aplikacja jest projektowana z myślą o trudnościach wykonawczych (często związanych z ADHD). Nie diagnozuje i nie leczy.

Źródła prawdy: `context/foundation/prd.md` (wymagania FR-001–FR-018) i `context/foundation/tech-stack.md`. Mają pierwszeństwo przed notatkami w `context/research/` (decyzje: `context/research/decisions.md`).

## Reguły, których nie wolno łamać

1. **Maksymalnie 3 pozycje w „Dzisiaj”. Egzekwuje to kod, nie prompt.** Limit nie jest konfigurowalny. Odpowiedź modelu z więcej niż 3 pozycjami jest obcinana lub odrzucana przez walidator.
2. **Brak winy.** Żadnych czerwonych znaczników, liczników zaległości, „X dni nieobecności”, streaków ani grywalizacji. Niezrobione pozycje wracają do „Później” po resecie dnia.
3. **AI proponuje, człowiek zatwierdza.** Nic nie jest zapisane ani wysłane bez potwierdzenia użytkownika.
4. **Odpowiedź modelu to dane niezaufane.** Walidacja schematu, potem reguły biznesowe, dopiero potem UI. Każda pozycja ma `source_text`, który musi występować w zrzucie użytkownika. Pozycja bez pokrycia w tekście jest odrzucana.
5. **Aplikacja działa bez LLM.** Przy błędzie, timeoucie lub niedostępności modelu użytkownik nie traci wpisanego tekstu i może ułożyć listy ręcznie.
6. **Prywatność.** Treść zrzutów nigdy nie trafia do logów ani narzędzi do śledzenia błędów. Do modelu idą tylko zrzut i tytuły z „Później”, bez e-maila i identyfikatorów. Użytkownik może usunąć wszystkie swoje dane jednym przyciskiem.
7. **Pozycja z twardym terminem (`is_hard`) nie spada do „Później” bez jawnego potwierdzenia.**

## Pułapki ze startera

- Logowanie w szkielecie to e-mail + hasło (`src/pages/api/auth/signin.ts`, `signup.ts`). PRD wymaga magic linku (FR-001) — nie rozbudowuj logowania hasłem.
- `wrangler.jsonc` ma włączone `observability`, więc każdy `console.*` w Workerze trafia do logów Cloudflare. Nigdy nie loguj treści zrzutu, propozycji ani odpowiedzi modelu (reguła 6).
- Zod importuj z `astro/zod`; `zod` nie jest bezpośrednią zależnością w `package.json`.

## Komendy

Node 26 (`.nvmrc`). `npm run dev` (serwer na :4321), `npm run lint`, `npx astro check`, `npm run build`, `npm run smoke` (test logowania na działającym serwerze, `BASE_URL`). Lokalny Supabase: `npx supabase start` (Docker). Pozostałe skrypty: `package.json`.

## Struktura i konwencje

- Strony i API w `src/pages/` (`api/` dla endpointów), logika i serwisy w `src/lib/`, komponenty UI shadcn w `src/components/ui/`, ochrona tras w `src/middleware.ts` (`PROTECTED_ROUTES`).
- Endpointy API: eksporty `GET`/`POST` wielkimi literami, `export const prerender = false`, walidacja wejścia schematem zod.
- Sekrety czytaj przez `astro:env/server`; nowe zmienne deklaruj w `env.schema` w `astro.config.mjs`. Lokalnie `.env` i `.dev.vars` (gitignorowane, wzór: `.env.example`).
- Migracje w `supabase/migrations/YYYYMMDDHHmmss_opis.sql`; każda nowa tabela ma RLS `user_id = auth.uid()`.
- Klasy Tailwind łącz przez `cn()` z `src/lib/utils.ts`.

## Model danych i stack

Model `items` (type oddzielony od bucket, `day_key` z granicą dnia 4:00 Europe/Warsaw): `context/research/idea-brief.md`. Warstwa AI za adapterem `AIProvider` (`OpenRouterProvider`, `MockProvider`); testy nie wołają prawdziwego LLM. Vitest i Playwright nie są jeszcze zainstalowane — dodaj je, zanim napiszesz pierwszy test.

## Poza zakresem

Wszystko z sekcji NOT NOW w `context/research/backlog.md` (integracje, powiadomienia push, kalendarz, godzina wyjścia, moduł ekranu, sport). Nowy pomysł trafia najpierw na tę listę, a nie do MVP.

## Praca z repozytorium

- Zmiany przez gałąź i PR do `main`, jeden temat na PR. CI (`.github/workflows/ci.yml`): lint, `astro check`, build oraz smoke na lokalnym Supabase — musi być zielone. Pre-commit (husky + lint-staged) uruchamia `eslint --fix` i `prettier`.
- Commity po polsku, w trybie rozkazującym, bez prefiksów typu `feat:` (np. „Popraw cel wdrożenia na Cloudflare Workers”).
- Sekretów (klucze OpenRouter, Supabase `service_role`) nie wolno commitować. Mają być w ustawieniach Cloudflare i w `.env` poza repozytorium.
- Materiały kursu (`.claude/skills/`, `.claude/prompts/`, `CLAUDE.local.md`) nigdy nie trafiają do repozytorium (decyzja D14); są w `.gitignore`.
