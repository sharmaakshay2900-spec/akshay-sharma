import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Search,
  Eye,
  Trash2,
  Printer,
  X,
  FileText,
  CheckCircle2,
  AlertCircle,
  Database,
  Image as ImageIcon,
  FileSpreadsheet
} from 'lucide-react';
import { getReports, deleteReport, SavedReport } from '../services/storageService';

export const SavedReportsManager: React.FC = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [search, setSearch] = useState('');
  const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null);

  const reload = async () => {
    const local = getReports();
    setReports(local);

    try {
      const res = await fetch('/api/reports');
      if (res.ok) {
        const serverReports = await res.json();
        if (Array.isArray(serverReports) && serverReports.length > 0) {
          const map = new Map<string, SavedReport>();
          [...serverReports, ...local].forEach((r) => {
            if (r.id && !map.has(r.id)) {
              map.set(r.id, r);
            }
          });
          setReports(Array.from(map.values()));
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this report from database and local storage?')) {
      await deleteReport(id);
      await reload();
      if (selectedReport?.id === id) {
        setSelectedReport(null);
      }
    }
  };

  const filteredReports = reports.filter((r) => {
    const q = search.toLowerCase();
    return (
      (r.patientName && r.patientName.toLowerCase().includes(q)) ||
      (r.title && r.title.toLowerCase().includes(q)) ||
      (r.fileName && r.fileName.toLowerCase().includes(q)) ||
      (r.doctorSpecialty && r.doctorSpecialty.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Saved Patient & Uploaded Reports Database</h2>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Database Synced
                </span>
              </div>
              <p className="text-xs text-slate-500">
                All uploaded blood reports, scans, and clinical patient evaluations saved in database storage.
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right text-xs text-slate-400">
            Total Saved: <strong className="text-slate-700">{reports.length}</strong>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, patient, or file name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={reload}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors cursor-pointer"
        >
          Refresh Database Records
        </button>
      </div>

      {/* Reports List */}
      <div>
        {filteredReports.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm">No Saved Reports Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Upload a blood test or medical image in &quot;Image & Blood Report Analyzer&quot; or create a clinical evaluation in &quot;Report Generator&quot; to see them saved here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="bg-white border border-slate-200 hover:border-blue-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-md truncate max-w-[180px]">
                      {report.type === 'lab-report' ? 'Uploaded Blood / Scan' : 'Clinical Evaluation'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${
                      report.urgencyLevel === 'Emergency' ? 'bg-red-100 text-red-800' :
                      report.urgencyLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                      report.urgencyLevel === 'Moderate' ? 'bg-amber-100 text-amber-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {report.urgencyLevel || 'Standard'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                    {report.title}
                  </h3>

                  {report.fileName && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 mb-2 font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100 truncate">
                      <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{report.fileName}</span>
                    </div>
                  )}

                  {report.imageUrl && (
                    <div className="mb-2 max-h-24 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
                      <img
                        src={report.imageUrl}
                        alt="Document preview"
                        className="max-h-24 w-full object-contain"
                      />
                    </div>
                  )}

                  <div className="text-xs text-slate-600 line-clamp-2 mb-2">
                    {report.findings || report.symptoms}
                  </div>

                  {report.labValues && report.labValues.length > 0 && (
                    <div className="text-[11px] text-violet-700 font-semibold mb-2 flex items-center gap-1">
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{report.labValues.length} Lab Parameters Logged</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReport(report);
                      }}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(report.id, e)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete from Database"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedReport.title}</h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                    Saved in DB
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  ID: <span className="font-mono text-slate-700">{selectedReport.id}</span> · Saved on: {new Date(selectedReport.generatedAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If uploaded document has image preview */}
            {selectedReport.imageUrl && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Uploaded Document Preview:</span>
                <div className="p-2 border border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center">
                  <img
                    src={selectedReport.imageUrl}
                    alt="Uploaded Document"
                    className="max-h-64 object-contain rounded-lg shadow-sm"
                  />
                </div>
              </div>
            )}

            {/* Extracted Lab Values Table */}
            {selectedReport.labValues && selectedReport.labValues.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-3.5 h-3.5 text-violet-600" />
                  Extracted Lab Indicators:
                </span>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Test Parameter</th>
                        <th className="py-2 px-3">Observed Value</th>
                        <th className="py-2 px-3">Reference Range</th>
                        <th className="py-2 px-3">Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReport.labValues.map((lab, i) => (
                        <tr key={i} className={lab.status === 'High' || lab.status === 'Low' ? 'bg-amber-50/50' : ''}>
                          <td className="py-2 px-3 font-medium text-slate-800">{lab.testName}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{lab.value}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{lab.referenceRange}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                              lab.status === 'High' ? 'bg-red-100 text-red-800' :
                              lab.status === 'Low' ? 'bg-amber-100 text-amber-800' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {lab.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vitals if available */}
            {selectedReport.vitals && selectedReport.vitals.temperature && (
              <div className="grid grid-cols-4 gap-2 text-center text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Temperature</span>
                  <span className="font-bold text-slate-800">{selectedReport.vitals.temperature}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">BP</span>
                  <span className="font-bold text-slate-800">{selectedReport.vitals.bloodPressure}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Heart Rate</span>
                  <span className="font-bold text-slate-800">{selectedReport.vitals.heartRate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">SpO2</span>
                  <span className="font-bold text-slate-800">{selectedReport.vitals.spO2 || '98%'}</span>
                </div>
              </div>
            )}

            {selectedReport.findings && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Clinical Findings:</span>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
                  {selectedReport.findings}
                </p>
              </div>
            )}

            {selectedReport.possibleConditions && selectedReport.possibleConditions.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Differential Impressions:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedReport.possibleConditions.map((cond, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium rounded-lg"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedReport.recommendations && selectedReport.recommendations.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Recommendations:</span>
                <ul className="space-y-1.5">
                  {selectedReport.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Report</span>
              </button>
              <button
                onClick={() => setSelectedReport(null)}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedReportsManager;
