import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  Database,
  ExternalLink
} from 'lucide-react';
import api, { ImageAnalysisResponse, LabValueItem } from '../services/api';
import { saveReport } from '../services/storageService';

// Sample built-in presets including dedicated Blood Report, Chest X-Ray, Brain MRI, and Dermatology
const SAMPLE_PRESETS = [
  {
    id: 'blood-report',
    name: 'Blood Report (CBC & Metabolic Panel)',
    fileName: 'cbc_blood_report_sample.svg',
    category: 'Laboratory Test',
    notes: 'Routine executive health checkup: Patient reports mild fatigue and afternoon lethargy. Hemoglobin low at 10.4 g/dL, WBC mildly elevated at 13,200 /mcL.',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23ffffff"/><rect x="15" y="15" width="370" height="270" rx="8" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="1.5"/><rect x="15" y="15" width="370" height="42" rx="8" fill="%231e3a8a"/><text x="30" y="42" fill="%23ffffff" font-size="14" font-weight="bold" font-family="sans-serif">DIAGNOSTIC PATHOLOGY LABORATORY</text><text x="360" y="42" fill="%2393c5fd" font-size="10" font-family="sans-serif" text-anchor="end">CBC PANEL</text><text x="30" y="80" fill="%23334155" font-size="11" font-weight="bold" font-family="sans-serif">TEST NAME</text><text x="170" y="80" fill="%23334155" font-size="11" font-weight="bold" font-family="sans-serif">RESULT</text><text x="240" y="80" fill="%23334155" font-size="11" font-weight="bold" font-family="sans-serif">FLAG</text><text x="300" y="80" fill="%23334155" font-size="11" font-weight="bold" font-family="sans-serif">REF RANGE</text><line x1="25" y1="90" x2="375" y2="90" stroke="%23e2e8f0" stroke-width="1"/><text x="30" y="115" fill="%231e293b" font-size="11" font-family="sans-serif">Hemoglobin (Hb)</text><text x="170" y="115" fill="%23b91c1c" font-size="11" font-weight="bold" font-family="sans-serif">10.4 g/dL</text><rect x="238" y="103" width="36" height="16" rx="4" fill="%23fee2e2"/><text x="256" y="115" fill="%23991b1b" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">LOW</text><text x="300" y="115" fill="%2364748b" font-size="10" font-family="sans-serif">12.0 - 15.5</text><text x="30" y="145" fill="%231e293b" font-size="11" font-family="sans-serif">Total WBC Count</text><text x="170" y="145" fill="%23b91c1c" font-size="11" font-weight="bold" font-family="sans-serif">13,200 /mcL</text><rect x="238" y="133" width="36" height="16" rx="4" fill="%23fee2e2"/><text x="256" y="145" fill="%23991b1b" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">HIGH</text><text x="300" y="145" fill="%2364748b" font-size="10" font-family="sans-serif">4,500 - 11,000</text><text x="30" y="175" fill="%231e293b" font-size="11" font-family="sans-serif">Platelet Count</text><text x="170" y="175" fill="%230f766e" font-size="11" font-weight="bold" font-family="sans-serif">245,000 /mcL</text><rect x="238" y="163" width="46" height="16" rx="4" fill="%23ccfbf1"/><text x="261" y="175" fill="%23115e59" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">NORMAL</text><text x="300" y="175" fill="%2364748b" font-size="10" font-family="sans-serif">150,000 - 450,000</text><text x="30" y="205" fill="%231e293b" font-size="11" font-family="sans-serif">Fasting Blood Sugar</text><text x="170" y="205" fill="%23b45309" font-size="11" font-weight="bold" font-family="sans-serif">118 mg/dL</text><rect x="238" y="193" width="36" height="16" rx="4" fill="%23fef3c7"/><text x="256" y="205" fill="%2392400e" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">HIGH</text><text x="300" y="205" fill="%2364748b" font-size="10" font-family="sans-serif">70 - 99</text><text x="30" y="235" fill="%231e293b" font-size="11" font-family="sans-serif">Serum Creatinine</text><text x="170" y="235" fill="%230f766e" font-size="11" font-weight="bold" font-family="sans-serif">0.9 mg/dL</text><rect x="238" y="223" width="46" height="16" rx="4" fill="%23ccfbf1"/><text x="261" y="235" fill="%23115e59" font-size="10" font-weight="bold" font-family="sans-serif" text-anchor="middle">NORMAL</text><text x="300" y="235" fill="%2364748b" font-size="10" font-family="sans-serif">0.6 - 1.2</text><line x1="25" y1="255" x2="375" y2="255" stroke="%23e2e8f0" stroke-width="1"/><text x="200" y="272" fill="%2394a3b8" font-size="9" font-family="sans-serif" text-anchor="middle">AUTHORIZED CLINICAL PATHOLOGY SIGN-OFF - ACCREDITED REFERENCE LAB</text></svg>',
  },
  {
    id: 'chest-xray',
    name: 'Chest X-Ray (Suspected Pneumonia)',
    fileName: 'chest_xray_radiology.svg',
    category: 'Radiology',
    notes: 'Persistent productive cough, right-sided pleuritic chest pain, fever 101.4°F.',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230f172a"/><path d="M 60 40 Q 90 20 150 20 Q 210 20 240 40 L 250 260 L 50 260 Z" fill="%231e293b"/><path d="M 90 60 Q 60 120 70 200 Q 110 220 135 180 Q 140 100 90 60 Z" fill="%23334155"/><path d="M 210 60 Q 240 120 230 200 Q 190 220 165 180 Q 160 100 210 60 Z" fill="%23334155"/><ellipse cx="195" cy="165" rx="35" ry="25" fill="%2394a3b8" opacity="0.75"/><rect x="146" y="30" width="8" height="230" fill="%2364748b"/><text x="150" y="285" fill="%2394a3b8" font-size="12" font-family="monospace" text-anchor="middle">CHEST PA: R LOWER LOBE OPACITY</text></svg>',
  },
  {
    id: 'brain-mri',
    name: 'Brain MRI (Axial T2)',
    fileName: 'brain_mri_scan.svg',
    category: 'Radiology',
    notes: 'Severe throbbing unilateral headache, photophobia, nausea.',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23020617"/><ellipse cx="150" cy="150" rx="100" ry="120" fill="%231e293b" stroke="%23475569" stroke-width="4"/><ellipse cx="130" cy="140" rx="20" ry="40" fill="%230f172a"/><ellipse cx="170" cy="140" rx="20" ry="40" fill="%230f172a"/><path d="M 150 40 L 150 260" stroke="%23334155" stroke-width="2"/><text x="150" y="285" fill="%2394a3b8" font-size="12" font-family="monospace" text-anchor="middle">AXIAL T2: NORMAL VENTRICULAR SYMMETRY</text></svg>',
  },
  {
    id: 'skin-lesion',
    name: 'Dermatology Erythema / Rash',
    fileName: 'dermatology_lesion_photo.svg',
    category: 'Clinical Photo',
    notes: 'Maculopapular itchy skin eruptions on trunk, fever 100.8°F, joint aches.',
    dataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23fed7aa"/><circle cx="110" cy="120" r="28" fill="%23ef4444" opacity="0.6"/><circle cx="180" cy="140" r="34" fill="%23dc2626" opacity="0.7"/><circle cx="140" cy="190" r="24" fill="%23f87171" opacity="0.65"/><circle cx="210" cy="90" r="18" fill="%23ef4444" opacity="0.5"/><text x="150" y="285" fill="%237c2d12" font-size="12" font-family="sans-serif" text-anchor="middle">MACULOPAPULAR ERYTHEMATOUS RASH</text></svg>',
  }
];

// Helper to downscale large camera images so client doesn't upload 20MB files
function resizeImageIfNeeded(dataUrl: string, maxDimension: number = 1400): Promise<string> {
  return new Promise((resolve) => {
    if (dataUrl.startsWith('data:image/svg')) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxDimension && height <= maxDimension) {
        resolve(dataUrl);
        return;
      }

      if (width > height) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export const ImageReportAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_PRESETS[0].dataUrl);
  const [uploadedFileName, setUploadedFileName] = useState<string>('cbc_blood_report_sample.svg');
  const [symptomNotes, setSymptomNotes] = useState<string>(SAMPLE_PRESETS[0].notes);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ImageAnalysisResponse | null>(null);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const rawDataUrl = event.target.result as string;
        const optimized = await resizeImageIfNeeded(rawDataUrl);
        setSelectedImage(optimized);
        setResult(null);
        setError('');
        setSavedReportId(null);
        setSaveSuccessMsg('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedImage(preset.dataUrl);
    setUploadedFileName(preset.fileName || preset.name);
    setSymptomNotes(preset.notes);
    setResult(null);
    setError('');
    setSavedReportId(null);
    setSaveSuccessMsg('');
  };

  // Helper to persist current analysis to the database
  const persistAnalysisToDatabase = async (data: ImageAnalysisResponse) => {
    try {
      setIsSaving(true);
      const title = `${data.reportType || 'Laboratory Analysis'} - ${uploadedFileName}`;
      const saved = await saveReport({
        title,
        patientName: 'Clinical Patient (Analyzed)',
        age: 35,
        gender: 'Adult',
        symptoms: symptomNotes || 'Uploaded clinical file evaluation',
        possibleConditions: data.differentialImpression || ['Clinical Evaluation Recommended'],
        findings: data.findings || '',
        recommendations: data.recommendations || [],
        doctorSpecialty: 'Pathology / Radiology',
        urgencyLevel: (data.urgency as any) || 'Moderate',
        type: 'lab-report',
        fileName: uploadedFileName,
        imageUrl: selectedImage.length < 400000 ? selectedImage : undefined,
        labValues: data.labValues || [],
      });

      if (saved && saved.id) {
        setSavedReportId(saved.id);
        setSaveSuccessMsg('File analysis successfully saved to database!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    } catch (saveErr: any) {
      console.warn('Database save warning:', saveErr);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) {
      setError('Please select or upload a medical image or blood report.');
      return;
    }

    setLoading(true);
    setError('');
    setSavedReportId(null);
    setSaveSuccessMsg('');

    try {
      let mimeType = 'image/jpeg';
      if (selectedImage.startsWith('data:image/png')) mimeType = 'image/png';
      else if (selectedImage.startsWith('data:image/webp')) mimeType = 'image/webp';
      else if (selectedImage.startsWith('data:application/pdf')) mimeType = 'application/pdf';

      const data = await api.analyzeImage(selectedImage, mimeType, symptomNotes);
      if (data && data.success) {
        setResult(data);
        // Automatically save to database upon analysis!
        await persistAnalysisToDatabase(data);
      } else {
        setError(data?.error || 'Analysis service returned an unexpected response.');
      }
    } catch (err: any) {
      setError(err.message || 'Image and report analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Medical Image & Blood Report Analysis</h2>
            <p className="text-xs text-slate-500">
              Multimodal Clinical Vision analysis powered by Gemini Generative AI. Uploaded files and analyses are automatically saved into the database.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Upload / Controls (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">Upload Blood Report or Scan</h3>
            <span className="text-[11px] text-slate-400">JPG, PNG, WEBP, Scans</span>
          </div>

          {/* Preset Buttons */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1.5 uppercase tracking-wider">
              Sample Report & Image Presets:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((preset) => {
                const isSelected = selectedImage === preset.dataUrl;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-violet-50 border-violet-400 text-violet-950 font-semibold ring-1 ring-violet-400 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold truncate text-[11px]">{preset.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{preset.category}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Preview & Upload Dropzone */}
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4 text-center hover:border-violet-400 transition-colors bg-slate-50/50 flex flex-col items-center justify-center min-h-[220px] relative">
            {selectedImage ? (
              <div className="relative group w-full flex flex-col items-center">
                <img
                  src={selectedImage}
                  alt="Selected medical document"
                  className="max-h-56 max-w-full rounded-xl object-contain shadow-sm border border-slate-200 bg-white"
                />
                <div className="mt-2 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-600" />
                  <span className="truncate max-w-xs">{uploadedFileName}</span>
                </div>
              </div>
            ) : (
              <div>
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Drag & drop blood report or scan</p>
                <p className="text-[11px] text-slate-400 mt-0.5">or click below to browse file</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="mt-3 text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 cursor-pointer"
            />
          </div>

          {/* Symptom Notes Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Associated Clinical Notes / Lab Context
            </label>
            <textarea
              rows={2}
              value={symptomNotes}
              onChange={(e) => setSymptomNotes(e.target.value)}
              placeholder="e.g. Routine blood report: fatigue, low hemoglobin, high WBC"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyzeImage}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Clinical Vision & Database Sync...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-violet-200" />
                <span>Analyze & Save to Database</span>
              </>
            )}
          </button>
        </div>

        {/* Right Results Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              {/* Header with Title and Database Save Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-violet-100 text-violet-800 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      {result.reportType || 'Clinical Evaluation'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                      result.urgency === 'Emergency' ? 'bg-red-100 text-red-800' :
                      result.urgency === 'High' ? 'bg-orange-100 text-orange-800' :
                      result.urgency === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      Urgency: {result.urgency}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 truncate max-w-sm">
                    {uploadedFileName}
                  </h3>
                </div>

                {/* Database Save Status & Action */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => persistAnalysisToDatabase(result)}
                    disabled={isSaving}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>{isSaving ? 'Saving...' : savedReportId ? 'Saved in Database' : 'Save to Database'}</span>
                  </button>
                </div>
              </div>

              {saveSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{saveSuccessMsg} (Access anytime from <strong>Saved Reports</strong>)</span>
                </div>
              )}

              {/* Lab Values Table if CBC / Blood test */}
              {result.labValues && result.labValues.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FileSpreadsheet className="w-3.5 h-3.5 text-violet-600" />
                      Extracted Laboratory Parameters
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {result.labValues.length} indicators evaluated
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-100">
                        <tr>
                          <th className="py-2 px-3">Test Parameter</th>
                          <th className="py-2 px-3">Observed Value</th>
                          <th className="py-2 px-3">Reference Range</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {result.labValues.map((item, idx) => {
                          const isAbnormal = item.status === 'High' || item.status === 'Low';
                          return (
                            <tr key={idx} className={isAbnormal ? 'bg-amber-50/40' : ''}>
                              <td className="py-2 px-3 font-medium text-slate-800">{item.testName}</td>
                              <td className={`py-2 px-3 font-semibold ${
                                item.status === 'High' ? 'text-red-600' :
                                item.status === 'Low' ? 'text-amber-600' :
                                'text-emerald-700'
                              }`}>
                                {item.value}
                              </td>
                              <td className="py-2 px-3 text-slate-500 text-[11px]">{item.referenceRange}</td>
                              <td className="py-2 px-3">
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                                  item.status === 'High' ? 'bg-red-100 text-red-800' :
                                  item.status === 'Low' ? 'bg-amber-100 text-amber-800' :
                                  'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Clinical Findings */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">
                  Detailed Findings & Radiological Observations
                </span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-line">
                  {result.findings}
                </p>
              </div>

              {/* Differential Impressions */}
              {result.differentialImpression && result.differentialImpression.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Diagnostic Impressions & Etiologies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.differentialImpression.map((diff, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-violet-50 border border-violet-200 text-violet-900 text-xs font-semibold rounded-lg"
                      >
                        {diff}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                    Actionable Next Steps & Medical Recommendations
                  </span>
                  <ul className="space-y-1.5">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span>{result.disclaimer || 'Educational AI analysis. All findings must be clinically verified.'}</span>
                {savedReportId && (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <Database className="w-3 h-3" />
                    Record ID: {savedReportId}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center">
              <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">Ready to Analyze Blood Report or Scan</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                Choose the &quot;Blood Report (CBC)&quot; preset or upload a scan/photo from your device, and click &quot;Analyze & Save to Database&quot; to inspect lab parameters and persist it to the database.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageReportAnalyzer;
