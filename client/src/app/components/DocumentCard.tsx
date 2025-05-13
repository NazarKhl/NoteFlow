'use client';

import { useState, useEffect } from 'react';

type Document = {
  id: number;
  fileName: string;
  fileType: string;
  fileData: string;
  upload_date: string;
  folderId?: number;
  userId?: number;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchDocuments = async (query = '') => {
    setIsLoading(true);
    setError(null);
    try {
      const url = query 
        ? `http://localhost:8080/api/documents/search?query=${encodeURIComponent(query)}`
        : 'http://localhost:8080/api/documents';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Błąd podczas ładowania dokumentów');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] || null);
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

    try {
      const response = await fetch('http://localhost:8080/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Błąd podczas przesyłania pliku');
      }

      const newDocument = await response.json();
      setDocuments([newDocument, ...documents]);
      setSelectedFile(null);
      (document.getElementById('fileInput') as HTMLInputElement).value = '';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Czy na pewno chcesz usunąć ten dokument?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Błąd podczas usuwania');

      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/documents/${id}/download`);
      if (!response.ok) throw new Error('Błąd podczas pobierania');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      const doc = documents.find(d => d.id === id);
      link.href = url;
      link.setAttribute('download', doc?.fileName || 'dokument');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd podczas pobierania');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments(searchQuery);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl bg-white text-black min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Zarządzanie dokumentami</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded-lg border border-gray-300">
        <h2 className="text-xl font-semibold mb-3">Dodaj nowy dokument</h2>
        <div className="space-y-3">
          <div>
            <label className="block mb-1">Wybierz plik:</label>
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-black
                file:mr-4 file:py-2 file:px-4
                file:rounded file:border-0
                file:text-sm file:font-semibold
                file:bg-green-500 file:text-white
                hover:file:bg-green-600"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={isLoading || !selectedFile}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Wysyłanie...' : 'Prześlij dokument'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Szukaj dokumentów..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-400 bg-white rounded focus:ring-2 focus:ring-green-500 text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
            className="px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Wyczyść
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mb-2"></div>
            <p className="text-black">Ładowanie dokumentów...</p>
          </div>
        ) : documents.length === 0 ? (
          <p className="text-center py-8 text-black">Brak dokumentów</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-300 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{doc.fileName}</h2>
                  <div className="text-xs text-gray-500 mt-2">
                    Data przesłania: {new Date(doc.upload_date).toLocaleString('pl-PL')}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(doc.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    disabled={isLoading}
                  >
                    Pobierz
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
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
