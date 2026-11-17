---
project: trzy
researched_at: 2026-11-17
recommended_platform: Cloudflare Workers (static assets)
runner_up: Vercel
context_type: mvp
tech_stack:
  language: TypeScript
  framework: Astro 7.4.4 (SSR, React 19 islands) + @astrojs/cloudflare 14.4.3
  runtime: Cloudflare workerd (nodejs_compat)
---

## Recommendation

**Deploy on Cloudflare Workers (z plikami statycznymi), plan Workers Paid ($5/mies.).**

Cloudflare zdobył komplet 5/5 w kryteriach przyjaznych agentom (CLI do wdrożenia, wycofania i logów; platforma w pełni zarządzana; dokumentacja w Markdown ze źródłami na GitHubie; deterministyczne `wrangler deploy`; oficjalny serwer MCP) i jako jedyny nie wymaga zmian w kodzie, bo starter już działa na Workers. Odpowiedzi z wywiadu (tylko żądanie/odpowiedź + ewentualnie cron, priorytet wygody pracy, jeden region UE, zewnętrzny Supabase) nie wykluczyły żadnej platformy; o wyniku zdecydowały wygoda pracy (brak kontenerów do utrzymania), wbudowany cron i koszt $5/mies. przy naszej skali.

## Platform Comparison

Twarde filtry: brak (aplikacja nie potrzebuje trwałych połączeń; każda platforma obsługuje TypeScript/Node). Wagi z wywiadu: wygoda pracy ważniejsza niż najniższy koszt; jeden region (edge bez przewagi, liczy się region UE); zewnętrzna baza (współlokalizacja neutralna); brak znanej platformy.

| Platforma          | CLI-first | Managed/Serverless | Dokumentacja dla agenta | Stabilne API wdrożeniowe | MCP / integracja | Suma |
| ------------------ | --------- | ------------------ | ----------------------- | ------------------------ | ---------------- | ---- |
| Cloudflare Workers | Pass      | Pass               | Pass                    | Pass                     | Pass             | 5    |
| Vercel             | Pass      | Pass               | Pass                    | Pass                     | Pass             | 5    |
| Netlify            | Partial   | Pass               | Pass                    | Pass                     | Pass             | 4,5  |
| Render             | Partial   | Pass               | Pass                    | Pass                     | Pass             | 4,5  |
| Railway            | Partial   | Pass               | Pass                    | Pass                     | Partial          | 4    |
| Fly.io             | Partial   | Partial            | Pass                    | Pass                     | Partial          | 3,5  |

Uwaga o źródłach: sieć sesji badawczej blokowała strony wszystkich platform. Dokumentację Cloudflare przeczytano w źródle (GitHub `cloudflare/cloudflare-docs`); pozostałe platformy oceniono na podstawie fragmentów oficjalnych stron z wyników wyszukiwania. Liczby cenowe Vercel, Netlify, Render, Railway i Fly.io wymagają ponownego sprawdzenia przed ewentualną zmianą platformy.

- **Cloudflare Workers** — `wrangler deploy`, `wrangler rollback` (ostatnie 100 wersji), `wrangler tail`, `wrangler secret put`; `llms.txt` i strony `index.md`; MCP `mcp.cloudflare.com/mcp` (serwery per produkt oznaczone jako wycofywane). Cron Triggers GA. Free: 10 ms CPU/żądanie (za mało dla SSR + auth); Paid $5/mies. obejmuje 10 mln żądań. Czas oczekiwania na `fetch` (OpenRouter, Supabase) nie liczy się do CPU.
- **Vercel** — `vercel deploy --prod`, `vercel rollback`, `vercel logs`; `llms.txt` + strony `.md`; MCP `mcp.vercel.com` (GA). Plan Hobby tylko do użytku niekomercyjnego; cron na Hobby raz dziennie z dokładnością ±59 min; domyślny region `iad1` (USA), Frankfurt `fra1` do ustawienia. Wymaga zmiany adaptera na `@astrojs/vercel`.
- **Netlify** — `netlify deploy --prod`, `netlify logs`; brak wycofania wdrożenia z CLI (panel lub API); `llms.txt`; oficjalny MCP. Cennik kredytowy (Free 300 kredytów, każde wdrożenie produkcyjne 15); Scheduled Functions GA (limit 30 s). Region UE `fra` możliwy, wcześniej wymagał planu Pro (niepotwierdzone).
- **Render** — CLI w becie (`render deploys create`, `render logs`); MCP GA; `llms.txt`. Darmowa instancja usypia po 15 min (start 30–60 s); realnie Starter ~$7 + cron ≥$1. Frankfurt dostępny. Wymaga `@astrojs/node` i procesu serwera.
- **Railway** — `railway up`, `railway logs`; wycofanie tylko w panelu (obraz trzymany 72 h na Hobby); MCP niezweryfikowany; region Amsterdam; brak umownej gwarancji lokalizacji danych na żadnym planie.
- **Fly.io** — `fly deploy`, `fly logs`; wycofanie przez ponowne wdrożenie starego obrazu; MCP eksperymentalny; brak darmowego planu; utrzymanie Dockerfile; region Warszawa (`waw`) oznaczony jako wycofywany.

### Shortlisted Platforms

#### 1. Cloudflare Workers (Recommended)

Komplet 5/5, zero przeróbek kodu (adapter, `wrangler.jsonc`, CI i test smoke już działają na workerd), cron w standardzie, najniższy koszt płatnego planu ($5/mies.) i dokumentacja w źródle na GitHubie, którą agent czyta bezpośrednio.

#### 2. Vercel

Również 5/5 i bardzo dobre doświadczenie pracy (natychmiastowe `promote`/`rollback`, MCP GA). Przegrywa kosztem migracji (zmiana adaptera), ograniczeniem planu Hobby do użytku niekomercyjnego, domyślnym regionem w USA i niedokładnym cronem na planie darmowym.

#### 3. Netlify

Model serverless zbliżony do obecnej architektury i cron GA. Przegrywa brakiem wycofania wdrożenia z CLI, cennikiem kredytowym, który przy częstych wdrożeniach szybko wymusza Pro ($20/mies.), i niepewnym dostępem do regionu UE na planie darmowym.

## Anti-Bias Cross-Check: Cloudflare Workers

### Devil's Advocate — Weaknesses

1. **Darmowy plan się nie nadaje.** 10 ms CPU na żądanie, a renderowanie SSR z weryfikacją sesji zajmuje według Cloudflare zwykle 10–20 ms. Na planie darmowym produkcja losowo zwraca błąd 1102. Plan Paid ($5/mies.) jest konieczny od pierwszego wdrożenia.
2. **Cron wymaga własnego punktu wejścia.** Domyślny `@astrojs/cloudflare/entrypoints/server` nie ma obsługi `scheduled`, więc trzeba napisać `src/worker.ts` opakowujący handler Astro. Cron działa w UTC, a granica dnia to 4:00 Europe/Warsaw, więc przesunięcie zmienia się przy zmianie czasu.
3. **Gwarancja przetwarzania wyłącznie w UE (Data Localization Suite) jest tylko w planie Enterprise** i tylko dla Workerów na własnej domenie. Polscy użytkownicy trafiają do europejskich lokalizacji domyślnie, ale bez gwarancji umownej; logi przechowuje firma z USA.
4. **workerd to nie Node.** `nodejs_compat` pokrywa większość API, ale biblioteka (np. SDK dostawcy modelu) może nie działać i ujawni to dopiero build lub wdrożenie.

### Pre-Mortem — How This Could Fail

Zespół wdrożył Trzy na darmowym planie Workers, bo „na start wystarczy”. Lokalnie i w CI wszystko działało, bo testy nie mierzą CPU. Pierwsi testerzy zgłaszali, że raz na kilka prób logowanie kończy się błędem 1102; przez tydzień szukano przyczyny w Supabase i w kodzie. Po przejściu na plan płatny dodano poranny mail: cron ustawiony na 4:00 UTC wysyłał go o 5:00 zimą i o 6:00 latem, a reset dnia rozjechał się z mailem. Własny `worker.ts`, dopisany dla crona, zepsuł się przy aktualizacji adaptera Astro, bo nikt nie pamiętał, że odszedł od domyślnego punktu wejścia startera. Potem tester zapytał o RODO: gdzie fizycznie leżą jego zrzuty i logi? Odpowiedź „u Cloudflare, gdzieś w UE, bez gwarancji” nie wystarczyła, a polityki prywatności nikt nie napisał. Żaden z tych problemów nie wynikał z samej platformy, tylko z założeń, których nikt nie sprawdził na starcie.

### Unknown Unknowns

- `wrangler rollback` cofa tylko kod: sekrety, powiązania (bindings) i migracje Supabase zostają w nowym stanie.
- Workers Builds (wdrożenia z gita prowadzone przez Cloudflare) tworzą token API przypisany do osobistego konta użytkownika; tokeny należące do konta są „wkrótce”.
- `wrangler tail` przy większym ruchu przełącza się na próbkowanie i pokazuje tylko część żądań.
- Od Astro 6 usunięto `Astro.locals.runtime`; sekrety czyta się przez `astro:env/server` lub `cloudflare:workers`, a większość tutoriali w sieci podaje stary sposób.
- Serwery MCP Cloudflare per produkt (Observability, Builds, Bindings) są wycofywane na rzecz jednego serwera `mcp.cloudflare.com/mcp`.

Decyzja po kontroli: **kontynuacja z Cloudflare Workers, ryzyka odnotowane** (2026-11-17).

## Operational Story

- **Deploys**: produkcję wdraża job `deploy` w `.github/workflows/ci.yml` (`npx wrangler deploy`) po zielonych jobach `ci` i `smoke`, tylko przy push do `main` (decyzja 2026-11-17; Workers Builds odrzucone, bo wdrażałoby niezależnie od wyniku CI). Plan pierwszego wdrożenia: `context/deployment/deploy-plan.md`.
- **Preview deploys**: na razie brak. Przy GitHub Actions podgląd wymagałby osobnego kroku (`wrangler versions upload`); podglądy dostają adres `*.workers.dev` bez domyślnej ochrony dostępu.
- **Secrets**: sekrety uruchomieniowe (`SUPABASE_URL`, `SUPABASE_KEY`, później klucz OpenRouter) trzymane na Workerze przez `npx wrangler secret put <NAZWA>` albo w panelu (Variables & Secrets); widzą je osoby z dostępem do konta Cloudflare. Przy GitHub Actions dodatkowo `CLOUDFLARE_API_TOKEN` (ograniczony do Workers jednego konta) i `CLOUDFLARE_ACCOUNT_ID` w sekretach repozytorium. Rotacja: nowa wartość przez `wrangler secret put`, potem unieważnienie starej u dostawcy.
- **Rollback**: `npx wrangler rollback [version-id]` (ostatnie 100 wersji), działa w kilka sekund; nie cofa sekretów, powiązań ani migracji bazy.
- **Approval**: człowiek wykonuje: pierwsze utworzenie Workera i wybór planu Paid, nadanie i rotację głównych sekretów, usunięcie Workera lub projektu Supabase, zmiany DNS. Agent może bez nadzoru: build, wdrożenie po zielonym CI, odczyt logów, wycofanie do poprzedniej wersji po zgłoszeniu awarii.
- **Logs**: `npx wrangler tail trzy` (na żywo, z próbkowaniem przy większym ruchu) oraz logi Workers Observability (`observability.enabled: true` w `wrangler.jsonc`); serwer MCP `mcp.cloudflare.com/mcp` do zapytań strukturalnych. Treść zrzutów nigdy nie trafia do `console.*` (reguła 6 w `AGENTS.md`).

## Risk Register

| Risk                                                                          | Source           | Likelihood | Impact | Mitigation                                                                                                                                            |
| ----------------------------------------------------------------------------- | ---------------- | ---------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Błąd 1102 (limit CPU) na planie darmowym                                      | Devil's advocate | H          | H      | Plan Workers Paid od pierwszego wdrożenia produkcyjnego                                                                                               |
| Cron w UTC rozjeżdża się z granicą dnia 4:00 Europe/Warsaw przy zmianie czasu | Devil's advocate | M          | M      | Reset dnia leniwie przy otwarciu (bez crona); jeśli cron wejdzie, harmonogram uwzględniający oba przesunięcia i sprawdzanie godziny lokalnej w kodzie |
| Własny `src/worker.ts` (dla crona) psuje się przy aktualizacji adaptera Astro | Pre-mortem       | M          | M      | Dodawać tylko, gdy cron jest naprawdę potrzebny; test smoke i build w CI przy każdej aktualizacji adaptera                                            |
| Brak umownej gwarancji przetwarzania danych wyłącznie w UE                    | Devil's advocate | M          | H      | Polityka prywatności opisująca Cloudflare i Supabase jako podmioty przetwarzające; brak treści zrzutów w logach; konsultacja RODO przed testerami     |
| Biblioteka niezgodna z workerd                                                | Devil's advocate | M          | M      | Każdą nową zależność sprawdzać buildem i `npm run smoke` lokalnie na workerd przed merge'em                                                           |
| Wycofanie nie cofa migracji bazy ani sekretów                                 | Unknown unknowns | M          | M      | Migracje Supabase tylko wstecznie zgodne; zmiany sekretów osobno od wdrożeń kodu                                                                      |
| Token Workers Builds przypisany do osobistego konta                           | Unknown unknowns | L          | M      | Rozważyć wdrażanie z GitHub Actions z tokenem ograniczonym do Workers                                                                                 |
| Próbkowanie `wrangler tail` ukrywa pojedyncze błędy                           | Unknown unknowns | L          | L      | Do debugowania używać Workers Observability zamiast samego `tail`                                                                                     |
| Nieaktualne tutoriale (`Astro.locals.runtime`, stare serwery MCP)             | Unknown unknowns | M          | L      | Sekrety tylko przez `astro:env/server` (zasada w `AGENTS.md`); MCP tylko `mcp.cloudflare.com/mcp`                                                     |
| Ceny i limity pozostałych platform niezweryfikowane bezpośrednio              | Research finding | M          | L      | Przed ewentualną zmianą platformy sprawdzić oficjalne strony cenowe                                                                                   |

## Getting Started

Sprawdzone względem wersji w projekcie: `wrangler@4.156.0`, `@astrojs/cloudflare@14.4.3`, `astro@7.4.4`. Od Astro 6 `npm run dev` działa już na workerd, więc osobne `wrangler dev` nie jest potrzebne.

1. Zmień nazwę Workera w `wrangler.jsonc` z `10x-astro-starter` na `trzy` (Workers Builds wymaga zgodności nazwy z polem `name`).
2. Załóż konto Cloudflare, włącz plan Workers Paid i zaloguj CLI: `npx wrangler login` (lokalnie) albo utwórz token API ograniczony do edycji Workers dla CI.
3. Utwórz projekt Supabase w regionie UE (Frankfurt) i ustaw sekrety Workera: `npx wrangler secret put SUPABASE_URL` oraz `npx wrangler secret put SUPABASE_KEY`. Wklej szablon `supabase/templates/magic_link.html` i adres Workera jako Site URL w ustawieniach Auth projektu.
4. Zbuduj i wdroż: `npm run build && npx wrangler deploy`; sprawdź logowanie magic linkiem na adresie `trzy.<konto>.workers.dev`.
5. Zdecyduj, kto wdraża automatycznie po merge'u do `main`: Workers Builds (platforma) albo krok `cloudflare/wrangler-action` w `.github/workflows/ci.yml` po zielonym lint, `astro check`, buildzie i teście smoke.

## Out of Scope

The following were not evaluated in this research:

- Docker image configuration
- CI/CD pipeline setup
- Production-scale architecture (multi-region, HA, DR)
