---
project: "Trzy"
context_type: greenfield
created: 2026-11-02
updated: 2026-11-02
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: "context type"
      decision: "greenfield — repo zawiera tylko dokumentację, brak kodu"
    - topic: "pain moment"
      decision: "rano przed startem dnia oraz w ciągu dnia, gdy wpadają nowe sprawy"
    - topic: "insight"
      decision: "brak poczucia winy u użytkownika + twardy limit 3 jako cecha produktu"
    - topic: "primary persona scope"
      decision: "autor jako pierwszy użytkownik, potem 5–10 testerów"
    - topic: "auth strategy"
      decision: "magic link (bez haseł); płaski model, bez ról"
    - topic: "first flow"
      decision: "przepływ z briefu kroki 1–6, w kroku 5 tylko odhaczanie; „Nie ogarniam” poza rdzeniem"
    - topic: "timeline"
      decision: "5 tygodni do 6.12; użytkownik zaakceptował koszt stałego wysiłku"
    - topic: "D15 extra scope"
      decision: "„Nie ogarniam”, manifest PWA i „Do odpisania” planowane po rdzeniu (po zielonym CI i wdrożeniu), jako nice-to-have"
    - topic: "primary success"
      decision: "autor sam używa Trzy przez 2 tygodnie"
  frs_drafted: 18
  quality_check_status: accepted
---

# Shape notes: Trzy

Zalążek: `context/research/idea-brief.md` — „Aplikacja, w której wpisujesz wszystko, co masz w głowie, a ona proponuje maksymalnie trzy rzeczy na dziś, bez karania za zaległości.”

## Vision & Problem Statement

```
Pain:        Przytłoczenie i brak decyzji „czym zająć się teraz” — nie brak wiedzy, co zrobić.
Person:      Pracujący dorosły, który porzucił co najmniej dwa task managery.
Moment:      Rano, przed startem dnia (chaos w głowie, nie wiadomo od czego zacząć)
             oraz w ciągu dnia, gdy wpadają nowe sprawy i wybijają z rytmu.
Cost today:  Zadania, wiadomości do odpisania i luźne pomysły rozproszone po notatkach,
             komunikatorach i głowie. Task managery wymagają kategorii, priorytetów
             i regularnego porządkowania; po kilku dniach przerwy użytkownik widzi stos
             zaległości i traci ochotę na powrót.
```

Wgląd: istniejące narzędzia (m.in. Goblin Tools, Tiimo, Todoist Ramble, Structured) wywołują u użytkownika poczucie winy — stos zaległości, liczniki, kary za przerwę. Trzy nie powoduje poczucia winy, a twardy limit trzech rzeczy na dziś jest cechą produktu, nie ograniczeniem: przytłoczonej osobie pomaga właśnie odebranie nadmiaru wyboru.

## User & Persona

Główna persona: pracujący dorosły, korzysta z telefonu, po polsku, porzucił co najmniej dwa task managery. Produkt projektowany z myślą o trudnościach wykonawczych (często związanych z ADHD), ale nie pyta o diagnozę ani jej nie przechowuje. Pierwszym użytkownikiem jest autor, następnie 5–10 testerów.

Sięga po produkt rano przed startem dnia oraz w ciągu dnia, gdy wpadają nowe sprawy.

## Access Control

Logowanie magic linkiem (e-mail, bez haseł). Płaski model użytkowników, bez ról. Każdy użytkownik widzi i zmienia wyłącznie własne dane; użytkownik A nie widzi danych użytkownika B. Niezalogowany użytkownik trafiający na chroniony ekran jest kierowany do logowania.

## MVP flow (draft)

1. Użytkownik otwiera aplikację; pole „Co masz teraz w głowie?” jest od razu aktywne.
2. Wpisuje lub wkleja chaos i naciska „Uporządkuj”.
3. Widzi propozycję: do 3 rzeczy na dziś, każda z pierwszym krokiem, oraz zwinięte „Później”.
4. Jedna decyzja: „Biorę to” (zamiana pozycji możliwa, nieobowiązkowa).
5. W widoku „Dzisiaj” odhacza zrobione rzeczy.
6. Następnego dnia „Dzisiaj” jest puste (czysta kartka); niezrobione wróciły do „Później”.

Zakres dodatkowy po rdzeniu (po zielonym CI i wdrożeniu): „Nie ogarniam”, manifest PWA, „Do odpisania”.

## Success Criteria

### Primary
- Autor sam używa Trzy przez 2 tygodnie.

### Secondary
- Czas do wartości poniżej 60 sekund: od otwarcia aplikacji do zatwierdzonego planu dnia.
- Ludzie wracają po przerwie: tester po kilku dniach nieobecności wraca i układa nowy plan.

### Guardrails
- Nigdy więcej niż 3 pozycje w „Dzisiaj”, niezależnie od tego, co zaproponuje model.
- Żadnej winy ani zaległości: brak liczników, czerwonych znaczników, streaków i komunikatów „X dni nieobecności”.
- Prywatność zrzutów: treść nie trafia do logów; do modelu nie trafia e-mail ani identyfikatory; użytkownik usuwa wszystkie swoje dane jednym przyciskiem.

## Product framing

```yaml
product_type: web-app
target_scale:
  users: small
  qps: low
  data_volume: small
```

## Timeline budget

```yaml
timeline_budget:
  mvp_weeks: 5
  hard_deadline: 2026-12-06
  after_hours_only: true
```

## Timeline acknowledgment

Acknowledged on 2026-11-02: 5-week MVP requires sustained dedication; user accepted. Twardy termin: 2026-12-06.

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
- FR-015: Użytkownik może przed pierwszym użyciem zobaczyć, co trafia do modelu, i wyrazić zgodę. Priority: must-have
  > Socrates: Counter-argument considered and rejected; it stands as written.

### Zakres dodatkowy (po rdzeniu)
- FR-016: Użytkownik może wybrać „Nie ogarniam” i dostać jedną rzecz z jednym krokiem. Priority: nice-to-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-017: Użytkownik może zainstalować aplikację na telefonie. Priority: nice-to-have
  > Socrates: Counter-argument considered and rejected; it stands as written.
- FR-018: Użytkownik może zobaczyć sekcję „Do odpisania” ze szkicem odpowiedzi. Priority: nice-to-have
  > Socrates: Counter-argument considered and rejected; it stands as written.

## User Stories

### US-01: Użytkownik zamienia chaos w plan dnia

- **Given** zalogowany użytkownik z chaosem w głowie
- **When** wkleja zrzut i naciska „Uporządkuj”
- **Then** widzi do 3 rzeczy na dziś, każdą z pierwszym krokiem, oraz zwinięte „Później”, a po „Biorę to” plan jest zapisany

#### Acceptance Criteria
- „Dzisiaj” nigdy nie zawiera więcej niż 3 pozycji, nawet jeśli propozycja zawierała więcej.
- Przed „Biorę to” nic nie jest zapisane.
- Każda pozycja ma pierwszy krok.

## Business Logic

Z dowolnego zrzutu Trzy wybiera najwyżej 3 rzeczy na dziś, każdą z pierwszym krokiem, stawiając na początku twarde terminy na dziś lub jutro, a resztę odkłada do „Później” bez oznaczeń zaległości.

Dane wejściowe: swobodny tekst zrzutu wpisany przez użytkownika oraz tytuły pozycji, które już czekają w „Później” (do 30), żeby nie tworzyć duplikatów. Każda proponowana pozycja musi mieć pokrycie we fragmencie tekstu użytkownika; pozycja bez takiego pokrycia jest odrzucana, a „Dzisiaj” nigdy nie przekracza 3 pozycji, niezależnie od propozycji.

Wynik: propozycja planu dnia (do 3 pozycji z pierwszym krokiem) i lista „Później”. Użytkownik spotyka regułę po naciśnięciu „Uporządkuj” i zatwierdza ją jedną decyzją „Biorę to”. Reguła działa też w czasie: na granicy dnia (4:00 czasu lokalnego) niezrobione pozycje wracają do „Później”, a pozycja z twardym terminem nie trafia tam bez jawnego potwierdzenia.

## Non-Functional Requirements

- Treść zrzutów nie jest dostępna w żadnych danych diagnostycznych ani narzędziach operatora; poza przetwarzaniem propozycji nie opuszcza ona przechowywania w regionie UE, a do przetwarzania nie trafia e-mail ani identyfikatory użytkownika.
- Pojedynczy zrzut ma najwyżej 5000 znaków, a liczba uporządkowań na użytkownika na dobę jest ograniczona; przekroczenie limitu daje czytelny komunikat, bez utraty wpisu.
- Wszystkie funkcje rdzenia są w pełni obsługiwalne na telefonie jedną ręką; interfejs jest po polsku.

## Non-Goals

- Brak powiadomień push i natrętnych przypomnień — produkt nie naciska; ewentualny jeden łagodny bodziec zostaje jako pytanie otwarte.
- Brak streaków, punktów i grywalizacji — sprzeczne z zasadą braku winy.
- Brak integracji z kalendarzem, komunikatorami i pocztą — to osobne problemy, poza rdzeniem.
- Brak trybu offline-first (poza zachowaniem szkicu wpisu) — nie celujemy w pełne działanie bez sieci.
- Brak współdzielonych list i pracy zespołowej — jeden użytkownik na konto.

## Open Questions

1. **Czy archiwizacja „Później” po 14 dniach to właściwy próg?** — Owner: autor. Weryfikacja na testerach.
2. **Brak bodźca do powrotu (H4):** czy w MVP potrzebny jest jeden łagodny bodziec wybierany przez użytkownika (np. poranny mail), skoro push jest poza zakresem? — Owner: autor. Weryfikacja w 2. tygodniu użycia.

## Forward: tech-stack

Informacyjne, nie jest częścią PRD. Z `AGENTS.md` i `context/research/decisions.md` (D1–D4): Astro SSR + React + TypeScript + Tailwind + shadcn/ui; Supabase (Auth + Postgres z RLS, region UE); Cloudflare Workers; OpenRouter za adapterem `AIProvider` (`OpenRouterProvider`, `MockProvider`); Vitest + Playwright; GitHub Actions; testy nie wołają prawdziwego LLM. Otwarte: którzy dostawcy modeli w OpenRouter są dozwoleni (brak retencji danych, brak trenowania).
