'use client';

import { useState, useEffect } from 'react';

// Typy danych
type Comment = {
  id: number;
  content: string;
  createdAt: string;
};

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  comments: Comment[];
};

// Komponent karty notatki
function NoteCard({ note }: { note: Note }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <h2 className="font-bold text-lg mb-2">{note.title || 'Untitled Note'}</h2>
      <p className="text-gray-700 mb-3">{note.content}</p>
      
      <div className="border-t pt-2">
        <h3 className="text-sm font-semibold text-gray-500">Comments:</h3>
        {note.comments?.length > 0 ? (
          <ul className="mt-1 space-y-1">
            {note.comments.map(comment => (
              <li key={comment.id} className="text-sm p-2 bg-gray-50 rounded">
                <p>{comment.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400 italic">No comments</p>
        )}
      </div>
    </div>
  );
}

// Główny komponent strony
export default function NotesDashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  // Funkcja walidująca strukturę notatki
  const isValidNote = (data: any): data is Note => {
    return (
      data &&
      typeof data.id === 'number' &&
      typeof data.title === 'string' &&
      typeof data.content === 'string' &&
      Array.isArray(data.comments)
    );
  };

  // Funkcja walidująca tablicę notatek
  const isValidNotesArray = (data: any): data is Note[] => {
    if (!Array.isArray(data)) {
      console.error('Expected array but got:', data);
      return false;
    }
    
    const invalidItems = data.filter(item => !isValidNote(item));
    if (invalidItems.length > 0) {
      console.error('Invalid note items:', invalidItems);
      return false;
    }
    
    return true;
  };

  // Pobieranie notatek
  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8080/api/note');
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      
      if (!isValidNotesArray(data)) {
        throw new Error('Invalid data structure from API');
      }

      setNotes(data);
    } catch (err) {
      console.error('Failed to fetch notes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setNotes([]); // Ustaw pustą tablicę jako fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Efekt pobierający notatki przy pierwszym renderze
  useEffect(() => {
    fetchNotes();
  }, []);

  // Funkcja renderująca notatki z zabezpieczeniem
  const renderNotes = () => {
    if (!Array.isArray(notes)) {
      console.error('Notes is not an array:', notes);
      return (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          Critical error: Notes data is not in expected format
        </div>
      );
    }

    if (notes.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No notes found. Create your first note.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Notes Dashboard</h1>

      {/* Sekcja błędów */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Główna zawartość */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderNotes()
      )}
    </div>
  );
}