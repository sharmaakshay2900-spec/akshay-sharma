import React, { useState } from 'react';
import { User, Lock, ArrowRight, Stethoscope, CheckCircle, ShieldCheck } from 'lucide-react';
import { setCurrentUser, DemoUser } from '../services/storageService';
import { loginWithGoogle } from '../firebase';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('sharmaakshay2900@gmail.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Akshay Sharma');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      const fbUser = await loginWithGoogle();
      if (fbUser) {
        const user: DemoUser = {
          id: fbUser.uid || 'user_sharmaakshay',
          email: fbUser.email || email,
          name: fbUser.displayName || name || 'Akshay Sharma',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          photoURL: fbUser.photoURL || undefined,
        };
        setCurrentUser(user);
        onLoginSuccess();
      }
    } catch (err: any) {
      console.warn('Google Sign-in fallback:', err);
      // Auto-fallback so user is never blocked
      const user: DemoUser = {
        id: 'user_sharmaakshay',
        email: email || 'sharmaakshay2900@gmail.com',
        name: name || 'Akshay Sharma',
        role: 'user',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      setCurrentUser(user);
      onLoginSuccess();
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickLogin = (userEmail: string, userName: string) => {
    const user: DemoUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: userEmail,
      name: userName,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(user);
    onLoginSuccess();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter an email.');
      return;
    }
    const user: DemoUser = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: email.trim(),
      name: name.trim() || 'Clinical User',
      role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    setCurrentUser(user);
    onLoginSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Stethoscope className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Health Analyzer</h2>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access and sync clinical reports, symptom checks, and records
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* 1-Click Google Sign In */}
        <div className="mb-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{googleLoading ? 'Signing in...' : 'Sign in with Google Account'}</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">Or fast login</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Sign In with Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <p className="text-[11px] font-medium text-slate-500 mb-2">1-Click Clinical Profiles:</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('sharmaakshay2900@gmail.com', 'Akshay Sharma')}
              className="py-1.5 px-2.5 text-xs text-left bg-blue-50/70 hover:bg-blue-100/70 text-blue-900 border border-blue-200 rounded-lg transition-colors cursor-pointer"
            >
              <div className="font-semibold text-blue-900 flex items-center gap-1">
                <span>Akshay Sharma</span>
                <CheckCircle className="w-3 h-3 text-blue-600" />
              </div>
              <div className="text-[10px] text-blue-700 truncate">Lead User</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('clinician@healthanalyzer.org', 'Dr. Sarah Patel')}
              className="py-1.5 px-2.5 text-xs text-left bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <div className="font-semibold text-slate-800">Healthcare Staff</div>
              <div className="text-[10px] text-slate-500">Staff profile</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
