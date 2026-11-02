# Trzy – skrót niezależnego audytu (2026-10-21, uzupełniony 2026-11-02)

Pełna wersja audytu istnieje poza repozytorium. Poniżej wnioski użyteczne dla agenta i autora. Oznaczenia: **Fakt**, **Założenie**, **Hipoteza**, **Rekomendacja**.

## Werdykt
**Rekomendacja:** budować, ale węższy produkt niż w pierwotnym backlogu. Rdzeń (zrzut z głowy, maks. 3 rzeczy, czysta kartka) jest spójny. Poranne podsumowanie, kalendarz, godzina wyjścia, moduł ekranu i sport to osobne problemy, a nie rozwinięcie jednego.

## Cięcie zakresu
- **Obowiązkowe:** US-001 logowanie i RLS, US-002 + US-003 zrzut i propozycja AI z walidacją, US-004 „Dzisiaj” z resetem dnia, US-005 pamięć (zapis + tytuły z „Później” w prompcie), US-008 usuwanie danych, polityka prywatności i zgoda.
- **Dodatkowe, po zielonym CI i wdrożeniu:** US-006 „Nie ogarniam”, US-009 manifest PWA (bez service workera), US-007 „Do odpisania”.
- **Poza MVP:** US-120 godzina wyjścia i wszystko z sekcji NOT NOW.
- **Fakt (materiały kursu):** terminy certyfikacji to 4.11.2026 (z szansą na wyróżnienie), 6.12.2026 i 10.01.2027. Wcześniejsze założenie audytu o terminie około 1.11 było błędne; ocena „nie mieści się w 32 godzinach” dotyczyła tamtego założenia. Przy terminie 6.12 zakres dodatkowy jest realny, przy 4.11 nie.

## Czego krytycznie brakowało (dodane do zakresu)
1. „Później” domyślnie zwinięte, bez licznika, z archiwizacją po 14 dniach, żeby nie stało się nowym stosem zaległości.
2. Cofnięcie ostatniej akcji (pomyłkowe dotknięcie jedną ręką).
3. Limit długości zrzutu (5000 znaków) i limit wywołań AI na użytkownika na dobę.
4. Polityka prywatności i informacja o tym, co trafia do modelu, przed pierwszym testerem.

## Ryzyka
| Obszar | Problem | Rekomendacja | Priorytet |
| --- | --- | --- | --- |
| Prywatność LLM | zrzut zawiera dane wrażliwe, możliwe przekazanie poza EOG | lista dozwolonych dostawców bez retencji, brak treści w logach | Critical |
| Zakres MVP | zbyt duży względem czasu | zakres jak wyżej | Critical |
| „Później” | staje się nowym stosem zaległości | zwinięte, bez licznika, archiwizacja | High |
| Reset dnia | północ psuje „dzisiaj” osobom pracującym nocą | granica 4:00, pole `day_key` | High |
| Halucynacje | model może dopisać nieistniejące zadanie | `source_text` i sprawdzenie pokrycia | High |
| Koszty | otwarty endpoint AI | limity znaków i wywołań | High |
| Brak bodźca do powrotu | produkt nie ma przypomnień | jeden łagodny, wybierany przez użytkownika bodziec (poranny mail) i test w tygodniu 2 | High |

## Największe ryzyko, które trzeba nazwać
Produkt z założenia nie ma bodźca do powrotu. Osoba z problemami z inicjowaniem działań nie otworzy aplikacji, o której zapomniała. Bez jednego łagodnego bodźca test retencji pokaże brak bodźca, a nie wartość produktu (hipoteza H4).

## Konkurencja (stan na 2026-10-29, część danych niezweryfikowana)
Goblin Tools (Compiler, Magic ToDo), Tiimo (AI Co-Planner, plan wizualny), Todoist Ramble (głosowy zrzut), Structured (oś czasu, AI), Claude Duet (proaktywny agent, research preview w USA). Każdą pojedynczą funkcję ktoś już ma. Wyróżnikiem ma być połączenie twardego limitu, braku zaległości i polskiego języka bez konfiguracji. Cena i obsługa polskiego u części konkurentów nie była sprawdzana.

## Metryki i kryteria (progi arbitralne, do małej próby)
- North Star (hipoteza): „dni z ruszonym planem” na aktywnego użytkownika tygodniowo (zatwierdzony plan i co najmniej jedna odhaczona rzecz).
- **GO:** co najmniej 5 z 8 osób ma co najmniej 3 takie dni w tygodniu 2 oraz co najmniej 60% propozycji przyjętych z najwyżej jedną zmianą.
- **PIVOT:** ludzie wracają tylko do jednej części (np. szkice wiadomości lub „Nie ogarniam”).
- **STOP:** najwyżej 2 z 8 osób wraca w tygodniu 2 i w wywiadach pada „wystarczy mi ChatGPT” lub „zapomniałem o aplikacji”.

## Prawo (analiza produktowa, nie porada prawna)
Zrzut to swobodny tekst, więc będzie zawierał dane o zdrowiu i o innych osobach. Aplikacja nie pyta o diagnozę i jej nie zapisuje. Przekazanie do dostawców modeli poza EOG wymaga zapisu w polityce prywatności. Komunikacja mówi o organizacji dnia, nie o terapii ani leczeniu. Przed komercjalizacją potrzebna konsultacja z prawnikiem od RODO.
