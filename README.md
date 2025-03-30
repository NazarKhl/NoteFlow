# NoteFlow - Aplikacja do Tworzenia i Zarządzania Notatkami

**NoteFlow** to nowoczesna aplikacja do tworzenia, organizowania i współdzielenia notatek oraz dokumentów. Zainspirowana popularnymi aplikacjami typu Notion, NoteFlow umożliwia łatwe zarządzanie treściami w formie notatek, dokumentów, projektów i folderów, zapewniając pełną synchronizację w czasie rzeczywistym. Idealna do współpracy w zespole, zarówno do codziennego użytku, jak i bardziej złożonych projektów.

### Funkcjonalności

- **Tworzenie i edycja notatek**: Łatwe tworzenie notatek i dokumentów w bogatym edytorze tekstu, z możliwością formatowania.
- **Organizacja treści**: Grupowanie notatek w foldery, przypisywanie tagów i kategoryzowanie dokumentów.
- **Współpraca w czasie rzeczywistym**: Praca nad notatkami z zespołem w czasie rzeczywistym.
- **Kontrola wersji**: Historia wersji notatek, możliwość przywrócenia poprzednich wersji.
- **Zarządzanie dostępem**: Możliwość udostępniania dokumentów z różnymi poziomami uprawnień.
- **Bezpieczne logowanie**: Autoryzacja użytkowników z użyciem JWT (JSON Web Token) lub OAuth.

### Architektura

**NoteFlow** jest aplikacją opartą na mikroserwisach, składającą się z dwóch niezależnych Web API:

- **Serwis Notatek**: Odpowiada za zarządzanie treścią notatek, edycję, wersjonowanie i organizację dokumentów.
- **Serwis Użytkowników**: Obsługuje logowanie, rejestrację, autoryzację użytkowników oraz zarządzanie uprawnieniami.

### Technologie

- **Frontend**: React, Next.js, Redux, TailwindCSS
- **Backend**: Dwa mikroserwisy Web API (Node.js/Express)
- **Baza danych**: PostgreSQL/MySQL
- **Autoryzacja**: JWT (JSON Web Token) lub OAuth
- **Komunikacja**: REST API, WebSocket (do współpracy w czasie rzeczywistym)

### Jak działa aplikacja?

1. **Logowanie i Rejestracja**:  
   Użytkownicy mogą tworzyć konto i logować się do aplikacji za pomocą systemu autoryzacji opartego na **JWT** lub **OAuth**. Po zalogowaniu dostępne są funkcje tworzenia i zarządzania notatkami.

2. **Tworzenie Notatek**:  
   Każdy użytkownik może tworzyć notatki przy pomocy edytora tekstu, który oferuje możliwość formatowania, dodawania linków, obrazów i tabel. Notatki można zapisywać, edytować i organizować w folderach.

3. **Współpraca w czasie rzeczywistym**:  
   Dzięki usłudze synchronizacji w czasie rzeczywistym, kilka osób może edytować tę samą notatkę równocześnie. Zmiany są natychmiastowo widoczne dla wszystkich użytkowników.

4. **System Uprawnień**:  
   Dokumenty i notatki można udostępniać innym użytkownikom. Istnieją różne poziomy uprawnień, takie jak tylko odczyt, edycja czy pełne administrowanie.

5. **Kontrola Wersji**:  
   Każda zmiana w notatce jest rejestrowana, a użytkownicy mogą przeglądać historię wersji i przywracać poprzednie wersje dokumentów.

### Struktura Projektu

#### Frontend

- **React + Next.js**: Tworzymy dynamiczne interfejsy użytkownika, które są zarówno responsywne, jak i wydajne. Dzięki Next.js aplikacja jest renderowana po stronie serwera, co zapewnia szybki czas ładowania.
- **Redux**: Używamy Redux do zarządzania stanem aplikacji, co umożliwia centralne przechowywanie danych, takich jak użytkownicy, notatki i sesje.
- **TailwindCSS**: Stylizacja aplikacji jest realizowana przy pomocy TailwindCSS, co pozwala na szybkie tworzenie nowoczesnych interfejsów użytkownika.

#### Backend

- **Serwis Notatek**: Odpowiada za logikę tworzenia i zarządzania notatkami, wersjonowanie oraz synchronizację dokumentów.
  - **Endpoints**:
    - `GET /notes`: Pobierz wszystkie notatki.
    - `POST /notes`: Tworzenie nowej notatki.
    - `PUT /notes/{id}`: Edytowanie notatki.
    - `DELETE /notes/{id}`: Usunięcie notatki.
    - `GET /notes/{id}/versions`: Historia wersji notatki.
  
- **Serwis Użytkowników**: Obsługuje proces logowania, rejestracji oraz zarządzanie użytkownikami i ich uprawnieniami.
  - **Endpoints**:
    - `POST /users/register`: Rejestracja nowego użytkownika.
    - `POST /users/login`: Logowanie użytkownika.
    - `GET /users/me`: Pobierz informacje o zalogowanym użytkowniku.
    - `POST /users/logout`: Wylogowanie użytkownika.
  
#### Baza danych

- **PostgreSQL/MySQL**: Relacyjna baza danych, która przechowuje informacje o użytkownikach, notatkach, folderach i wersjach dokumentów.
