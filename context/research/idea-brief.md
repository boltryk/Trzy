# Trzy – idea brief (wejście dla /10x-shape)

Użycie: `/10x-shape @context/research/idea-brief.md`. Plik zawiera decyzje autora oraz oznaczone hipotezy. Luki zostają jako pytania otwarte, bez zgadywania.

## Pomysł w jednym zdaniu
Aplikacja, w której wpisujesz wszystko, co masz w głowie, a ona proponuje maksymalnie trzy rzeczy na dziś, bez karania za zaległości.

## Problem
Zadania, wiadomości do odpisania i luźne pomysły rozpraszają się po notatkach, komunikatorach i głowie. Klasyczne task managery wymagają kategorii, priorytetów i regularnego porządkowania. Po kilku dniach przerwy użytkownik widzi stos zaległości i traci ochotę na powrót. Główny problem to przytłoczenie i brak decyzji „czym zająć się teraz”, a nie brak wiedzy, co zrobić.

## Użytkownik (założenie)
Pracujący dorosły, który porzucił co najmniej dwa task managery, korzysta z telefonu, po polsku. Projekt jest tworzony z myślą o trudnościach wykonawczych, często związanych z ADHD, ale nie pyta o diagnozę ani jej nie przechowuje. Pierwszym użytkownikiem jest autor, potem 5–10 testerów.

## Główny przepływ (MVP)
1. Otwieram aplikację. Pole „Co masz teraz w głowie?” jest od razu aktywne.
2. Wpisuję lub wklejam chaos, naciskam „Uporządkuj”.
3. Widzę propozycję: do 3 rzeczy na dziś, każda z pierwszym krokiem, oraz zwinięte „Później”.
4. Jedna decyzja: „Biorę to”. Zamiana pozycji jest możliwa, ale nieobowiązkowa.
5. Widok „Dzisiaj”: odhaczam albo wybieram „Nie ogarniam” (jedna rzecz, jeden krok).
6. Następnego dnia „Dzisiaj” jest puste (czysta kartka). Niezrobione wracają do „Później”.

## Logika biznesowa (decyzje)
- „Dzisiaj” ma maksymalnie 3 pozycje. Limit wymusza kod, nie prompt, i nie jest konfigurowalny.
- Granica dnia to 4:00 czasu lokalnego (pole `day_key`). Przy pierwszym otwarciu nowego dnia niezrobione pozycje wracają do „Później” bez oznaczenia zaległości.
- Pozycja z twardym terminem (`is_hard`) na dziś lub jutro jest pierwsza w propozycji i nie spada do „Później” bez potwierdzenia.
- Model dzieli tekst na pozycje i proponuje podział; kod waliduje schemat i reguły. Każda pozycja ma `source_text`, który musi występować w zrzucie. Pozycje bez pokrycia są odrzucane.
- „Później” jest domyślnie zwinięte, bez licznika, z archiwizacją po 14 dniach (do potwierdzenia).
- Pamięć między dniami w MVP: zapis w bazie i przekazanie do promptu do 30 tytułów z „Później”, żeby uniknąć duplikatów.

## Model danych (skrót)
`items` (type `task|reply`, bucket `today|later`, status `active|done|dismissed|archived`, title, next_action, source_text, due_date, is_hard, pick_count, day_key), `dumps` (treść zrzutu), `ai_runs` (model, opóźnienie, tokeny, wynik walidacji, bez treści).

## Kontrola dostępu
Logowanie e-mailem lub magic link. RLS `user_id = auth.uid()` na każdej tabeli. Test: użytkownik A nie widzi danych użytkownika B.

## Obsługa błędów
Timeout LLM (np. 20 s), jedna ponowna próba, potem tryb ręczny. Użytkownik nigdy nie traci wpisanego tekstu.

## Poza zakresem (świadomie)
Streaki i grywalizacja, natrętne powiadomienia, body doubling, współpraca z psychologiem, integracje z komunikatorami, kalendarz, godzina wyjścia, moduł ekranu, sport. Szczegóły w `backlog.md` (NOT NOW).

## Hipotezy do sprawdzenia
H1 limit 3 zmniejsza przytłoczenie. H2 propozycja AI jest trafna (akceptacja z najwyżej jedną zmianą). H3 brak kar sprawia, że ludzie wracają po przerwie. H4 użytkownicy wracają bez przypomnień (najsłabsza hipoteza). H5 szkic wiadomości skraca czas do odpisania.

## Pytania otwarte
- Który termin certyfikacji: 4.11, 6.12 czy 10.01.2027? (patrz `decisions.md`)
- Czy „Do odpisania” i „Nie ogarniam” wchodzą do MVP?
- Archiwizacja „Później” po 14 dniach: czy to właściwa wartość?
- Które modele i dostawcy w OpenRouter są dozwoleni (brak retencji danych, brak trenowania)?
