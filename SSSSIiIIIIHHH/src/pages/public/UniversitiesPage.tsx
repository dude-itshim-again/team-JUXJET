import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, MapPin, Building, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UniversitiesPage: React.FC = () => {
  const { institutions } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
          Participating Higher Education Institutions
        </h1>
        <p className="text-sm text-slate-600">
          Premier universities, Indian Institutes of Technology (IITs), and National Institutes of Technology (NITs) solving real societal challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {institutions.map(inst => (
          <div
            key={inst.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{inst.name}</h3>
                    <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      NIRF #{inst.nirfRank}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {inst.city}, {inst.state}
                  </p>
                </div>
              </div>

              {/* Research Departments */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-700 block">Departments:</span>
                <div className="flex flex-wrap gap-1">
                  {inst.departments.map((dept, i) => (
                    <span key={i} className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Labs */}
              <div className="space-y-1 text-xs">
                <span className="font-semibold text-slate-700 block">Prototyping Labs & Facilities:</span>
                <div className="flex flex-wrap gap-1">
                  {inst.equipmentLabs.map((lab, i) => (
                    <span key={i} className="text-[11px] bg-teal-50 text-teal-900 px-2 py-0.5 rounded border border-teal-100">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="text-slate-500">
                <span>{inst.facultyCount} Faculty</span> •{' '}
                <span className="font-bold text-slate-700">{inst.activeProjectsCount} Active Projects</span>
              </div>
              <Link
                to="/explore"
                className="font-semibold text-navy-700 hover:underline"
              >
                View Challenges in this Region →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
