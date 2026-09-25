import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  Share2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Send,
  Building2,
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { LeafletMap } from '../../components/common/LeafletMap';
import { AiTriageBadges } from '../../components/common/AiTriageBadges';
import { UniversityMatchmaker } from '../../components/common/UniversityMatchmaker';
import { formatDate } from '../../utils/helpers';
import { fetchComplaintById, mapBackendComplaintToChallenge } from '../../api';
import { Challenge } from '../../types';

export const ChallengeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { challenges, toggleUpvote, addComment, currentUser } = useApp();
  const [commentText, setCommentText] = useState('');
  const [backendChallenge, setBackendChallenge] = useState<Challenge | null>(null);
  const [loadingBackend, setLoadingBackend] = useState<boolean>(false);

  // Try finding locally first
  const localChallenge = challenges.find(
    c => c.id === id || (c as any).backendId === id || c.complaintNumber === id
  );

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const loadBackend = async () => {
      // Even if local exists, fetch backend if id is a uuid or complaintNumber to get latest AI triage
      setLoadingBackend(true);
      try {
        const data = await fetchComplaintById(id);
        if (isMounted && data) {
          const mapped = mapBackendComplaintToChallenge(data);
          setBackendChallenge(mapped);
        }
      } catch (e) {
        console.error('Error fetching backend complaint:', e);
      } finally {
        if (isMounted) setLoadingBackend(false);
      }
    };

    loadBackend();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const challenge: Challenge | undefined = backendChallenge || localChallenge;

  if (!challenge) {
    if (loadingBackend) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-base font-bold text-slate-800">Loading Complaint Data...</h2>
          <p className="text-xs text-slate-500 mt-1">Retrieving AI triage analysis and university matches from server...</p>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Challenge Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">The requested challenge record does not exist or has been archived.</p>
        <Link to="/explore" className="mt-4 inline-block text-xs text-navy-700 underline font-semibold">
          Return to Explore Directory
        </Link>
      </div>
    );
  }

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(challenge.id, commentText);
    setCommentText('');
  };

  const isInnovation = (challenge.classification || 'INNOVATION').toUpperCase().includes('INNOVATION');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-2">
          {challenge.complaintNumber && (
            <span className="text-xs font-mono font-bold text-navy-800 bg-navy-50 px-2 py-0.5 rounded border border-navy-200">
              {challenge.complaintNumber}
            </span>
          )}
          <span className="text-xs font-mono text-slate-400">Record ID: {challenge.id}</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded">
              {challenge.category}
            </span>
            <StatusBadge status={challenge.status} size="md" />
            <PriorityBadge priority={challenge.priority} size="md" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleUpvote(challenge.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Endorse ({challenge.upvotes})</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Public challenge link copied to clipboard.');
              }}
              className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
              title="Share Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* AI Triage Badges Row */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">AI Triage Classification:</span>
            <AiTriageBadges
              classification={challenge.classification}
              sdg_target={challenge.sdg_target}
              extracted_skills={challenge.extracted_skills}
            />
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 leading-snug">
          {challenge.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {challenge.location.address || `${challenge.location.district}, ${challenge.location.state}`}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Submitted {formatDate(challenge.submittedAt)}
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            {challenge.submittedBy.isAnonymous ? 'Anonymous Citizen' : challenge.submittedBy.name}
          </span>
        </div>
      </div>

      {/* Main Grid: Left Details & Right Progress / Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Evidence, Impact */}
        <div className="lg:col-span-2 space-y-6">
          {/* SIH Innovation Track Banner */}
          {isInnovation && (
            <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-xl p-4 sm:p-5 flex items-start gap-3 shadow-card border border-purple-800">
              <div className="p-2.5 bg-white/10 rounded-lg shrink-0">
                <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-purple-200">
                    Smart India Hackathon 2024 (SIH 26043)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/40 text-purple-100 border border-purple-400/30">
                    Innovation Ticket
                  </span>
                </div>
                <p className="text-purple-100 leading-relaxed text-xs">
                  This civic issue requires engineering R&D rather than routine municipal maintenance. Our AI Matchmaker has calculated skill overlap and automatically paired this problem statement with accredited university labs in Jharkhand.
                </p>
              </div>
            </div>
          )}

          {/* Problem Statement */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Problem Description
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {challenge.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div>
                <span className="text-slate-500 block">Who is Affected?</span>
                <span className="font-semibold text-slate-800">{challenge.whoIsAffected}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Duration of Problem:</span>
                <span className="font-semibold text-slate-800">{challenge.durationExisted}</span>
              </div>
            </div>
          </div>

          {/* Societal Impact Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Assessed Community Impact
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Affected Citizens</span>
                <span className="text-base font-bold text-slate-900">
                  {challenge.impact.affectedPeopleCount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Severity</span>
                <span className="text-xs font-bold text-red-700">{challenge.impact.severity}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Urgency</span>
                <span className="text-xs font-bold text-orange-700">{challenge.impact.urgency}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Frequency</span>
                <span className="text-xs font-bold text-slate-800">{challenge.impact.frequency}</span>
              </div>
            </div>

            {challenge.impact.existingAttempts && (
              <div className="pt-2 text-xs text-slate-600">
                <strong className="text-slate-700">Existing Local Attempts:</strong> {challenge.impact.existingAttempts}
              </div>
            )}

            {challenge.impact.suggestedSolution && (
              <div className="p-3 rounded-lg bg-teal-50/60 border border-teal-200 text-xs text-teal-900">
                <strong className="block mb-1 text-teal-950">Citizen's Suggested Direction:</strong>
                {challenge.impact.suggestedSolution}
              </div>
            )}
          </div>

          {/* Evidence Attachments */}
          {challenge.evidence && challenge.evidence.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Submitted Field Evidence ({challenge.evidence.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {challenge.evidence.map(ev => (
                  <div key={ev.id} className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                    {ev.type === 'image' ? (
                      <img
                        src={ev.url}
                        alt={ev.name}
                        className="w-full h-44 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-44 flex flex-col items-center justify-center p-4 bg-slate-100 text-slate-600">
                        <FileText className="w-12 h-12 text-slate-400 mb-2" />
                        <span className="text-xs font-semibold text-slate-800 text-center">{ev.name}</span>
                        <span className="text-[10px] text-slate-500 mt-1">Official Document PDF</span>
                      </div>
                    )}
                    <div className="p-3 bg-white">
                      <p className="text-xs font-semibold text-slate-800 truncate">{ev.name}</p>
                      {ev.caption && <p className="text-[11px] text-slate-500 mt-0.5">{ev.caption}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments & Discussion */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Community Engagement & Updates ({challenge.comments.length})
            </h2>

            {/* Post Comment Input */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={currentUser ? 'Share community feedback or update...' : 'Login to comment...'}
                disabled={!currentUser}
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600"
              />
              <button
                type="submit"
                disabled={!currentUser || !commentText.trim()}
                className="px-4 py-2 bg-navy-700 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold disabled:opacity-50 inline-flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post</span>
              </button>
            </form>

            {/* List */}
            <div className="space-y-3 pt-2">
              {challenge.comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No comments posted yet. Be the first to share feedback.</p>
              ) : (
                challenge.comments.map(c => (
                  <div key={c.id} className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        {c.userName}
                        {c.isOfficial && (
                          <span className="text-[9px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded uppercase">
                            Official
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] text-slate-400">{formatDate(c.createdAt)}</span>
                    </div>
                    <p className="text-slate-600">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: University Match, Timeline, Geolocation Map */}
        <div className="space-y-6">
          {/* University Matchmaker Section */}
          <UniversityMatchmaker
            complaintId={(challenge as any).backendId || challenge.id}
            classification={challenge.classification}
          />

          {/* Linked University & Solution Project Box */}
          {challenge.assignedUniversity && (
            <div className="bg-gradient-to-br from-teal-50 to-teal-100/50 rounded-xl p-5 border border-teal-200 space-y-3 shadow-subtle">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-xs uppercase tracking-wider">
                <Building2 className="w-4 h-4 text-teal-700" />
                <span>Academic Solution Partner</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                {challenge.assignedUniversity.institutionName}
              </h3>
              <p className="text-xs text-slate-600">
                Assigned by Ministry on {challenge.assignedUniversity.assignedDate}. Multidisciplinary research team actively engineering prototype.
              </p>

              {challenge.linkedProjectId && (
                <Link
                  to={`/projects/${challenge.linkedProjectId}`}
                  className="w-full mt-2 inline-flex justify-center items-center gap-1.5 px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <span>Inspect Solution Lifecycle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          )}

          {/* Solution Timeline Stepper */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Resolution Progress Stepper
            </h3>

            <div className="relative pl-5 border-l-2 border-slate-200 space-y-4 text-xs">
              {challenge.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full bg-navy-700 border-2 border-white shadow-xs"></span>
                  <div>
                    <span className="font-semibold text-slate-900 block">{event.label}</span>
                    <span className="text-[10px] text-slate-400 block">{formatDate(event.timestamp)}</span>
                    {event.notes && <p className="text-[11px] text-slate-600 mt-1">{event.notes}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Leaflet Mini Map */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Geographic Coordinates
            </h3>
            <p className="text-xs text-slate-500">
              Lat: {challenge.location.lat}, Lng: {challenge.location.lng}
            </p>
            <LeafletMap challenges={[challenge]} height="200px" />
          </div>
        </div>
      </div>
    </div>
  );
};
