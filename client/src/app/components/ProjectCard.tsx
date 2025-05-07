'use client';

import { useCallback, useEffect, useState } from 'react';
import { JSX } from 'react/jsx-runtime';

type Project = {
  id: number;
  name: string;
  description: string;
};

type ProjectFormData = Omit<Project, 'id'>;

type ProjectCardProps = {
  project: Project;
  onEdit?: (id: number, updatedProject: ProjectFormData) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onUpdateProjects?: () => void;
};

function ProjectCard(props: ProjectCardProps): JSX.Element {
  const {
    project,
    onEdit = async () => {},
    onDelete = async () => {},
    onUpdateProjects = () => {},
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<ProjectFormData>({
    name: project.name,
    description: project.description
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onDelete(project.id);
      setIsDeleteConfirmOpen(false);
      setIsModalOpen(false);
      onUpdateProjects();
    } catch (err) {
      setError('Wystąpił błąd podczas usuwania projektu');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await onEdit(project.id, editFormData);
      setIsEditing(false);
      onUpdateProjects();
    } catch (err) {
      setError('Wystąpił błąd podczas zapisywania zmian');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <div
        className="bg-white shadow-lg rounded p-4 cursor-pointer hover:bg-gray-100 transition relative"
        onClick={() => !isEditing && setIsModalOpen(true)}
      >
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Nazwa projektu"
              disabled={isLoading}
            />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Opis"
              disabled={isLoading}
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1 bg-gray-300 rounded"
                disabled={isLoading}
              >
                Anuluj
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={isLoading}
              >
                {isLoading ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-700">{project.name}</h3>
            <p className="text-gray-700">{project.description}</p>
          </>
        )}
      </div>

      {isModalOpen && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-black">{project.name}</h2>
            <p className="mb-2 text-black"><strong>Opis:</strong> {project.description}</p>
            
            <div className="flex justify-between mt-4">
              <div className="space-x-2">
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(true);
                  }}
                  disabled={isLoading}
                >
                  Edytuj
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={isLoading}
                >
                  Usuń
                </button>
              </div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-black">Potwierdzenie usunięcia</h2>
            <p className="mb-4 text-black">Czy na pewno chcesz usunąć projekt "{project.name}"?</p>
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isLoading}
              >
                Anuluj
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? 'Usuwanie...' : 'Usuń'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState<ProjectFormData>({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8080/api/projects');
      if (!response.ok) throw new Error('Błąd pobierania projektów');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError('Nie udało się załadować projektów');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8080/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Błąd tworzenia projektu');
      }

      await fetchProjects();
      setShowForm(false);
      setNewProject({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = async (id: number, updated: ProjectFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      
      if (!res.ok) throw new Error('Błąd aktualizacji projektu');

      const updatedProject = await res.json();
      setProjects(prev => prev.map(p => (p.id === id ? updatedProject : p)));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${id}`, { method: 'DELETE' });
      
      if (!res.ok) throw new Error('Błąd usuwania projektu');

      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Projekty</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(prev => !prev)}
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        disabled={isLoading}
      >
        {showForm ? 'Anuluj' : 'Utwórz nowy projekt'}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border rounded bg-gray-50 space-y-4">
          <input
            type="text"
            name="name"
            value={newProject.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Nazwa projektu"
            disabled={isLoading}
            required
          />
          <textarea
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Opis"
            disabled={isLoading}
            required
          />
          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !newProject.name || !newProject.description}
          >
            {isLoading ? 'Tworzenie...' : 'Dodaj projekt'}
          </button>
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="p-4 text-center">Ładowanie projektów...</div>
      ) : projects.length === 0 ? (
        <div className="p-4 text-center">Brak projektów</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              onUpdateProjects={fetchProjects}
            />
          ))}
        </div>
      )}
    </div>
  );
}