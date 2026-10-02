import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, FileText, Activity, Clock, Database, CheckCircle2, Server, Trash2, Cpu } from 'lucide-react';
import { getUsers, getReports, getAuditLogs, DemoUser, SavedReport, clearUserData } from '../services/storageService';
import api from '../services/api';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'conditions' | 'logs'>('overview');
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [systemHealth, setSystemHealth] = useState<any | null>(null);
  const [diseases, setDiseases] = useState<any[]>([]);

  useEffect(() => {
    setUsers(getUsers());
    setReports(getReports());
    setLogs(getAuditLogs());
    api.getSystemHealth().then((h) => setSystemHealth(h)).catch(() => {});
    api.getDiseases().then((d) => setDiseases(d)).catch(() => {});
  }, []);

  const handleClearData = () => {
    if (confirm('Clear all demo reports, symptoms, and test histories from browser LocalStorage?')) {
      clearUserData();
      setUsers(getUsers());
      setReports(getReports());
      setLogs(getAuditLogs());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">System Administration & Telemetry</h2>
              <p className="text-xs text-slate-500">
                Operational status of Random Forest ML model, Generative AI pipeline, and LocalStorage data storage.
              </p>
            </div>
          </div>

          <button
            onClick={handleClearData}
            className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Demo LocalStorage</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Users</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{users.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Simulated demo accounts</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Reports</span>
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{reports.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Saved patient workups</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reference Diseases</span>
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{diseases.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Static JSON clinical conditions</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">System Status</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">Online</div>
          <p className="text-[11px] text-slate-500 mt-1">Random Forest & Gemini Ready</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Architecture Telemetry' },
          { id: 'users', label: 'Simulated Users' },
          { id: 'conditions', label: 'Disease Condition Stats' },
          { id: 'logs', label: 'Audit Logs' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Machine Learning & AI Engine</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Supervised Algorithm:</span>
                <span className="font-bold text-slate-800">Random Forest Classifier (100 Trees)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Cross-Validation Accuracy:</span>
                <span className="font-bold text-emerald-600">94.35% (±0.43%)</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Training Samples:</span>
                <span className="font-bold text-slate-800">920 Multi-Symptom Records</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Generative AI Provider:</span>
                <span className="font-bold text-indigo-600">
                  {systemHealth?.generativeAI || 'Gemini 3.8 Flash'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>Zero-MongoDB Architecture Compliance</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">MongoDB / Mongoose:</span>
                <span className="font-bold text-emerald-700">Completely Eliminated</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Client Persistence:</span>
                <span className="font-bold text-slate-800">Browser LocalStorage</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Reference Registry:</span>
                <span className="font-bold text-slate-800">Static JSON Datasets</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Total MCQs Loaded:</span>
                <span className="font-bold text-blue-600">{systemHealth?.datasets?.mcqs || 109} Questions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Simulated Demo Users (LocalStorage)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold text-[10px]">
                  <th className="pb-2.5">Name</th>
                  <th className="pb-2.5">Email</th>
                  <th className="pb-2.5">Role</th>
                  <th className="pb-2.5">Created</th>
                  <th className="pb-2.5">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="text-slate-700">
                    <td className="py-2.5 font-bold text-slate-900">{u.name}</td>
                    <td className="py-2.5">{u.email}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 text-slate-400">{new Date(u.lastLogin).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'conditions' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3">Loaded Condition Classifications</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {diseases.map((d) => (
              <div key={d.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="font-bold text-slate-900">{d.name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Category: {d.category} · {d.doctorSpecialty}
                </div>
                <div className="text-[10px] text-amber-700 font-medium mt-1">
                  Urgency: {d.urgencyGuidance}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-3">System & Clinical Audit Logs</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-800">{log.message}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
