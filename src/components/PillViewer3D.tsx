import React, { useState, useEffect } from 'react';
import { Pill, AlertTriangle, Info, RotateCw, ExternalLink } from 'lucide-react';
import api from '../services/api';

export const PillViewer3D: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [rotation, setRotation] = useState(25);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    api.getMedicines().then((data) => {
      setMedicines(data);
      if (data.length > 0) setSelectedMed(data[0]);
    });
  }, []);

  // Continuous subtle 3D rotation animation
  useEffect(() => {
    if (!isRotating) return;
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 40);
    return () => clearInterval(interval);
  }, [isRotating]);

  if (!selectedMed) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-sm text-slate-500">
        Loading pharmaceutical models...
      </div>
    );
  }

  const isCapsule = selectedMed.shape === 'capsule';
  const isCapsuleTablet = selectedMed.shape === 'capsule_tablet';
  const primaryColor = selectedMed.primaryColor || '#EF4444';
  const secondaryColor = selectedMed.secondaryColor || '#FFFFFF';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">3D Pharmaceutical & Pill Viewer</h2>
            <p className="text-xs text-slate-500">
              Interactive geometry rendering of pharmaceutical dosages with active compound mechanisms and safety warnings.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Center 3D Stage (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold text-slate-500">
              Interactive Render Canvas
            </span>
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{isRotating ? 'Pause Rotation' : 'Auto Rotate'}</span>
            </button>
          </div>

          {/* 3D Visualizer Container with CSS Perspective */}
          <div
            className="w-full h-64 sm:h-72 bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-xl flex items-center justify-center relative overflow-hidden select-none border border-slate-100"
            style={{ perspective: '800px' }}
          >
            {/* Ambient Lighting reflections */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/80 via-transparent to-transparent pointer-events-none" />

            {/* Simulated 3D Pill Object */}
            <div
              className="transition-transform duration-75 relative cursor-grab active:cursor-grabbing"
              style={{
                transform: `rotateY(${rotation}deg) rotateX(18deg)`,
                transformStyle: 'preserve-3d',
              }}
              onMouseDown={() => setIsRotating(false)}
            >
              {isCapsule ? (
                // Capsule Render
                <div className="relative w-48 h-20 rounded-full flex shadow-2xl border border-black/10 overflow-hidden">
                  {/* Left half */}
                  <div
                    className="w-1/2 h-full flex items-center justify-center font-bold text-xs tracking-wider uppercase text-white/90 shadow-inner"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <span className="drop-shadow-sm font-mono text-[10px]">RX-MED</span>
                  </div>
                  {/* Right half */}
                  <div
                    className="w-1/2 h-full flex items-center justify-center font-bold text-xs tracking-wider uppercase text-slate-700 shadow-inner"
                    style={{ backgroundColor: secondaryColor }}
                  >
                    <span className="drop-shadow-sm font-mono text-[10px]">500MG</span>
                  </div>
                  {/* Glass specular sheen */}
                  <div className="absolute top-1 left-4 right-4 h-3 bg-white/40 rounded-full blur-[1px]" />
                </div>
              ) : isCapsuleTablet ? (
                // Caplet (Elongated Tablet with score line)
                <div
                  className="relative w-44 h-18 rounded-3xl flex items-center justify-center shadow-2xl border border-black/10 overflow-hidden"
                  style={{ backgroundColor: primaryColor }}
                >
                  {/* Center Score Indentation Line */}
                  <div className="absolute inset-y-0 left-1/2 w-0.5 bg-black/20 shadow-xs" />
                  <span className="font-mono text-xs font-bold text-white tracking-widest drop-shadow-sm">
                    {selectedMed.name.split(' ')[0]}
                  </span>
                  <div className="absolute top-1 left-4 right-4 h-2.5 bg-white/30 rounded-full blur-[1px]" />
                </div>
              ) : (
                // Round Tablet
                <div
                  className="relative w-36 h-36 rounded-full flex items-center justify-center shadow-2xl border border-black/10"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="w-28 h-28 rounded-full border border-black/10 flex items-center justify-center">
                    <span className="font-mono text-xs font-bold text-slate-800 tracking-wider text-center px-2">
                      {selectedMed.name.split(' ')[0]}
                    </span>
                  </div>
                  {/* Score line across diameter */}
                  <div className="absolute inset-x-4 top-1/2 h-0.5 bg-black/15" />
                  <div className="absolute top-3 left-6 right-6 h-4 bg-white/35 rounded-full blur-[1px]" />
                </div>
              )}
            </div>

            {/* Pill Shadow beneath */}
            <div className="absolute bottom-6 w-44 h-5 bg-black/10 rounded-full blur-md" />
          </div>

          {/* Quick Medicine Switcher Carousel / Row */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Select Medicine Sample:
            </span>
            <div className="grid grid-cols-4 gap-2">
              {medicines.map((med) => {
                const isCurrent = med.id === selectedMed.id;
                return (
                  <button
                    key={med.id}
                    onClick={() => {
                      setSelectedMed(med);
                      setRotation(25);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-8 h-4 rounded-full mx-auto mb-1 flex overflow-hidden border border-black/10 shadow-2xs">
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: med.primaryColor || '#cbd5e1' }}
                      />
                      <div
                        className="w-1/2 h-full"
                        style={{ backgroundColor: med.secondaryColor || '#ffffff' }}
                      />
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 truncate">
                      {med.name.split(' ')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Details Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {selectedMed.category}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-0.5">{selectedMed.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Generic Chemical Name: <span className="font-semibold text-slate-700">{selectedMed.genericName}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-semibold">Dosage Form</span>
              <span className="font-bold text-slate-800">{selectedMed.form}</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-[10px] text-slate-400 block font-semibold">Shape Geometry</span>
              <span className="font-bold text-slate-800 capitalize">
                {selectedMed.shape.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">Common Clinical Indications</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedMed.commonUses}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">Mechanism of Action</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
              {selectedMed.mechanismOfAction}
            </p>
          </div>

          <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl text-amber-900 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Safety & Clinical Warnings</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              {selectedMed.warnings}
            </p>
          </div>

          <div className="text-[11px] text-slate-400 text-center pt-2">
            No personalized dosage advice provided. Reference only.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PillViewer3D;
