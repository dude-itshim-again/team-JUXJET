import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Search, Filter, MapPin, ThumbsUp, Layers, SlidersHorizontal, PlusCircle, Sparkles } from 'lucide-react';
import { LeafletMap } from '../../components/common/LeafletMap';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { AiTriageBadges } from '../../components/common/AiTriageBadges';
import { CATEGORIES, STATES_AND_DISTRICTS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';
import { fetchAllComplaints, mapBackendComplaintToChallenge } from '../../api';

export const ExplorePage: React.FC = () => {
  const { challenges, toggleUpvote, currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedClassification, setSelectedClassification] = useState('All');
  const [showMap, setShowMap] = useState(true);
  const [backendComplaints, setBackendComplaints] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    fetchAllComplaints()
      .then(data => {
        if (isMounted && data && Array.isArray(data)) {
          const mapped = data.map(mapBackendComplaintToChallenge);
          setBackendComplaints(mapped);
        }
      })
      .catch(err => console.warn('Could not fetch backend complaints in ExplorePage:', err));

    return () => {
      isMounted = false;
    };
  }, []);

  // Merge live complaints from backend DB with local initial challenges
  const allChallenges = [
    ...backendComplaints,
    ...challenges.filter(
      c => !backendComplaints.some(bc => bc.id === c.id || bc.backendId === c.id || bc.complaintNumber === c.id),
    ),
  ];

  const filteredChallenges = allChallenges.filter(c => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.state.toLowerCase().includes(searchQuery.toLowerCase());

    const matchCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchState = selectedState === 'All' || c.location.state === selectedState;
    const matchStatus = selectedStatus === 'All' || c.status === selectedStatus;
    const matchClassification =
      selectedClassification === 'All' ||
      (selectedClassification === 'INNOVATION' && (c.classification || 'INNOVATION').toUpperCase().includes('INNOVATION')) ||
      (selectedClassification === 'GRIEVANCE' && (c.classification || '').toUpperCase().includes('GRIEVANCE'));

    return matchSearch && matchCategory && matchState && matchStatus && matchClassification;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 font-sans">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            Explore Societal Challenges
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse crowdsourced challenges across India, track prototype progression, and endorse priority issues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMap(!showMap)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              showMap ? 'bg-navy-700 text-white border-navy-700' : 'bg-white text-slate-700 border-slate-300'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>{showMap ? 'Hide Map' : 'Show Map'}</span>
          </button>
          {(!currentUser || currentUser.role === 'citizen') && (
            <Link
              to="/citizen/submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit Challenge</span>
            </Link>
          )}
        </div>
      </div>

      {/* Map View Toggle */}
      {showMap && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Interactive Geolocation Explorer (Click pins for preview)</span>
            <span>{filteredChallenges.length} challenges mapped</span>
          </div>
          <LeafletMap
            challenges={filteredChallenges}
            selectedCategory={selectedCategory === 'All' ? undefined : selectedCategory}
            height="320px"
          />
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-subtle space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, district (e.g. Ranchi, Dhanbad, Gumla)..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600 focus:ring-1 focus:ring-navy-600"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="w-full md:w-52 py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600 bg-white"
          >
            <option value="All">All Categories ({challenges.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* State Dropdown */}
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="w-full md:w-44 py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600 bg-white"
          >
            <option value="All">All States</option>
            {Object.keys(STATES_AND_DISTRICTS).map(st => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full md:w-36 py-2 px-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:border-navy-600 bg-white"
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

          {/* AI Track Dropdown */}
          <select
            value={selectedClassification}
            onChange={e => setSelectedClassification(e.target.value)}
            className="w-full md:w-44 py-2 px-3 text-xs border border-purple-300 rounded-lg focus:outline-none focus:border-purple-600 bg-purple-50/50 text-purple-900 font-semibold"
          >
            <option value="All">All AI Tracks</option>
            <option value="INNOVATION">✨ Innovation Track</option>
            <option value="GRIEVANCE">🛡️ Grievance Track</option>
          </select>
        </div>
      </div>

      {/* Challenge Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <span>Showing {filteredChallenges.length} of {allChallenges.length} challenges</span>
          {(selectedCategory !== 'All' || selectedState !== 'All' || selectedClassification !== 'All' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedState('All');
                setSelectedStatus('All');
                setSelectedClassification('All');
                setSearchQuery('');
              }}
              className="text-teal-700 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredChallenges.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
            <Layers className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-700">No challenges match your filters</h3>
            <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map(ch => (
              <div
                key={ch.id}
                className="bg-white rounded-xl border border-slate-200 shadow-subtle hover:shadow-card transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Category & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {ch.category}
                      </span>
                      <StatusBadge status={ch.status} />
                    </div>
                    {ch.complaintNumber && (
                      <span className="text-[10px] font-mono font-bold text-navy-800 bg-navy-50 px-1.5 py-0.5 rounded border border-navy-200">
                        {ch.complaintNumber}
                      </span>
                    )}
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

                  {/* Title */}
                  <Link
                    to={`/challenges/${ch.id}`}
                    className="block text-sm font-bold text-slate-900 hover:text-navy-700 leading-snug"
                  >
                    {ch.title}
                  </Link>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {ch.description}
                  </p>

                  {/* District & Location */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {ch.location.villageWard ? `${ch.location.villageWard}, ` : ''}
                      {ch.location.district}, {ch.location.state}
                    </span>
                  </div>

                  {/* Impact & Priority Pill */}
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-600">
                      Affected: <strong className="text-slate-800">{ch.impact.affectedPeopleCount.toLocaleString('en-IN')}</strong>
                    </span>
                    <PriorityBadge priority={ch.priority} />
                  </div>

                  {/* Assigned University Badge if present */}
                  {ch.assignedUniversity && (
                    <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-700 flex items-center justify-between">
                      <span className="text-slate-500">R&D Match:</span>
                      <span className="font-semibold text-teal-800 truncate max-w-[170px]">
                        {ch.assignedUniversity.institutionName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer Bar */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => toggleUpvote(ch.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="font-semibold">{ch.upvotes}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400">{formatDate(ch.submittedAt)}</span>
                    <Link
                      to={`/challenges/${ch.id}`}
                      className="font-semibold text-navy-700 hover:underline"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
