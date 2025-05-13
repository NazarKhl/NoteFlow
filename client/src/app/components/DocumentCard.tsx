'use client';

import { useState, useEffect } from 'react';

type Document = {
  id: number;
  fileName: string;
  filePath: string;
  upload_date: string;
  user?: {
    id: number;
    username: string;
  };
  folder?: {
    id: number;
    name: string;
  };
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [folderId, setFolderId] = useState<string>('');

  // Pobieranie dokumentów
  const fetchDocuments = async (query = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = query 
        ? `http://localhost:8080/api/documents/search?query=${encodeURIComponent(query)}`
        : 'http://localhost:8080/api/documents';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Błąd ładowania dokumentów');
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Obsługa wyboru pliku
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Proszę wybrać plik');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    if (folderId) {
      formData.append('folderId', folderId);
    }

    try {
      const response = await fetch('http://localhost:8080/api/documents', {
        method: 'POST',
        body: formData,
        // headers are omitted here as FormData will automatically set 'Content-Type'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd podczas uploadu pliku');
      }

      await fetchDocuments(searchQuery);  // Reload the document list
      setSelectedFile(null);  // Reset the selected file
      setFolderId('');        // Reset the folder input
      // Reset the file input field
      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd podczas uploadu');
    } finally {
      setIsLoading(false);
    }
};

  // Usuwanie dokumentu
  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten dokument?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Błąd usuwania dokumentu');
      
      await fetchDocuments(searchQuery);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  // Obsługa wyszukiwania
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments(searchQuery);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie dokumentami</h1>

      {/* Formularz uploadu */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-3">Dodaj nowy dokument</h2>
        <div className="space-y-3">
          <div>
            <label className="block mb-1">Wybierz plik:</label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label className="block mb-1">ID folderu (opcjonalne):</label>
            <input
              type="text"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Wpisz ID folderu"
              disabled={isLoading}
            />
          </div>
          
          <button
            onClick={handleUpload}
            disabled={isLoading || !selectedFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {isLoading ? 'Wysyłanie...' : 'Wyślij plik'}
          </button>
        </div>
      </div>

      {/* Wyszukiwarka */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Wyszukaj dokumenty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={isLoading}
          >
            Szukaj
          </button>
          <button 
            type="button" 
            onClick={() => {
              setSearchQuery('');
              fetchDocuments();
            }}
            className="px-4 py-2 bg-gray-200 rounded"
            disabled={isLoading}
          >
            Wyczyść
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Lista dokumentów */}
      <div className="space-y-4">
        {isLoading ? (
          <p className="text-center py-4">Ładowanie dokumentów...</p>
        ) : documents.length === 0 ? (
          <p className="text-center py-4">Brak dokumentów</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow p-4 border">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{doc.fileName}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Ścieżka: {doc.filePath}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    Data uploadu: {new Date(doc.upload_date).toLocaleString()}
                  </div>
                  {doc.user && (
                    <div className="text-xs text-gray-500">
                      Użytkownik: {doc.user.username}
                    </div>
                  )}
                  {doc.folder && (
                    <div className="text-xs text-gray-500">
                      Folder: {doc.folder.name} (ID: {doc.folder.id})
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={`http://localhost:8080${doc.filePath}`} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Pobierz
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                    disabled={isLoading}
                  >
                    Usuń
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