# Lessons Learned

> Append-only register of recurring rules and patterns. Re-read at start by /10x-frame, /10x-research, /10x-plan, /10x-plan-review, /10x-implement, /10x-impl-review.

## Nie zmieniaj stanu przy otwarciu linku (GET)

- **Context**: Każdy link, który może otworzyć ktoś inny niż człowiek: maile, komunikatory, podglądy linków. W Trzy: magic link, „Biorę to”, odhaczanie, usuwanie danych.
- **Problem**: Link może zostać „zużyty” przez automaty, np. skanujące pocztę (decyzja D16: skaner zużywał jednorazowy kod magic linku, zanim zrobił to użytkownik).
- **Rule**: Nigdy nie zmieniaj stanu (logowanie, zapis, usunięcie, zużycie kodu) przy otwarciu adresu (`GET`). Otwarcie linku tylko pokazuje stronę, a akcję wykonuje dopiero `POST` po kliknięciu człowieka.
- **Applies to**: all

## Nazywaj każdy element interfejsu jego akcją

- **Context**: W każdym elemencie interfejsu.
- **Problem**: Źle nazwane kroki wprowadzały użytkownika w błąd: cztery razy „Zaloguj się” przy trzech różnych akcjach w przepływie magic linku (PR #8 → #9); po kliknięciu linku w mailu użytkownik nie wiedział, że musi jeszcze potwierdzić. Zauważyła to też Karolina.
- **Rule**: Zawsze napis na elemencie, niezależnie, czy to jest przycisk, czy nagłówek, etykieta/akcja, ma odpowiadać czynności z historyjki użytkownika i być dla niego czytelny. W jednym przepływie różne akcje nie mogą nosić tej samej nazwy.
- **Applies to**: all

## Przypinaj dokładne wersje narzędzi w CI

- **Context**: Konfiguracja CI (`.github/workflows/*.yml`) i każde miejsce, gdzie instalujemy narzędzie z wersją: akcje GitHuba, CLI (Supabase, wrangler), `npx <pakiet>@…`.
- **Problem**: W PR #5 `supabase/setup-cli` z `version: latest` pytało API GitHuba o najnowszą wersję, trafiło na limit zapytań i job `smoke` padł, zanim cokolwiek przetestował. Tego samego dnia wyszła wersja 3.0.0, więc `latest` mogło też bez ostrzeżenia zmienić zachowanie CI.
- **Rule**: Zawsze wpisuj dokładną wersję narzędzia (np. `2.122.1`) zamiast `latest`; wersję podnoś świadomie, osobnym PR, i sprawdzaj wynik w CI.
- **Applies to**: plan, implement, impl-review
