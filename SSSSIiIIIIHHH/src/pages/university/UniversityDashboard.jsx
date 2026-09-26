import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  Sparkles,
  CheckCircle2,
  Target,
  Award,
  FlaskConical,
  Calendar,
  User,
  Check,
  RefreshCw,
  FolderKanban,
  Clock
} from 'lucide-react';
import { PriorityBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';

const DEFAULT_UNIVERSITIES = [
  {
    id: 'f2a3c359-ae9f-4738-b720-3fdb73931859',
    name: 'Ranchi Science College',
    location: 'Ranchi, Jharkhand',
    capabilities: ['Chemical Engineering', 'Water Filtration', 'Spectroscopy']
  },
  {
    id: '5c8a716f-e3d5-43db-be05-ec7010fd0209',
    name: 'Jharkhand Institute of Technology',
    location: 'Ranchi, Jharkhand',
    capabilities: ['IoT', 'Civil Engineering', 'Sensors', 'Roads']
  },
  {
    id: 'e3fc5433-79da-486a-9783-d168f3fa32f5',
    name: 'State Agricultural University',
    location: 'Kanke, Ranchi',
    capabilities: ['Soil Mechanics', 'Agriculture', 'Drones']
  }
];

export const UniversityDashboard = () => {
  // Step 2 & 3: State variables with immediate non-null defaults
  const [university, setUniversity] = useState(DEFAULT_UNIVERSITIES[0]);
  const [complaints, setComplaints] = useState([]);
  const [archives, setArchives] = useState([]);
  const [universitiesList, setUniversitiesList] = useState(DEFAULT_UNIVERSITIES);

  // UI / Action states
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  /**
   * 1. Initial Load: Fetch universities list and select active university
   */
  useEffect(() => {
    fetch('http://localhost:3000/universities')
      .then((res) => res.json())
      .then((data) => {
        console.log('Universities Data:', data);
        if (Array.isArray(data) && data.length > 0) {
          setUniversitiesList(data);
          const ranchi = data.find((u) => u.name && u.name.toLowerCase().includes('ranchi'));
          const myUni = ranchi || data[0];
          console.log('Selected University:', myUni);
          setUniversity(myUni);
        }
      })
      .catch((err) => {
        console.warn('Backend universities endpoint not ready, using defaults:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * 2. Real-Time Auto-Polling:
   * Polls GET /universities/${university.id}/inbox and GET /universities/${university.id}/archives every 3000ms.
   * Returns a cleanup function calling clearInterval to avoid memory leaks.
   */
  useEffect(() => {
    if (!university) return;

    const fetchData = async () => {
      try {
        // Fetch Inbox
        const inboxRes = await fetch(`http://localhost:3000/universities/${university.id}/inbox`);
        if (inboxRes.ok) {
          const inboxData = await inboxRes.json();
          setComplaints(Array.isArray(inboxData) ? inboxData : []);
        }

        // Step 2: Fetch Archives / Active Projects accepted by this university
        const archivesRes = await fetch(`http://localhost:3000/universities/${university.id}/archives`);
        if (archivesRes.ok) {
          const archivesData = await archivesRes.json();
          const items = Array.isArray(archivesData) ? archivesData : [];
          setArchives(items);
          console.log('Fetched Archives:', items);
        }
      } catch (err) {
        console.error('Error polling university data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Fetch immediately once
    fetchData();

    // Then fetch every 3 seconds (3000 milliseconds)
    const intervalId = setInterval(fetchData, 3000);

    // Cleanup: clear interval on unmount or when university changes
    return () => clearInterval(intervalId);
  }, [university]);

  // Step 3: Console log for safety to verify archives array
  useEffect(() => {
    console.log('Fetched Archives:', archives);
  }, [archives]);

  // Institution switcher for testing other universities in the database
  const handleUniversityChange = (uniId) => {
    const selected = universitiesList.find((u) => u.id === uniId);
    if (selected) {
      setLoading(true);
      setUniversity(selected);
    }
  };

  /**
   * Step 3: Fix Accept Button
   * Calls POST http://localhost:3000/complaints/${complaint.id}/accept
   * Payload: { universityId: university.id }
   * Includes .catch(err => console.error(err)) to log exactly why accept action fails.
   */
  const handleAcceptProject = (complaint) => {
    if (!university) {
      console.error('Cannot accept project: university state is null');
      return;
    }

    setAcceptingId(complaint.id);
    console.log(`Calling POST /complaints/${complaint.id}/accept with universityId: ${university.id}`);

    fetch(`http://localhost:3000/complaints/${complaint.id}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ universityId: university.id }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || `Failed to accept challenge (${res.status})`);
        }
        return res.json();
      })
      .then((result) => {
        console.log('Project accepted successfully:', result);

        // Show toast
        setToastMessage({
          title: `Challenge Accepted by ${university.name}!`,
          desc: `"${complaint.title}" has been assigned to your R&D laboratory pipeline.`,
        });

        // Filter that complaint out of the inbox view
        setComplaints((prev) => prev.filter((item) => item.id !== complaint.id));

        // Append to archives
        setArchives((prev) => [
          {
            ...complaint,
            status: 'ASSIGNED',
            assignedUniversityId: university.id,
            updatedAt: new Date().toISOString(),
          },
          ...prev,
        ]);

        setTimeout(() => setToastMessage(null), 6000);
      })
      .catch((err) => {
        console.error('Failed to accept challenge:', err);
        alert(`Error accepting challenge: ${err.message}`);
      })
      .finally(() => {
        setAcceptingId(null);
      });
  };

  const getSdgLabel = (sdg) => {
    switch (Number(sdg)) {
      case 6:
        return 'SDG 6: Clean Water';
      case 9:
        return 'SDG 9: Industry & Infra';
      case 2:
        return 'SDG 2: Zero Hunger';
      case 3:
        return 'SDG 3: Good Health';
      case 11:
        return 'SDG 11: Sustainable Cities';
      default:
        return `SDG ${sdg || 6}`;
    }
  };

  const capabilities = university?.capabilities
    ? Array.isArray(university.capabilities)
      ? university.capabilities
      : JSON.parse(university.capabilities)
    : [];

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-4 rounded-xl shadow-lg border border-emerald-500 flex items-start justify-between gap-3 animate-slideDown">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{toastMessage.title}</h4>
              <p className="text-xs text-emerald-100">{toastMessage.desc}</p>
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs font-semibold px-2 py-1 bg-black/20 rounded hover:bg-black/30 text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Real-time Telemetry & Live Polling Status */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2.5 rounded-xl border border-indigo-900/60 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-200">Active Institution:</span>
          {universitiesList.length > 0 ? (
            <select
              value={university ? university.id : ''}
              onChange={(e) => handleUniversityChange(e.target.value)}
              className="py-1 px-2.5 text-xs bg-slate-800 border border-slate-600 rounded-lg text-white font-bold focus:outline-none focus:border-teal-400 cursor-pointer shadow-inner"
            >
              {universitiesList.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-purple-300 font-semibold">{university ? university.name : 'Ranchi Science College'}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-emerald-400 font-mono bg-emerald-950/80 border border-emerald-600/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Live Database Polling (3s)
          </span>
          <span className="text-slate-300 text-xs hidden sm:inline">
            Inbox: <strong className="text-white font-bold">{complaints.length}</strong> | Active: <strong className="text-white font-bold">{archives.length}</strong>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Incoming AI Matches</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{complaints.length}</div>
          <p className="text-[11px] text-slate-600 font-medium">Awaiting lab acceptance</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Active Lab Projects</span>
            <FolderKanban className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-800">{archives.length}</div>
          <p className="text-[11px] text-slate-600 font-medium">Accepted research challenges</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Top Overlap Strength</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {complaints.length > 0 ? `${complaints[0].matchPercentage}%` : '100%'}
          </div>
          <p className="text-[11px] text-slate-600 font-medium">Based on verified lab skills</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-md space-y-1">
          <div className="flex items-center justify-between text-slate-600">
            <span className="text-xs font-bold">Research Associates</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">24 Researchers</div>
          <p className="text-[11px] text-slate-600 font-medium">Across chemical & sensor cells</p>
        </div>
      </div>

      {/* INCOMING AI CHALLENGES INBOX */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Incoming AI Innovation Inbox
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
                {complaints.length} New
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Live AI skill-overlap ranked challenges fetched from{' '}
              <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-[11px] border border-slate-200">
                GET /universities/{university?.id ? `${university.id.slice(0, 8)}...` : ':id'}/inbox
              </code>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Sorted by:</span>
            <span className="font-bold text-slate-900 bg-slate-100 border border-slate-200 px-2 py-1 rounded">Highest Skill Overlap ↓</span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-8 text-center space-y-3 bg-white rounded-xl border border-slate-200 shadow-sm">
            <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-800">Synchronizing AI Innovation Matches & Telemetry...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Inbox All Clear — All Challenges Routed</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              All submitted civic innovation challenges have been routed to faculty research teams. New validated challenges will appear here in real time.
            </p>
          </div>
        ) : (
          /* Grid of incoming complaints */
          <div className="space-y-4">
            {complaints.map((item, idx) => {
              const isTop = idx === 0;
              const isAccepting = acceptingId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border p-5 transition-all space-y-4 ${
                    isTop
                      ? 'border-purple-400 bg-gradient-to-r from-purple-50 via-white to-white shadow-md ring-1 ring-purple-200'
                      : 'border-slate-200 bg-white shadow-sm hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  {/* Card Top: Rank, Title, Match Badge */}
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {isTop && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            <Award className="w-3 h-3 text-amber-600" />
                            <span>#1 Top Overlap Match</span>
                          </span>
                        )}

                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {item.category}
                        </span>

                        {/* SDG Target Tag */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                          <Target className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{getSdgLabel(item.sdg_target)}</span>
                        </span>

                        <PriorityBadge
                          priority={
                            item.priority?.toUpperCase() === 'HIGH' || item.priority?.toUpperCase() === 'CRITICAL'
                              ? 'High'
                              : item.priority?.toUpperCase() === 'LOW'
                              ? 'Low'
                              : 'Medium'
                          }
                          size="sm"
                        />
                      </div>

                      <Link
                        to={`/complaints/${item.id}`}
                        className="block text-base sm:text-lg font-bold text-slate-900 hover:text-navy-700 transition-colors leading-snug"
                      >
                        {item.title}
                      </Link>
                    </div>

                    {/* Match Score Display */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="inline-flex items-baseline gap-1 px-3 py-1 rounded-xl bg-purple-100 text-purple-950 border border-purple-300 shadow-2xs">
                        <span className="text-lg font-black">{item.matchPercentage}%</span>
                        <span className="text-[10px] font-bold">MATCH</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono font-semibold mt-0.5">
                        {item.matchScore} Skills Overlap
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* AI Explanation Box */}
                  <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-slate-800 space-y-1.5">
                    <p className="leading-snug">
                      <strong className="text-slate-900 font-bold">AI Match Rationale:</strong> {item.explanation}
                    </p>
                    {item.matchedCapabilities && item.matchedCapabilities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-700 font-semibold">Overlapping Lab Strengths:</span>
                        {item.matchedCapabilities.map((cap, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold text-[10px]"
                          >
                            <Check className="w-2.5 h-2.5 text-emerald-700 stroke-[3]" />
                            <span>{cap}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Metadata + Step 3 Accept Project Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-slate-200">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-medium">
                      <span className="font-mono text-slate-700 font-bold">{item.complaintNumber}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{formatDate(item.createdAt)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>{item.citizen?.name || 'Citizen'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/complaints/${item.id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors"
                      >
                        Inspect Problem
                      </Link>

                      {/* Step 3: Accept Project Button */}
                      <button
                        type="button"
                        disabled={isAccepting || !university}
                        onClick={() => handleAcceptProject(item)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-navy-800 hover:bg-navy-900 text-white shadow-sm hover:shadow transition-all disabled:opacity-50"
                      >
                        {isAccepting ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Accepting...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Accept Project</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 2: Active Lab Projects */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Active Lab Projects
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                Civic challenges accepted and currently active in the {university?.name || 'University'} laboratory pipeline
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-900 border border-teal-200 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            {archives.length} Active {archives.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {archives.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">No Active Lab Projects Yet</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              When you accept an innovation challenge from the inbox above, it will automatically move here into active research tracking.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archives.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-emerald-400 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {item.complaintNumber || item.id.slice(0, 8)}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* Step 4: Shiny Gold Badge if Funded */}
                      {item.fundingStatus === 'FUNDED' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                          <span>💰</span>
                          <span>Funded by {item.industryPartner?.name || 'Corporate CSR'}</span>
                        </span>
                      )}
                      {/* Green ASSIGNED Badge */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-900 border border-green-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                        ASSIGNED
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link
                    to={`/complaints/${item.id}`}
                    className="block font-bold text-base text-slate-900 hover:text-navy-700 leading-snug line-clamp-2"
                  >
                    {item.title}
                  </Link>

                  {/* SDG Target */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                      <Target className="w-3 h-3 text-emerald-600" />
                      <span>{getSdgLabel(item.sdg_target)}</span>
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{formatDate(item.createdAt)}</span>
                  </span>
                  <Link
                    to={`/complaints/${item.id}`}
                    className="font-bold text-teal-800 hover:text-teal-950 hover:underline flex items-center gap-0.5"
                  >
                    <span>View Telemetry</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversityDashboard;

