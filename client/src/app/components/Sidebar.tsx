// components/Sidebar.tsx
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: 'USER' | 'ADMIN';
};

const sections = [
  { id: 'notes', name: 'Notatki' },
  { id: 'projects', name: 'Projekty' },
  { id: 'comments', name: 'Komentarze' },
  { id: 'folders', name: 'Foldery' },
  { id: 'documents', name: 'Dokumenty' },
];

const Sidebar = ({ activeSection, setActiveSection, userRole }: SidebarProps) => {
  const router = useRouter();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen fixed">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          {sections.map((section) => {
            const isDisabled = userRole === 'USER' && section.id === 'projects';

            return (
              <li key={section.id}>
                <button
                  onClick={() => !isDisabled && setActiveSection(section.id)}
                  disabled={isDisabled}
                  className={`w-full text-left p-2 rounded transition-colors
                    ${activeSection === section.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    ${isDisabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent hover:text-gray-300' : ''}
                  `}
                >
                  {section.name}
                </button>
              </li>
            );
          })}
          <li className="pt-8 mt-8 border-t border-gray-700">
            <Link 
              href="/" 
              className="block p-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors"
            >
              Strona główna
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
