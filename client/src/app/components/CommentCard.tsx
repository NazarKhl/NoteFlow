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
  const [newComment, setNewComment] = useState({ content: '', noteId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [daysFilter, setDaysFilter] = useState(7);

  // Pobieranie komentarzy
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

  useEffect(() => {
    fetchComments();
  }, []);

  // Tworzenie nowego komentarza
  const handleCreate = async () => {
    if (!newComment.content) {
      setError('Treść komentarza jest wymagana');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const commentToCreate = {
        content: newComment.content,
        note: newComment.noteId ? { id: parseInt(newComment.noteId) } : null
      };

      const response = await fetch('http://localhost:8080/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentToCreate),
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

  // Rozpoczęcie edycji
  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  // Anulowanie edycji
  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  // Zapisanie zmian
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

  // Usuwanie komentarza
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

  // Filtrowanie komentarzy
  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComments(daysFilter);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie komentarzami</h1>

      {/* Filtrowanie */}
      <form onSubmit={handleFilter} className="mb-6 bg-white p-4 rounded shadow">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span>Pokaż z ostatnich:</span>
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(parseInt(e.target.value))}
              className="p-2 border rounded"
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
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isLoading}
          >
            Filtruj
          </button>
        </div>
      </form>

      {/* Formularz dodawania */}
      <div className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Dodaj nowy komentarz</h2>
        <div className="space-y-3">
          <textarea
            placeholder="Treść komentarza"
            value={newComment.content}
            onChange={(e) => setNewComment({...newComment, content: e.target.value})}
            className="w-full p-2 border rounded"
            rows={3}
            disabled={isLoading}
          />
          <input
            type="number"
            placeholder="ID notatki (opcjonalne)"
            value={newComment.noteId}
            onChange={(e) => setNewComment({...newComment, noteId: e.target.value})}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
          <button
            onClick={handleCreate}
            disabled={isLoading || !newComment.content}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Wysyłanie...' : 'Dodaj komentarz'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
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
            <div key={comment.id} className="bg-white rounded shadow p-4">
              {editingId === comment.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows={3}
                    disabled={isLoading}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEditing}
                      className="px-3 py-1 bg-gray-300 rounded"
                      disabled={isLoading}
                    >
                      Anuluj
                    </button>
                    <button
                      onClick={handleUpdate}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
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
                      <div className="text-xs text-gray-500 mt-2">
                        Dodano: {new Date(comment.created_at).toLocaleString()}
                        {comment.user && (
                          <span> przez {comment.user.username}</span>
                        )}
                        {comment.note && (
                          <span> do notatki: {comment.note.title}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(comment)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                        disabled={isLoading}
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(comment.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
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