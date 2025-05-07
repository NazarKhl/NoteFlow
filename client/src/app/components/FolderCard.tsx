'use client';

import { useState, useEffect } from 'react';

type Folder = {
  id: number;
  name: string;
  project?: {
    id: number;
    name: string;
  };
  documents?: Array<{
    id: number;
    fileName: string;
  }>;
};

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [newFolder, setNewFolder] = useState({ name: '', projectId: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: '', projectId: '' });

  // Pobieranie folderów
  const fetchFolders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/folders');
      if (!response.ok) throw new Error('Błąd ładowania folderów');
      const data = await response.json();
      setFolders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  // Tworzenie nowego folderu
  const handleCreate = async () => {
    if (!newFolder.name) {
      setError('Nazwa folderu jest wymagana');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const folderToCreate = {
        name: newFolder.name,
        project: newFolder.projectId ? { id: Number(newFolder.projectId) } : null
      };

      const response = await fetch('http://localhost:8080/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderToCreate),
      });

      if (!response.ok) throw new Error('Błąd tworzenia folderu');
      
      await fetchFolders();
      setNewFolder({ name: '', projectId: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Rozpoczęcie edycji
  const startEditing = (folder: Folder) => {
    setEditingId(folder.id);
    setEditData({
      name: folder.name,
      projectId: folder.project?.id.toString() || ''
    });
  };

  // Anulowanie edycji
  const cancelEditing = () => {
    setEditingId(null);
    setEditData({ name: '', projectId: '' });
  };

  // Zapisanie zmian
  const handleUpdate = async () => {
    if (!editData.name) {
      setError('Nazwa folderu jest wymagana');
      return;
    }

    if (!editingId) return;

    setIsLoading(true);
    setError(null);
    try {
      const folderToUpdate = {
        name: editData.name,
        project: editData.projectId ? { id: Number(editData.projectId) } : null
      };

      const response = await fetch(`http://localhost:8080/api/folders/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(folderToUpdate),
      });

      if (!response.ok) throw new Error('Błąd aktualizacji folderu');
      
      await fetchFolders();
      setEditingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Usuwanie folderu
  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten folder?')) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/folders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Błąd usuwania folderu');
      
      await fetchFolders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie folderami</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Formularz tworzenia */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Nowy folder</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nazwa folderu"
            value={newFolder.name}
            onChange={(e) => setNewFolder({...newFolder, name: e.target.value})}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
          <input
            type="text"
            placeholder="ID projektu (opcjonalne)"
            value={newFolder.projectId}
            onChange={(e) => setNewFolder({...newFolder, projectId: e.target.value})}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          />
          <button
            onClick={handleCreate}
            disabled={isLoading || !newFolder.name}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Tworzenie...' : 'Dodaj folder'}
          </button>
        </div>
      </div>

      {/* Lista folderów */}
      <div className="space-y-4">
        {isLoading && folders.length === 0 ? (
          <p className="text-center py-4">Ładowanie folderów...</p>
        ) : folders.length === 0 ? (
          <p className="text-center py-4">Brak folderów</p>
        ) : (
          folders.map((folder) => (
            <div key={folder.id} className="bg-white rounded-lg shadow p-4">
              {editingId === folder.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    disabled={isLoading}
                  />
                  <input
                    type="text"
                    placeholder="ID projektu (opcjonalne)"
                    value={editData.projectId}
                    onChange={(e) => setEditData({...editData, projectId: e.target.value})}
                    className="w-full p-2 border rounded"
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
                      className="px-3 py-1 bg-green-600 text-white rounded"
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
                      <h2 className="text-xl font-semibold">{folder.name}</h2>
                      {folder.project && (
                        <p className="text-sm text-gray-600 mt-1">
                          Projekt: {folder.project.name} (ID: {folder.project.id})
                        </p>
                      )}
                      {folder.documents && folder.documents.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                          Liczba dokumentów: {folder.documents.length}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(folder)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                        disabled={isLoading}
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(folder.id)}
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