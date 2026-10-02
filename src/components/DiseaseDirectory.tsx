import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, Activity, Filter } from 'lucide-react';
import api from '../services/api';
import DiseaseExplainer from './DiseaseExplainer';

interface DiseaseDirectoryProps {
  initialSelectedDisease?: string | null;
}

export const DiseaseDirectory: React.FC<DiseaseDirectoryProps> = ({ initialSelectedDisease }) => {
  const [diseases, setDiseases] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedDisease, setSelectedDisease] = useState<any | null>(null);

  useEffect(() => {
    api.getDiseases().then((data) => {
      setDiseases(data);
      if (initialSelectedDisease) {
        const found = data.find(
          (d) => d.name.toLowerCase() === initialSelectedDisease.toLowerCase()
        );
        if (found) setSelectedDisease(found);
        else if (data.length > 0) setSelectedDisease(data[0]);
      } else if (data.length > 0 && !selectedDisease) {
        setSelectedDisease(data[0]);
      }
    });
  }, [initialSelectedDisease]);

  const categories = ['all', 'Respiratory', 'Cardiovascular', 'Metabolic', 'Neurological', 'Gastrointestinal', 'Infectious', 'Musculoskeletal'];

  const filteredDiseases = diseases.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
      d.symptoms.some((s: string) => s.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || d.category.toLowerCase().includes(categoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Medical Disease Directory</h2>
            <p className="text-xs text-slate-500">
              Curated medical reference encyclopedia with symptoms, pathology, treatment modalities, and plain English translation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List & Filters (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search diseases, symptoms..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All Conditions' : cat}
              </button>
            ))}
          </div>

          {/* List items */}
          <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredDiseases.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No matching conditions found.
              </div>
            ) : (
              filteredDiseases.map((d) => {
                const isSelected = selectedDisease?.id === d.id;
                return (
                  <div
                    key={d.id}
                    onClick={() => setSelectedDisease(d)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-400/20'
                        : 'bg-white border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{d.name}</span>
                        {d.isChronic && (
                          <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 bg-amber-50 text-amber-800 rounded">
                            Chronic
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[240px]">
                        {d.category} · {d.doctorSpecialty}
                      </div>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Detail Pane (7 cols) */}
        <div className="lg:col-span-7">
          {selectedDisease ? (
            <DiseaseExplainer disease={selectedDisease} />
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-500">
              Select a condition on the left to read clinical explanations and treatments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDirectory;
