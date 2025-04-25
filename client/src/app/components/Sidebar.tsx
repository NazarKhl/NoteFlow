import Link from 'next/link';
import { useRouter } from 'next/navigation';

type SidebarProps = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const sections = [
  { id: 'projects', name: 'Projekty' },
  { id: 'notes', name: 'Notatki' },
  { id: 'comments', name: 'Komentarze' },
  { id: 'folders', name: 'Foldery' },
  { id: 'documents', name: 'Dokumenty' }
];

const Sidebar = ({ activeSection, setActiveSection }: SidebarProps) => {
  const router = useRouter();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen fixed">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left p-2 rounded transition-colors ${activeSection === section.id ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                {section.name}
              </button>
            </li>
          ))}
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