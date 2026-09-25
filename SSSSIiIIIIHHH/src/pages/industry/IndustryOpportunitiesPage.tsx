import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { Coins, Building2, Handshake, ArrowRight, Sparkles } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/helpers';

export const IndustryOpportunitiesPage: React.FC = () => {
  const { projects } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered = projects.filter(
    p => selectedCategory === 'All' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Fundable Innovation Projects
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active university research projects seeking corporate social responsibility (CSR) grants, equipment access, or pilot manufacturing.
          </p>
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-amber-600 font-medium"
        >
          <option value="All">All Thematic Sectors</option>
          <option value="Water and Sanitation">Water and Sanitation</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Healthcare">Healthcare</option>
          <option value="Urban Infrastructure">Urban Infrastructure</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(p => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {p.category}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {p.stage}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{p.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {p.proposal.proposedSolution}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Developing HEI:</span>
                  <span className="font-bold text-slate-800">{p.universityName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seed Budget:</span>
                  <span className="font-bold text-slate-800">{formatCurrencyINR(p.budget.requested)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Existing CSR Match:</span>
                  <span className="font-bold text-amber-700">{formatCurrencyINR(p.budget.csrPledged)}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">{p.id}</span>
              <Link
                to={`/projects/${p.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-colors"
              >
                <Handshake className="w-3.5 h-3.5" />
                <span>Pledge CSR Support</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
