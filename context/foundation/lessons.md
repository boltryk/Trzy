# Lessons Learned

> Append-only register of recurring rules and patterns. Re-read at start by /10x-frame, /10x-research, /10x-plan, /10x-plan-review, /10x-implement, /10x-impl-review.

## Nie zmieniaj stanu przy otwarciu linku (GET)

- **Context**: Każdy link, który może otworzyć ktoś inny niż człowiek: maile, komunikatory, podglądy linków. W Trzy: magic link, „Biorę to”, odhaczanie, usuwanie danych.
- **Problem**: Link może zostać „zużyty” przez automaty, np. skanujące pocztę (decyzja D16: skaner zużywał jednorazowy kod magic linku, zanim zrobił to użytkownik).
- **Rule**: Nigdy nie zmieniaj stanu (logowanie, zapis, usunięcie, zużycie kodu) przy otwarciu adresu (`GET`). Otwarcie linku tylko pokazuje stronę, a akcję wykonuje dopiero `POST` po kliknięciu człowieka.
- **Applies to**: all
