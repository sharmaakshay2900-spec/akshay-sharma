import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SymptomDiseaseDetector from './components/SymptomDiseaseDetector';
import DiseaseDirectory from './components/DiseaseDirectory';
import MedicalReportGenerator from './components/MedicalReportGenerator';
import ImageReportAnalyzer from './components/ImageReportAnalyzer';
import BodyViewer3D from './components/BodyViewer3D';
import PillViewer3D from './components/PillViewer3D';
import AIConsultChat from './components/AIConsultChat';
import MCQDatasetViewer from './components/MCQDatasetViewer';
import HospitalFinder from './components/HospitalFinder';
import SavedReportsManager from './components/SavedReportsManager';
import AdminDashboard from './components/AdminDashboard';
import LoginPage from './components/LoginPage';
import { getCurrentUser, setCurrentUser as setStorageUser, fetchFirestoreReports, DemoUser } from './services/storageService';
import { testConnection, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Server, Settings, AlertTriangle, ShieldCheck, Cpu, Database } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedDiseaseForExplainer, setSelectedDiseaseForExplainer] = useState<string | null>(null);

  useEffect(() => {
    // 1. Test Firestore connection on boot as mandated by Firebase specification
    testConnection();

    // 2. Listen to Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const user: DemoUser = {
          id: fbUser.uid,
          email: fbUser.email || 'user@healthanalyzer.org',
          name: fbUser.displayName || 'Clinical User',
          role: 'user',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          photoURL: fbUser.photoURL || undefined,
        };
        setCurrentUser(user);
        setStorageUser(user);
        // Sync reports from Firestore
        await fetchFirestoreReports(fbUser.uid);
      } else {
        const local = getCurrentUser();
        if (local) {
          setCurrentUser(local);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSelectSymptomFromAnatomy = (symptom: string) => {
    setActiveTab('symptoms');
  };

  const handleSelectDiseaseFromDetector = (diseaseName: string) => {
    setSelectedDiseaseForExplainer(diseaseName);
    setActiveTab('diseases');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans">
      {/* Top Banner Header */}
      <Header
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        onNavigateLogin={() => setActiveTab('login')}
      />

      {/* Navigation Sub-Bar */}
      {activeTab !== 'login' && (
        <Navigation
          activeTab={activeTab}
          onSelectTab={(tabId) => {
            setActiveTab(tabId);
            if (tabId !== 'diseases') setSelectedDiseaseForExplainer(null);
          }}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'login' && (
          <LoginPage
            onLoginSuccess={() => {
              setCurrentUser(getCurrentUser());
              setActiveTab('dashboard');
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            user={currentUser}
            onNavigate={(tabId) => setActiveTab(tabId)}
          />
        )}

        {activeTab === 'symptoms' && (
          <SymptomDiseaseDetector
            onSelectDisease={handleSelectDiseaseFromDetector}
          />
        )}

        {activeTab === 'diseases' && (
          <DiseaseDirectory
            initialSelectedDisease={selectedDiseaseForExplainer}
          />
        )}

        {activeTab === 'report' && <MedicalReportGenerator />}

        {activeTab === 'image-analysis' && <ImageReportAnalyzer />}

        {activeTab === 'body-viewer' && (
          <BodyViewer3D onSelectSymptom={handleSelectSymptomFromAnatomy} />
        )}

        {activeTab === 'pill-viewer' && <PillViewer3D />}

        {activeTab === 'consult-chat' && <AIConsultChat />}

        {activeTab === 'mcq-practice' && <MCQDatasetViewer />}

        {activeTab === 'hospitals' && <HospitalFinder />}

        {activeTab === 'saved-reports' && <SavedReportsManager />}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Clean Clinical Medical Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* About Platform */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-sm">Health Analyzer</div>
              <p className="text-slate-500 text-xs leading-relaxed">
                An intelligent clinical exploration suite providing symptom assessments, medical reference guides, blood test and scan interpretations, and interactive anatomy learning.
              </p>
            </div>

            {/* Quick Health Modules */}
            <div className="space-y-2">
              <div className="font-bold text-slate-900 text-sm">Clinical Modules</div>
              <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-500">
                <button onClick={() => setActiveTab('symptoms')} className="text-left hover:text-blue-600 transition-colors cursor-pointer">Symptom Detector</button>
                <button onClick={() => setActiveTab('image-analysis')} className="text-left hover:text-blue-600 transition-colors cursor-pointer">Blood & Scan Analysis</button>
                <button onClick={() => setActiveTab('diseases')} className="text-left hover:text-blue-600 transition-colors cursor-pointer">Disease Directory</button>
                <button onClick={() => setActiveTab('body-viewer')} className="text-left hover:text-blue-600 transition-colors cursor-pointer">3D Body Viewer</button>
                <button onClick={() => setActiveTab('hospitals')} className="text-left hover:text-blue-600 transition-colors cursor-pointer">AIIMS Directory</button>
                <button onClick={() => setActiveTab('mcq-practice')} className="text-left hover:text-blue-600 transition-colors cursor-pointer">MCQ Practice</button>
              </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Medical Disclaimer</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Information and estimates provided by this platform are for educational and exploratory purposes only. They do not constitute personalized medical advice, formal clinical diagnosis, or prescriptions. Always consult a licensed healthcare practitioner for medical concerns.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
            <div>Health Analyzer · Medical & Clinical Exploration Suite</div>
            <div>Educational Healthcare Intelligence</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
