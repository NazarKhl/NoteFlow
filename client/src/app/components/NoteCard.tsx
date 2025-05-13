'use client';

import React, { useState, useEffect } from 'react';

type Comment = {
  id: number;
  content: string;
  created_at: string;
};

type Note = {
  id: number;
  title: string;
  comments: Comment[];
};

export default function NoteCard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newNote, setNewNote] = useState('');
  const [editNoteId, setEditNoteId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/note');
      if (!res.ok) throw new Error('Błąd podczas ładowania notatek');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await fetch('http://localhost:8080/api/note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          comments: [],
          roles: [],
        }),
      });
      if (!res.ok) throw new Error('Nie udało się utworzyć notatki');
      setNewTitle('');
      setNewNote('');
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć tę notatkę?')) return;
    try {
      const res = await fetch(`http://localhost:8080/api/note/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Błąd podczas usuwania');
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    }
  };

  const handleUpdate = async () => {
    if (!editTitle.trim() || editNoteId === null) return;
    try {
      const res = await fetch(`http://localhost:8080/api/note/${editNoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          comments: [],
          roles: [],
        }),
      });
      if (!res.ok) throw new Error('Aktualizacja nie powiodła się');
      setEditNoteId(null);
      setEditTitle('');
      setEditContent('');
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    }
  };

  return (
<div className="text-black">
  {error && <p className="text-red-600 mb-4">{error}</p>}

  {/* Nowa notatka */}
  <div className="mb-6 w-[1100px] bg-white p-4 rounded-lg shadow flex items-center justify-between">
    <h2 className="text-lg font-semibold mb-2">Utwórz Notatkę</h2>
    <div className="w-full flex space-x-4 items-center">
      <input
        type="text"
        placeholder="Tytuł notatki"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />
      <button
        onClick={handleCreate}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Dodaj
      </button>
    </div>
  </div>

      {/* Lista notatek */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {loading ? (
          <p>Ładowanie...</p>
        ) : notes.length === 0 ? (
          <p>Brak notatek</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-bold mb-1">{note.title}</h3>
              <p className="text-sm text-gray-400 mb-3">ID: {note.id}</p>

              <div className="mb-3">
                <h4 className="font-semibold text-gray-700">Komentarze:</h4>
                {note.comments.length === 0 ? (
                  <p className="text-sm text-gray-500">Brak komentarzy</p>
                ) : (
                  <ul className="list-disc pl-5">
                    {note.comments.map((comment) => (
                      <li key={comment.id}>
                        <p className="text-sm">{comment.content}</p>
                        <span className="text-xs text-gray-400">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Akcje */}
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    setEditNoteId(note.id);
                    setEditTitle(note.title);
                  }}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Usuń
                </button>
              </div>

              {editNoteId === note.id && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Nowy tytuł"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Zapisz zmiany
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
