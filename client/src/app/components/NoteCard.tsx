'use client';

import { useState, useEffect } from 'react';

type Note = {
  id: number;
  comments?: {
    id: number;
    content: string;
    // inne pola komentarza
  }[];
  roles?: {
    id: number;
    name: string;
  }[];
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<Partial<Note>>({});
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  // Pobieranie notatek
  const fetchNotes = async (keyword = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = keyword
        ? `http://localhost:8080/api/note/comment-keyword?kw=${encodeURIComponent(keyword)}`
        : 'http://localhost:8080/api/note';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      setNotes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Tworzenie nowej notatki
  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newNote),
      });

      if (!response.ok) throw new Error('Failed to create note');
      
      await fetchNotes();
      setNewNote({});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Aktualizacja notatki
  const handleUpdate = async () => {
    if (!editingNote) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/note/${editingNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingNote),
      });

      if (!response.ok) throw new Error('Failed to update note');
      
      await fetchNotes();
      setEditingNote(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Usuwanie notatki
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/note/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete note');
      
      await fetchNotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  // Wyszukiwanie po słowie kluczowym w komentarzach
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNotes(searchKeyword);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Notes Management</h1>

      {/* Wyszukiwarka */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by comment keyword..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isLoading}
          >
            Search
          </button>
          <button 
            type="button" 
            onClick={() => {
              setSearchKeyword('');
              fetchNotes();
            }}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={isLoading}
          >
            Clear
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Formularz tworzenia/edycji */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">
          {editingNote ? 'Edit Note' : 'Create New Note'}
        </h2>
        <div className="space-y-3">
          {/* Tutaj możesz dodać pola formularza w zależności od potrzeb */}
          <p className="text-gray-500">Note form fields would go here</p>
          
          <div className="flex justify-end space-x-2">
            {editingNote && (
              <button
                onClick={() => setEditingNote(null)}
                className="px-3 py-1 bg-gray-300 rounded"
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              onClick={editingNote ? handleUpdate : handleCreate}
              className="px-3 py-1 bg-green-600 text-white rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : editingNote ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>

      {/* Lista notatek */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-4">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-center py-4">No notes found</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">Note #{note.id}</h2>
                  
                  {/* Komentarze */}
                  {note.comments && note.comments.length > 0 && (
                    <div className="mt-2">
                      <h3 className="font-medium">Comments:</h3>
                      <ul className="list-disc pl-5">
                        {note.comments.map(comment => (
                          <li key={comment.id}>{comment.content}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Role */}
                  {note.roles && note.roles.length > 0 && (
                    <div className="mt-2">
                      <h3 className="font-medium">Roles:</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {note.roles.map(role => (
                          <span key={role.id} className="px-2 py-1 bg-gray-100 rounded text-sm">
                            {role.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                    disabled={isLoading}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    disabled={isLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}