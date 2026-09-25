import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Filter, MapPin, Calendar, CheckSquare, GitFork, ArrowRight } from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { formatDate } from '../../utils/helpers';
import { CATEGORIES } from '../../utils/constants';

export const GovernmentChallengesPage: React.FC = () => {
  const { challenges } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const filtered = challenges.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.location.district.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCategory === 'All' || c.category === selectedCategory;
    const matchStat = selectedStatus === 'All' || c.status === selectedStatus;
    return matchSearch && matchCat && matchStat;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-navy-900 tracking-tight">
            Challenge Inbox & National Registry
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Centralized registry of all citizen societal submissions across all ministries.
          </p>
        </div>

        <Link
          to="/government/validation"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-blue-800 hover:bg-blue-900 text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <CheckSquare className="w-4 h-4" />
          <span>Launch 3-Column Validation Queue</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID, keywords, district..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="w-full md:w-48 py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 bg-white"
        >
          <option value="All">All Categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="w-full md:w-44 py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-blue-700 bg-white"
        >
          <option value="All">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Under Validation">Under Validation</option>
          <option value="Validated">Validated</option>
          <option value="Assigned to University">Assigned to University</option>
          <option value="In Progress">In Progress</option>
          <option value="Pilot">Pilot</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Challenge ID & Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(ch => (
                <tr key={ch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono text-[10px] text-slate-400">{ch.id}</div>
                    <Link
                      to={`/government/validation?challengeId=${ch.id}`}
                      className="font-bold text-slate-900 hover:text-blue-800 line-clamp-1 max-w-sm"
                    >
                      {ch.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{ch.category}</td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {ch.location.district}, {ch.location.state}
                  </td>
                  <td className="py-3.5 px-4">
                    <PriorityBadge priority={ch.priority} />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={ch.status} />
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      to={`/government/validation?challengeId=${ch.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-blue-800 hover:underline"
                    >
                      <span>Review</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
