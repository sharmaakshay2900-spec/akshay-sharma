import React, { useState, useEffect } from 'react';
import { Building2, Search, MapPin, Globe, AlertCircle, ExternalLink, Filter } from 'lucide-react';
import api from '../services/api';

export const HospitalFinder: React.FC = () => {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [aiimsList, setAiimsList] = useState<any[]>([]);
  const [medicalCenters, setMedicalCenters] = useState<any[]>([]);

  const [search, setSearch] = useState('AIIMS');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  useEffect(() => {
    Promise.all([api.getHospitals(), api.getAIIMS(), api.getMedicalCenters()]).then(
      ([hosp, aiims, centers]) => {
        setHospitals(hosp);
        setAiimsList(aiims);
        setMedicalCenters(centers);
      }
    );
  }, []);

  // Merge all institutions into unified search space
  const allInstitutions = [
    ...aiimsList,
    ...hospitals,
    ...medicalCenters,
  ];

  // Distinct states and types
  const states = ['all', ...Array.from(new Set(allInstitutions.map((h) => h.state).filter(Boolean)))];
  const types = ['all', 'Government - Institute of National Importance (INI)', 'Government Tertiary Center', 'Government', 'Private / Non-Profit Teaching Hospital'];

  const filtered = allInstitutions.filter((item) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      item.name.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q) ||
      item.state.toLowerCase().includes(q) ||
      item.departments?.some((d: string) => d.toLowerCase().includes(q)) ||
      item.specialties?.some((s: string) => s.toLowerCase().includes(q));

    const matchesState = selectedState === 'all' || item.state === selectedState;
    const matchesType = selectedType === 'all' || item.type.includes(selectedType) || (selectedType === 'Government' && item.type.includes('Government'));
    const matchesSpecialty =
      selectedSpecialty === 'all' ||
      item.departments?.some((d: string) => d.toLowerCase().includes(selectedSpecialty.toLowerCase())) ||
      item.specialties?.some((s: string) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));

    return matchesSearch && matchesState && matchesType && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hospital & AIIMS Medical Center Finder</h2>
            <p className="text-xs text-slate-500">
              Explore All India Institute of Medical Sciences (AIIMS) and premier Indian tertiary institutions.
            </p>
          </div>
        </div>
      </div>

      {/* Prominent Educational Notice */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Educational Reference Registry:</span> Educational/demo reference data – verify current information, emergency phone lines, and OPD timings from official institutional sources.
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by hospital name, city, department (e.g. AIIMS)..."
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All States / UTs</option>
              {states.filter((s) => s !== 'all').map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">All Specialties</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Pulmonary">Pulmonology</option>
              <option value="Oncology">Oncology</option>
              <option value="Gastroenterology">Gastroenterology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
            </select>
          </div>
        </div>

        {/* Quick Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1 no-scrollbar">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Quick Queries:
          </span>
          {['AIIMS', 'AIIMS New Delhi', 'AIIMS Jodhpur', 'AIIMS Rishikesh', 'AIIMS Bhopal', 'PGIMER', 'NIMHANS'].map((chip) => (
            <button
              key={chip}
              onClick={() => setSearch(chip)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                search === chip
                  ? 'bg-sky-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {chip}
            </button>
          ))}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Found <span className="font-bold text-slate-800">{filtered.length}</span> institutions
          </span>
          <span>Showing verified educational records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 bg-white border border-slate-200 rounded-2xl p-12 text-center text-xs text-slate-400">
              No medical institutions found matching your filter criteria.
            </div>
          ) : (
            filtered.map((inst) => (
              <div
                key={inst.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-sky-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100">
                        {inst.type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm mt-1.5 leading-snug">
                        {inst.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {inst.city}, <span className="font-medium text-slate-700">{inst.state}</span>
                    </span>
                    {inst.establishedYear && (
                      <span className="text-[11px] text-slate-400">· Est. {inst.establishedYear}</span>
                    )}
                  </div>

                  {/* Specialties & Departments */}
                  {inst.specialties && inst.specialties.length > 0 && (
                    <div className="mt-3">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        Key Specialties:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {inst.specialties.map((s: string) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[11px] font-medium text-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {inst.departments && inst.departments.length > 0 && (
                    <div className="mt-2 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Departments: </span>
                      {inst.departments.slice(0, 5).join(', ')}
                      {inst.departments.length > 5 && ` +${inst.departments.length - 5} more`}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[10px] text-slate-400 italic truncate max-w-[240px]">
                    {inst.contact}
                  </div>
                  {inst.website && (
                    <a
                      href={inst.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 font-semibold transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalFinder;
