import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Coins,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Target,
  RefreshCw,
  Clock,
  FolderKanban,
  Award,
  Calendar,
  Layers,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export const IndustryDashboard = () => {
  // Step 2: Dynamic Login & Polling States
  const [industriesList, setIndustriesList] = useState([]);
  const [activeIndustryId, setActiveIndustryId] = useState(null);
  const [activeIndustry, setActiveIndustry] = useState(null);
  const [noIndustryMessage, setNoIndustryMessage] = useState(null);

  const [opportunities, setOpportunities] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fundingId, setFundingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  /**
   * 1. Dynamic Login: Fetch GET /industries and pick first industry
   */
  useEffect(() => {
    fetch('http://localhost:3000/industries')
      .then((res) => res.json())
      .then((data) => {
        console.log('Fetched Industries:', data);
        if (Array.isArray(data) && data.length > 0) {
          setIndustriesList(data);
          const first = data[0];
          setActiveIndustryId(first.id);
          setActiveIndustry(first);
          setNoIndustryMessage(null);
          console.log('Selected Active Industry:', first);
        } else {
          const emptyMsg = 'No Industry profile found in database. Please add one in Prisma Studio.';
          console.warn(emptyMsg);
          setNoIndustryMessage(emptyMsg);
          // Hardcode fallback industry profile with valid UUID so opportunities view doesn't fail silently
          const fallbackIndustry = {
            id: '00000000-0000-0000-0000-000000000000',
            name: 'Default Corporate Partner (Prisma Studio Needed)',
            sector: 'CSR & Innovation',
            location: 'Jharkhand, India',
          };
          setIndustriesList([fallbackIndustry]);
          setActiveIndustryId(fallbackIndustry.id);
          setActiveIndustry(fallbackIndustry);
        }
      })
      .catch((err) => {
        console.error('Error fetching industries:', err);
        const errMsg = 'No Industry profile found in database. Please add one in Prisma Studio.';
        setNoIndustryMessage(errMsg);
        const fallbackIndustry = {
          id: '00000000-0000-0000-0000-000000000000',
          name: 'Default Corporate Partner (Prisma Studio Needed)',
          sector: 'CSR & Innovation',
          location: 'Jharkhand, India',
        };
        setIndustriesList([fallbackIndustry]);
        setActiveIndustryId(fallbackIndustry.id);
        setActiveIndustry(fallbackIndustry);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  /**
   * 2. Auto-Polling: 3000ms polling for Opportunities & Portfolio
   */
  useEffect(() => {
    if (!activeIndustryId || activeIndustryId === 'undefined') {
      console.warn('Skipping fetch: activeIndustryId is not a valid ID:', activeIndustryId);
      return;
    }

    const fetchIndustryData = async () => {
      try {
        console.log('Fetching CSR opportunities for ID:', activeIndustryId);
        // Fetch Opportunities (ASSIGNED & PENDING)
        const oppsRes = await fetch(`http://localhost:3000/industries/${activeIndustryId}/opportunities`);
        if (oppsRes.ok) {
          const oppsData = await oppsRes.json();
          setOpportunities(Array.isArray(oppsData) ? oppsData : []);
        }

        // Fetch Portfolio (Funded by this industry)
        const portRes = await fetch(`http://localhost:3000/industries/${activeIndustryId}/portfolio`);
        if (portRes.ok) {
          const portData = await portRes.json();
          setPortfolio(Array.isArray(portData) ? portData : []);
        }
      } catch (err) {
        console.error('Error polling industry data:', err);
      } finally {
        setLoading(false);
      }
    };

    // Immediate initial fetch
    fetchIndustryData();

    // 3-second interval polling
    const intervalId = setInterval(fetchIndustryData, 3000);

    return () => clearInterval(intervalId);
  }, [activeIndustryId]);

  /**
   * Step 3: Wire the Fund Button
   * POST /complaints/:id/fund with { industryId: activeIndustryId }
   */
  const handleReleaseFunds = async (complaint) => {
    if (!activeIndustryId) {
      alert('No active industry selected.');
      return;
    }

    setFundingId(complaint.id);
    console.log(`Releasing CSR funds for complaint ${complaint.id} with industryId ${activeIndustryId}`);

    try {
      const res = await fetch(`http://localhost:3000/complaints/${complaint.id}/fund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ industryId: activeIndustryId }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Funding request failed (${res.status})`);
      }

      const result = await res.json();
      console.log('Funding successful:', result);

      // Optimistic state updates
      setOpportunities((prev) => prev.filter((item) => item.id !== complaint.id));
      setPortfolio((prev) => [
        {
          ...complaint,
          fundingStatus: 'FUNDED',
          industryPartnerId: activeIndustryId,
          industryPartner: activeIndustry,
          updatedAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setToastMessage({
        title: 'CSR Funds Released Successfully!',
        desc: `Grant sanctioned for "${complaint.title}". Project moved to your active CSR Portfolio.`,
      });

      setTimeout(() => setToastMessage(null), 5000);
    } catch (err) {
      console.error('Error releasing CSR funds:', err);
      alert(`Error releasing funds: ${err.message}`);
    } finally {
      setFundingId(null);
    }
  };

  const handleIndustryChange = (id) => {
    const selected = industriesList.find((i) => i.id === id);
    if (selected) {
      setLoading(true);
      setActiveIndustryId(selected.id);
      setActiveIndustry(selected);
    }
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

  return (
    <div className="space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 text-white p-4 rounded-xl shadow-lg border border-amber-400 flex items-start justify-between gap-3 animate-slideDown">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-sm">{toastMessage.title}</h4>
              <p className="text-xs text-amber-100">{toastMessage.desc}</p>
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

      {/* Warning if no industry profile found in database */}
      {noIndustryMessage && (
        <div className="bg-amber-50 border-2 border-amber-400 text-amber-950 rounded-xl p-4 flex items-center justify-between gap-3 shadow-subtle">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-900">Database Notice</h4>
              <p className="text-xs font-semibold text-amber-800">{noIndustryMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Corporate Innovation Banner */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-900 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6 border border-amber-700/50">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/30">
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>SIH 26043 CSR & Corporate Innovation Portal</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Section 135 Compliant</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
            <span>{activeIndustry ? activeIndustry.name : 'Loading Corporate Partner...'}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Co-sponsor university R&D prototypes, track field pilots with verified telemetry, and satisfy Schedule VII CSR impact requirements with full transparency.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-amber-200/90 font-medium">
            <span>Location: <strong>{activeIndustry?.location || 'Ranchi, Jharkhand'}</strong></span>
            <span>•</span>
            <span>Sector: <strong>{activeIndustry?.sector || 'CSR & Community Development'}</strong></span>
          </div>
        </div>

        {/* Corporate Switcher Widget */}
        {industriesList.length > 0 && (
          <div className="bg-white/10 p-4 rounded-xl border border-white/10 space-y-2 backdrop-blur-xs min-w-[280px] shrink-0">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-200 block">
              Corporate Partner Switcher
            </span>
            <select
              value={activeIndustryId || ''}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-semibold focus:outline-none focus:border-amber-400"
            >
              {industriesList.map((ind) => (
                <option key={ind.id} value={ind.id}>
                  {ind.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono pt-1">
              <span>UUID: {activeIndustryId ? `${activeIndustryId.slice(0, 8)}...` : ''}</span>
              <span className="text-emerald-400 font-bold">Auto-Polling: 3s</span>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Open R&D Opportunities</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{opportunities.length}</div>
          <p className="text-[11px] text-slate-500">Seeking prototyping funds</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active CSR Portfolio</span>
            <FolderKanban className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{portfolio.length}</div>
          <p className="text-[11px] text-slate-500">Funded university projects</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Impacted Citizens</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-900">
            {(portfolio.length * 1200 + 450).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500">Beneficiaries reached</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-subtle space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Audit Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">100%</div>
          <p className="text-[11px] text-slate-500">Schedule VII verified</p>
        </div>
      </div>

      {/* UI Section 1: Open Opportunities */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Civic Innovation Opportunities (Awaiting CSR Funding)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {opportunities.length} Available
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              University-assigned challenges currently seeking CSR prototype manufacturing grants
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Polling endpoint: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px]">/industries/:id/opportunities</code>
          </span>
        </div>

        {loading ? (
          <div className="space-y-4 py-8">
            <div className="h-6 bg-slate-200 rounded w-1/4 animate-pulse"></div>
            <div className="h-28 bg-slate-100 rounded-xl animate-pulse"></div>
            <div className="h-28 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Unfunded Assigned Projects</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              All accepted university challenges have been matched with corporate CSR grants. New opportunities will appear here once accepted by university labs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {opportunities.map((complaint) => {
              const isFunding = fundingId === complaint.id;

              return (
                <div
                  key={complaint.id}
                  className="bg-white rounded-xl p-5 border border-slate-200 hover:border-amber-400 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {/* SDG Tag */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <Target className="w-3 h-3 text-emerald-600" />
                        <span>{getSdgLabel(complaint.sdg_target)}</span>
                      </span>

                      <span className="text-xs font-mono text-slate-400">
                        {complaint.complaintNumber || complaint.id.slice(0, 8)}
                      </span>
                    </div>

                    {/* Problem Title */}
                    <Link
                      to={`/complaints/${complaint.id}`}
                      className="block text-base font-bold text-slate-900 hover:text-amber-700 leading-snug line-clamp-2"
                    >
                      {complaint.title}
                    </Link>

                    {/* Prominent Badge: R&D Partner */}
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold">
                      <span className="text-base leading-none">🏛️</span>
                      <span>
                        R&D Partner: <strong>{complaint.assignedUniversity?.name || 'Ranchi Science College'}</strong>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {complaint.description}
                    </p>
                  </div>

                  {/* Primary Button: Release CSR Funds */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      to={`/complaints/${complaint.id}`}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Inspect Problem
                    </Link>

                    <button
                      type="button"
                      disabled={isFunding}
                      onClick={() => handleReleaseFunds(complaint)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm hover:shadow transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isFunding ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Sanctioning Funds...</span>
                        </>
                      ) : (
                        <>
                          <Coins className="w-3.5 h-3.5 text-yellow-200" />
                          <span>Release CSR Funds</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* UI Section 2: Portfolio (Funded Projects) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                Corporate CSR Portfolio (Funded R&D Projects)
              </h2>
              <p className="text-xs text-slate-500">
                Civic innovations actively financed by {activeIndustry?.name || 'this industry partner'}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            {portfolio.length} Funded {portfolio.length === 1 ? 'Project' : 'Projects'}
          </span>
        </div>

        {portfolio.length === 0 ? (
          <div className="p-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
            <Clock className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700">No Funded Projects in Portfolio Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Click "Release CSR Funds" on any opportunity above to sponsor its prototype development. It will immediately appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-to-br from-white to-emerald-50/20 rounded-xl border border-slate-200 hover:border-emerald-300 p-5 shadow-subtle hover:shadow-card transition-all flex flex-col justify-between space-y-3.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {item.complaintNumber || item.id.slice(0, 8)}
                    </span>

                    {/* Green FUNDED Status Badge */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      FUNDED
                    </span>
                  </div>

                  {/* Shiny Gold Badge (Step 4 preview) */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-2xs">
                    <span className="text-sm">💰</span>
                    <span>Funded by {activeIndustry?.name || item.industryPartner?.name || 'Corporate CSR'}</span>
                  </div>

                  {/* Title */}
                  <Link
                    to={`/complaints/${item.id}`}
                    className="block font-bold text-base text-slate-900 hover:text-emerald-700 leading-snug line-clamp-2"
                  >
                    {item.title}
                  </Link>

                  {/* Prominent Badge: R&D Partner */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold">
                    <span className="text-base leading-none">🏛️</span>
                    <span>
                      R&D Partner: <strong>{item.assignedUniversity?.name || 'Ranchi Science College'}</strong>
                    </span>
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{formatDate(item.updatedAt || item.createdAt)}</span>
                  </span>
                  <Link
                    to={`/complaints/${item.id}`}
                    className="font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5"
                  >
                    <span>View Telemetry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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

export default IndustryDashboard;
