import React, { useState } from 'react';
import { User, Activity, AlertCircle, ChevronRight, Check } from 'lucide-react';

interface BodyViewer3DProps {
  onSelectSymptom?: (symptom: string) => void;
}

export const BodyViewer3D: React.FC<BodyViewer3DProps> = ({ onSelectSymptom }) => {
  const [selectedArea, setSelectedArea] = useState<'Head' | 'Chest' | 'Abdomen' | 'Arms' | 'Legs'>('Chest');

  const anatomicalAreas = [
    {
      id: 'Head',
      name: 'Head & Neck',
      organs: ['Brain', 'Cranial Nerves', 'Eyes', 'Inner Ear', 'Paranasal Sinuses', 'Pharynx'],
      symptoms: ['headache', 'dizziness', 'blurred vision', 'facial pressure', 'loss of smell', 'sore throat'],
      conditions: ['Migraine', 'Sinusitis', 'Tension Cephalea', 'Otitis Media', 'Allergic Rhinitis'],
      description: 'Houses the central nervous system command center and major sensory organs. Susceptible to vascular headaches, sinus blockage, and cranial nerve compression.',
    },
    {
      id: 'Chest',
      name: 'Thorax & Chest',
      organs: ['Heart', 'Lungs & Bronchi', 'Pericardium', 'Coronary Arteries', 'Esophagus', 'Aorta'],
      symptoms: ['cough', 'shortness of breath', 'chest pain', 'wheezing', 'palpitations', 'heartburn'],
      conditions: ['Common Cold', 'Influenza', 'Bronchial Asthma', 'Pneumonia', 'GERD', 'Angina Pectoris'],
      description: 'Protects the cardiorespiratory vitals. Key clinical red flags include radiating retrosternal tightness and sudden acute dyspnea.',
    },
    {
      id: 'Abdomen',
      name: 'Abdomen & Pelvis',
      organs: ['Stomach', 'Liver & Gallbladder', 'Pancreas', 'Small & Large Bowel', 'Kidneys', 'Bladder'],
      symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'frequent urination', 'unexplained weight loss'],
      conditions: ['Type 2 Diabetes Mellitus', 'Peptic Ulcer Disease', 'Gastroenteritis', 'Renal Calculi'],
      description: 'Major site for nutrient digestion, endocrine glycemic control, hepatic detoxification, and renal filtration.',
    },
    {
      id: 'Arms',
      name: 'Upper Limbs & Arms',
      organs: ['Brachial Plexus', 'Radial/Ulnar Arteries', 'Carpal Tunnel', 'Metacarpals', 'Shoulder Rotator Cuff'],
      symptoms: ['joint pain', 'numbness in hands', 'muscle weakness', 'tingling in fingers'],
      conditions: ['Rheumatoid Arthritis', 'Carpal Tunnel Syndrome', 'Rotator Cuff Tendinitis', 'Peripheral Neuropathy'],
      description: 'Peripheral sensory-motor dexterity. Small joint symmetrical swelling frequently flags systemic autoimmune rheumatology conditions.',
    },
    {
      id: 'Legs',
      name: 'Lower Limbs & Legs',
      organs: ['Femoral Vessels', 'Sciatic Nerve', 'Knee Menisci', 'Patella', 'Ankle Joint', 'Plantar Fascia'],
      symptoms: ['swollen legs', 'joint swelling', 'calf pain', 'joint pain'],
      conditions: ['Osteoarthritis', 'Gout (Podagra)', 'Deep Vein Thrombosis risk', 'Peripheral Edema'],
      description: 'Weight-bearing musculoskeletal architecture. Prone to mechanical joint degradation (osteoarthritis) and fluid dependency (peripheral edema).',
    },
  ];

  const currentData = anatomicalAreas.find((a) => a.id === selectedArea)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Human Anatomy Viewer</h2>
            <p className="text-xs text-slate-500">
              Select an anatomical quadrant to inspect vital organs, typical symptom clusters, and associated medical conditions.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Anatomy Navigator Buttons (3 Cols) */}
        <div className="lg:col-span-3 space-y-2">
          {anatomicalAreas.map((area) => (
            <button
              key={area.id}
              onClick={() => setSelectedArea(area.id as any)}
              className={`w-full p-3.5 text-left rounded-xl border font-medium text-xs transition-all flex items-center justify-between cursor-pointer ${
                selectedArea === area.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    selectedArea === area.id ? 'bg-white' : 'bg-slate-300'
                  }`}
                />
                <span className="font-semibold">{area.name}</span>
              </div>
              <ChevronRight
                className={`w-4 h-4 ${
                  selectedArea === area.id ? 'text-white' : 'text-slate-400'
                }`}
              />
            </button>
          ))}

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 mt-4">
            <div className="font-semibold text-slate-700 mb-1">Anatomy Note:</div>
            Clicking a symptom chip in the detail view automatically passes it to the Symptom Disease Detector for ML classification.
          </div>
        </div>

        {/* Center Anatomy Graphical Visualization (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative min-h-[420px]">
          {/* Stylized SVG Medical Mannequin */}
          <div className="relative w-64 h-96 flex items-center justify-center">
            <svg
              viewBox="0 0 200 400"
              className="w-full h-full drop-shadow-sm transition-all"
            >
              {/* Silhouette base */}
              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="100%" stopColor="#e2e8f0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Head */}
              <g
                onClick={() => setSelectedArea('Head')}
                className="cursor-pointer transition-all"
              >
                <circle
                  cx="100"
                  cy="40"
                  r="24"
                  fill={selectedArea === 'Head' ? '#3b82f6' : '#cbd5e1'}
                  stroke={selectedArea === 'Head' ? '#1d4ed8' : '#94a3b8'}
                  strokeWidth="2"
                />
                <text
                  x="100"
                  y="44"
                  textAnchor="middle"
                  fill={selectedArea === 'Head' ? '#ffffff' : '#475569'}
                  fontSize="9"
                  fontWeight="bold"
                >
                  Head
                </text>
              </g>

              {/* Neck */}
              <rect x="94" y="64" width="12" height="12" fill="#cbd5e1" />

              {/* Chest / Thorax */}
              <g
                onClick={() => setSelectedArea('Chest')}
                className="cursor-pointer transition-all"
              >
                <path
                  d="M 68 76 L 132 76 L 126 145 L 74 145 Z"
                  fill={selectedArea === 'Chest' ? '#2563eb' : '#cbd5e1'}
                  stroke={selectedArea === 'Chest' ? '#1d4ed8' : '#94a3b8'}
                  strokeWidth="2"
                  rx="6"
                />
                <text
                  x="100"
                  y="112"
                  textAnchor="middle"
                  fill={selectedArea === 'Chest' ? '#ffffff' : '#475569'}
                  fontSize="11"
                  fontWeight="bold"
                >
                  Chest / Heart
                </text>
              </g>

              {/* Abdomen */}
              <g
                onClick={() => setSelectedArea('Abdomen')}
                className="cursor-pointer transition-all"
              >
                <path
                  d="M 74 148 L 126 148 L 120 215 L 80 215 Z"
                  fill={selectedArea === 'Abdomen' ? '#0284c7' : '#cbd5e1'}
                  stroke={selectedArea === 'Abdomen' ? '#0369a1' : '#94a3b8'}
                  strokeWidth="2"
                  rx="4"
                />
                <text
                  x="100"
                  y="183"
                  textAnchor="middle"
                  fill={selectedArea === 'Abdomen' ? '#ffffff' : '#475569'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  Abdomen
                </text>
              </g>

              {/* Left Arm */}
              <g
                onClick={() => setSelectedArea('Arms')}
                className="cursor-pointer transition-all"
              >
                <rect
                  x="44"
                  y="80"
                  width="20"
                  height="115"
                  rx="9"
                  transform="rotate(8 44 80)"
                  fill={selectedArea === 'Arms' ? '#3b82f6' : '#cbd5e1'}
                  stroke={selectedArea === 'Arms' ? '#1d4ed8' : '#94a3b8'}
                  strokeWidth="2"
                />
                <text
                  x="48"
                  y="140"
                  textAnchor="middle"
                  fill={selectedArea === 'Arms' ? '#ffffff' : '#475569'}
                  fontSize="8"
                  fontWeight="bold"
                >
                  Arms
                </text>
              </g>

              {/* Right Arm */}
              <g
                onClick={() => setSelectedArea('Arms')}
                className="cursor-pointer transition-all"
              >
                <rect
                  x="136"
                  y="80"
                  width="20"
                  height="115"
                  rx="9"
                  transform="rotate(-8 156 80)"
                  fill={selectedArea === 'Arms' ? '#3b82f6' : '#cbd5e1'}
                  stroke={selectedArea === 'Arms' ? '#1d4ed8' : '#94a3b8'}
                  strokeWidth="2"
                />
              </g>

              {/* Pelvis */}
              <path d="M 80 217 L 120 217 L 115 235 L 85 235 Z" fill="#94a3b8" />

              {/* Left Leg */}
              <g
                onClick={() => setSelectedArea('Legs')}
                className="cursor-pointer transition-all"
              >
                <rect
                  x="72"
                  y="238"
                  width="22"
                  height="145"
                  rx="9"
                  fill={selectedArea === 'Legs' ? '#3b82f6' : '#cbd5e1'}
                  stroke={selectedArea === 'Legs' ? '#1d4ed8' : '#94a3b8'}
                  strokeWidth="2"
                />
                <text
                  x="83"
                  y="310"
                  textAnchor="middle"
                  fill={selectedArea === 'Legs' ? '#ffffff' : '#475569'}
                  fontSize="9"
                  fontWeight="bold"
                >
                  Legs
                </text>
              </g>

              {/* Right Leg */}
              <g
                onClick={() => setSelectedArea('Legs')}
                className="cursor-pointer transition-all"
              >
                <rect
                  x="106"
                  y="238"
                  width="22"
                  height="145"
                  rx="9"
                  fill={selectedArea === 'Legs' ? '#3b82f6' : '#cbd5e1'}
                  stroke={selectedArea === 'Legs' ? '#1d4ed8' : '#94a3b8'}
                  strokeWidth="2"
                />
              </g>
            </svg>
          </div>

          <span className="text-[11px] text-slate-400 mt-2">
            Click on anatomical regions to inspect organs
          </span>
        </div>

        {/* Right Detail Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
              Selected Anatomical Quadrant
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">{currentData.name}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              {currentData.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">Key Organ Systems</h4>
            <div className="flex flex-wrap gap-1.5">
              {currentData.organs.map((organ) => (
                <span
                  key={organ}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                >
                  {organ}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">Characteristic Symptoms</h4>
            <div className="flex flex-wrap gap-1.5">
              {currentData.symptoms.map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => onSelectSymptom && onSelectSymptom(sym)}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-medium text-blue-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{sym}</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 mb-2">Common Associated Conditions</h4>
            <div className="space-y-1.5">
              {currentData.conditions.map((cond) => (
                <div
                  key={cond}
                  className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-medium text-slate-700 flex items-center justify-between"
                >
                  <span>{cond}</span>
                  <span className="text-[10px] text-slate-400">Reference</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyViewer3D;
