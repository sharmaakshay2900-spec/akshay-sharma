/**
 * Health Analyzer Storage & Firestore Service
 * Provides unified data storage with Firebase Firestore and local synchronization.
 */

import {
  db,
  auth,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

export interface DemoUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin: string;
  photoURL?: string;
}

export interface SavedReport {
  id: string;
  userId?: string;
  title: string;
  patientName: string;
  age: number | string;
  gender: string;
  symptoms: string;
  vitals?: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    respiratoryRate?: string;
    spO2?: string;
  };
  possibleConditions: string[];
  findings?: string;
  recommendations: string[];
  doctorSpecialty?: string;
  urgencyLevel?: 'Low' | 'Moderate' | 'High' | 'Emergency';
  generatedAt: string;
  type: 'medical-report' | 'lab-report' | 'consultation' | 'image-analysis';
  fileName?: string;
  imageUrl?: string;
  labValues?: Array<{
    testName: string;
    value: string;
    referenceRange: string;
    status: 'Normal' | 'High' | 'Low' | string;
  }>;
}

export interface SymptomHistoryEntry {
  id: string;
  userId?: string;
  symptoms: string[];
  bodyArea?: string;
  severity?: string;
  duration?: string;
  matchedFeatures?: string[];
  topCondition?: string;
  predictions: Array<{
    condition: string;
    confidence: number;
    probability: number;
  }>;
  doctorSpecialty?: string;
  urgencyGuidance?: string;
  clinicalExplanation?: string;
  timestamp: string;
}

export interface MCQResult {
  id: string;
  userId?: string;
  score: number;
  totalQuestions: number;
  category?: string;
  percentage: number;
  answers: Record<number, number>;
  timestamp: string;
}

const STORAGE_KEYS = {
  USERS: 'health_analyzer_users',
  CURRENT_USER: 'health_analyzer_current_user',
  REPORTS: 'health_analyzer_reports',
  SYMPTOM_HISTORY: 'health_analyzer_symptom_history',
  MCQ_RESULTS: 'health_analyzer_mcq_results',
  AUDIT_LOGS: 'health_analyzer_audit_logs',
};

function initializeDefaults() {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const defaultUsers: DemoUser[] = [
      {
        id: 'user_default',
        email: 'user@healthanalyzer.org',
        name: 'User',
        role: 'user',
        createdAt: '2026-01-15T08:00:00.000Z',
        lastLogin: new Date().toISOString(),
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }

  if (!localStorage.getItem(STORAGE_KEYS.REPORTS)) {
    const defaultReports: SavedReport[] = [
      {
        id: 'rep_001',
        title: 'Comprehensive Health Evaluation',
        patientName: 'John Doe',
        age: 34,
        gender: 'Male',
        symptoms: 'Mild productive cough, low-grade fever (100.2°F), fatigue for 3 days',
        vitals: {
          temperature: '100.2°F',
          bloodPressure: '122/78 mmHg',
          heartRate: '78 bpm',
          respiratoryRate: '16 bpm',
          spO2: '98%',
        },
        possibleConditions: ['Acute Bronchitis', 'Upper Respiratory Infection', 'Viral Pharyngitis'],
        findings: 'Chest clear bilaterally on auscultation. Pharyngeal erythema without exudate.',
        recommendations: [
          'Hydration (2.5L daily oral fluids)',
          'Rest for 48-72 hours',
          'Paracetamol 500mg as needed for fever',
          'Follow-up if symptoms persist beyond 7 days',
        ],
        doctorSpecialty: 'General Physician / Pulmonologist',
        urgencyLevel: 'Low',
        generatedAt: '2026-02-18T14:30:00.000Z',
        type: 'medical-report',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(defaultReports));
  }
}

export function getCurrentUser(): DemoUser | null {
  if (typeof window === 'undefined') return null;
  initializeDefaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.name && parsed.name.includes('Mitchell')) {
      parsed.name = 'User';
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: DemoUser | null): void {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Reports (Firestore + Local fallback)
export function getReports(userId?: string): SavedReport[] {
  if (typeof window === 'undefined') return [];
  initializeDefaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    const reports: SavedReport[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return reports.filter((r) => !r.userId || r.userId === userId);
    }
    return reports;
  } catch {
    return [];
  }
}

export async function fetchFirestoreReports(userId: string): Promise<SavedReport[]> {
  const path = 'reports';
  try {
    const q = query(collection(db, path), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    const cloudReports: SavedReport[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      cloudReports.push({
        id: docSnap.id,
        userId: data.userId,
        title: data.title || 'Medical Report',
        patientName: data.patientName || 'Patient',
        age: data.age || 0,
        gender: data.gender || 'Not specified',
        symptoms: data.symptoms || '',
        vitals: typeof data.vitals === 'string' ? JSON.parse(data.vitals || '{}') : data.vitals || {
          temperature: '98.6°F',
          bloodPressure: '120/80',
          heartRate: '72',
        },
        possibleConditions: data.diagnosis ? [data.diagnosis] : [],
        recommendations: typeof data.recommendations === 'string' ? [data.recommendations] : data.recommendations || [],
        generatedAt: data.createdAt || new Date().toISOString(),
        type: 'medical-report',
      });
    });

    if (cloudReports.length > 0) {
      // Merge with local reports
      const local = getReports();
      const existingIds = new Set(cloudReports.map((c) => c.id));
      const merged = [...cloudReports, ...local.filter((l) => !existingIds.has(l.id))];
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(merged));
      return merged;
    }
    return getReports(userId);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return getReports(userId);
  }
}

export async function saveReport(
  reportData: Omit<SavedReport, 'id' | 'generatedAt'> & { id?: string; generatedAt?: string }
): Promise<SavedReport> {
  const cleanId = (reportData.id || 'rep_' + Math.random().toString(36).substring(2, 9)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const now = new Date().toISOString();
  const currentAuthUser = auth.currentUser;
  const activeUser = getCurrentUser();
  const targetUserId = currentAuthUser ? currentAuthUser.uid : (activeUser ? activeUser.id : (reportData.userId || 'guest_user'));

  const newReport: SavedReport = {
    ...reportData,
    id: cleanId,
    userId: targetUserId,
    generatedAt: reportData.generatedAt || now,
  };

  // 1. Update local cache
  const localReports = getReports();
  const existingIdx = localReports.findIndex((r) => r.id === cleanId);
  if (existingIdx >= 0) {
    localReports[existingIdx] = newReport;
  } else {
    localReports.unshift(newReport);
  }
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(localReports));

  // 2. Persist to server REST database API (/api/reports)
  try {
    fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReport),
    }).catch((err) => console.warn('Server database sync notice:', err));
  } catch {
    // ignore
  }

  // 3. If user is authenticated with Firebase, save directly to Firestore
  if (currentAuthUser) {
    const path = `reports/${cleanId}`;
    try {
      await setDoc(doc(db, 'reports', cleanId), {
        id: cleanId,
        userId: currentAuthUser.uid,
        title: (newReport.title || 'Medical Evaluation').slice(0, 256),
        patientName: (newReport.patientName || 'Patient').slice(0, 128),
        age: typeof newReport.age === 'number' ? newReport.age : parseInt(String(newReport.age), 10) || 0,
        gender: (newReport.gender || 'Not specified').slice(0, 32),
        symptoms: (newReport.symptoms || '').slice(0, 2048),
        vitals: JSON.stringify(newReport.vitals || {}).slice(0, 1024),
        diagnosis: (newReport.possibleConditions?.[0] || 'Clinical Assessment').slice(0, 1024),
        recommendations: (newReport.recommendations?.join('\n') || '').slice(0, 4096),
        doctorNotes: `Specialty: ${newReport.doctorSpecialty || 'General'}. Urgency: ${newReport.urgencyLevel || 'Moderate'}`.slice(0, 4096),
        createdAt: now,
        updatedAt: now,
      });
    } catch (error) {
      console.warn('Firestore write warning:', error);
    }
  }

  return newReport;
}

export async function deleteReport(reportId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  const reports = getReports();
  const filtered = reports.filter((r) => r.id !== reportId);
  localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(filtered));

  // Delete from server database API
  try {
    fetch(`/api/reports/${reportId}`, { method: 'DELETE' }).catch(() => {});
  } catch {
    // ignore
  }

  const currentAuthUser = auth.currentUser;
  if (currentAuthUser && reportId) {
    const path = `reports/${reportId}`;
    try {
      await deleteDoc(doc(db, 'reports', reportId));
    } catch (error) {
      console.warn('Firestore delete warning:', error);
    }
  }
  return true;
}

// Symptom History (Firestore + Local fallback)
export function getSymptomHistory(userId?: string): SymptomHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SYMPTOM_HISTORY);
    const history: SymptomHistoryEntry[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return history.filter((h) => !h.userId || h.userId === userId);
    }
    return history;
  } catch {
    return [];
  }
}

export async function saveSymptomCheck(
  entry: Omit<SymptomHistoryEntry, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): Promise<SymptomHistoryEntry> {
  const cleanId = (entry.id || 'sym_' + Math.random().toString(36).substring(2, 9)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const now = new Date().toISOString();
  const currentAuthUser = auth.currentUser;
  const targetUserId = currentAuthUser ? currentAuthUser.uid : (entry.userId || 'guest_user');

  const newEntry: SymptomHistoryEntry = {
    ...entry,
    id: cleanId,
    userId: targetUserId,
    timestamp: entry.timestamp || now,
  };

  const history = getSymptomHistory();
  history.unshift(newEntry);
  localStorage.setItem(STORAGE_KEYS.SYMPTOM_HISTORY, JSON.stringify(history));

  if (currentAuthUser) {
    const path = `symptom_history/${cleanId}`;
    try {
      await setDoc(doc(db, 'symptom_history', cleanId), {
        id: cleanId,
        userId: currentAuthUser.uid,
        symptoms: newEntry.symptoms || [],
        bodyArea: (newEntry.bodyArea || 'Unspecified').slice(0, 64),
        duration: (newEntry.duration || '').slice(0, 64),
        severity: (newEntry.severity || '').slice(0, 64),
        topCondition: (newEntry.topCondition || 'Unknown').slice(0, 128),
        topConfidence: newEntry.predictions?.[0]?.confidence || 0,
        doctorSpecialty: (newEntry.doctorSpecialty || '').slice(0, 128),
        urgencyGuidance: (newEntry.urgencyGuidance || '').slice(0, 512),
        clinicalExplanation: (newEntry.clinicalExplanation || '').slice(0, 4096),
        createdAt: now,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  return newEntry;
}

// MCQ Results (Firestore + Local fallback)
export function getMCQResults(userId?: string): MCQResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MCQ_RESULTS);
    const results: MCQResult[] = raw ? JSON.parse(raw) : [];
    if (userId) {
      return results.filter((r) => !r.userId || r.userId === userId);
    }
    return results;
  } catch {
    return [];
  }
}

export async function saveMCQResult(
  result: Omit<MCQResult, 'id' | 'timestamp'> & { id?: string; timestamp?: string }
): Promise<MCQResult> {
  const cleanId = (result.id || 'mcq_' + Math.random().toString(36).substring(2, 9)).replace(/[^a-zA-Z0-9_-]/g, '_');
  const now = new Date().toISOString();
  const currentAuthUser = auth.currentUser;
  const targetUserId = currentAuthUser ? currentAuthUser.uid : (result.userId || 'guest_user');

  const newResult: MCQResult = {
    ...result,
    id: cleanId,
    userId: targetUserId,
    timestamp: result.timestamp || now,
  };

  const results = getMCQResults();
  results.unshift(newResult);
  localStorage.setItem(STORAGE_KEYS.MCQ_RESULTS, JSON.stringify(results));

  if (currentAuthUser) {
    const path = `mcq_results/${cleanId}`;
    try {
      await setDoc(doc(db, 'mcq_results', cleanId), {
        id: cleanId,
        userId: currentAuthUser.uid,
        score: newResult.score,
        totalQuestions: newResult.totalQuestions,
        percentage: newResult.percentage,
        category: (newResult.category || 'General').slice(0, 64),
        createdAt: now,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  }

  return newResult;
}

export const saveSymptomHistory = saveSymptomCheck;

export function getUsers(): DemoUser[] {
  if (typeof window === 'undefined') return [];
  initializeDefaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUser(email: string, name?: string, role: 'admin' | 'user' = 'user'): DemoUser {
  initializeDefaults();
  const users = getUsers();
  const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existing) {
    existing.lastLogin = new Date().toISOString();
    if (name) existing.name = name;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return existing;
  }

  const newUser: DemoUser = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    email,
    name: name || email.split('@')[0],
    role,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  addAuditLog(`User registered/created: ${newUser.email}`);
  return newUser;
}

export function addAuditLog(action: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    const logs: string[] = raw ? JSON.parse(raw) : [];
    logs.unshift(`[${new Date().toLocaleTimeString()}] ${action}`);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 50)));
  } catch {
    // ignore
  }
}

export function getAuditLogs(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : ['System initialized'];
  } catch {
    return ['System initialized'];
  }
}

export function clearUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.REPORTS);
  localStorage.removeItem(STORAGE_KEYS.SYMPTOM_HISTORY);
  localStorage.removeItem(STORAGE_KEYS.MCQ_RESULTS);
  initializeDefaults();
}

export default {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  getReports,
  saveReport,
  deleteReport,
  getSymptomHistory,
  saveSymptomCheck,
  saveSymptomHistory,
  getMCQResults,
  saveMCQResult,
  getUsers,
  saveUser,
  getAuditLogs,
  clearUserData,
};
