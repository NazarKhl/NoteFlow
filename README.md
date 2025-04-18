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
