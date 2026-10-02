import React, { useState } from 'react';
import { BookOpen, Volume2, CheckCircle2, AlertCircle, ShieldAlert, ArrowLeft } from 'lucide-react';

interface DiseaseExplainerProps {
  disease: any;
  onBack?: () => void;
}

export const DiseaseExplainer: React.FC<DiseaseExplainerProps> = ({ disease, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'symptoms' | 'treatment' | 'prevention'>('overview');
  const [mode, setMode] = useState<'plain' | 'clinical'>('plain');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!disease) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
        No disease selected.
      </div>
    );
  }

  const handleSpeak = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead =
      mode === 'plain'
        ? `${disease.name}. ${disease.plainEnglish || disease.shortDescription}`
        : `${disease.name}. ${disease.clinical || disease.overview}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Back to Directory"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{disease.name}</h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                {disease.category}
              </span>
              {disease.isChronic && (
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                  Chronic
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specialist: <span className="font-semibold text-slate-700">{disease.doctorSpecialty}</span> · Urgency: <span className="text-amber-700 font-medium">{disease.urgencyGuidance}</span>
            </p>
          </div>
        </div>

        {/* Plain English vs Clinical Mode & Audio Button */}
        <div className="flex items-center gap-2">
          {/* Segmented Mode Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => setMode('plain')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'plain'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plain English
            </button>
            <button
              onClick={() => setMode('clinical')}
              className={`px-3 py-1 font-semibold rounded-lg transition-all cursor-pointer ${
                mode === 'clinical'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Clinical
            </button>
          </div>

          {/* Listen (Audio) Button */}
          <button
            onClick={handleSpeak}
            className={`py-1.5 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isPlayingAudio
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 animate-pulse'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Volume2 className="w-4 h-4 text-blue-600" />
            <span>{isPlayingAudio ? 'Stop Audio' : 'Listen (Audio)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-100 text-xs font-medium">
        {(['overview', 'symptoms', 'treatment', 'prevention'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2.5 px-3 border-b-2 capitalize transition-all cursor-pointer ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">
                {mode === 'plain' ? 'What you need to know:' : 'Clinical Pathology & Description:'}
              </span>
              {mode === 'plain'
                ? disease.plainEnglish || disease.shortDescription
                : disease.clinical || disease.overview}
            </div>

            {disease.riskFactors && disease.riskFactors.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Key Risk Factors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {disease.riskFactors.map((rf: string) => (
                    <span
                      key={rf}
                      className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg"
                    >
                      {rf}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'symptoms' && (
          <div className="space-y-3">
            <span className="text-xs text-slate-600 block">
              Typical symptoms documented for {disease.name}:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {disease.symptoms.map((s: string) => (
                <div
                  key={s}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="capitalize">{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'treatment' && (
          <div className="space-y-2">
            <span className="text-xs text-slate-600 block">
              Standard clinical management & therapy modalities:
            </span>
            <ul className="space-y-2">
              {disease.treatments?.map((t: string, i: number) => (
                <li
                  key={i}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'prevention' && (
          <div className="space-y-2">
            <span className="text-xs text-slate-600 block">
              Evidence-based preventive guidelines:
            </span>
            <ul className="space-y-2">
              {disease.prevention?.map((p: string, i: number) => (
                <li
                  key={i}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
        Reference Dataset ID: {disease.id} · Educational reference only. Verify current medical recommendations from accredited guidelines.
      </div>
    </div>
  );
};

export default DiseaseExplainer;
