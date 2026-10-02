import React from 'react';
import { Activity, LogOut, User, Cloud } from 'lucide-react';
import { logoutUser } from '../services/storageService';
import { logoutFirebase } from '../firebase';

interface HeaderProps {
  user: any;
  onLogout: () => void;
  onNavigateLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onNavigateLogin }) => {
  const handleLogout = async () => {
    try {
      await logoutFirebase();
    } catch {
      // ignore
    }
    logoutUser();
    onLogout();
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white shadow-sm border-b border-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-inner shrink-0">
            <Activity className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Health Analyzer
              </h1>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                <Cloud className="w-3 h-3 text-emerald-300" />
                <span>Cloud Sync</span>
              </span>
            </div>
            <p className="text-xs text-blue-200 font-normal">
              Medical Health & Symptom Explorer
            </p>
          </div>
        </div>

        {/* Right Info Banner & User Status */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <div className="hidden lg:block text-right text-xs text-blue-100 leading-snug border-r border-blue-600/40 pr-4 max-w-sm">
            Explore health symptoms, medical conditions, lab reports, and anatomy.
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 py-1.5 px-3 rounded-xl">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-white/20"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-blue-500/40 flex items-center justify-center text-xs font-bold text-white">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                )}
                <div className="text-left">
                  <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                  <div className="text-[10px] text-blue-200 truncate max-w-[110px]">
                    {user.email || 'Cloud Account'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-2 p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onNavigateLogin}
                className="py-1.5 px-3.5 bg-white text-blue-900 font-semibold text-xs rounded-xl shadow-sm hover:bg-blue-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In / Sync</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
