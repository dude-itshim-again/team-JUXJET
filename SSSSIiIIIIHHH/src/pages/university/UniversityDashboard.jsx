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

export const UniversityDashboard = () => {
  // Step 2 & 3: State variables
  const [university, setUniversity] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [archives, setArchives] = useState([]);
  const [universitiesList, setUniversitiesList] = useState([]);

  // UI / Action states
  const [loading, setLoading] = useState(true);
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
          // Pick Ranchi Science College if present, otherwise pick the first one
          const ranchi = data.find((u) => u.name && u.name.toLowerCase().includes('ranchi'));
          const myUni = ranchi || data[0];
          console.log('Selected University:', myUni);
          setUniversity(myUni);
        }
      })
      .catch((err) => {
        console.error('Error fetching universities list:', err);
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
    <div className="space-y-6 font-sans max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

      {/* Step 4: Debug Mode (Frontend) as requested */}
      <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-md font-mono text-xs space-y-1">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-purple-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>System Debug Status (Step 4)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Live Polling: 3s
          </span>
        </div>
        {!university && <p>Loading Universities...</p>}
        {university && <p>Logged in as: {university.name} (ID: {university.id})</p>}
        {complaints.length === 0 && <p>Inbox is empty. Waiting for INNOVATION complaints...</p>}
      </div>

      {/* University Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-indigo-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              <GraduationCap className="w-4 h-4 text-purple-300" />
              <span>SIH 26043 Academic Partner Dashboard</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Matchmaker Active</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{university ? university.name : 'Loading University...'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Multidisciplinary R&D laboratory routing portal. Real-time skill-overlap engine matches citizen innovation challenges directly to university capabilities.
          </p>

          {/* Capabilities Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-slate-400">Lab Capabilities:</span>
            {capabilities.length > 0 ? (
              capabilities.map((cap, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-white/10 text-teal-200 border border-white/15"
                >
                  <FlaskConical className="w-3 h-3 text-teal-300" />
                  <span>{cap}</span>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">Chemical Engineering, Water Filtration, Spectroscopy</span>
            )}
          </div>
        </div>

        {/* Demo Switcher Widget */}
        {universitiesList.length > 0 && (
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-2 backdrop-blur-xs min-w-[260px] shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block">
              Institution Switcher
            </span>
            <select
              value={university ? university.id : ''}
              onChange={(e) => handleUniversityChange(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-purple-400"
            >
              {universitiesList.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>UUID: {university?.id ? `${university.id.slice(0, 8)}...` : ''}</span>
              {university && (
                <button
                  onClick={() => handleUniversityChange(university.id)}
                  className="text-purple-300 hover:text-purple-200 underline inline-flex items-center gap-0.5"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  <span>Refresh</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Incoming AI Matches</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{complaints.length}</div>
          <p className="text-[11px] text-slate-500">Awaiting lab acceptance</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Lab Projects</span>
            <FolderKanban className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-800">{archives.length}</div>
          <p className="text-[11px] text-slate-500">Accepted research challenges</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Top Overlap Strength</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">
            {complaints.length > 0 ? `${complaints[0].matchPercentage}%` : '100%'}
          </div>
          <p className="text-[11px] text-slate-500">Based on verified lab skills</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Research Associates</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">24 Researchers</div>
          <p className="text-[11px] text-slate-500">Across chemical & sensor cells</p>
        </div>
      </div>

      {/* INCOMING AI CHALLENGES INBOX */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Incoming AI Innovation Inbox
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-900 border border-purple-300">
                {complaints.length} New
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live AI skill-overlap ranked challenges fetched from{' '}
              <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[11px]">
                GET /universities/{university?.id ? `${university.id.slice(0, 8)}...` : ':id'}/inbox
              </code>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Sorted by:</span>
            <span className="font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded">Highest Skill Overlap ↓</span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4 py-8">
            <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Inbox is empty. Waiting for INNOVATION complaints...</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All submitted innovation tickets have been routed to faculty research teams.
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
                  className={`rounded-xl border p-5 transition-all shadow-subtle hover:shadow-card space-y-4 ${
                    isTop
                      ? 'border-purple-300 bg-gradient-to-r from-purple-50/40 via-white to-white'
                      : 'border-slate-200 bg-white'
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

                        <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {item.category}
                        </span>

                        {/* SDG Target Tag */}
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {item.matchScore} Skills Overlap
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* AI Explanation Box */}
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <p className="leading-snug">
                      <strong className="text-slate-900">AI Match Rationale:</strong> {item.explanation}
                    </p>
                    {item.matchedCapabilities && item.matchedCapabilities.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] text-slate-500 font-medium">Overlapping Lab Strengths:</span>
                        {item.matchedCapabilities.map((cap, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold text-[10px]"
                          >
                            <Check className="w-2.5 h-2.5 text-emerald-700" />
                            <span>{cap}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom: Metadata + Step 3 Accept Project Button */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                      <span className="font-mono text-slate-600 font-semibold">{item.complaintNumber}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{formatDate(item.createdAt)}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{item.citizen?.name || 'Citizen'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/complaints/${item.id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-50 border border-teal-200 text-teal-700">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Active Lab Projects
              </h2>
              <p className="text-xs text-slate-500">
                Civic challenges accepted and currently active in the {university?.name || 'University'} laboratory pipeline
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-teal-600"></span>
            {archives.length} Active {archives.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {archives.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Active Lab Projects Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              When you accept an innovation challenge from the inbox above, it will automatically move here into active research tracking.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archives.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-emerald-300 p-5 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500">
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
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-green-100 text-green-800 border border-green-300">
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
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Target className="w-3 h-3 text-emerald-600" />
                      <span>{getSdgLabel(item.sdg_target)}</span>
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatDate(item.createdAt)}</span>
                  </span>
                  <Link
                    to={`/complaints/${item.id}`}
                    className="font-semibold text-teal-700 hover:text-teal-900 hover:underline flex items-center gap-0.5"
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
