'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<string>('folders');
  const [newFolderName, setNewFolderName] = useState<string>('');
  const [editFolderId, setEditFolderId] = useState<number | null>(null);
  const [editFolderName, setEditFolderName] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const getToken = () => localStorage.getItem('token');
  const removeToken = () => localStorage.removeItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/pages/login');
          return;
        }

        const [projectsResponse, foldersResponse, userResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/projects', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/api/folders', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/api/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setProjects(projectsResponse.data);
        setFolders(foldersResponse.data);
        setUser(userResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        router.push('/pages/login');
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push('/pages/login');
  };

  const handleCreateFolder = async () => {
    const token = getToken();
    if (!token) {
      router.push('/pages/login');
      return;
    }

    try {
      const newFolder = { name: newFolderName, projectId: selectedProject };
      const response = await axios.post('http://localhost:8080/api/folders', newFolder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders([...folders, response.data]);
      setNewFolderName('');
      setSelectedProject(null);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleEditFolder = async () => {
    if (editFolderId === null) return;

    const token = getToken();
    if (!token) {
      router.push('/pages/login');
      return;
    }

    try {
      const updatedFolder = { name: editFolderName, projectId: selectedProject };
      const response = await axios.put(`http://localhost:8080/api/folders/${editFolderId}`, updatedFolder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(folders.map(folder => folder.id === editFolderId ? response.data : folder));
      setEditFolderId(null);
      setEditFolderName('');
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating folder:', error);
    }
  };

  const handleDeleteFolder = async (id: number) => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/folders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(folders.filter(folder => folder.id !== id));
    } catch (error) {
      console.error('Error deleting folder:', error);
    }
  };

  const handleEditClick = (id: number, name: string, projectId: number) => {
    setEditFolderId(id);
    setEditFolderName(name);
    setSelectedProject(projectId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full h-12 w-12 bg-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-[75vw] flex bg-gray-50">
      <main className="flex-1 p-6 lg:p-8 ml-[0px]">
        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Folder Creation Form */}
          <div className="mb-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nowa nazwa folderu"
              className="border p-2 rounded w-full text-black"
            />
            <select
              value={selectedProject ?? ''}
              onChange={(e) => setSelectedProject(Number(e.target.value))}
              className="border p-2 rounded w-full mt-2 text-black"
            >
              <option value="">Wybierz projekt</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            <button
              onClick={handleCreateFolder}
              className="mt-2 w-full p-2 bg-green-600 text-white rounded"
            >
              Stwórz folder
            </button>
          </div>

          {/* Folder Edit Form */}
          {editFolderId !== null && (
            <div className="mb-4">
              <input
                type="text"
                value={editFolderName}
                onChange={(e) => setEditFolderName(e.target.value)}
                className="border p-2 rounded w-full text-black"
              />
              <select
                value={selectedProject ?? ''}
                onChange={(e) => setSelectedProject(Number(e.target.value))}
                className="border p-2 rounded w-full mt-2 text-black"
              >
                <option value="">Wybierz projekt</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button
                onClick={handleEditFolder}
                className="mt-2 p-2 bg-yellow-600 text-white rounded text-black"
              >
                Edytuj folder
              </button>
            </div>
          )}

          {/* Folders List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
            {folders.map((folder) => (
              <div key={folder.id} className="border p-4 rounded shadow-sm">
                <h3 className="font-medium">{folder.name}</h3>
                <p className="text-gray-500">Projekt: {folder.name}</p>
                <button
                  onClick={() => handleEditClick(folder.id, folder.name, folder.projectId)}
                  className="mt-2 text-[#1e2939]"
                >
                  Edytuj
                </button>
                <button
                  onClick={() => handleDeleteFolder(folder.id)}
                  className="mt-2 ml-3 text-[#1e2939]"
                >
                  Usuń
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
