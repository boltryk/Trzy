# Dziennik decyzji

Format: decyzja, uzasadnienie, status (**ustalone** | **rekomendacja** | **otwarte**). Nowa zmiana kierunku = nowy wpis.

| # | Decyzja | Uzasadnienie | Status |
| --- | --- | --- | --- |
| D1 | Hosting: Cloudflare Workers + Supabase (region UE) | spełnia „wdrożenie na chmurę”, darmowe plany wystarczą na testy, secrets w ustawieniach platformy | ustalone |
| D2 | Hetzner dopiero, gdy będą potrzebne długo działające procesy; Mikrus odrzucony dla projektu zaliczeniowego | prostota i jednoznaczność „chmury” | ustalone |
| D3 | Stack ze startera kursu (Astro SSR + React) | gotowe auth, CI, testy i struktura pod skille kursu; zmiana kosztowałaby dni | ustalone |
| D4 | Adapter `AIProvider` (OpenRouter + Mock) | testy bez prawdziwego LLM, wymienialny dostawca | ustalone |
| D5 | Model danych oddziela `type` od `bucket`; dodane `is_hard`, `pick_count`, `day_key` | „odpisać dziś Michałowi” to jednocześnie `reply` i `today` | ustalone |
| D6 | Limit 3 w „Dzisiaj” egzekwowany w kodzie, niekonfigurowalny | obietnica produktu musi być testowalna | ustalone |
| D7 | Granica dnia 4:00 czasu lokalnego | praca po północy | rekomendacja |
| D8 | Reset dnia: niezrobione wracają do „Później” bez oznaczeń zaległości | brak winy | ustalone |
| D9 | PWA-lite (manifest, instalowalność); offline i push później | push na iPhonie jest zawodny; podstawowy bodziec to mail | rekomendacja |
| D10 | Poza MVP: kalendarz, godzina wyjścia, moduł ekranu, sport, integracje komunikatorów | cztery osobne problemy, ryzyko rozrostu | ustalone |
| D11 | Zasada zakresu: nowy pomysł trafia do NOT NOW | ochrona MVP | ustalone |
| D12 | Pozycjonowanie: „kiedy jest za dużo naraz”, ADHD jako kontekst projektowy, nie hasło | ryzyko wyrobu medycznego i danych szczególnych | rekomendacja |
| D13 | Termin certyfikacji: 6.12 | 4.11 nierealne (2 dni, repo ma tylko dokumentację); 10.01 zostaje jako zapas | ustalone |
| D14 | Żadne materiały kursu nie trafiają do publicznego repo: `.claude/skills/`, manifest CLI i `CLAUDE.local.md` (reguły lekcji) są w `.gitignore`; `10x get`/`sync` uruchamiamy z `--no-course-rules`, żeby CLI nie dopisywał reguł do `CLAUDE.md` | materiały płatne; przyjmujemy, że kurs nie pozwala ich udostępniać | ustalone |
| D15 | Zakres dodatkowy: „Nie ogarniam”, manifest PWA i „Do odpisania” jako nice-to-have po rdzeniu (po zielonym CI i wdrożeniu) | rozstrzygnięte w `/10x-shape` (FR-016–018 w `prd.md`) | ustalone |
