import React, { useState } from 'react';
import { FileText, Stethoscope, Printer, Download, Save, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../services/api';
import { saveReport } from '../services/storageService';

export const MedicalReportGenerator: React.FC = () => {
  const [patientName, setPatientName] = useState('John Doe');
  const [age, setAge] = useState('32');
  const [gender, setGender] = useState('Male');
  const [symptoms, setSymptoms] = useState('Persistent dry cough, mild afternoon fever (99.8°F), body aches, and occasional fatigue.');
  const [temperature, setTemperature] = useState('99.4 °F');
  const [bloodPressure, setBloodPressure] = useState('122/80');
  const [heartRate, setHeartRate] = useState('78');
  const [spO2, setSpO2] = useState('98%');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedReport, setGeneratedReport] = useState<any | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !symptoms.trim()) {
      setError('Please provide patient name and symptoms.');
      return;
    }

    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      const res = await api.generateReport({
        patientName,
        age,
        gender,
        symptoms,
        vitals: {
          temperature,
          bloodPressure,
          heartRate,
          spO2,
        },
      });

      if (res.success && res.report) {
        setGeneratedReport(res.report);
      } else {
        setError(res.error || 'Failed to generate report.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with report engine.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveReport = () => {
    if (!generatedReport) return;
    saveReport({
      title: generatedReport.title || 'Comprehensive Medical Evaluation',
      patientName: generatedReport.patientName,
      age: generatedReport.age,
      gender: generatedReport.gender,
      symptoms: generatedReport.symptoms,
      vitals: generatedReport.vitals,
      possibleConditions: generatedReport.possibleConditions || [],
      findings: generatedReport.findings,
      recommendations: generatedReport.recommendations || [],
      doctorSpecialty: generatedReport.doctorSpecialty,
      urgencyLevel: generatedReport.urgencyLevel,
      type: 'medical-report',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Medical Report & Rx Generator</h2>
            <p className="text-xs text-slate-500">
              Input patient clinical signs, recorded vitals, and symptomatology to generate an evidence-based clinical evaluation draft.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Patient Information
          </h3>

          <form onSubmit={handleGenerate} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g. John Doe"
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
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
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other / Non-binary</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Symptoms Description
              </label>
              <textarea
                rows={3}
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. fever, cough, fatigue, headache"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Recorded Vitals
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Temperature</span>
                  <input
                    type="text"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 98.6 F"
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Blood Pressure (BP)</span>
                  <input
                    type="text"
                    value={bloodPressure}
                    onChange={(e) => setBloodPressure(e.target.value)}
                    placeholder="e.g. 120/80"
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">Heart Rate</span>
                  <input
                    type="text"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    placeholder="e.g. 72 bpm"
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block mb-0.5 font-medium">SpO2 Oxygen</span>
                  <input
                    type="text"
                    value={spO2}
                    onChange={(e) => setSpO2(e.target.value)}
                    placeholder="e.g. 98%"
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-50 text-white font-medium text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing Medical Report...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Report Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {generatedReport ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 print:border-none print:shadow-none">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[11px] font-semibold rounded-md mb-1">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>Clinical Evaluation Summary</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{generatedReport.title}</h3>
                  <div className="text-[11px] text-slate-400">
                    Generated: {new Date(generatedReport.generatedAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveReport}
                    className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saveSuccess ? 'Saved to LocalStorage!' : 'Save Report'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Patient Meta Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Patient</span>
                  <span className="font-bold text-slate-800">{generatedReport.patientName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Age / Sex</span>
                  <span className="font-bold text-slate-800">{generatedReport.age} / {generatedReport.gender}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Triage Urgency</span>
                  <span className="font-bold text-amber-700">{generatedReport.urgencyLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Specialty</span>
                  <span className="font-bold text-blue-700">{generatedReport.doctorSpecialty}</span>
                </div>
              </div>

              {/* Vitals Summary Strip */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                  Recorded Baseline Vitals
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Temp</span>
                    <span className="font-bold text-slate-800">{generatedReport.vitals?.temperature}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">BP</span>
                    <span className="font-bold text-slate-800">{generatedReport.vitals?.bloodPressure}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Heart Rate</span>
                    <span className="font-bold text-slate-800">{generatedReport.vitals?.heartRate}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <span className="font-bold text-slate-800">{generatedReport.vitals?.spO2 || '98%'}</span>
                  </div>
                </div>
              </div>

              {/* Clinical Findings */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                  Objective Findings
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {generatedReport.findings}
                </p>
              </div>

              {/* Possible Conditions */}
              {generatedReport.possibleConditions?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                    Differential Diagnostic Impressions
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {generatedReport.possibleConditions.map((c: string) => (
                      <span
                        key={c}
                        className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold rounded-lg"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {generatedReport.recommendations?.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Clinical Recommendations & Follow-Up
                  </span>
                  <ul className="space-y-1.5">
                    {generatedReport.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disclaimer */}
              <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                * Note: This report draft is generated for educational evaluation purposes only. No prescription is legally binding without a licensed physician signature.
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Ready to Generate Clinical Report</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Fill in the patient clinical details on the left and click &quot;Generate Report&quot; to synthesize an evaluation with vital assessments and structured recommendations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalReportGenerator;
