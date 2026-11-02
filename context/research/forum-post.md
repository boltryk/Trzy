# Post na forum 10xDevs

Opisuje zakres rekomendowany w audycie. Funkcje planowane są wyraźnie oznaczone jako przyszłe.

## Wersja rekomendowana (ok. 250 słów)

**Trzy – „Masz dziś trzy rzeczy. Reszta może poczekać.”**

**Problem:** Zadania, wiadomości, na które trzeba odpisać, i luźne pomysły lądują w notatkach, komunikatorach i w głowie. Klasyczne task managery wymagają kategorii, priorytetów i regularnego porządkowania. Wystarczy kilka dni przerwy, żeby zobaczyć kilkadziesiąt zaległości i stracić ochotę na powrót. Projektuję z myślą o trudnościach wykonawczych, które często towarzyszą ADHD. To nie jest narzędzie do diagnozy ani terapii.

**Rozwiązanie:** Jedno pole: „Co masz teraz w głowie?”. Wpisujesz chaos, a AI proponuje: Dzisiaj (maksymalnie trzy rzeczy, limit pilnuje kod, nie prompt) i Później. Ty zatwierdzasz. Niezrobione rzeczy wracają do Później bez czerwonych liczników i streaków, a każdy dzień zaczyna się od czystej kartki.

**MVP:** logowanie, zrzut z głowy, propozycja AI z zatwierdzeniem i trybem ręcznym, gdy model nie odpowiada, widok Dzisiaj z limitem trzech, reset dnia i usuwanie wszystkich danych. Jeśli starczy czasu: przycisk „Nie ogarniam” (jedna rzecz, jeden krok), lista Do odpisania ze szkicem wiadomości i instalacja na telefonie. Świadomie bez powiadomień, integracji i grywalizacji.

**Stack:** Astro + React + TypeScript, Tailwind + shadcn/ui, Supabase (Auth, Postgres z RLS), Cloudflare Workers, Vitest + Playwright, GitHub Actions.

**Integracje:** w MVP tylko LLM przez OpenRouter. Później Google Calendar i liczenie, o której wyjść, żeby zdążyć na wydarzenie.

Pytanie do Was: co sprawia, że po tygodniu porzucacie aplikacje do zadań? I czy limit trzech rzeczy by Was przekonał, czy raczej irytował?

## Wersja krótsza (ok. 140 słów)

**Trzy – „Masz dziś trzy rzeczy. Reszta może poczekać.”**

**Problem:** Zadania i sprawy do odpisania są rozrzucone po notatkach, komunikatorach i głowie, a po kilku dniach przerwy task manager wita stosem zaległości. Projektuję z myślą o trudnościach wykonawczych, częstych przy ADHD.

**Rozwiązanie:** Jedno pole na wszystko, co masz w głowie. AI proponuje Dzisiaj (maksymalnie trzy rzeczy, limit w kodzie) i Później, a Ty zatwierdzasz. Bez liczników zaległości i streaków: codziennie czysta kartka.

**MVP:** logowanie, zrzut z głowy, propozycja AI z zatwierdzeniem, Dzisiaj z limitem, reset dnia, usuwanie danych. Świadomie bez powiadomień i grywalizacji.

**Stack:** Astro, React, TypeScript, Supabase (RLS), Cloudflare Workers, Vitest, Playwright.

**Integracje:** OpenRouter. Później Google Calendar i godzina wyjścia na wydarzenie.

Co musiałaby robić taka aplikacja, żebyście wrócili do niej po tygodniu?
