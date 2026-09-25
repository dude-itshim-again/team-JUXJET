import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GitFork, GraduationCap, Building2, Send, CheckCircle2, Award } from 'lucide-react';

export const GovernmentRoutingPage: React.FC = () => {
  const { institutions, challenges, routeChallengeToUniversity } = useApp();
  const [selectedChallengeId, setSelectedChallengeId] = useState(challenges[0]?.id || '');
  const [selectedInstitutionId, setSelectedInstitutionId] = useState(institutions[0]?.id || '');
  const [routedSuccess, setRoutedSuccess] = useState(false);

  const handleRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeId || !selectedInstitutionId) return;
    routeChallengeToUniversity(selectedChallengeId, selectedInstitutionId);
    setRoutedSuccess(true);
    setTimeout(() => setRoutedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          University Capability Matchmaking & Routing
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Route validated challenges to higher education institutions based on laboratory facilities, faculty domains, and NIRF rankings.
        </p>
      </div>

      {routedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Official institutional assignment invitation has been dispatched!</span>
        </div>
      )}

      {/* Routing Dispatch Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle">
        <form onSubmit={handleRoute} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Validated Societal Challenge
            </label>
            <select
              value={selectedChallengeId}
              onChange={e => setSelectedChallengeId(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-700"
            >
              {challenges.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.title.substring(0, 50)}... ({c.category})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Assign Target University
            </label>
            <select
              value={selectedInstitutionId}
              onChange={e => setSelectedInstitutionId(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-700"
            >
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.city}, NIRF #{inst.nirfRank})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Assignment</span>
            </button>
          </div>
        </form>
      </div>

      {/* University Directory with R&D Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {institutions.map(inst => (
          <div
            key={inst.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{inst.name}</h3>
                  <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded">
                    {inst.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  📍 {inst.city}, {inst.state} • NIRF Rank #{inst.nirfRank}
                </p>
              </div>
            </div>

            {/* Labs & Equipment */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-700 block">Accredited Testing & Prototyping Labs:</span>
              <div className="flex flex-wrap gap-1.5">
                {inst.equipmentLabs.map((lab, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200"
                  >
                    {lab}
                  </span>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Faculty</span>
                <span className="font-bold text-slate-800">{inst.facultyCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Student Innovators</span>
                <span className="font-bold text-slate-800">{inst.studentInnovatorsCount}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Active Projects</span>
                <span className="font-bold text-teal-800">{inst.activeProjectsCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
