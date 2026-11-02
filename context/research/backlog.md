# Backlog: Trzy (asystent dnia, rdzeń "ADHD-friendly" + dojazd + podsumowanie + ekran + sport)

Stan na 2026-10-21. Dokument roboczy w `context/research/`. Historyjki z oznaczeniem MVP wchodzą do projektu zaliczeniowego 10xDevs (10xBuilder). Reszta to backlog poza zakresem certyfikatu.

Hasło produktu: **"Masz dziś trzy rzeczy. Reszta może poczekać."**

> **Status po audycie (2026-11-02).** Zakres MVP został zawężony. Obowiązkowo: US-001, US-002 + US-003, US-004, US-005, US-008. Dodatkowo, po zielonym CI i wdrożeniu: US-006, US-009, US-007. US-120 (godzina wyjścia) i wszystko poniżej v1 jest poza MVP. Priorytety "MVP" przy US-006, US-007 i US-009 należy czytać jako "zakres dodatkowy". Terminy certyfikacji: 4.11, 6.12.2026 i 10.01.2027 (decyzja D13 w `decisions.md`). Skrót uzasadnienia: `audit-summary.md`.

## Format historyjki

`US-xxx | Jako [kto] chcę [co], żeby [po co] | Priorytet | Kryteria akceptacji`

Priorytety: **MVP** (projekt na certyfikat), **v1** (zaraz po kursie), **Później** (wymaga integracji lub weryfikacji popytu).

## Zasady produktu

- Zero konfiguracji na starcie. Użytkownik wkleja tekst i dostaje wynik. Czas do wartości poniżej 60 sekund.
- Brak wstydu: żadnych czerwonych liczników zaległości, nic nie wraca jako kara.
- Maksymalnie 3 rzeczy na "Dzisiaj". Limit jest opinią produktu i nie jest konfigurowalny.
- AI proponuje, człowiek zatwierdza. Nic nie jest zapisane ani wysłane bez potwierdzenia.
- Prywatność: użytkownik może usunąć wszystkie swoje dane jednym przyciskiem.
- Mobile-first (PWA), obsługa jedną ręką.
- Komunikacja: produkt jest zaprojektowany z myślą o trudnościach wykonawczych, często związanych z ADHD. Nie diagnozuje, nie leczy i nie ocenia nasilenia.
- **Zasada zakresu:** od teraz każdy nowy pomysł trafia do sekcji NOT NOW, a nie do MVP.

## Model danych (decyzja)

Typ sprawy jest oddzielony od czasu. W UI nadal są sekcje "Dzisiaj", "Później" i "Do odpisania", ale model nie utożsamia odpowiedzi z kubełkiem czasu.

```
ITEM
  type:      task | reply            (MVP; idea, reminder dopiero później)
  bucket:    today | later
  status:    active | done | dismissed
  due_date:  nullable
  is_hard:   boolean                 (twardy termin, nie spada do "Później" bez potwierdzenia)
  pick_count: integer                (ile razy wybrano do "Dzisiaj"; tylko zapis, bez logiki w MVP)
```

Sekcja "Do odpisania" w UI to pozycje typu `reply` ze statusem `active`, niezależnie od bucketu. Pozycja "odpisać dziś Michałowi" jest jednocześnie w "Dzisiaj" (bucket) i ma typ `reply`.

## Warstwa AI (decyzja)

- Interfejs `AIProvider`: `classifyBrainDump()`, `prioritizeItems()`, `draftReply()`, później `breakDownTask()`.
- Implementacje: `OpenRouterProvider`, `MockProvider` (testy). Inni dostawcy w przyszłości bez zmian w logice.
- Odpowiedź modelu to structured output: walidacja schematu, następnie walidacja reguł biznesowych (max 3, twarde terminy), dopiero potem UI.
- Gdy LLM jest niedostępny: aplikacja nadal pozwala zapisać dump i ręcznie ułożyć listy (graceful degradation).

## MVP (projekt zaliczeniowy)

Minimalne wymagania 10xBuilder: CRUD, co najmniej jedna funkcja z logiką biznesową, testy adresujące ryzyko z test-planu, autentykacja, wdrożenie na chmurę (Cloudflare + Supabase).

### US-001 | Logowanie i izolacja danych
Jako użytkownik chcę się zalogować i widzieć tylko swoje dane, żeby moje wpisy były prywatne.
**Priorytet:** MVP
**Kryteria akceptacji:**
- Rejestracja i logowanie e-mailem (lub magic link).
- Niezalogowany użytkownik jest przekierowany na ekran logowania.
- Użytkownik A nie widzi wpisów użytkownika B (RLS, sprawdzone testem).

### US-002 | Brain dump jednym polem
Jako użytkownik chcę wkleić lub wpisać wszystko, co mam w głowie, jednym polem, bez wybierania kategorii, żeby zapisanie nie wymagało wysiłku.
**Priorytet:** MVP
**Kryteria akceptacji:**
- Po zalogowaniu pole wpisu jest na pierwszym ekranie ("Co masz teraz w głowie?"), bez kroków konfiguracji i bez rozbudowanego onboardingu.
- Pusty wpis nie jest zapisywany.
- Szkic wpisu jest zachowywany lokalnie, jeśli zniknie połączenie.
- Zapisany dump jest widoczny na liście wpisów i można go edytować lub usunąć (CRUD).

### US-003 | AI sortuje dump na listy
Jako użytkownik chcę, żeby aplikacja podzieliła mój dump na "Dzisiaj", "Później" i "Do odpisania", a ja to zatwierdzam, żeby nie musieć sam planować od zera.
**Priorytet:** MVP (główna logika biznesowa)
**Kryteria akceptacji:**
- Wynik AI ma ustalony format (schemat walidowany po stronie aplikacji), a następnie przechodzi walidację reguł biznesowych.
- Do "Dzisiaj" trafiają maksymalnie 3 pozycje, nawet jeśli AI zaproponuje więcej (reguła wymuszana w kodzie, nie tylko w prompcie).
- Pozycje z twardym terminem (`is_hard`) nie trafiają do "Później" bez jawnego potwierdzenia użytkownika.
- Użytkownik może przenieść pozycję między listami i zatwierdzić podział; przed zatwierdzeniem nic nie jest zapisane.
- Każda pozycja ma proponowany pierwszy krok (`next_action`).
- Błędy: przy uszkodzonym JSON, przekroczeniu czasu odpowiedzi lub niedostępnym LLM użytkownik widzi czytelny komunikat, może spróbować ponownie albo ułożyć listy ręcznie.
**Przypadki testowe:** 0 pozycji, 1 pozycja, dump z 20 pozycjami, model zwraca 4 w "Dzisiaj", uszkodzony JSON, timeout, LLM niedostępny, pozycja z twardym terminem.

### US-004 | Widok "Dzisiaj" bez winy
Jako użytkownik chcę widzieć tylko to, co na dziś, bez licznika zaległości, żeby nie czuć się winny.
**Priorytet:** MVP
**Kryteria akceptacji:**
- Widok pokazuje max 3 pozycje i przycisk "gotowe".
- Przycisk "odłóż" przenosi pozycję do "Później" bez żadnego komunikatu o porażce.
- Nie ma czerwonych znaczników ani liczników przeterminowanych zadań.
- **Reset dnia:** przy pierwszym otwarciu nowego dnia (lub o północy) niezałatwione pozycje wracają do "Później", bez oznaczenia zaległości i bez licznika dni. `pick_count` rośnie przy każdym wyborze do "Dzisiaj", ale nie jest pokazywany użytkownikowi.
- Pozycje z `is_hard` i terminem na dziś lub jutro są oznaczone neutralnie, bez koloru ostrzegawczego.
- Pozytywne zamknięcie dnia, np. "Zrobiłeś dziś 2 rzeczy. Wystarczy.", bez streaków.

### US-005 | Pamięć między dniami
Jako użytkownik chcę, żeby wczorajsze wpisy nie znikały i były brane pod uwagę przy dzisiejszym sortowaniu, żeby nie zaczynać od zera.
**Priorytet:** MVP
**Kryteria akceptacji:**
- Wpisy i listy są zapisane w bazie i dostępne po ponownym zalogowaniu.
- Przy nowym dumpie AI dostaje pozycje z "Później", żeby nie dublować zadań.

### US-006 | Tryb ratunkowy ("Nie ogarniam")
Jako użytkownik w złym momencie chcę jednego przycisku, który pokaże mi tylko jedną rzecz do zrobienia, żeby móc zacząć.
**Priorytet:** MVP
**Kryteria akceptacji:**
- Przycisk "Nie ogarniam" jest zawsze widoczny.
- Po kliknięciu nie otwiera się menu: ekran pokazuje jedną pozycję i jej pierwszy krok oraz dwie akcje: "zrobione" i "inna".
- Po "zrobione" aplikacja pyta: "Jeszcze jedną rzecz czy kończymy na dziś?".
- Wyjście z trybu przywraca zwykły widok bez zmiany danych.

### US-007 | "Do odpisania" + szkic wiadomości
Jako użytkownik chcę przy osobach, którym zalegam z odpowiedzią, dostać krótki, życzliwy szkic wiadomości na ponowne otwarcie rozmowy, żeby nie unikać odpisania przez wstyd.
**Priorytet:** MVP
**Kryteria akceptacji:**
- Pozycje typu `reply` trafiają na osobną listę z imieniem lub nazwą osoby.
- Użytkownik może wygenerować szkic jednym kliknięciem, edytować go i skopiować ("Kopiuj", "Edytuj", "Gotowe").
- Aplikacja niczego sama nie wysyła i nie integruje się z komunikatorami.

### US-008 | Usunięcie wszystkich danych
Jako użytkownik chcę jednym przyciskiem usunąć wszystkie swoje dane, żeby mieć kontrolę nad prywatnością.
**Priorytet:** MVP
**Kryteria akceptacji:**
- Przycisk w ustawieniach z potwierdzeniem.
- Po usunięciu wpisy i listy użytkownika nie są dostępne.
- Aplikacja nie zbiera telemetrii poza niezbędnymi logami błędów.

### US-009 | PWA-lite (mobile-first)
Jako użytkownik chcę dodać aplikację do ekranu głównego telefonu i otwierać ją jak zwykłą aplikację, żeby każde otwarcie było jak najkrótsze.
**Priorytet:** MVP (jeśli zabraknie czasu: tylko responsywność)
**Kryteria akceptacji:**
- Manifest i ikony, aplikacja instalowalna, uruchamia się w trybie pełnoekranowym.
- Układ zaprojektowany najpierw pod telefon i obsługę jedną ręką.
- Poza zakresem MVP: tryb offline z synchronizacją i push (patrz v1).

### Wymogi niefunkcjonalne MVP
- Adapter `AIProvider` z mockiem; testy nie wołają prawdziwego LLM.
- Sekrety w ustawieniach Cloudflare, nie w repo.
- Supabase w regionie EU.
- Pierwszy deploy na Cloudflare zanim powstanie logika (sprawdzenie limitów Workers).

## v1 (po kursie)

### US-101 | Pierwszy krok z krótkim timerem
Jako użytkownik chcę przy wybranym zadaniu zobaczyć jeden pierwszy krok i timer (np. 2-5 minut), żeby łatwiej zacząć.
**Priorytet:** v1
**Kryteria:** krok proponuje AI i można go edytować; po czasie pytanie "kontynuować czy odłożyć?" bez oceniania.

### US-102 | Zapytaj swój dump
Jako użytkownik chcę zadać pytanie typu "kiedy obiecałem komuś zadzwonić?" i dostać odpowiedź z moich wpisów, żeby odzyskać to, o czym zapomniałem.
**Priorytet:** v1
**Kryteria:** odpowiedź wskazuje wpis źródłowy; gdy nie ma danych, aplikacja mówi to wprost zamiast zgadywać.

### US-103 | Dzienny mail z trzema rzeczami
Jako użytkownik chcę dostawać rano krótką wiadomość z moimi trzema rzeczami na dziś, żeby nie musieć pamiętać o otwarciu aplikacji.
**Priorytet:** v1
**Kryteria:** godzina wysyłki ustawiana przez użytkownika; wyłączenie jednym kliknięciem; wiadomość zawiera link do widoku "Dzisiaj". To podstawowy kanał przypomnień, bo push w PWA na iPhonie jest zawodny.

### US-104 | Poranne podsumowanie dnia
Jako użytkownik chcę rano dostać jedno podsumowanie: zadania, kalendarz, dojazd, pogodę i to, co spakować, żeby zacząć dzień bez sprawdzania pięciu aplikacji.
**Priorytet:** v1
**Kryteria akceptacji:**
- Zawiera trzy rzeczy z "Dzisiaj" oraz wydarzenia z kalendarza na dziś.
- Zawiera pogodę dla lokalizacji użytkownika na kluczowe godziny dnia.
- Zawiera "co spakować" wyprowadzone z pogody i kalendarza; to sugestia, którą użytkownik może edytować.
- Gdy któregoś źródła brakuje, podsumowanie pokazuje resztę i mówi, czego nie udało się pobrać.

### US-106 | Połączenie z Google Calendar
Jako użytkownik chcę połączyć kalendarz Google, żeby aplikacja znała moje wydarzenia. To pierwsza ważna integracja v1.
**Priorytet:** v1
**Kryteria:** dostęp tylko do odczytu na start; użytkownik widzi, które kalendarze są użyte; można odłączyć jednym kliknięciem. Wpływ na plan dnia: przy napiętym kalendarzu aplikacja proponuje mniejsze zadania.

### US-107 | Wybór domyślnego kalendarza i brak duplikatów
Jako użytkownik z kilkoma kontami i kalendarzami chcę wskazać, do którego kalendarza aplikacja ma dodawać wydarzenia, żeby nic nie trafiało w złe miejsce ani nie dublowało się.
**Priorytet:** v1
**Kryteria:** przed pierwszym zapisem aplikacja pyta, który kalendarz jest domyślny; przed dodaniem sprawdza, czy podobne wydarzenie już nie istnieje; po dodaniu pokazuje, gdzie trafiło.

### US-108 | Planowanie dnia z ustalonych bloków
Jako użytkownik chcę podać kilka rzeczy na jutro (np. lekcja, granie, wyjście), a aplikacja ułoży z nich plan z przerwami i doda do kalendarza po mojej akceptacji.
**Priorytet:** v1
**Kryteria:** czas trwania bloków można zmienić przed zatwierdzeniem; aplikacja zostawia bufor na dojazd; nic nie jest dodane bez zatwierdzenia.

### US-109 | Cichy tygodniowy przegląd
Jako użytkownik chcę raz w tygodniu krótkie, spokojne podsumowanie tego, co zrobiłem, bez oceniania, żeby widzieć postęp.
**Priorytet:** v1
**Kryteria:** pokazuje liczbę zrobionych rzeczy, nie zaległości; można wyłączyć.

### US-110 | Zablokowane pozycje (sygnał "utknęło")
Jako użytkownik chcę, żeby aplikacja zauważyła, że jakaś sprawa była wybierana kilka razy i nie została zrobiona, i zaproponowała jej rozbicie, odłożenie lub wyrzucenie, żeby nie wracała w kółko.
**Priorytet:** v1
**Kryteria:** wykorzystuje `pick_count`; komunikat neutralny i nieoceniający ("To wygląda na rzecz, która utknęła. Rozbić na mniejszy krok, odłożyć czy usunąć?"); użytkownik zawsze decyduje.

### Czas wyjścia na wydarzenie (grupa US-120+)

Problem: trudno wyjść i dojechać na czas, bo łatwo zaniżyć czas dojazdu i przygotowań. Aplikacja liczy od tyłu: czas wydarzenia, minus dojazd, minus bufor, minus przygotowania.

#### US-120 | Godzina wyjścia z podanych danych (Etap 0)
Jako użytkownik chcę podać godzinę wydarzenia, czas dojazdu i czas przygotowań, a aplikacja ma policzyć godzinę wyjścia z buforem.
**Priorytet:** v1 (opcjonalnie MVP, jeśli zostanie czas; czysta logika bez zewnętrznych API)
**Kryteria:** wynik pokazuje "wyjdź o HH:MM, zacznij szykować się o HH:MM"; bufor domyślny jest widoczny i możliwy do zmiany; testy: północ, strefy czasowe, brak danych, dojazd dłuższy niż czas do wydarzenia.

#### US-121 | Dojazd z API tras (Etap 1)
Jako użytkownik chcę, żeby aplikacja sama obliczyła czas przejazdu do miejsca wydarzenia z kalendarza.
**Priorytet:** v1 (po US-106)
**Kryteria:** środek transportu do wyboru (rower, pieszo, komunikacja, auto); lokalizacja startowa to adres domowy lub ostatnie znane miejsce, ustawiane przez użytkownika; przy niepewnym czasie aplikacja mówi to wprost; dane lokalizacji są objęte funkcją "usuń wszystkie dane".

#### US-122 | Wydarzenie "Wyjście" z alarmem w kalendarzu
Jako użytkownik chcę, żeby godzina wyjścia pojawiła się w kalendarzu jako osobne wydarzenie z alarmem, żeby telefon przypomniał mi niezależnie od aplikacji.
**Priorytet:** v1 (wymaga uprawnień do zapisu w kalendarzu i US-107)
**Kryteria:** zapis dopiero po akceptacji; brak duplikatów; wyraźna informacja, do którego kalendarza trafiło.

#### US-123 | Łańcuch przypomnień od końca (Etap 2)
Jako użytkownik chcę serię przypomnień: kiedy zacząć się szykować i kiedy wyjść, żeby nie liczyć czasu w głowie.
**Priorytet:** Później
**Kryteria:** korekta według ruchu na żywo; osobisty bufor uczony na podstawie wcześniejszych wyjść; kanał powiadomień zgodny z US-103 i US-122.

### Moduł ekranu (grupa US-130+)

Idea: oprócz aktywnego asystenta na telefonie, widok poglądowy "Dzisiaj" na tablecie lub ekranie e-ink, który nie wymaga interakcji.

#### US-130 | Widok ekranu tylko do odczytu
Jako użytkownik chcę mieć osobny, uproszczony widok na tablecie, który pokazuje trzy rzeczy na dziś, godzinę wyjścia i pogodę, żebym widział plan bez otwierania telefonu.
**Priorytet:** Później (po US-104 i US-120)
**Kryteria:** osobna trasa w tej samej aplikacji, bez elementów edycji, duże litery, wysoki kontrast; odświeżanie co kilka minut; prosty tryb dla e-ink (bez animacji, ograniczona paleta, mało odświeżeń).

#### US-131 | Dostęp ekranu bez logowania
Jako użytkownik chcę bezpiecznie połączyć ekran z kontem, mimo że ekran e-ink lub tablet nie ma wygodnej klawiatury.
**Priorytet:** Później
**Kryteria:** link z tokenem lub kod parowania; token można unieważnić jednym kliknięciem; widok pokazuje tylko to, co użytkownik zgodzi się wyświetlać (prywatność, np. ukrywanie imion w "Do odpisania").
**Pytanie otwarte:** token w URL a kod parowania, oraz czy ekran ma pokazywać szczegóły z kalendarza.

## Później (wymaga integracji lub weryfikacji popytu)

### US-201 | Ulubione drużyny i zawodnicy
Jako kibic chcę wskazać ulubione drużyny i zawodniczki/zawodników (np. wybrany klub piłkarski), żeby aplikacja śledziła je dla mnie.
**Priorytet:** Później
**Kryteria:** użytkownik może dodać i usunąć obserwowane drużyny; lista nie wymaga konta w serwisach sportowych.

### US-202 | Wyniki i przypomnienia o meczach
Jako kibic chcę dostawać wyniki ulubionych drużyn i przypomnienie przed meczem, żeby niczego nie przegapić.
**Priorytet:** Później
**Kryteria:** przypomnienie przed meczem o ustawionej godzinie; wynik po meczu w porannym podsumowaniu; gdy dane są niedostępne, aplikacja to mówi.

### US-203 | Gdzie jest transmisja
Jako kibic chcę widzieć, gdzie obejrzeć mecz (kanał lub platforma), żeby nie szukać.
**Priorytet:** Później
**Kryteria:** informacja o transmisji pokazuje źródło danych; przy braku danych brak informacji zamiast zgadywania.
**Uwaga:** dane o transmisjach w Polsce bywają trudne do uzyskania; trzeba sprawdzić dostępne API i licencje.

### US-204 | Wejście głosowe
Jako użytkownik chcę nagrać brain dump głosem, żeby zapisać myśli szybciej niż pisząc.
**Priorytet:** Później

### US-205 | Kontekstowe przypomnienia
Jako użytkownik chcę przypomnień zależnych od miejsca lub zdarzenia (np. "gdy będę w sklepie"), nie tylko od godziny.
**Priorytet:** Później
**Uwaga:** wymaga PWA z uprawnieniami lokalizacji lub aplikacji mobilnej.

### US-206 | Lista zakupów
Jako użytkownik chcę, żeby zakupy z dumpu trafiały na osobną listę, żeby nie mieszały się z zadaniami.
**Priorytet:** Później

### US-207 | Tryb offline z synchronizacją i push
Jako użytkownik chcę, żeby aplikacja działała bez zasięgu i mogła wysyłać powiadomienia push.
**Priorytet:** Później
**Uwaga:** push na iPhonie działa tylko w zainstalowanej PWA (iOS 16.4+) i jest zawodny; kanałem podstawowym zostaje mail (US-103) i wydarzenia kalendarza (US-122).

## NOT NOW (poza MVP, nowe pomysły lądują tutaj)

- Typy `idea` i `reminder` w modelu danych.
- Logika AI na `pick_count` (w MVP tylko zapis licznika).
- Integracje z komunikatorami (WhatsApp, Messenger, SMS).
- Integracje z kalendarzem, pogodą, trasami, sportem.
- Analityka retencji (North Star, W1/W2/W4). W MVP wystarczą metryki na sobie.
- Moduł ekranu (e-ink, tablet).
- Zmiana stacku (Astro zostaje, bo to starter kursu).

## Poza zakresem (świadomie nie robimy)

- Body doubling i dobieranie partnerów (słabe dowody, problem płynności rynku).
- Współpraca z psychologiem (brak potwierdzonego popytu, dane wrażliwe).
- Streaki i rozbudowana gamifikacja (źródła są sprzeczne; decyzja po teście na sobie).
- Natrętne, eskalujące powiadomienia.
- Wykrywanie aktywności i zakładek w przeglądarce.
- Diagnozowanie, leczenie lub ocenianie nasilenia ADHD.

## Otwarte pytania

1. Termin Demo Day i okno certyfikacji w edycji 4.0 (pytanie do supportu lub Q&A kursu).
2. Czy w MVP w ogóle dotykamy kalendarza? (rekomendacja: nie, dopiero v1)
3. Które API pogodowe, tras i sportowe wchodzą w grę i jaki jest ich koszt? (do sprawdzenia przed v1)
4. Czy zostajemy przy streakach w ogóle? (decyzja po tygodniu używania na sobie; rekomendacja: nie)
5. Limity Cloudflare Workers (czas CPU, kompatybilność z Node) i działanie service workera w Astro. (do zmierzenia przy pierwszym deployu)
6. Moduł ekranu: token w URL czy kod parowania; jakie dane wolno pokazywać.

## Metryki do weryfikacji na sobie

1. Czas od otwarcia aplikacji do pierwszego zapisanego dumpu (cel: poniżej 30 sekund).
2. Czy po 7 dniach bez przypomnień nadal ją otwierasz.
3. Ile pozycji z "Do odpisania" faktycznie wysłałeś.
