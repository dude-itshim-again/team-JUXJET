import React, { useState } from 'react';
import { MessageSquareQuote, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CitizenFeedbackPage: React.FC = () => {
  const { currentUser, challenges } = useApp();
  const [selectedChallenge, setSelectedChallenge] = useState(challenges[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const myChallenges = challenges.filter(c => c.submittedBy.id === currentUser?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !details) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject('');
      setDetails('');
      alert('Grievance ticket lodged. Tracking number: GRV-2026-881. You will receive an SMS update.');
    }, 1200);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Citizen Feedback & Grievance Redressal
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Report issues regarding validation delays, inaccurate ground resolution reports, or solution kiosk maintenance.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Related Challenge (Optional)
            </label>
            <select
              value={selectedChallenge}
              onChange={e => setSelectedChallenge(e.target.value)}
              className="w-full py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600 bg-white"
            >
              <option value="">General Platform Feedback</option>
              {myChallenges.map(c => (
                <option key={c.id} value={c.id}>
                  {c.id} - {c.title.substring(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject / Nature of Grievance *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={e => setSubject(e.target.value)}
                placeholder="e.g., Delay in ground validation for Kanke handpump"
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Detailed Description *
            </label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={e => setDetails(e.target.value)}
              placeholder="Describe the issue, dates, or specific officer interactions..."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
            />
          </div>

          <button
            type="submit"
            disabled={submitted}
            className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            {submitted ? <CheckCircle2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{submitted ? 'Submitting Grievance...' : 'Submit Grievance to Nodal Officer'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
