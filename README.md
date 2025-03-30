# NoteFlow - Aplikacja do Tworzenia i Zarządzania Notatkami

NoteFlow to aplikacja webowa do zarządzania notatkami, dokumentami i projektami. Aplikacja jest oparta na architekturze czterowarstwowej, z wykorzystaniem Spring Framework oraz bazuje na mikroserwisach Web API. System wspiera logowanie użytkowników, operacje CRUD na encjach, a także współpracę w czasie rzeczywistym przy użyciu JWT oraz Spring Security. 

## Wymagania Projektu

### 1. Web API w Spring
Aplikacja składa się z czterech głównych warstw:

- **Model**: Zawiera klasy encyjne, które odwzorowują struktury danych w bazie.
- **DAO**: Repozytoria, które umożliwiają operacje na danych.
- **Service**: Warstwa logiki biznesowej aplikacji.
- **Web API**: Kontrolery, które umożliwiają dostęp do funkcji aplikacji za pomocą HTTP.

#### Struktura Modelu
Model aplikacji zawiera minimum osiem klas encyjnych. Przykład struktur danych:

- **User** - Encja użytkownika z danymi do logowania.
- **Note** - Encja notatki, która przechowuje dane użytkownika.
- **Tag** - Tag dla notatek.
- **Folder** - Folder dla grupowania notatek.
- **Document** - Encja dokumentu, przypisanego do folderu.
- **Comment** - Komentarz przypisany do notatki.
- **Project** - Projekt, do którego przypisane są notatki.
- **Role** - Rola użytkownika w systemie (np. autor, administrator).

#### Relacje w modelu danych:

- **Jeden-do-wielu**:
  - Jeden użytkownik może mieć wiele notatek.
  - Jeden folder może zawierać wiele notatek.
  - Jeden projekt może mieć wiele notatek.
  - Jeden tag może być przypisany do wielu notatek.

- **Wiele-do-wielu**:
  - Notatki mogą mieć przypisane wiele tagów.

### Warstwa DAO
Repozytoria (DAO) dla każdej encji zawierają operacje na danych, w tym co najmniej trzy metody do pobierania danych z wykorzystaniem specyficznych pól encji. W niektórych przypadkach wykorzystano zapytania JPQL lub Native SQL.

### Warstwa Serwisów
Serwis implementuje logikę biznesową, w tym operacje CRUD dla przynajmniej pięciu encji, takich jak User, Note, Project, Tag, Folder. Dodatkowo zaimplementowano transakcję w celu zapewnienia spójności danych.

### Warstwa Web API
Kontrolery w warstwie Web API umożliwiają dostęp do funkcji aplikacji za pomocą odpowiednich endpointów. Każdy kontroler jest zabezpieczony za pomocą Spring Security.

Endpointy są odpowiednio zabezpieczone, umożliwiając dostęp tylko dla zalogowanych użytkowników oraz przydzielają odpowiednie role, np. tylko administratorzy mogą usuwać notatki.

### Zabezpieczenia Spring Security
Aplikacja wykorzystuje Spring Security do autoryzacji i autentyfikacji użytkowników. Hasła są przechowywane w bazie danych w formie hashowanej (np. BCrypt). Po zalogowaniu użytkownik otrzymuje JWT, które służy do autoryzacji dostępu do chronionych endpointów.

---

### 2. Frontend
Aplikacja frontendowa została stworzona w React i komunikuje się z Web API za pomocą HTTP. Frontend obsługuje logowanie, które zwraca JWT w przypadku udanej autentykacji.

**Postman**: Przygotowana kolekcja zapytań HTTP dla Web API.

**Logowanie**: Po zalogowaniu użytkownik otrzymuje token JWT, który jest wykorzystywany w dalszej komunikacji z backendem.

Operacje CRUD są dostępne dla dwóch encji:

- **Notatki** – dla użytkowników zalogowanych.
- **Projekty** – dla użytkowników z rolą autora.

---

### 3. Dodatkowe Funkcjonalności
- **Dziedziczenie**: W bazie danych odwzorowano dziedziczenie encji, np. User dziedziczy po Person.
- **Generyczne serwisy**: Została utworzona generyczna klasa serwisu, która jest dziedziczona przez inne serwisy.
- **Query JPQL i Native SQL**: Wykorzystano zapytania JPQL oraz Native SQL w repozytoriach do specyficznych zapytań.
- **Lazy i Eager Loading**: Zastosowano odpowiednie strategie ładowania danych, takie jak Lazy oraz Eager Loading.
- **Walidacja i obsługa błędów**: Zaimplementowano walidację danych wejściowych oraz odpowiednią obsługę błędów (np. w przypadku nieznalezienia zasobu).

---

## Drugie Web API

W ramach rozwoju aplikacji **NoteFlow** wprowadzono także **drugie Web API**, które będzie odpowiedzialne za dodatkowe funkcje, takie jak integracja z zewnętrznymi systemami lub realizacja niestandardowych operacji na danych, które nie są bezpośrednio związane z główną aplikacją. To drugie API, może być np. odpowiedzialne za **wyszukiwanie**, **raportowanie**, **statystyki** i integrację z innymi aplikacjami, które wymagają dostępu do danych aplikacji **NoteFlow**, ale w bardziej zaawansowany sposób niż podstawowe operacje CRUD.

Drugie Web API będzie odpowiedzialne za takie operacje jak:
- **Tworzenie raportów i analiz** dotyczących aktywności użytkowników, projektów, notatek itp.
- **Integracja z zewnętrznymi systemami** (np. systemy analityczne, CRM, czy inne aplikacje zewnętrzne).
- **Zaawansowane filtrowanie i przetwarzanie danych** (np. wyszukiwanie notatek według różnych parametrów, generowanie wykresów/statystyk).
- **Zarządzanie powiązaniami z danymi zewnętrznymi** (np. synchronizacja z zewnętrznymi bazami danych, integracja z aplikacjami trzecimi).

### Przykładowe Encje w Modelu Drugiego Web API

1. **AnalyticsReport** - Reprezentuje raporty generowane na podstawie danych z aplikacji NoteFlow.
   - **id**: Unikalny identyfikator raportu.
   - **reportType**: Typ raportu (np. aktywność użytkowników, statystyki projektów).
   - **data**: Zawartość raportu (może to być np. JSON, CSV, PDF).
   - **generatedAt**: Data wygenerowania raportu.

2. **ExternalIntegration** - Reprezentuje dane związane z integracjami zewnętrznymi, jak np. aplikacje zewnętrzne synchronizujące dane.
   - **id**: Unikalny identyfikator integracji.
   - **integrationName**: Nazwa zewnętrznego systemu (np. CRM, ERP).
   - **lastSync**: Data ostatniej synchronizacji z systemem zewnętrznym.
   - **status**: Status integracji (np. aktywna, nieaktywna).

3. **SearchLog** - Reprezentuje zapytania wyszukiwania i przetwarzanie danych.
   - **id**: Unikalny identyfikator logu.
   - **user**: Użytkownik, który wykonał zapytanie.
   - **query**: Zapytanie wyszukiwania.
   - **resultsCount**: Liczba wyników zapytania.
   - **timestamp**: Czas wykonania zapytania.

### Przykładowe Endpointy Drugiego Web API

1. **GET /analytics/reports** – Pobranie listy dostępnych raportów analitycznych.
2. **GET /analytics/reports/{id}** – Pobranie konkretnego raportu na podstawie ID.
3. **GET /integrations** – Pobranie listy wszystkich aktywnych integracji z systemami zewnętrznymi.
4. **POST /integrations** – Tworzenie nowej integracji z systemem zewnętrznym.
5. **GET /search/logs** – Pobranie logów zapytań wyszukiwania.
6. **POST /search/query** – Wykonanie zapytania wyszukiwania w systemie.

### Implementacja Operacji w Drugim Web API

1. **Generowanie raportów**: Drugie Web API pozwala na generowanie raportów analitycznych, takich jak raporty o aktywności użytkowników, statystyki notatek itp.
2. **Integracja z zewnętrznymi systemami**: Możliwość synchronizacji z aplikacjami trzecimi, np. CRM lub ERP.
3. **Wyszukiwanie zaawansowane**: Wykorzystanie specjalistycznych zapytań do zaawansowanego filtrowania i przetwarzania danych w aplikacji.
4. **Logowanie wyszukiwań**: Możliwość zapisywania i monitorowania zapytań wyszukiwania w systemie.

---

### Przykładowe Architektury i Strategie w Drugim Web API

1. **Mikroserwisowa architektura**: Drugie Web API może być traktowane jako oddzielny mikroserwis w systemie, który działa niezależnie od głównego API, ale komunikuje się z nim za pomocą zapytań HTTP lub komunikatów.
2. **Bezpieczeństwo**: Drugie API powinno być zabezpieczone podobnie jak główne API. Może to obejmować autoryzację użytkowników z JWT oraz różne poziomy dostępu zależnie od ról użytkowników (np. tylko administratorzy mogą tworzyć integracje).

---

