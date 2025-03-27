# NoteFlow - Aplikacja do Zarządzania Notatkami, Dokumentami i Projektami

## Opis
NoteFlow to aplikacja inspirowana Notion, umożliwiająca użytkownikom tworzenie, edycję, organizowanie i współdzielenie dokumentów. Obsługuje system tagowania, wersjonowania oraz współpracy w czasie rzeczywistym.

Projekt oparty na architekturze mikroserwisowej, składający się z dwóch niezależnych Web API:
- **Serwis Notatek** – odpowiedzialny za zarządzanie treścią dokumentów, edycję i wersjonowanie.
- **Serwis Użytkowników** – obsługuje autoryzację, role użytkowników oraz system udostępniania.

## Kluczowe funkcjonalności
- Tworzenie i edycja dokumentów w bogatym edytorze tekstu.
- Organizacja treści za pomocą tagów i folderów.
- Współpraca w czasie rzeczywistym nad dokumentami.
- Kontrola wersji dokumentów.
- System uprawnień i udostępniania.

## Architektura
Aplikacja składa się z:
- **Frontend** – interfejs użytkownika w technologii webowej.
- **Backend** – dwa mikroserwisy Web API do obsługi notatek i użytkowników.
- **Baza danych** – przechowuje dokumenty, metadane i użytkowników.
- **Usługa synchronizacji** – zapewnia aktualizacje w czasie rzeczywistym.

## Technologie
- **Frontend:** React / Next.js + Redux + TailwindCSS
- **Backend:** Web API (dwa mikroserwisy)
- **Baza danych:** PostgreSQL / MySQL
- **Autoryzacja:** JWT / OAuth
- **Komunikacja:** REST API / WebSocket

## Planowane funkcje
- Integracja z usługami chmurowymi.
- Obsługa załączników i mediów.
- Zaawansowane wyszukiwanie i filtrowanie treści.