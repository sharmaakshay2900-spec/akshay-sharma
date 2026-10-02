import React from 'react';
import {
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
  ChevronRight,
  ArrowRight,
  Heart,
  ShieldCheck,
  Stethoscope,
  Info
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tabId: string) => void;
  user?: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const cards = [
    {
      id: 'symptoms',
      title: 'Symptom Detector',
      description: 'Enter symptoms and receive possible conditions with recommended doctor specialties',
      icon: Activity,
      badge: 'Symptom Check',
    },
    {
      id: 'diseases',
      title: 'Disease Directory',
      description: 'Browse medical conditions, symptoms, and clinical treatments in plain English',
      icon: BookOpen,
      badge: 'Medical Library',
    },
    {
      id: 'report',
      title: 'Medical Report & Rx',
      description: 'Generate structured patient evaluations, vital summaries, and care recommendations',
      icon: FileText,
      badge: 'Clinical Report',
    },
    {
      id: 'image-analysis',
      title: 'Image & Scan Analysis',
      description: 'Upload blood test reports, X-rays, and medical images for clinical interpretation',
      icon: ImageIcon,
      badge: 'Scan & Lab Reader',
    },
    {
      id: 'body-viewer',
      title: 'Body Viewer (3D)',
      description: 'Interactive human anatomy explorer across head, chest, abdomen, and limbs',
      icon: User,
      badge: 'Human Anatomy',
    },
    {
      id: 'pill-viewer',
      title: 'Pill Viewer',
      description: 'Examine 3D medicine models, indications, mechanisms, and safety warnings',
      icon: Pill,
      badge: 'Pharmaceuticals',
    },
    {
      id: 'consult-chat',
      title: 'AI Consult Chat',
      description: 'Ask clinical triage questions and get direct, concise medical explanations',
      icon: MessageSquare,
      badge: 'Health Assistant',
    },
    {
      id: 'mcq-practice',
      title: 'MCQ Practice',
      description: 'Practice 100+ clinical and health board-style questions with instant rationales',
      icon: Award,
      badge: 'Knowledge Quiz',
    },
    {
      id: 'hospitals',
      title: 'Hospital & AIIMS Finder',
      description: 'Locate premier AIIMS institutions, medical centers, and specialties across India',
      icon: Building2,
      badge: 'Hospitals',
    },
    {
      id: 'saved-reports',
      title: 'Saved Reports',
      description: 'Access, print, and manage your saved patient evaluation records',
      icon: FolderOpen,
      badge: 'Saved Records',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner - Clean, elegant, no tech jargon, no fake doctor name */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-lg text-xs font-medium mb-3 text-blue-100">
            <Heart className="w-3.5 h-3.5 text-blue-200 fill-blue-200" />
            <span>Interactive Health Analysis & Diagnostic Learning Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome to Health Analyzer
          </h1>
          <p className="text-blue-100 text-sm mt-2 leading-relaxed">
            A comprehensive clinical explorer to analyze symptoms, review blood test reports and scans, inspect 3D anatomy, and look up verified medical reference guides.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('symptoms')}
              className="py-2.5 px-4 bg-white text-blue-900 font-semibold text-xs rounded-xl shadow hover:bg-blue-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Check Symptoms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate('image-analysis')}
              className="py-2.5 px-4 bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-xs rounded-xl border border-white/20 transition-all cursor-pointer"
            >
              <span>Analyze Blood Report / Scan</span>
            </button>
            <button
              onClick={() => onNavigate('hospitals')}
              className="py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl border border-white/15 transition-all cursor-pointer"
            >
              <span>Find Hospitals & AIIMS</span>
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Activity className="w-80 h-80" />
        </div>
      </div>

      {/* Main Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Health Tools & Explorers</h2>
          <span className="text-xs text-slate-500">10 Clinical Features</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-50 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-md">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600 group-hover:text-blue-600">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Highlights / Health Information Strip (Clean, user-centric, no internal tech logs) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-600">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800 mb-0.5">Clinical Decision Support</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Analyze complex symptoms against structured clinical benchmarks to identify potential conditions and recommended doctor specialties.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800 mb-0.5">Verified Medical Information</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Explore reference datasets for diseases, medications, AIIMS institutes, and educational multiple-choice practice tests.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-800 mb-0.5">Educational Guidance</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Provides triage insights and physiological overviews. Consult a certified medical practitioner for definitive clinical diagnosis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
