import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  CheckSquare,
  AlertTriangle,
  GitFork,
  Activity,
  ArrowRight,
  TrendingUp,
  Building,
  MapPin,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { fetchAllComplaints, mapBackendComplaintToChallenge } from '../../api';

export const GovernmentDashboard = () => {
  const { currentUser, challenges, projects, departments } = useApp();
  const [backendComplaints, setBackendComplaints] = useState([]);

  useEffect(() => {
    fetchAllComplaints()
      .then(data => {
        if (Array.isArray(data)) {
          setBackendComplaints(data.map(mapBackendComplaintToChallenge));
        }
      })
      .catch(err => console.error('Failed to fetch backend complaints for government:', err));
  }, []);

  // Merge live backend complaints with local mock challenges
  const combinedChallenges = [
    ...backendComplaints,
    ...challenges.filter(
      c => !backendComplaints.some(bc => bc.id === c.id || bc.backendId === c.id || bc.complaintNumber === c.id)
    ),
  ];

  const pendingValidation = combinedChallenges.filter(
    c => c.status === 'Submitted' || c.status === 'Under Validation' || c.status === 'Assigned to University'
  );
  const validatedCount = combinedChallenges.filter(
    c => c.status !== 'Draft' && c.status !== 'Submitted' && c.status !== 'Rejected'
  ).length;
  const criticalCount = combinedChallenges.filter(c => c.priority === 'Critical' || c.priority === 'High').length;
  const activeProjectsCount = projects.length + combinedChallenges.filter(c => c.assignedUniversity).length;

  return (
    <div className="space-y-6 font-sans">
      {/* Executive Oversight Banner */}
      <div className="bg-gradient-to-r from-navy-800 to-blue-900 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-700/80 text-blue-200 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>Government Central Oversight Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Officer Portal: {currentUser?.name || 'Rajesh Kumar, IAS'}
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Oversight for <strong className="text-white">{currentUser?.departmentName || 'Drinking Water & Sanitation'}</strong>. Review triage queue, validate ground reports with simulated AI assistance, and sanction university pilot deployments.
          </p>
        </div>

        <Link
          to="/government/validation"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-saffron-400 hover:bg-saffron-500 text-slate-950 shadow-md transition-all shrink-0"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Launch 3-Column Validation ({pendingValidation.length})</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Validation Queue</span>
            <CheckSquare className="w-4 h-4 text-blue-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingValidation.length}</div>
          <p className="text-[11px] text-slate-500">Awaiting officer sanction</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Critical Priority</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-700">{criticalCount}</div>
          <p className="text-[11px] text-slate-500">Urgent health & safety hazards</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Validated Challenges</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{validatedCount}</div>
          <p className="text-[11px] text-slate-500">Categorized & routed</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">University Teams Active</span>
            <Activity className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-bold text-teal-800">{activeProjectsCount}</div>
          <p className="text-[11px] text-slate-500">Prototyping & field pilots</p>
        </div>
      </div>

      {/* Main Grid: Pending Validation & Department Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Urgent Triage Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <span>Pending Ground Truth Triage & Assignments</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                {pendingValidation.length} Total
              </span>
            </h2>
            <Link to="/government/validation" className="text-xs font-semibold text-blue-800 hover:underline">
              Open Validation Queue →
            </Link>
          </div>

          <div className="space-y-3">
            {pendingValidation.map(ch => (
              <div
                key={ch.id}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-subtle hover:border-blue-400 transition-all space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {ch.category}
                    </span>
                    <PriorityBadge priority={ch.priority} />
                    <StatusBadge status={ch.status} />
                  </div>
                  <span className="text-xs font-mono text-slate-400">{ch.complaintNumber || ch.id}</span>
                </div>

                <Link
                  to={`/complaints/${ch.backendId || ch.id}`}
                  className="block text-sm font-bold text-slate-900 hover:text-blue-800"
                >
                  {ch.title}
                </Link>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.description}</p>

                {/* Step 2: Research Partner Badge if assigned */}
                {ch.assignedUniversity && (
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold">
                    <span className="text-base leading-none">🏛️</span>
                    <span>Research Partner: {ch.assignedUniversity.name}</span>
                  </div>
                )}

                {/* Step 4: Shiny Gold Badge if Funded */}
                {ch.fundingStatus === 'FUNDED' && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                    <span className="text-sm">💰</span>
                    <span>Funded by {ch.industryPartner?.name || 'Corporate CSR Partner'}</span>
                  </div>
                )}

                {/* AI Suggestion Snippet */}
                {ch.aiAnalysis && (
                  <div className="p-2.5 rounded-lg bg-purple-50/70 border border-purple-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                      <span className="text-purple-900 font-medium">
                        AI Recommended Dept: <strong>{ch.aiAnalysis.suggestedDepartment}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                      {ch.aiAnalysis.categoryConfidence}% Confidence
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {ch.location?.district || 'Ranchi'}, {ch.location?.state || 'Jharkhand'}
                  </span>

                  <Link
                    to={`/complaints/${ch.backendId || ch.id}`}
                    className="px-3 py-1.5 rounded-md bg-blue-800 hover:bg-blue-900 text-white font-semibold text-xs transition-colors"
                  >
                    Inspect Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Department Workload & Escalations */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Inter-Department Workload
          </h2>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle space-y-3">
            {departments.map(dept => (
              <div key={dept.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">{dept.name}</span>
                  <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-1.5 py-0.2 rounded">
                    {dept.activeChallengesCount} Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Turnaround: {dept.avgTurnaroundDays} days</span>
                  <span>{dept.officersCount} Officers</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Routing Shortcut */}
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-blue-900">
              <GitFork className="w-4 h-4 text-blue-700" />
              University Capability Matchmaking
            </span>
            <p className="text-[11px] leading-relaxed text-blue-800">
              Route validated challenges directly to verified research centers like <strong>BIT Mesra</strong>, <strong>Ranchi Science College</strong>, and <strong>BAU Ranchi</strong> based on lab equipment.
            </p>
            <Link
              to="/government/routing"
              className="inline-block mt-1 text-xs font-bold text-blue-900 underline"
            >
              Open Matchmaking Directory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GovernmentDashboard;
