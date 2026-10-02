import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Stethoscope,
  ShieldAlert,
  Save,
  HelpCircle,
  Clock,
  User,
  Plus,
  X
} from 'lucide-react';
import api, { SymptomAnalysisResponse } from '../services/api';
import { saveSymptomHistory } from '../services/storageService';

interface SymptomDiseaseDetectorProps {
  onSelectDisease?: (diseaseName: string) => void;
}

const COMMON_SYMPTOMS = [
  'fever', 'cough', 'headache', 'fatigue', 'sore throat',
  'runny nose', 'shortness of breath', 'chest pain', 'body ache',
  'nausea', 'vomiting', 'diarrhea', 'joint pain', 'skin rash'
];

export const SymptomDiseaseDetector: React.FC<SymptomDiseaseDetectorProps> = ({ onSelectDisease }) => {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fever', 'cough', 'fatigue']);
  const [bodyArea, setBodyArea] = useState('Chest');
  const [age, setAge] = useState('28');
  const [duration, setDuration] = useState('3 days');
  const [severity, setSeverity] = useState('Moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<SymptomAnalysisResponse | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const addSymptom = (sym: string) => {
    const cleaned = sym.trim().toLowerCase();
    if (cleaned && !selectedSymptoms.includes(cleaned)) {
      setSelectedSymptoms([...selectedSymptoms, cleaned]);
    }
  };

  const removeSymptom = (sym: string) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (symptomsInput) {
        addSymptom(symptomsInput);
        setSymptomsInput('');
      }
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0 && !symptomsInput.trim()) {
      setError('Please add at least one symptom.');
      return;
    }

    const currentList = [...selectedSymptoms];
    if (symptomsInput.trim() && !currentList.includes(symptomsInput.trim().toLowerCase())) {
      currentList.push(symptomsInput.trim().toLowerCase());
      setSelectedSymptoms(currentList);
      setSymptomsInput('');
    }

    setLoading(true);
    setError('');
    setSavedSuccess(false);

    try {
      const data = await api.analyzeSymptoms({
        symptoms: currentList,
        bodyArea,
        age,
        duration,
        severity,
      });

      if (!data.success && data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err: any) {
      setError(err.message || 'Analysis service failed. Verify server and Python ML service.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToHistory = () => {
    if (!result) return;
    saveSymptomHistory({
      symptoms: selectedSymptoms,
      bodyArea,
      severity,
      duration,
      matchedFeatures: result.matchedFeatures,
      topCondition: result.topCondition,
      predictions: result.predictions,
      doctorSpecialty: result.doctorSpecialty,
      urgencyGuidance: result.urgencyGuidance,
      clinicalExplanation: result.clinicalExplanation,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Symptom Disease Detector</h2>
            <p className="text-xs text-slate-500">
              Input patient symptoms to evaluate probable clinical conditions, urgency levels, and recommended specialist consultations.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Column (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2.5">
            Patient Symptom Profile
          </h3>

          {/* Selected Symptoms Chips */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Active Symptoms ({selectedSymptoms.length})
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[46px]">
              {selectedSymptoms.map((sym) => (
                <span
                  key={sym}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-xs font-medium text-slate-800 rounded-lg shadow-2xs"
                >
                  {sym}
                  <button
                    type="button"
                    onClick={() => removeSymptom(sym)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              <input
                type="text"
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder={selectedSymptoms.length === 0 ? "Type symptom & hit enter..." : "Add more..."}
                className="flex-1 min-w-[120px] bg-transparent text-xs text-slate-800 focus:outline-none px-1"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Press enter or comma to add</p>
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-[11px] font-medium text-slate-500 mb-1.5 block">Quick Add Common Symptoms:</span>
            <div className="flex flex-wrap gap-1">
              {COMMON_SYMPTOMS.map((cs) => {
                const isSelected = selectedSymptoms.includes(cs);
                return (
                  <button
                    key={cs}
                    type="button"
                    onClick={() => (isSelected ? removeSymptom(cs) : addSymptom(cs))}
                    className={`text-[11px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {cs}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Primary Body Area
            </label>
            <select
              value={bodyArea}
              onChange={(e) => setBodyArea(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Head">Head & Neck</option>
              <option value="Chest">Chest & Respiratory</option>
              <option value="Abdomen">Abdomen & Digestive</option>
              <option value="Arms">Arms & Upper Extremities</option>
              <option value="Legs">Legs & Lower Extremities</option>
              <option value="Systemic">Systemic / Generalized</option>
            </select>
          </div>

          {/* Age & Duration Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Age
              </label>
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 25"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 days"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Mild">Mild – Tolerable, everyday activities unaffected</option>
              <option value="Moderate">Moderate – Uncomfortable, partial impairment</option>
              <option value="Severe">Severe – Intense distress, interfering with routine</option>
            </select>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Random Forest Model...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Analyze Symptoms</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <div className="space-y-4">
              {/* Primary Condition Banner */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-600">
                      Primary Clinical Impression
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                      {result.topCondition}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-700">Match Confidence</div>
                      <div className="text-sm font-bold text-blue-600">{result.topConfidence}%</div>
                    </div>
                    <button
                      onClick={handleSaveToHistory}
                      className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savedSuccess ? 'Saved!' : 'Save'}</span>
                    </button>
                  </div>
                </div>

                {/* Specialty & Urgency Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
                    <div className="text-[11px] font-semibold text-blue-900 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
                      Recommended Specialty
                    </div>
                    <div className="text-xs font-bold text-blue-950 mt-1">
                      {result.doctorSpecialty}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                    <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1.5">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      Urgency Guidance
                    </div>
                    <div className="text-xs font-medium text-amber-950 mt-1">
                      {result.urgencyGuidance}
                    </div>
                  </div>
                </div>

                {/* Clinical Explanation */}
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Clinical Reasoning & Guidance</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {result.clinicalExplanation}
                  </div>
                </div>
              </div>

              {/* Differential Ranked Conditions List */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Differential Condition Distribution
                </h4>

                <div className="space-y-2">
                  {result.predictions.map((p, idx) => (
                    <div
                      key={p.condition}
                      className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200/70 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{p.condition}</div>
                          <div className="text-[11px] text-slate-500">
                            Probability: {p.probability}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden hidden sm:block">
                          <div
                            className="bg-blue-600 h-full rounded-full"
                            style={{ width: `${Math.min(100, p.confidence)}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-800 w-12 text-right">
                          {p.confidence}%
                        </span>
                        {onSelectDisease && (
                          <button
                            onClick={() => onSelectDisease(p.condition)}
                            className="p-1 text-slate-400 hover:text-blue-600 cursor-pointer"
                            title="Explore disease details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Awaiting Symptom Input</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Add patient symptoms on the left and click &quot;Analyze Symptoms&quot; to review clinical condition probabilities, urgency levels, and recommended specialist consultations.
              </p>

              <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl text-left max-w-md mx-auto text-xs text-slate-600 space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clinical Evaluation Workflow:</span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-1">
                  <div>1. Select reported symptoms and primary anatomical area</div>
                  <div>2. Specify duration and severity degree</div>
                  <div>3. Review top matched conditions and match confidence</div>
                  <div>4. Check medical urgency level and recommended specialist</div>
                  <div>5. Access evidence-based care guidance and next steps</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomDiseaseDetector;
