import React from 'react';
import { useApp } from '../../context/AppContext';
import { GraduationCap, MapPin, Building, Award, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UniversitiesPage: React.FC = () => {
  const { institutions } = useApp();

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-900 border border-teal-300">
          <Building className="w-3.5 h-3.5 text-teal-700" />
          <span>Academic R&D Network</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Participating Higher Education Institutions
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Premier universities, Indian Institutes of Technology (IITs), and National Institutes of Technology (NITs) solving real societal challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {institutions.map(inst => (
          <div
            key={inst.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md hover:shadow-xl hover:border-teal-400 transition-all space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-bold text-slate-900">{inst.name}</h3>
                    <span className="text-[11px] font-bold text-teal-900 bg-teal-100 border border-teal-300 px-2 py-0.5 rounded-full">
                      NIRF #{inst.nirfRank}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>{inst.city}, {inst.state}</span>
                  </p>
                </div>
              </div>

              {/* Research Departments */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 block">Departments:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inst.departments.map((dept, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {dept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Labs */}
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 block">Prototyping Labs & Facilities:</span>
                <div className="flex flex-wrap gap-1.5">
                  {inst.equipmentLabs.map((lab, i) => (
                    <span key={i} className="text-[11px] font-semibold bg-teal-50 text-teal-950 px-2.5 py-0.5 rounded-md border border-teal-200">
                      {lab}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="text-slate-600">
                <span className="font-medium">{inst.facultyCount} Faculty</span> •{' '}
                <span className="font-bold text-slate-900">{inst.activeProjectsCount} Active Projects</span>
              </div>
              <Link
                to="/explore"
                className="font-bold text-teal-800 hover:text-teal-950 hover:underline flex items-center gap-0.5"
              >
                <span>View Challenges</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
