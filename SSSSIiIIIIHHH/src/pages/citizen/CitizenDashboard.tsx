import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  PlusCircle,
  FolderHeart,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { fetchMyComplaints, mapBackendComplaintToChallenge } from '../../api';

export const CitizenDashboard: React.FC = () => {
  const { currentUser, challenges, notifications } = useApp();
  const [backendComplaints, setBackendComplaints] = useState<any[]>([]);

  useEffect(() => {
    fetchMyComplaints()
      .then(data => {
        if (Array.isArray(data)) {
          setBackendComplaints(data.map(mapBackendComplaintToChallenge));
        }
      })
      .catch(err => console.error('Failed to fetch citizen complaints:', err));
  }, []);

  const localMyChallenges = challenges.filter(c => c.submittedBy?.id === currentUser?.id);
  const myChallenges = [
    ...backendComplaints,
    ...localMyChallenges.filter(
      mc => !backendComplaints.some(bc => bc.id === mc.id || bc.backendId === mc.id || bc.complaintNumber === mc.id)
    ),
  ];

  const pendingCount = myChallenges.filter(c => c.status === 'Submitted' || c.status === 'Under Validation').length;
  const inProgressCount = myChallenges.filter(c => c.status === 'In Progress' || c.status === 'Assigned to University').length;
  const pilotOrCompletedCount = myChallenges.filter(c => c.status === 'Pilot' || c.status === 'Completed' || c.status === 'Implemented').length;

  const totalBeneficiaries = myChallenges.reduce((acc, c) => acc + (c.impact?.affectedPeopleCount || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Citizen Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-emerald-200 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Civic Contributor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">
            Welcome back, {currentUser?.name || 'Citizen'}
          </h1>
          <p className="text-xs text-emerald-100 max-w-xl">
            You are actively tracking issues for <strong className="text-white">{currentUser?.location.cityVillage || 'Kanke Village'}</strong>, {currentUser?.location.district}. Your reports directly mobilize university engineers and government funds.
          </p>
        </div>

        <Link
          to="/citizen/submit"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-saffron-400 hover:bg-saffron-500 text-slate-950 shadow-md transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Citizen Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">My Submissions</span>
            <FolderHeart className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{myChallenges.length}</div>
          <p className="text-[11px] text-slate-500">Total reported challenges</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pending Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{pendingCount}</div>
          <p className="text-[11px] text-slate-500">Govt validation queue</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">In Engineering</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{inProgressCount}</div>
          <p className="text-[11px] text-slate-500">Assigned to university R&D</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-medium">Pilot / Deployed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{pilotOrCompletedCount}</div>
          <p className="text-[11px] text-slate-500">{totalBeneficiaries.toLocaleString('en-IN')} beneficiaries reached</p>
        </div>
      </div>

      {/* Main Grid: My Challenges & Community Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: My Active Submissions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              My Submitted Challenges
            </h2>
            <Link to="/citizen/challenges" className="text-xs font-semibold text-emerald-700 hover:underline">
              View All
            </Link>
          </div>

          {myChallenges.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 space-y-3">
              <p className="text-xs text-slate-500">You haven't submitted any challenges yet.</p>
              <Link
                to="/citizen/submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Submit First Challenge
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myChallenges.map(ch => (
                <div
                  key={ch.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-subtle hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {ch.category}
                    </span>
                    <StatusBadge status={ch.status} />
                  </div>

                  <Link
                    to={`/citizen/challenges/${ch.id}`}
                    className="block text-sm font-bold text-slate-900 hover:text-emerald-700"
                  >
                    {ch.title}
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2">{ch.description}</p>

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

                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                    <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {ch.location.district}, {ch.location.state}
                      </span>
                      <span>• {formatDate(ch.submittedAt)}</span>
                    </div>

                    <Link
                      to={`/citizen/challenges/${ch.id}`}
                      className="font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1 text-xs"
                    >
                      Track Milestone Progress →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Latest Alerts & Community Activity */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Latest Progress Updates
          </h2>

          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-subtle space-y-3 divide-y divide-slate-100">
            {notifications
              .filter(n => n.recipientRole === 'citizen')
              .slice(0, 4)
              .map(n => (
                <div key={n.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900">{n.title}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(n.createdAt)}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                </div>
              ))}
          </div>

          {/* Civic Impact Pledge Box */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-emerald-900">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Your Community Footprint
            </span>
            <p className="text-[11px] leading-relaxed text-emerald-800">
              Because of your report, <strong>BIT Mesra</strong> and <strong>Tata Trusts</strong> deployed a solar water ATM serving 2,400 residents in Kanke.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
