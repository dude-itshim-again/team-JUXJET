import React from 'react';
import { useApp } from '../../context/AppContext';
import { Lightbulb, FileCheck, Award, ExternalLink } from 'lucide-react';

export const UniversityResearchPage: React.FC = () => {
  const { projects } = useApp();

  const allOutcomes = projects.flatMap(p =>
    p.outcomes.map(o => ({
      ...o,
      projectTitle: p.title,
      projectId: p.id,
      universityName: p.universityName
    }))
  );

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Research, Patents & Innovation IP Registry
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Intellectual property, peer-reviewed publications, and verified technology transfer disclosures developed from societal challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allOutcomes.map(out => (
          <div
            key={out.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                {out.type}
              </span>
              <span className="text-xs font-mono text-slate-400">{out.referenceNo}</span>
            </div>

            <h3 className="text-sm font-bold text-slate-900 leading-snug">{out.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{out.description}</p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">
                Origin: <strong className="text-slate-700">{out.universityName}</strong>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                ✓ Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
