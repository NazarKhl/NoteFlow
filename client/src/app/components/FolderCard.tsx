'use client';

import { useState, useEffect } from 'react';

type Project = {
  id: number;
  name: string;
};

type Folder = {
  id: number;
  name: string;
  projects: Project[];
  documents?: Array<{
    id: number;
    fileName: string;
  }>;
};

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [newFolder, setNewFolder] = useState({ name: '', projectIds: [] as number[] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null); // Для редагування

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [foldersResponse, projectsResponse] = await Promise.all([
        fetch('http://localhost:8080/api/folders'),
        fetch('http://localhost:8080/api/projects')
      ]);

      if (!foldersResponse.ok) throw new Error('Błąd ładowania folderów');
      if (!projectsResponse.ok) throw new Error('Błąd ładowania projektów');

      const foldersData = await foldersResponse.json();
      const projectsData = await projectsResponse.json();

      setFolders(foldersData.map((folder: any) => ({
        ...folder,
        projects: folder.projects || [], 
      })));
      setAvailableProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create folder
  const handleCreate = async () => {
    if (!newFolder.name) {
      setError('Nazwa folderu jest wymagana');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newFolder.name,
          projectId: newFolder.projectIds[0]
        }),
      });

      if (!response.ok) throw new Error('Błąd tworzenia folderu');
      
      await fetchData();
      setNewFolder({ name: '', projectIds: [] });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Update folder
  const handleUpdate = async (folderId: number) => {
    if (!editingFolder?.name) {
      setError('Nazwa folderu jest wymagana');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingFolder),
      });

      if (!response.ok) throw new Error('Błąd aktualizacji folderu');
      
      await fetchData();
      setEditingFolder(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete folder
  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten folder?')) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/folders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Błąd usuwania folderu');
      
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove project from folder
  const removeProjectFromFolder = async (folderId: number, projectId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/api/folders/${folderId}/projects`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) throw new Error('Błąd usuwania projektu z folderu');
      
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the folder.projects check to guard against undefined
const toggleProjectInFolder = async (folderId: number, projectId: number) => {
  setIsLoading(true);
  setError(null);
  try {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return;

    const isAdding = !Array.isArray(folder.projects) || !folder.projects.some(p => p.id === projectId);
    
    const response = await fetch(`http://localhost:8080/api/folders/${folderId}`, {
      method: isAdding ? 'PUT' : 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ projectId }),
    });

    if (!response.ok) throw new Error(`Błąd ${isAdding ? 'dodawania' : 'usuwania'} projektu`);
    
    await fetchData();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Nieznany błąd');
  } finally {
    setIsLoading(false);
  }
};

  // Toggle project selection for new folder
  const toggleProjectSelection = (projectId: number) => {
    setNewFolder(prev => ({
      ...prev,
      projectIds: prev.projectIds.includes(projectId)
        ? prev.projectIds.filter(id => id !== projectId)
        : [...prev.projectIds, projectId]
    }));
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Zarządzanie folderami</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          disabled={isLoading}
        >
          {showForm ? 'Anuluj' : '+ Nowy folder'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Dodaj nowy folder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa folderu*</label>
              <input
                type="text"
                placeholder="Wprowadź nazwę folderu"
                value={newFolder.name}
                onChange={(e) => setNewFolder({...newFolder, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dostępne projekty</label>
              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded p-2">
                {availableProjects.length === 0 ? (
                  <p className="text-gray-500 text-sm">Brak dostępnych projektów</p>
                ) : (
                  availableProjects.map(project => (
                    <div key={project.id} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`project-${project.id}`}
                        checked={newFolder.projectIds.includes(project.id)}
                        onChange={() => toggleProjectSelection(project.id)}
                        className="mr-2 h-4 w-4 text-blue-600 rounded"
                        disabled={isLoading}
                      />
                      <label htmlFor={`project-${project.id}`} className="text-gray-800">
                        {project.name} (ID: {project.id})
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <button
              onClick={handleCreate}
              disabled={isLoading || !newFolder.name}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Tworzenie...' : 'Utwórz folder'}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {isLoading && folders.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : folders.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-800">Brak folderów</h3>
            <p className="mt-1 text-gray-600">Nie znaleziono żadnych folderów.</p>
          </div>
        ) : (
          folders.map((folder) => (
            <div key={folder.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow w-full sm:w-[300px]">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {editingFolder?.id === folder.id ? (
                      <input
                        type="text"
                        value={editingFolder.name}
                        onChange={(e) => setEditingFolder({ ...editingFolder, name: e.target.value })}
                        className="text-xl font-semibold text-gray-800"
                      />
                    ) : (
                      folder.name
                    )}
                  </h2>
                  {editingFolder?.id === folder.id ? (
                    <button
                      onClick={() => handleUpdate(folder.id)}
                      className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                      disabled={isLoading}
                    >
                      Zapisz
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingFolder(folder)}
                      className="ml-2 text-xs text-yellow-600 hover:text-yellow-800"
                      disabled={isLoading}
                    >
                      Edytuj
                    </button>
                  )}

                  {Array.isArray(folder.projects) && folder.projects.length > 0 && (
                    <div className="mt-3">
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Projekty w folderze ({folder.projects.length}):</h3>
                      <ul className="space-y-1">
                        {folder.projects.map(project => (
                          <li key={project.id} className="flex items-center">
                            <span className="text-gray-800">{project.name} (ID: {project.id})</span>
                            <button
                              onClick={() => removeProjectFromFolder(folder.id, project.id)}
                              className="ml-2 text-xs text-red-600 hover:text-red-800"
                              disabled={isLoading}
                            >
                              [usuń]
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {folder.documents && folder.documents.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Dokumenty:</span> {folder.documents.length}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(folder.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    disabled={isLoading}
                  >
                    Usuń folder
                  </button>
                </div>
              </div>

              <div className="mt-4 border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Dodaj projekty do folderu:</h3>
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-2">
                  {availableProjects.filter(p => !Array.isArray(folder.projects) || !folder.projects.some(fp => fp.id === p.id)).length === 0 ? (
                    <p className="text-gray-500 text-sm">Wszystkie dostępne projekty są już w folderze</p>
                  ) : (
                    availableProjects
                      .filter(p => !Array.isArray(folder.projects) || !folder.projects.some(fp => fp.id === p.id))                  
                      .map(project => (
                        <div key={project.id} className="flex items-center mb-1">
                          <button
                            onClick={() => toggleProjectInFolder(folder.id, project.id)}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                            disabled={isLoading}
                          >
                            + Dodaj
                          </button>
                          <span className="ml-2 text-gray-800">{project.name} (ID: {project.id})</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
