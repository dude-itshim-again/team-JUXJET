import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, ThumbsUp, MessageSquare, MapPin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';

export const CitizenCommunityPage: React.FC = () => {
  const { challenges, toggleUpvote, addComment } = useApp();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const handleCommentSubmit = (challengeId: string) => {
    const text = commentInputs[challengeId];
    if (!text || !text.trim()) return;
    addComment(challengeId, text);
    setCommentInputs({ ...commentInputs, [challengeId]: '' });
  };

  return (
    <div className="space-y-6 font-sans">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
          Community Engagement & Endorsements
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Endorse challenges raised by neighboring villages, share updates, and collaborate on local solutions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {challenges.map(ch => (
          <div
            key={ch.id}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {ch.category}
                </span>
                <StatusBadge status={ch.status} />
              </div>
              <span className="text-xs text-slate-400">{formatDate(ch.submittedAt)}</span>
            </div>

            <Link
              to={`/challenges/${ch.id}`}
              className="block text-base font-bold text-slate-900 hover:text-emerald-700"
            >
              {ch.title}
            </Link>

            <p className="text-xs text-slate-600 leading-relaxed">{ch.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleUpvote(ch.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium text-slate-700"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Support / Endorse ({ch.upvotes})</span>
                </button>
                <span className="text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {ch.location.district}, {ch.location.state}
                </span>
              </div>

              <span className="text-slate-500">{ch.comments.length} Comments</span>
            </div>

            {/* Inline Comment Box */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                value={commentInputs[ch.id] || ''}
                onChange={e => setCommentInputs({ ...commentInputs, [ch.id]: e.target.value })}
                placeholder="Share your perspective on this challenge..."
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-emerald-600"
              />
              <button
                type="button"
                onClick={() => handleCommentSubmit(ch.id)}
                className="px-3 py-1.5 bg-navy-700 hover:bg-navy-800 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                <span>Comment</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
