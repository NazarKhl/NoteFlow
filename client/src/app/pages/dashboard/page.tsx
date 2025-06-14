// pages/DashboardPage.tsx або components/DashboardPage.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/app/lib/api';
import { getToken, removeToken } from '@/app/lib/auth';
import Sidebar from '@/app/components/Sidebar';
import ProjectCard from '@/app/components/ProjectCard';
import NoteCard from '@/app/components/NoteCard';
import CommentCard from '@/app/components/CommentCard';
import FolderCard from '@/app/components/FolderCard';
import DocumentCard from '@/app/components/DocumentCard';

type UserRole = 'USER' | 'ADMIN';

const DashboardPage = () => {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<string>('notes');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          router.push('/pages/login');
          return;
        }

        const userResponse = await axios.get('users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userResponse.data);

        const roles: string[] = userResponse.data.roles || [];
        const role: UserRole = roles.includes('ROLE_ADMIN') ? 'ADMIN' : 'USER';
        setUserRole(role);

        if (role === 'USER' && activeSection === 'projects') {
          setActiveSection('notes');
        }

        const [notesResponse, projectsResponse, commentsResponse, foldersResponse, documentsResponse] = await Promise.all([
          axios.get('/note', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/projects', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/comments', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/folders', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/documents', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setNotes(notesResponse.data);
        setProjects(projectsResponse.data);
        setComments(commentsResponse.data);
        setFolders(foldersResponse.data);
        setDocuments(documentsResponse.data);
      } catch (error) {
        console.error(error);
        removeToken();
        router.push('/pages/login');
      }
    };

    fetchData();
  }, [router, activeSection]);

  const handleLogout = () => {
    removeToken();
    router.push('/pages/login');
  };

  if (!user || !userRole) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full h-12 w-12 bg-blue-400"></div>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'projects':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        );
      case 'notes':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        );
      case 'comments':
        return (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))}
          </div>
        );
      case 'folders':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {folders.map((folder) => (
              <FolderCard key={folder.id} folder={folder} />
            ))}
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-4">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const activeItems = (() => {
    switch (activeSection) {
      case 'projects':
        return projects;
      case 'notes':
        return notes;
      case 'comments':
        return comments;
      case 'folders':
        return folders;
      case 'documents':
        return documents;
      default:
        return [];
    }
  })();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userRole={userRole}
      />

      <main className="flex-1 p-6 lg:p-8 ml-[250px]">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-light text-gray-800">
              Witaj
              <span className="font-medium">
                <p className="text-sm text-gray-500 mt-1">@{user.username}</p>
              </span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Wyloguj się
          </button>
        </header>

        <section className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-medium text-gray-800 capitalize">
            {activeSection === 'projects' && 'Twoje projekty'}
            {activeSection === 'notes' && 'Twoje notatki'}
            {activeSection === 'comments' && 'Twoje komentarze'}
            {activeSection === 'folders' && 'Twoje foldery'}
            {activeSection === 'documents' && 'Twoje dokumenty'}
          </h2>
          <span className="text-xs text-gray-400">
            {`${activeItems.length} ${activeItems.length === 1 ? 'element' : 'elementów'}`}
          </span>
        </section>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {renderSection()}

          {activeItems.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Brak elementów</h3>
              <p className="mt-1 text-sm text-gray-500">
                Nie znaleziono żadnych {activeSection} w Twoim koncie.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
