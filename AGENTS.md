# Trzy – zasady dla agentów kodujących

Trzy to asystent dnia: „Masz dziś trzy rzeczy. Reszta może poczekać.” Użytkownik wpisuje wszystko, co ma w głowie, AI proponuje podział, człowiek zatwierdza. Aplikacja jest projektowana z myślą o trudnościach wykonawczych (często związanych z ADHD). Nie diagnozuje i nie leczy.

Szczegóły produktu i decyzji: `context/research/` (punkt wejścia: `context/research/README.md`). Dokumenty bazowe kursu (`prd.md`, `tech-stack`, `roadmap`, `test-plan`) powstają w `context/foundation/` i mają pierwszeństwo przed notatkami z `research/`.

## Reguły, których nie wolno łamać

1. **Maksymalnie 3 pozycje w „Dzisiaj”. Egzekwuje to kod, nie prompt.** Limit nie jest konfigurowalny. Odpowiedź modelu z więcej niż 3 pozycjami jest obcinana lub odrzucana przez walidator.
2. **Brak winy.** Żadnych czerwonych znaczników, liczników zaległości, „X dni nieobecności”, streaków ani grywalizacji. Niezrobione pozycje wracają do „Później” po resecie dnia.
3. **AI proponuje, człowiek zatwierdza.** Nic nie jest zapisane ani wysłane bez potwierdzenia użytkownika.
4. **Odpowiedź modelu to dane niezaufane.** Walidacja schematu, potem reguły biznesowe, dopiero potem UI. Każda pozycja ma `source_text`, który musi występować w zrzucie użytkownika. Pozycja bez pokrycia w tekście jest odrzucana.
5. **Aplikacja działa bez LLM.** Przy błędzie, timeoucie lub niedostępności modelu użytkownik nie traci wpisanego tekstu i może ułożyć listy ręcznie.
6. **Prywatność.** Treść zrzutów nigdy nie trafia do logów ani narzędzi do śledzenia błędów. Do modelu idą tylko zrzut i tytuły z „Później”, bez e-maila i identyfikatorów. Użytkownik może usunąć wszystkie swoje dane jednym przyciskiem.
7. **Pozycja z twardym terminem (`is_hard`) nie spada do „Później” bez jawnego potwierdzenia.**

## Model danych (skrót)

`items`: type (`task` | `reply`), bucket (`today` | `later`), status (`active` | `done` | `dismissed` | `archived`), title, next_action, source_text, due_date, is_hard, pick_count, day_key. Typ sprawy jest oddzielony od horyzontu czasu. Granica dnia (`day_key`) to 4:00 czasu lokalnego (Europe/Warsaw). Każda tabela ma RLS `user_id = auth.uid()`.

## Stack (do potwierdzenia w tech-stack)

Astro SSR + React + TypeScript + Tailwind + shadcn/ui; Supabase (Auth + Postgres z RLS, region UE); Cloudflare Workers; OpenRouter za adapterem `AIProvider` (`OpenRouterProvider`, `MockProvider`); Vitest + Playwright; GitHub Actions. Testy nie wołają prawdziwego LLM.

## Poza zakresem

Wszystko z sekcji NOT NOW w `context/research/backlog.md` (integracje, powiadomienia push, kalendarz, godzina wyjścia, moduł ekranu, sport). Nowy pomysł trafia najpierw na tę listę, a nie do MVP.

## Praca z repozytorium

- Zmiany przez gałąź i PR, jeden temat na PR.
- Sekretów (klucze OpenRouter, Supabase `service_role`) nie wolno commitować. Mają być w ustawieniach Cloudflare i w `.env` poza repozytorium.
- Nie kopiuj materiałów kursu (skilli) do publicznego repozytorium bez sprawdzenia zasad kursu.
