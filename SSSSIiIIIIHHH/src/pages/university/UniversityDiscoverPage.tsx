import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Users, Sparkles, MapPin, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { Challenge } from '../../types';
import { useNavigate } from 'react-router-dom';

export const UniversityDiscoverPage: React.FC = () => {
  const { challenges, createProjectFromChallenge, acceptChallengeAssignment, currentUser } = useApp();
  const navigate = useNavigate();

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Modal team form state
  const [teamName, setTeamName] = useState('Interdisciplinary Innovation Team');
  const [leadStudentName, setLeadStudentName] = useState('Aarav Sharma');
  const [leadStudentDiscipline, setLeadStudentDiscipline] = useState('Chemical Engineering');
  const [facultyName, setFacultyName] = useState(currentUser?.name || 'Prof. Sunita Rao');
  const [budgetRequested, setBudgetRequested] = useState(400000);

  const validatedChallenges = challenges.filter(c => c.status === 'Validated' || c.status === 'Assigned to University');

  const handleOpenTeamModal = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setTeamName(`Team ${challenge.category.split(' ')[0]} Innovations`);
    setModalOpen(true);
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallenge) return;

    acceptChallengeAssignment(selectedChallenge.id, currentUser?.institutionId || 'INST-001');

    const newProj = createProjectFromChallenge(selectedChallenge.id, {
      teamName,
      title: `Scalable Solution: ${selectedChallenge.title}`,
      facultyMentor: {
        id: `FM-${Date.now()}`,
        name: facultyName,
        department: leadStudentDiscipline,
        designation: 'Faculty Mentor',
        email: 'faculty.mentor@univ.edu',
        specialization: selectedChallenge.category
      },
      studentTeam: [
        {
          id: `STU-1`,
          name: leadStudentName,
          discipline: leadStudentDiscipline,
          role: 'Team Lead',
          email: 'lead@student.univ.edu'
        },
        {
          id: `STU-2`,
          name: 'Pooja Nair',
          discipline: 'Computer Science & IoT',
          role: 'Embedded Telemetry Developer',
          email: 'pooja@student.univ.edu'
        }
      ],
      budget: {
        requested: budgetRequested,
        approved: budgetRequested,
        spent: 0,
        csrPledged: 0
      }
    });

    setModalOpen(false);
    alert(`Team Assembled and Project ${newProj.id} Created! Navigating to Project Lifecycle...`);
    navigate(`/projects/${newProj.id}`);
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Discover Validated Challenges for R&D
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Government-validated societal problems ready for multidisciplinary student problem solving and research prototyping.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {validatedChallenges.map(ch => (
          <div
            key={ch.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle hover:border-teal-300 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {ch.category}
                </span>
                <StatusBadge status={ch.status} />
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">{ch.title}</h3>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{ch.description}</p>

              {/* AI Matching Score */}
              {ch.aiAnalysis && (
                <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-teal-900 font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                    <span>Domain Compatibility:</span>
                  </div>
                  <span className="font-bold text-teal-800">
                    {ch.aiAnalysis.recommendedUniversities[0]?.matchScore || 94}% Fit
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{ch.location.district}, {ch.location.state} • Impact: {ch.impact.affectedPeopleCount} people</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">{formatDate(ch.submittedAt)}</span>
              <button
                type="button"
                onClick={() => handleOpenTeamModal(ch)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Accept & Assemble Team</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Multidisciplinary Team Builder Modal */}
      {modalOpen && selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-700" />
                <h3 className="text-base font-bold text-slate-900">Assemble Innovation Team</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg">
              <span className="font-semibold block text-slate-800">Challenge Target:</span>
              <p className="truncate">{selectedChallenge.title}</p>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Team Name</label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={e => setTeamName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Student</label>
                  <input
                    type="text"
                    required
                    value={leadStudentName}
                    onChange={e => setLeadStudentName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Discipline</label>
                  <input
                    type="text"
                    required
                    value={leadStudentDiscipline}
                    onChange={e => setLeadStudentDiscipline(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Faculty Mentor</label>
                  <input
                    type="text"
                    required
                    value={facultyName}
                    onChange={e => setFacultyName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Seed Budget (₹ INR)</label>
                  <input
                    type="number"
                    value={budgetRequested}
                    onChange={e => setBudgetRequested(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Confirm Team & Launch Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
