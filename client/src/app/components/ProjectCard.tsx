'use client';

import { useCallback, useEffect, useState } from 'react';
import { JSX } from 'react/jsx-runtime';

type User = {
  id: number;
  username: string;
  email: string;
};

type Project = {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  userId: number;
};

type ProjectFormData = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  userId: number;
};

type ProjectCardProps = {
  project: Project;
  users: User[];
  onEdit?: (id: number, updatedProject: ProjectFormData) => Promise<void>;
  onDelete?: (id: number) => Promise<void>;
  onUpdateProjects?: () => void;
};

function ProjectCard(props: ProjectCardProps): JSX.Element {
  const {
    project,
    users,
    onEdit = async () => {},
    onDelete = async () => {},
    onUpdateProjects = () => {},
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<ProjectFormData>({
    name: project.name,
    description: project.description,
    startDate: project.startDate,
    endDate: project.endDate,
    userId: project.userId
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
      [name]: name === 'userId' ? Number(value) : value
    }));
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Nie określono';
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL');
  };

  return (
    <>
      <div
        className="bg-gray-800 text-gray-100 shadow-lg rounded-lg p-4 cursor-pointer hover:bg-gray-700 transition relative border border-gray-700"
        onClick={() => !isEditing && setIsModalOpen(true)}
      >
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              placeholder="Nazwa projektu"
              disabled={isLoading}
            />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              placeholder="Opis"
              disabled={isLoading}
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data rozpoczęcia</label>
                <input
                  type="date"
                  name="startDate"
                  value={editFormData.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Data zakończenia</label>
                <input
                  type="date"
                  name="endDate"
                  value={editFormData.endDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Właściciel projektu</label>
              <select
                name="userId"
                value={editFormData.userId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                disabled={isLoading}
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 mt-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                disabled={isLoading}
              >
                Anuluj
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-500 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-white">{project.name}</h3>
            <p className="text-gray-300 mt-1">{project.description}</p>
            <div className="flex gap-4 mt-3 text-sm text-gray-400">
              <div>
                <span className="font-medium">Od:</span> {formatDate(project.startDate)}
              </div>
              <div>
                <span className="font-medium">Do:</span> {formatDate(project.endDate)}
              </div>
            </div>
          </>
        )}
      </div>

      {isModalOpen && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-white">{project.name}</h2>
            <p className="mb-2 text-gray-300"><strong className="text-gray-400">Opis:</strong> {project.description}</p>
            <div className="mb-3 text-gray-400">
              <p><strong>Data rozpoczęcia:</strong> {formatDate(project.startDate)}</p>
              <p><strong>Data zakończenia:</strong> {formatDate(project.endDate)}</p>
            </div>
            
            <div className="flex justify-between mt-6">
              <div className="space-x-2">
                <button
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-500 transition"
                  onClick={() => {
                    setIsModalOpen(false);
                    setIsEditing(true);
                  }}
                  disabled={isLoading}
                >
                  Edytuj
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={isLoading}
                >
                  Usuń
                </button>
              </div>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-white">Potwierdzenie usunięcia</h2>
            <p className="mb-4 text-gray-300">Czy na pewno chcesz usunąć projekt "{project.name}"?</p>
            {error && (
              <div className="mb-4 p-2 bg-red-900 text-red-100 rounded">
                {error}
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isLoading}
              >
                Anuluj
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
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
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState<ProjectFormData>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    userId: 0
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

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users');
      if (!response.ok) throw new Error('Błąd pobierania użytkowników');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      console.error('Błąd pobierania użytkowników:', err);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, [fetchProjects, fetchUsers]);

  const handleCreateProject = async () => {
    if (newProject.userId === 0) {
      setError('Proszę wybrać właściciela projektu');
      return;
    }

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
      setNewProject({ name: '', description: '', startDate: '', endDate: '', userId: 0 });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProject = async (id: number, updated: ProjectFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Błąd aktualizacji projektu');
      }

      const updatedProject = await res.json();
      setProjects(prev => prev.map(p => (p.id === id ? updatedProject : p)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8080/api/projects/${id}`, { method: 'DELETE' });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Błąd usuwania projektu');
      }

      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProject(prev => ({ 
      ...prev, 
      [name]: name === 'userId' ? Number(value) : value 
    }));
  };

  return (
    <div className="p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Projekty</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-900 text-red-100 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(prev => !prev)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
        disabled={isLoading}
      >
        {showForm ? 'Anuluj' : 'Utwórz nowy projekt'}
      </button>

      {showForm && (
        <div className="mb-6 p-4 border border-gray-700 rounded-lg bg-gray-800 space-y-4">
          <input
            type="text"
            name="name"
            value={newProject.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            placeholder="Nazwa projektu"
            disabled={isLoading}
            required
          />
          <textarea
            name="description"
            value={newProject.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
            placeholder="Opis"
            disabled={isLoading}
            required
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data rozpoczęcia</label>
              <input
                type="date"
                name="startDate"
                value={newProject.startDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Data zakończenia</label>
              <input
                type="date"
                name="endDate"
                value={newProject.endDate}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Właściciel projektu</label>
            <select
              name="userId"
              value={newProject.userId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-600 rounded bg-gray-700 text-white"
              disabled={isLoading}
              required
            >
              <option value="0">Wybierz użytkownika</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCreateProject}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition disabled:opacity-50"
            disabled={isLoading || !newProject.name || !newProject.description || newProject.userId === 0}
          >
            {isLoading ? 'Tworzenie...' : 'Dodaj projekt'}
          </button>
        </div>
      )}

      {isLoading && projects.length === 0 ? (
        <div className="p-4 text-center text-gray-400">Ładowanie projektów...</div>
      ) : projects.length === 0 ? (
        <div className="p-4 text-center text-gray-400">Brak projektów</div>
      ) : (
        <div className="grid gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              users={users}
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