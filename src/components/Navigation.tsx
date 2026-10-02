import React from 'react';
import {
  LayoutDashboard,
  Activity,
  BookOpen,
  FileText,
  Image as ImageIcon,
  User,
  Pill,
  MessageSquare,
  Award,
  Building2,
  FolderOpen,
  ShieldCheck,
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'symptoms', label: 'Symptom Detector', icon: Activity },
    { id: 'diseases', label: 'Disease Directory', icon: BookOpen },
    { id: 'report', label: 'Medical Report', icon: FileText },
    { id: 'image-analysis', label: 'Image Analysis', icon: ImageIcon },
    { id: 'body-viewer', label: 'Body Viewer (3D)', icon: User },
    { id: 'pill-viewer', label: 'Pill Viewer', icon: Pill },
    { id: 'consult-chat', label: 'AI Consult Chat', icon: MessageSquare },
    { id: 'mcq-practice', label: 'MCQ Practice', icon: Award },
    { id: 'hospitals', label: 'Hospital Finder', icon: Building2 },
    { id: 'saved-reports', label: 'Saved Reports', icon: FolderOpen },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldCheck },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold border border-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
