import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Search, MapPin, Calendar, ArrowRight, FolderHeart, Sparkles } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { AiTriageBadges } from '../../components/common/AiTriageBadges';
import { formatDate } from '../../utils/helpers';
import { fetchMyComplaints, mapBackendComplaintToChallenge } from '../../api';

export const CitizenChallengesPage: React.FC = () => {
  const { currentUser, challenges } = useApp();
  const [activeTab, setActiveTab] = useState<'All' | 'Pending' | 'Active' | 'Completed'>('All');
  const [search, setSearch] = useState('');
  const [backendComplaints, setBackendComplaints] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchMyComplaints()
      .then(data => {
        if (isMounted && data && Array.isArray(data)) {
          const mapped = data.map(mapBackendComplaintToChallenge);
          setBackendComplaints(mapped);
        }
      })
      .catch(err => console.error('Failed to fetch backend complaints:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  const myChallenges = challenges.filter(
    c => !currentUser || c.submittedBy?.id === currentUser?.id || currentUser?.role === 'citizen'
  );

  // Merge live backend complaints with local mock data (avoid duplicates)
  const combinedList = [
    ...backendComplaints,
    ...myChallenges.filter(
      mc => !backendComplaints.some(bc => bc.id === mc.id || bc.backendId === mc.id || bc.complaintNumber === mc.id),
    ),
  ];

  const filtered = combinedList.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;

    if (activeTab === 'Pending') return c.status === 'Submitted' || c.status === 'Under Validation';
    if (activeTab === 'Active') return c.status === 'Validated' || c.status === 'Assigned to University' || c.status === 'In Progress';
    if (activeTab === 'Completed') return c.status === 'Pilot' || c.status === 'Implemented' || c.status === 'Completed';
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            My Submitted Challenges
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track validation, university assignment, and field implementation for your reported problems.
          </p>
        </div>

        <Link
          to="/citizen/submit"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Submission</span>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['All', 'Pending', 'Active', 'Completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === tab
                  ? 'bg-emerald-700 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search my challenges..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Submissions List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FolderHeart className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-800">No submissions found</h3>
          <p className="text-xs text-slate-500 mt-1">Try switching tabs or report a new societal challenge.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(ch => (
            <div
              key={ch.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {ch.category}
                  </span>
                  <StatusBadge status={ch.status} />
                  <PriorityBadge priority={ch.priority} />
                </div>
                <div className="flex items-center gap-1.5">
                  {ch.complaintNumber && (
                    <span className="text-[10px] font-mono font-bold text-navy-800 bg-navy-50 px-1.5 py-0.5 rounded border border-navy-200">
                      {ch.complaintNumber}
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400">{ch.id}</span>
                </div>
              </div>

              {/* AI Triage Badges */}
              <div className="pt-0.5">
                <AiTriageBadges
                  classification={ch.classification}
                  sdg_target={ch.sdg_target}
                  extracted_skills={ch.extracted_skills}
                  compact
                />
              </div>

              <Link
                to={`/citizen/challenges/${ch.id}`}
                className="block text-base font-bold text-slate-900 hover:text-emerald-700"
              >
                {ch.title}
              </Link>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{ch.description}</p>

              {/* Step 2: Research Partner Badge if assigned */}
              {ch.assignedUniversity && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold">
                  <span className="text-base leading-none">🏛️</span>
                  <span>Research Partner: {ch.assignedUniversity.name || ch.assignedUniversity.institutionName}</span>
                </div>
              )}

              {/* Step 4: Shiny Gold Badge if Funded */}
              {ch.fundingStatus === 'FUNDED' && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                  <span className="text-sm">💰</span>
                  <span>Funded by {ch.industryPartner?.name || 'Corporate CSR Partner'}</span>
                </div>
              )}

              {/* Status Stepper Indicator */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {ch.location.district}, {ch.location.state}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {formatDate(ch.submittedAt)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {ch.assignedUniversity && (
                    <span className="text-[11px] text-teal-800 font-medium">
                      Partner: {ch.assignedUniversity.institutionName}
                    </span>
                  )}
                  <Link
                    to={`/challenges/${ch.id}`}
                    className="font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Full Tracking</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
