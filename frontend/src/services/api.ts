/**
 * Health-Analyzer Frontend API Service
 * Interacts with Express backend endpoints which execute Python ML Random Forest,
 * Gemini Generative AI, and serve static educational JSON datasets.
 */

export interface SymptomAnalysisRequest {
  symptoms: string[];
  bodyArea?: string;
  age?: number | string;
  duration?: string;
  severity?: string;
}

export interface MLPrediction {
  condition: string;
  confidence: number;
  probability: number;
}

export interface SymptomAnalysisResponse {
  success: boolean;
  matchedFeatures: string[];
  predictions: MLPrediction[];
  topCondition: string;
  topConfidence: number;
  doctorSpecialty: string;
  urgencyGuidance: string;
  clinicalExplanation: string;
  diseaseDetails?: any;
  error?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface LabValueItem {
  testName: string;
  value: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low';
}

export interface ImageAnalysisResponse {
  success: boolean;
  reportType?: string;
  findings: string;
  anatomicalObservations?: string;
  labValues?: LabValueItem[];
  differentialImpression: string[];
  urgency: 'Low' | 'Moderate' | 'High' | 'Emergency';
  recommendations: string[];
  disclaimer: string;
  error?: string;
}

export interface MedicalReportRequest {
  patientName: string;
  age: number | string;
  gender: string;
  symptoms: string;
  vitals: {
    temperature: string;
    bloodPressure: string;
    heartRate: string;
    spO2?: string;
  };
}

export const api = {
  // Symptom Analysis with Python Random Forest & Gemini
  async analyzeSymptoms(payload: SymptomAnalysisRequest): Promise<SymptomAnalysisResponse> {
    const res = await fetch('/api/symptom-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Failed to analyze symptoms: ${res.statusText}`);
    }
    return res.json();
  },

  // AI Consult Chat powered by Gemini
  async consultChat(message: string, history: ChatMessage[] = []): Promise<{ reply: string }> {
    const res = await fetch('/api/consult-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    });
    if (!res.ok) {
      throw new Error(`Chat request failed: ${res.statusText}`);
    }
    return res.json();
  },

  // Multimodal Image Analysis with Gemini Vision
  async analyzeImage(imageBase64: string, mimeType: string, symptomNotes?: string): Promise<ImageAnalysisResponse> {
    const res = await fetch('/api/image-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, symptomNotes }),
    });
    if (!res.ok) {
      throw new Error(`Image analysis failed: ${res.statusText}`);
    }
    return res.json();
  },

  // Generate Medical Report & Rx Draft
  async generateReport(payload: MedicalReportRequest): Promise<any> {
    const res = await fetch('/api/generate-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      throw new Error(`Report generation failed: ${res.statusText}`);
    }
    return res.json();
  },

  // Datasets
  async getDiseases(): Promise<any[]> {
    const res = await fetch('/api/diseases');
    return res.json();
  },

  async getDiseaseById(id: string): Promise<any> {
    const res = await fetch(`/api/disease/${id}`);
    return res.json();
  },

  async getSymptoms(): Promise<any[]> {
    const res = await fetch('/api/symptoms');
    return res.json();
  },

  async getMedicines(): Promise<any[]> {
    const res = await fetch('/api/medicines');
    return res.json();
  },

  async getHospitals(): Promise<any[]> {
    const res = await fetch('/api/hospitals');
    return res.json();
  },

  async getAIIMS(): Promise<any[]> {
    const res = await fetch('/api/aiims');
    return res.json();
  },

  async getMedicalCenters(): Promise<any[]> {
    const res = await fetch('/api/medical-centers');
    return res.json();
  },

  async getSpecialties(): Promise<any[]> {
    const res = await fetch('/api/specialties');
    return res.json();
  },

  async getMCQs(): Promise<any[]> {
    const res = await fetch('/api/mcqs');
    return res.json();
  },

  async getSystemHealth(): Promise<any> {
    const res = await fetch('/api/health');
    return res.json();
  }
};

export default api;
