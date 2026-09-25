import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { FolderKanban, Users, Building2, CheckCircle2, ArrowRight, Shield } from 'lucide-react';
import { formatCurrencyINR } from '../../utils/helpers';

export const UniversityProjectsPage: React.FC = () => {
  const { projects, currentUser } = useApp();

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Institutional Projects Lifecycle
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Active multidisciplinary research and engineering projects advancing from prototype to field pilot.
          </p>
        </div>

        <Link
          to="/university/discover"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-sm"
        >
          <span>+ New Project from Challenge</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {projects.map(proj => (
          <div
            key={proj.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle hover:shadow-card transition-shadow space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded">
                  {proj.category}
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Stage: {proj.stage}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">{proj.id}</span>
            </div>

            <div>
              <Link
                to={`/projects/${proj.id}`}
                className="text-lg font-bold text-slate-900 hover:text-teal-800 transition-colors"
              >
                {proj.title}
              </Link>
              <p className="text-xs text-slate-500 mt-1">
                Linked Challenge: <strong className="text-slate-700">{proj.challengeTitle}</strong>
              </p>
            </div>

            {/* Team and Mentor details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Team Name:</span>
                <span className="font-bold text-slate-800">{proj.teamName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Faculty Mentor:</span>
                <span className="font-semibold text-slate-800">{proj.facultyMentor.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Student Innovators:</span>
                <span className="font-semibold text-slate-800">{proj.studentTeam.length} Members</span>
              </div>
            </div>

            {/* Progress and Budget */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-1">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600 font-medium">Lifecycle Milestones</span>
                  <span className="font-bold text-slate-900">{proj.progressPercentage}% Completed</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full transition-all"
                    style={{ width: `${proj.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end items-center gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Approved Budget:</span>
                  <span className="font-bold text-slate-900">{formatCurrencyINR(proj.budget.approved)}</span>
                </div>
                {proj.budget.csrPledged > 0 && (
                  <div>
                    <span className="text-slate-400 block text-[10px]">CSR Match:</span>
                    <span className="font-bold text-amber-700">{formatCurrencyINR(proj.budget.csrPledged)}</span>
                  </div>
                )}
                <Link
                  to={`/projects/${proj.id}`}
                  className="px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-800 text-white font-semibold inline-flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
