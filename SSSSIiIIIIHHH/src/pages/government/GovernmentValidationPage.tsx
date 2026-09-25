import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  CheckSquare,
  Sparkles,
  MapPin,
  Calendar,
  User,
  AlertTriangle,
  Building2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  GitFork,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../utils/constants';
import { ChallengeCategory, Priority } from '../../types';

export const GovernmentValidationPage: React.FC = () => {
  const { challenges, institutions, departments, validateChallenge, routeChallengeToUniversity, currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Selected challenge
  const initialId = searchParams.get('challengeId') || challenges[0]?.id;
  const [selectedId, setSelectedId] = useState(initialId);

  const activeChallenge = challenges.find(c => c.id === selectedId) || challenges[0];

  // Action form state
  const [overrideCategory, setOverrideCategory] = useState<ChallengeCategory>(
    activeChallenge?.category || 'Water and Sanitation'
  );
  const [overridePriority, setOverridePriority] = useState<Priority>(activeChallenge?.priority || 'High');
  const [assignedDept, setAssignedDept] = useState(
    activeChallenge?.assignedDepartment || departments[0]?.name || ''
  );
  const [selectedUniversity, setSelectedUniversity] = useState(institutions[0]?.id || '');
  const [officerNotes, setOfficerNotes] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const handleValidationAction = (action: 'Validate' | 'Reject' | 'RequestInfo' | 'Duplicate') => {
    if (!activeChallenge) return;
    validateChallenge(activeChallenge.id, action, {
      category: overrideCategory,
      priority: overridePriority,
      department: assignedDept,
      notes: officerNotes || `Officer action: ${action}`
    });

    setActionSuccessMessage(`Successfully performed action: ${action}`);
    setTimeout(() => setActionSuccessMessage(''), 3000);
  };

  const handleRouteToUniversity = () => {
    if (!activeChallenge || !selectedUniversity) return;
    routeChallengeToUniversity(activeChallenge.id, selectedUniversity);
    const uni = institutions.find(i => i.id === selectedUniversity);
    setActionSuccessMessage(`Invitation dispatched to ${uni?.name || 'University'}`);
    setTimeout(() => setActionSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header & Challenge Selector Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-800" />
            <span>3-Column Challenge Validation Workspace</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ground Truth (Left) $\leftrightarrow$ Simulated AI Analysis (Center) $\leftrightarrow$ Officer Governance Console (Right)
          </p>
        </div>

        {/* Quick Challenge Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Select Case:</span>
          <select
            value={selectedId}
            onChange={e => {
              setSelectedId(e.target.value);
              setSearchParams({ challengeId: e.target.value });
            }}
            className="py-1.5 px-3 text-xs border border-slate-300 rounded-lg bg-white focus:outline-none focus:border-blue-700 font-semibold text-slate-800"
          >
            {challenges.map(c => (
              <option key={c.id} value={c.id}>
                {c.id} - {c.title.substring(0, 35)}... ({c.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionSuccessMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* THREE-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ================= COLUMN 1 (LEFT): CITIZEN GROUND TRUTH (4 cols) ================= */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-subtle p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              1. Citizen Ground Truth
            </span>
            <span className="text-[10px] font-mono text-slate-400">{activeChallenge.id}</span>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
              {activeChallenge.category}
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-1 leading-snug">
              {activeChallenge.title}
            </h3>
          </div>

          <div className="text-xs text-slate-600 space-y-2">
            <p className="leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
              {activeChallenge.description}
            </p>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-slate-800 block">Reported Location:</span>
                <span>
                  {activeChallenge.location.villageWard ? `${activeChallenge.location.villageWard}, ` : ''}
                  {activeChallenge.location.district}, {activeChallenge.location.state} - {activeChallenge.location.pincode}
                </span>
                <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                  Coords: {activeChallenge.location.lat}, {activeChallenge.location.lng}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Lodged: {formatDate(activeChallenge.submittedAt)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>
                By: {activeChallenge.submittedBy.isAnonymous ? 'Anonymous Citizen' : activeChallenge.submittedBy.name}
              </span>
            </div>
          </div>

          {/* Impact Claims */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
            <span className="font-bold text-slate-800 block">Citizen Impact Declaration:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block">Affected Population:</span>
                <span className="font-bold text-slate-900">
                  {activeChallenge.impact.affectedPeopleCount.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Citizen Urgency:</span>
                <span className="font-semibold text-red-700">{activeChallenge.impact.urgency}</span>
              </div>
            </div>
            {activeChallenge.impact.existingAttempts && (
              <p className="text-[11px] text-slate-500 pt-1">
                <strong>Prior Attempts:</strong> {activeChallenge.impact.existingAttempts}
              </p>
            )}
          </div>

          {/* Evidence Attachments */}
          {activeChallenge.evidence && activeChallenge.evidence.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-700 block">
                Evidence Files ({activeChallenge.evidence.length}):
              </span>
              <div className="space-y-1.5">
                {activeChallenge.evidence.map(ev => (
                  <div key={ev.id} className="p-2 rounded border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{ev.name}</span>
                    </div>
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-semibold text-blue-700 hover:underline shrink-0"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= COLUMN 2 (CENTER): SIMULATED AI PROBLEM ANALYSIS (4 cols) ================= */}
        <div className="lg:col-span-4 bg-purple-50/40 rounded-xl border border-purple-200 shadow-subtle p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              2. Simulated AI Triage
            </span>
            <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded">
              v2.4 Model
            </span>
          </div>

          {activeChallenge.aiAnalysis ? (
            <div className="space-y-4 text-xs">
              {/* Category & Confidence */}
              <div className="p-3 bg-white rounded-lg border border-purple-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Suggested Category:</span>
                  <span className="font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                    {activeChallenge.aiAnalysis.categoryConfidence}% Match
                  </span>
                </div>
                <div className="font-bold text-slate-800 text-sm">
                  {activeChallenge.aiAnalysis.suggestedCategory}
                </div>
              </div>

              {/* Priority & Rationale */}
              <div className="p-3 bg-white rounded-lg border border-purple-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Suggested Priority:</span>
                  <PriorityBadge priority={activeChallenge.aiAnalysis.suggestedPriority} />
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                  <strong>Rationale:</strong> {activeChallenge.aiAnalysis.priorityRationale}
                </p>
              </div>

              {/* Duplicate Detection */}
              <div className="p-3 bg-white rounded-lg border border-purple-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Duplicate Similarity:</span>
                  <span className="font-bold text-slate-800">
                    {activeChallenge.aiAnalysis.duplicateSimilarityScore}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {activeChallenge.aiAnalysis.duplicateSimilarityScore > 70
                    ? '⚠️ High probability duplicate candidate detected in district.'
                    : '✓ Unique issue signature across district challenge registry.'}
                </p>
              </div>

              {/* Top University Matches */}
              <div className="space-y-2">
                <span className="font-bold text-purple-900 block text-xs">
                  AI Recommended University Matches:
                </span>
                {activeChallenge.aiAnalysis.recommendedUniversities.map((rec, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-lg border border-purple-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{rec.institutionName}</span>
                      <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded">
                        {rec.matchScore}% Fit
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600">{rec.matchReason}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rec.facilities.map((fac, idx) => (
                        <span key={idx} className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                          {fac}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* SDG Alignment */}
              <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                <span className="text-[11px] font-bold text-slate-700 block mb-1">SDG Alignments:</span>
                <div className="flex flex-wrap gap-1">
                  {activeChallenge.aiAnalysis.sdgAlignments.map((sdg, i) => (
                    <span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-500">
              AI analysis queued for this submission.
            </div>
          )}
        </div>

        {/* ================= COLUMN 3 (RIGHT): OFFICER GOVERNANCE CONSOLE (4 cols) ================= */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-subtle p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-800" />
              3. Officer Decision Console
            </span>
            <StatusBadge status={activeChallenge.status} />
          </div>

          {/* Officer Identity */}
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs">
            <span className="text-slate-500 block">Reviewing Officer:</span>
            <span className="font-bold text-blue-950">
              {currentUser?.name || 'Rajesh Kumar, IAS'}
            </span>
            <span className="text-[11px] text-slate-500 block">Joint Secretary & Mission Director</span>
          </div>

          {/* Form Overrides */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department Routing</label>
              <select
                value={assignedDept}
                onChange={e => setAssignedDept(e.target.value)}
                className="w-full py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 bg-white"
              >
                {departments.map(d => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Category</label>
                <select
                  value={overrideCategory}
                  onChange={e => setOverrideCategory(e.target.value as any)}
                  className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 bg-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm Priority</label>
                <select
                  value={overridePriority}
                  onChange={e => setOverridePriority(e.target.value as any)}
                  className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Officer Internal Notes</label>
              <textarea
                rows={2}
                value={officerNotes}
                onChange={e => setOfficerNotes(e.target.value)}
                placeholder="Ground confirmation with local BDO, budget head allocations..."
                className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleValidationAction('Validate')}
              className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Validate & Accept Ground Truth</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleValidationAction('RequestInfo')}
                className="py-2 px-2.5 rounded-lg border border-orange-300 bg-orange-50 hover:bg-orange-100 text-orange-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Request Info</span>
              </button>

              <button
                type="button"
                onClick={() => handleValidationAction('Reject')}
                className="py-2 px-2.5 rounded-lg border border-red-300 bg-red-50 hover:bg-red-100 text-red-900 font-semibold text-xs transition-colors flex items-center justify-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>
            </div>
          </div>

          {/* University Routing Dispatch Sub-Console */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2 text-xs">
            <span className="font-bold text-teal-950 flex items-center gap-1">
              <GitFork className="w-3.5 h-3.5 text-teal-700" />
              Route to University R&D
            </span>
            <select
              value={selectedUniversity}
              onChange={e => setSelectedUniversity(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-teal-300 rounded-lg focus:outline-none bg-white font-medium text-slate-800"
            >
              {institutions.map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} (NIRF #{u.nirfRank || 'Top'})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleRouteToUniversity}
              className="w-full py-2 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Official Invitation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
