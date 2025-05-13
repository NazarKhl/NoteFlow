'use client';

import { useState, useEffect } from 'react';

type User = {
  id: number;
  username: string;
};

type Note = {
  id: number;
  title: string;
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
  user?: User;
  note?: Note;
};

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newComment, setNewComment] = useState({ content: '', noteId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [daysFilter, setDaysFilter] = useState(7);

  const fetchComments = async (days?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = days
        ? `http://localhost:8080/api/comments/recent?days=${days}`
        : 'http://localhost:8080/api/comments';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Błąd ładowania komentarzy');
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/note');
      if (!res.ok) throw new Error('Błąd ładowania notatek');
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComments();
    fetchNotes();
  }, []);

  const handleCreate = async () => {
    if (!newComment.content) {
      setError('Treść komentarza jest wymagana');
      return;
    }
  
    if (!newComment.noteId) {
      setError('Wybierz notatkę');
      return;
    }
  
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/comments/note/${newComment.noteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment.content }),
      });
  
      if (!response.ok) throw new Error('Błąd tworzenia komentarza');
  
      await fetchComments();
      setNewComment({ content: '', noteId: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };
  
  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleUpdate = async () => {
    if (!editContent) {
      setError('Treść komentarza jest wymagana');
      return;
    }

    if (!editingId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) throw new Error('Błąd aktualizacji komentarza');

      await fetchComments();
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten komentarz?')) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Błąd usuwania komentarza');

      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComments(daysFilter);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 text-black">
      {/* Filtrowanie */}
      <form onSubmit={handleFilter} className="mb-6 bg-white p-4 rounded-lg shadow-md text-black">
        <div className="flex justify-between items-center">
          <label className="text-lg text-black">
            Pokaż z ostatnich:
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(parseInt(e.target.value))}
              className="ml-2 p-2 border rounded-md text-black"
            >
              <option value="1">1 dzień</option>
              <option value="3">3 dni</option>
              <option value="7">7 dni</option>
              <option value="30">30 dni</option>
              <option value="0">Wszystkie</option>
            </select>
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={isLoading}
          >
            Filtruj
          </button>
        </div>
      </form>

      {/* Formularz dodawania */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-md text-black">
        <h2 className="text-xl font-semibold mb-4">Dodaj Nowy Komentarz</h2>
        <div className="space-y-3">
          <textarea
            placeholder="Treść komentarza"
            value={newComment.content}
            onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
            className="w-full p-3 border rounded-md text-black"
            rows={4}
            disabled={isLoading}
          />

          <select
            value={newComment.noteId}
            onChange={(e) => setNewComment({ ...newComment, noteId: e.target.value })}
            className="w-full p-3 border rounded-md text-black"
            disabled={isLoading}
          >
            <option value="">Wybierz notatkę (opcjonalnie)</option>
            {notes.map((note) => (
              <option key={note.id} value={note.id}>
                {note.title ? `#${note.id} - ${note.title}` : `Notatka #${note.id}`}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreate}
            disabled={isLoading || !newComment.content}
            className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Wysyłanie...' : 'Dodaj Komentarz'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Lista komentarzy */}
      <div className="space-y-4">
        {isLoading && comments.length === 0 ? (
          <p className="text-center py-4">Ładowanie komentarzy...</p>
        ) : comments.length === 0 ? (
          <p className="text-center py-4">Brak komentarzy</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-md p-4 text-black">
              {editingId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-3 border rounded-md text-black"
                    rows={4}
                    disabled={isLoading}
                  />
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-300 text-black rounded-md"
                      disabled={isLoading}
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Zapisywanie...' : 'Zapisz'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="whitespace-pre-line">{comment.content}</p>
                      <div className="text-xs text-gray-600 mt-2">
                        Dodano: {new Date(comment.created_at).toLocaleString()}
                        {comment.user && <span> przez {comment.user.username}</span>}
                        {comment.note && <span> do notatki: {comment.note.title}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(comment)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md"
                        disabled={isLoading}
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md"
                        disabled={isLoading}
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
