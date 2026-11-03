---
project: "Trzy"
version: 1
status: draft
created: 2026-11-03
context_type: greenfield
product_type: web-app
target_scale:
  users: small
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 5
  hard_deadline: 2026-12-06
  after_hours_only: true
---

# PRD: Trzy

## Vision & Problem Statement

Pracujący dorosły, który porzucił co najmniej dwa task managery. Ból: Przytłoczenie i brak decyzji „czym zająć się teraz” — nie brak wiedzy, co zrobić. Moment: Rano, przed startem dnia (chaos w głowie, nie wiadomo od czego zacząć) oraz w ciągu dnia, gdy wpadają nowe sprawy i wybijają z rytmu. Koszt dziś: Zadania, wiadomości do odpisania i luźne pomysły rozproszone po notatkach, komunikatorach i głowie. Task managery wymagają kategorii, priorytetów i regularnego porządkowania; po kilku dniach przerwy użytkownik widzi stos zaległości i traci ochotę na powrót.

Wgląd: istniejące narzędzia (m.in. Goblin Tools, Tiimo, Todoist Ramble, Structured) wywołują u użytkownika poczucie winy — stos zaległości, liczniki, kary za przerwę. Trzy nie powoduje poczucia winy, a twardy limit trzech rzeczy na dziś jest cechą produktu, nie ograniczeniem: przytłoczonej osobie pomaga właśnie odebranie nadmiaru wyboru.

## User & Persona

Główna persona: pracujący dorosły, korzysta z telefonu, po polsku, porzucił co najmniej dwa task managery. Produkt projektowany z myślą o trudnościach wykonawczych (często związanych z ADHD), ale nie pyta o diagnozę ani jej nie przechowuje. Pierwszym użytkownikiem jest autor, następnie 5–10 testerów.

Sięga po produkt rano przed startem dnia oraz w ciągu dnia, gdy wpadają nowe sprawy.

## Success Criteria

### Primary
- Autor sam używa Trzy przez 2 tygodnie.

### Secondary
- Czas do wartości poniżej 60 sekund: od otwarcia aplikacji do zatwierdzonego planu dnia.
- Ludzie wracają po przerwie: tester po kilku dniach nieobecności wraca i układa nowy plan.

### Guardrails
- Nigdy więcej niż 3 pozycje w „Dzisiaj”, niezależnie od treści propozycji.
- Żadnej winy ani zaległości: brak liczników, czerwonych znaczników, streaków i komunikatów „X dni nieobecności”.
- Prywatność zrzutów: treść nie trafia do logów; do zewnętrznego przetwarzania propozycji nie trafia e-mail ani identyfikatory; użytkownik usuwa wszystkie swoje dane jednym przyciskiem.

## User Stories

### US-01: Użytkownik zamienia chaos w plan dnia

- **Given** zalogowany użytkownik z chaosem w głowie
- **When** wkleja zrzut i naciska „Uporządkuj”
- **Then** widzi do 3 rzeczy na dziś, każdą z pierwszym krokiem, oraz zwinięte „Później”, a po „Biorę to” plan jest zapisany

#### Acceptance Criteria
- „Dzisiaj” nigdy nie zawiera więcej niż 3 pozycji, nawet jeśli propozycja zawierała więcej.
- Przed „Biorę to” nic nie jest zapisane.
- Każda pozycja ma pierwszy krok.

## Functional Requirements

### Logowanie
- FR-001: Użytkownik może zalogować się magic linkiem wysłanym na e-mail. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-002: Użytkownik może widzieć i zmieniać wyłącznie własne dane. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.

### Zrzut
- FR-003: Użytkownik może wpisać lub wkleić zrzut w jedno pole na pierwszym ekranie, bez wybierania kategorii. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-004: Użytkownik może odzyskać niewysłany szkic zrzutu po utracie połączenia. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-005: Użytkownik może przeglądać, edytować i usuwać zapisane zrzuty. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.

### Propozycja
- FR-006: Użytkownik może poprosić o uporządkowanie zrzutu i otrzymać propozycję: do 3 rzeczy na dziś, każda z pierwszym krokiem, oraz pozostałe w „Później”. Priority: must-have
  > Socrates: Counter-argument considered: "3 to za dużo w zły dzień — czasem nawet trzy rzeczy przytłaczają." Resolution: limit 3 zostaje bez zmian; to argument za „Nie ogarniam” (FR-016), nie za zmianą limitu.
- FR-007: Użytkownik może przenosić pozycje między listami i zatwierdzić podział; przed zatwierdzeniem nic nie jest zapisane. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-008: Użytkownik może przenieść pozycję z twardym terminem do „Później” tylko po jawnym potwierdzeniu. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-009: Użytkownik może, gdy uporządkowanie automatyczne jest niedostępne, zapisać zrzut do ponowienia później i ręcznie dodać do 3 pozycji na dziś, bez utraty wpisanego tekstu. Priority: must-have
  > Socrates: Counter-argument considered: "pełny tryb ręczny to drugi produkt do zbudowania i testowania." Resolution: zawężone do zapisu zrzutu z ponowieniem później i ręcznego dodania do 3 pozycji na dziś.

### Dzisiaj
- FR-010: Użytkownik może odhaczyć zrobioną pozycję w „Dzisiaj” i zobaczyć łagodny sygnał ukończenia (bez liczników i grywalizacji). Priority: must-have
  > Socrates: Counter-argument considered: "odhaczenie bez żadnej reakcji jest płaskie." Resolution: dodany mały, łagodny sygnał ukończenia; nadal bez liczników, streaków i punktów.
- FR-011: Użytkownik może cofnąć ostatnią akcję. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-012: Użytkownik może zacząć nowy dzień z pustym „Dzisiaj”; niezrobione pozycje wracają do „Później” bez oznaczeń zaległości, a rozpoczęte wczoraj mogą zostać łagodnie zaproponowane do kontynuacji. Priority: must-have
  > Socrates: Counter-argument considered: "czysta kartka gubi rozpoczętą pracę." Resolution: dodana łagodna propozycja powrotu do rzeczy rozpoczętych wczoraj, bez wstydu i bez oznaczeń zaległości. Granica dnia 4:00 bez zmian.

### Później i prywatność
- FR-013: Użytkownik może przejrzeć „Później”, domyślnie zwinięte i bez licznika; pozycje są archiwizowane po 14 dniach. Priority: must-have
  > Socrates: Counter-argument considered: "14 dni to arbitralny próg." Resolution: 14 dni zostaje na MVP; próg trafia do Open Questions do weryfikacji na testerach.
- FR-014: Użytkownik może usunąć wszystkie swoje dane jednym przyciskiem, z jednym potwierdzeniem. Priority: must-have
  > Socrates: Counter-argument considered: "przypadkowe kliknięcie usuwa wszystko." Resolution: dodane jedno potwierdzenie, bez wieloetapowego procesu.
- FR-015: Użytkownik może przed pierwszym użyciem zobaczyć, jakie dane są przekazywane do zewnętrznego przetwarzania propozycji, i wyrazić zgodę. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.

### Zakres dodatkowy (po rdzeniu)
- FR-016: Użytkownik może wybrać „Nie ogarniam” i dostać jedną rzecz z jednym krokiem. Priority: nice-to-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-017: Użytkownik może zainstalować aplikację na telefonie. Priority: nice-to-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-018: Użytkownik może zobaczyć sekcję „Do odpisania” ze szkicem odpowiedzi. Priority: nice-to-have
  > Socrates: Counter-argument considered and rejected; it stands as written.

## Non-Functional Requirements

- Treść zrzutów nie jest dostępna w żadnych danych diagnostycznych ani narzędziach operatora; poza przetwarzaniem propozycji nie opuszcza ona przechowywania w regionie UE, a do przetwarzania nie trafia e-mail ani identyfikatory użytkownika.
- Pojedynczy zrzut ma najwyżej 5000 znaków, a liczba uporządkowań na użytkownika na dobę jest ograniczona; przekroczenie limitu daje czytelny komunikat, bez utraty wpisu.
- Wszystkie funkcje rdzenia są w pełni obsługiwalne na telefonie jedną ręką; interfejs jest po polsku.

## Business Logic

Z dowolnego zrzutu Trzy wybiera najwyżej 3 rzeczy na dziś, każdą z pierwszym krokiem, stawiając na początku twarde terminy na dziś lub jutro, a resztę odkłada do „Później” bez oznaczeń zaległości.

Dane wejściowe: swobodny tekst zrzutu wpisany przez użytkownika oraz tytuły pozycji, które już czekają w „Później” (do 30), żeby nie tworzyć duplikatów. Każda proponowana pozycja musi mieć pokrycie we fragmencie tekstu użytkownika; pozycja bez takiego pokrycia jest odrzucana, a „Dzisiaj” nigdy nie przekracza 3 pozycji, niezależnie od propozycji.

Wynik: propozycja planu dnia (do 3 pozycji z pierwszym krokiem) i lista „Później”. Użytkownik spotyka regułę po naciśnięciu „Uporządkuj” i zatwierdza ją jedną decyzją „Biorę to”. Reguła działa też w czasie: na granicy dnia (4:00 czasu lokalnego) niezrobione pozycje wracają do „Później”, a pozycja z twardym terminem nie trafia tam bez jawnego potwierdzenia.

## Access Control

Logowanie magic linkiem (e-mail, bez haseł). Płaski model użytkowników, bez ról. Każdy użytkownik widzi i zmienia wyłącznie własne dane; użytkownik A nie widzi danych użytkownika B. Niezalogowany użytkownik trafiający na chroniony ekran jest kierowany do logowania.

## Non-Goals

- Brak powiadomień push i natrętnych przypomnień — produkt nie naciska; ewentualny jeden łagodny bodziec zostaje jako pytanie otwarte.
- Brak streaków, punktów i grywalizacji — sprzeczne z zasadą braku winy.
- Brak integracji z kalendarzem, komunikatorami i pocztą — to osobne problemy, poza rdzeniem.
- Brak trybu offline-first (poza zachowaniem szkicu wpisu) — nie celujemy w pełne działanie bez sieci.
- Brak współdzielonych list i pracy zespołowej — jeden użytkownik na konto.

## Open Questions

1. **Czy archiwizacja „Później” po 14 dniach to właściwy próg?** — Owner: autor. Weryfikacja na testerach.
2. **Brak bodźca do powrotu (H4):** czy w MVP potrzebny jest jeden łagodny bodziec wybierany przez użytkownika (np. poranny mail), skoro push jest poza zakresem? — Owner: autor. Weryfikacja w 2. tygodniu użycia.
