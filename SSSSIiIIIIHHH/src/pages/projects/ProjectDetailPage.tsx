import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  Users,
  Coins,
  FileText,
  FlaskConical,
  Rocket,
  PlusCircle,
  ArrowLeft,
  Building2,
  Handshake,
  Check,
  AlertCircle
} from 'lucide-react';
import { formatCurrencyINR, formatDate } from '../../utils/helpers';
import { Task } from '../../types';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, updateProjectTask, addProjectTask, updateMilestoneStatus, addIndustryPledge, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'milestones' | 'testing' | 'industry'>('overview');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  // Industry Pledge Modal
  const [pledgeModalOpen, setPledgeModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('Tata Trusts CSR Foundation');
  const [partnershipType, setPartnershipType] = useState<'Mentorship' | 'CSR Funding' | 'Equipment Access' | 'Pilot Co-Development'>('CSR Funding');
  const [pledgeDescription, setPledgeDescription] = useState('Sanctioning matching grant for pilot kiosk expansion');

  const project = projects.find(p => p.id === id) || projects[0];

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Project Not Found</h2>
        <Link to="/university/projects" className="text-xs text-teal-700 underline font-semibold mt-2 inline-block">
          Return to Projects
        </Link>
      </div>
    );
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addProjectTask(project.id, {
      title: taskTitle,
      assignedTo: taskAssignee || project.studentTeam[0]?.name || 'Student Innovator',
      priority: taskPriority,
      status: 'Todo',
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
    });
    setTaskTitle('');
  };

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIndustryPledge(project.id, partnerName, partnershipType, pledgeDescription);
    setPledgeModalOpen(false);
    alert('CSR / Industry Partnership Pledge Recorded Successfully!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <span className="text-xs font-mono text-slate-400">Project ID: {project.id}</span>
      </div>

      {/* Main Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-subtle space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded">
              {project.category}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Stage: {project.stage}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPledgeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-sm transition-colors"
            >
              <Handshake className="w-3.5 h-3.5" />
              <span>Offer CSR / Industry Pledge</span>
            </button>
          </div>
        </div>

        <h1 className="text-xl sm:text-3xl font-bold text-slate-900 leading-snug">
          {project.title}
        </h1>

        <p className="text-xs text-slate-500">
          Linked Challenge:{' '}
          <Link to={`/challenges/${project.challengeId}`} className="text-navy-700 font-semibold underline">
            {project.challengeTitle}
          </Link>
        </p>

        {/* Progress bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Overall Lifecycle Completion</span>
            <span className="font-bold text-slate-900">{project.progressPercentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-600 rounded-full transition-all"
              style={{ width: `${project.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-subtle flex items-center gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Proposal', icon: FolderKanban },
          { id: 'tasks', label: `Kanban Tasks (${project.tasks.length})`, icon: CheckCircle2 },
          { id: 'milestones', label: `Milestones (${project.milestones.length})`, icon: Clock },
          { id: 'testing', label: 'Field Testing & Pilot', icon: FlaskConical },
          { id: 'industry', label: `Industry Partners (${project.industryPartners.length})`, icon: Building2 }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive ? 'bg-navy-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Solution Proposal & Methodology
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {project.proposal.proposedSolution}
              </p>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
                <span className="font-semibold text-slate-800 block">Technical Methodology:</span>
                <p className="text-slate-600">{project.proposal.technicalMethodology}</p>
              </div>
            </div>

            {/* Student Team */}
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Multidisciplinary Student Team ({project.studentTeam.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.studentTeam.map(stu => (
                  <div key={stu.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 space-y-0.5">
                    <span className="font-bold text-xs text-slate-800 block">{stu.name}</span>
                    <span className="text-[11px] text-teal-800 font-medium block">{stu.discipline}</span>
                    <span className="text-[10px] text-slate-500">{stu.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Mentor & Budget */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Faculty Lead Mentor
              </h3>
              <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">{project.facultyMentor.name}</span>
                <span className="text-[11px] text-teal-800 font-medium block">{project.facultyMentor.department}</span>
                <p className="text-[10px] text-slate-600">{project.facultyMentor.specialization}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Financial Resource Allocation
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Approved Grant:</span>
                  <span className="font-bold text-slate-800">{formatCurrencyINR(project.budget.approved)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Expended to Date:</span>
                  <span className="font-semibold text-slate-800">{formatCurrencyINR(project.budget.spent)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">CSR Pledged:</span>
                  <span className="font-bold text-amber-700">{formatCurrencyINR(project.budget.csrPledged)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle">
            <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="Add a new engineering or field task..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-teal-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {(['Todo', 'In Progress', 'Done'] as const).map(status => {
              const statusTasks = project.tasks.filter(t => t.status === status);
              return (
                <div key={status} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                    <span>{status}</span>
                    <span className="bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-500">
                      {statusTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {statusTasks.map(t => (
                      <div
                        key={t.id}
                        className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2 text-xs"
                      >
                        <p className="font-medium text-slate-800">{t.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Assignee: {t.assignedTo}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus = status === 'Todo' ? 'In Progress' : 'Done';
                              updateProjectTask(project.id, { ...t, status: nextStatus });
                            }}
                            className="font-semibold text-teal-800 hover:underline"
                          >
                            Advance →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MILESTONES */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {project.milestones.map((m, idx) => (
            <div
              key={m.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{m.title}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      m.status === 'Approved'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">Due: {m.dueDate}</span>
              </div>

              <p className="text-xs text-slate-600">{m.description}</p>

              {m.feedback && (
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  <strong className="text-slate-800">Evaluator Feedback:</strong> {m.feedback}
                </div>
              )}

              {/* Action Buttons for evaluators */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">
                  Approved By: {m.approvedBy || 'Pending Ministry Review'}
                </span>
                {m.status !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() => {
                      updateMilestoneStatus(project.id, m.id, 'Approved', 'Deliverable verified with high quality.');
                      alert('Milestone marked Approved!');
                    }}
                    className="px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Approved</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: TESTING & PILOT */}
      {activeTab === 'testing' && (
        <div className="space-y-6">
          {/* Pilot Record */}
          {project.pilotRecord ? (
            <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <Rocket className="w-4 h-4 text-emerald-700" />
                  Active Field Pilot Deployment
                </span>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded">
                  Operational
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Location: {project.pilotRecord.location}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                {project.pilotRecord.feedbackSummary}
              </p>
              <div className="space-y-1 pt-1">
                <span className="text-xs font-semibold text-slate-800 block">Verified Pilot Outcomes:</span>
                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                  {project.pilotRecord.verifiedOutcomes.map((out, i) => (
                    <li key={i}>{out}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
              Pilot deployment stage pending lab test approvals.
            </div>
          )}

          {/* Test Records */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-subtle space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Laboratory & Field Test Reports ({project.testRecords.length})
            </h3>
            <div className="space-y-2">
              {project.testRecords.map(tr => (
                <div key={tr.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{tr.testName}</span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      ✓ {tr.result}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">Parameters: {tr.parameters}</p>
                  <p className="text-[11px] text-teal-800 font-semibold">{tr.metrics}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: INDUSTRY PARTNERS */}
      {activeTab === 'industry' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Active Industry & CSR Pledges ({project.industryPartners.length})
            </h3>
            <button
              onClick={() => setPledgeModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs shadow-sm"
            >
              + Add Partner Pledge
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.industryPartners.map((p, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{p.partnerName}</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    {p.partnershipType}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{p.pledgeDescription}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PLEDGE MODAL */}
      {pledgeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
            <h3 className="text-base font-bold text-slate-900">Offer Industry / CSR Pledge</h3>
            <form onSubmit={handlePledgeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company / Foundation Name</label>
                <input
                  type="text"
                  required
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pledge Nature</label>
                <select
                  value={partnershipType}
                  onChange={e => setPartnershipType(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600 bg-white"
                >
                  <option value="CSR Funding">CSR Funding Grant (Schedule VII)</option>
                  <option value="Equipment Access">Equipment / Testing Lab Access</option>
                  <option value="Mentorship">Industry Technical Mentorship</option>
                  <option value="Pilot Co-Development">Pilot Co-Development & Manufacturing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pledge Description</label>
                <textarea
                  rows={3}
                  required
                  value={pledgeDescription}
                  onChange={e => setPledgeDescription(e.target.value)}
                  placeholder="Details of grant amount, equipment specs, or deployment sites..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-amber-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPledgeModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                >
                  Submit Pledge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
