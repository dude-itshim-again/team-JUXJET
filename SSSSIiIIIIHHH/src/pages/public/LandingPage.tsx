import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  PlusCircle,
  Compass,
  CheckCircle2,
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  Layers,
  MapPin,
  FileCheck
} from 'lucide-react';
import { LeafletMap } from '../../components/common/LeafletMap';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import { CATEGORIES } from '../../utils/constants';

export const LandingPage: React.FC = () => {
  const { challenges, projects, institutions, industryPartners } = useApp();

  const totalBeneficiaries = challenges.reduce((acc, c) => acc + (c.impact?.affectedPeopleCount || 0), 0);
  const validatedCount = challenges.filter(c => c.status !== 'Draft' && c.status !== 'Submitted').length;
  const activePilotsCount = projects.filter(p => p.stage === 'Pilot' || p.stage === 'Implementation').length;

  return (
    <div className="space-y-16 pb-16 font-sans">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-700/80 border border-navy-600 text-saffron-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>JanSetu | National Innovation Collaboration Network</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Every Community Challenge Deserves an{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-saffron-400">
              Innovative Solution.
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            JanSetu connects citizens reporting local societal problems with higher education researchers,
            government mission officers, and industry CSR partners to engineer prototypes, deploy field pilots,
            and measure scalable human impact.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
            <Link
              to="/citizen/submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-saffron-500 hover:bg-saffron-600 text-slate-950 shadow-elevated transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Submit a Challenge</span>
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-navy-700 hover:bg-navy-600 text-white border border-navy-500 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Challenges Map</span>
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              <span>Login / Switch Role</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Live Counters Banner */}
        <div className="relative max-w-6xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Reported Challenges', val: challenges.length, icon: Layers, sub: 'Across 8 States' },
            { label: 'Validated by Govt', val: validatedCount, icon: ShieldCheck, sub: 'Jal Jeevan & MoHUA' },
            { label: 'Partner Universities', val: institutions.length, icon: GraduationCap, sub: 'IITs, NITs, Central Unis' },
            { label: 'Active Field Pilots', val: activePilotsCount, icon: TrendingUp, sub: `${(totalBeneficiaries / 1000).toFixed(1)}k Citizens Reached` }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur text-left space-y-1"
              >
                <div className="flex items-center justify-between text-teal-400 mb-1">
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">{stat.sub}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.val}</div>
                <div className="text-xs text-slate-300 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. How it Works (4 Separate Roles in Action) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 tracking-tight">
            How JanSetu Works
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A transparent, multistakeholder lifecycle transforming community complaints into field-tested technological prototypes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Citizens Report',
              desc: 'Villagers & residents submit ground evidence, geotagged location, and problem impact.',
              role: 'Citizen Workspace',
              color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900'
            },
            {
              step: '02',
              title: 'Govt & AI Triage',
              desc: 'Simulated AI categorizes, detects duplicates, and officers validate ground truth.',
              role: 'Government Workspace',
              color: 'border-blue-200 bg-blue-50/50 text-blue-950'
            },
            {
              step: '03',
              title: 'Universities Solve',
              desc: 'Faculty & multidisciplinary student innovators engineer prototypes and field solutions.',
              role: 'University R&D Hub',
              color: 'border-teal-200 bg-teal-50/50 text-teal-950'
            },
            {
              step: '04',
              title: 'Industry & Pilot Scale',
              desc: 'Enterprises match CSR grants, deploy field kiosks, and measure verified outcomes.',
              role: 'Industry & CSR Workspace',
              color: 'border-amber-200 bg-amber-50/50 text-amber-950'
            }
          ].map(item => (
            <div
              key={item.step}
              className={`p-6 rounded-2xl border ${item.color} shadow-subtle flex flex-col justify-between`}
            >
              <div>
                <span className="text-3xl font-black text-slate-300 block mb-2">{item.step}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  {item.role}
                </span>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Flagship Showcase: Kanke Fluoride Water Project */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-navy-800 to-navy-950 text-white p-6 sm:p-10 border border-navy-700 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 border border-teal-500/40 text-teal-300 text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Flagship JanSetu Demonstration</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Kanke Village Fluoride Defluoridation & Solar Water Kiosk
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Groundwater with 3.8 mg/L toxic fluoride in Ranchi district caused dental fluorosis among 320 children.
                Reported by citizen Ramesh Verma $\to$ Validated by Jal Jeevan Mission $\to$ Solved by BIT Mesra Team AquaShuddhi
                $\to$ Funded by Tata Trusts CSR.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Status:</span>
                  <span className="text-xs font-bold text-emerald-400">Pilot Deployed</span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Treated Water:</span>
                  <span className="text-xs font-bold text-white">0.42 mg/L (Safe BIS)</span>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <span className="text-[11px] text-slate-400 block">Beneficiaries:</span>
                  <span className="text-xs font-bold text-white">2,400 Villagers</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/projects/PROJ-2026-001"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-500 hover:bg-teal-600 text-slate-950 transition-colors"
                >
                  <span>Inspect AquaShuddhi Lifecycle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/challenges/CHAL-2026-001"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <span>View Citizen Ground Truth</span>
                </Link>
              </div>
            </div>

            {/* Quick Timeline Card */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-400 block">
                Live Verification Flow
              </span>
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-semibold text-white">Citizen Lodged:</span>
                    <p className="text-[11px] text-slate-300">Ramesh Verma with lab report</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-semibold text-white">Govt Triage & Routing:</span>
                    <p className="text-[11px] text-slate-300">Matched to BIT Mesra R&D</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-semibold text-white">Multidisciplinary Team:</span>
                    <p className="text-[11px] text-slate-300">Bio-sorbent column + IoT ATM</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-saffron-400 mt-1.5 shrink-0 animate-pulse"></span>
                  <div>
                    <span className="font-semibold text-white">Pilot Telemetry:</span>
                    <p className="text-[11px] text-slate-300">16,800L dispensed in Kanke</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Interactive National Map Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
              Jharkhand Societal Challenge Heatmap
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Real-time geolocated challenges from districts across Jharkhand.
            </p>
          </div>
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy-700 hover:text-navy-900 hover:underline"
          >
            <span>Open Full Interactive Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <LeafletMap challenges={challenges} height="380px" />
      </section>

      {/* 5. Featured Challenges Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
            Featured Societal Challenges
          </h2>
          <Link
            to="/explore"
            className="text-xs font-semibold text-navy-700 hover:underline"
          >
            View All ({challenges.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.slice(0, 3).map(ch => (
            <div
              key={ch.id}
              className="p-5 rounded-xl bg-white border border-slate-200 shadow-subtle hover:shadow-card transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {ch.category}
                  </span>
                  <StatusBadge status={ch.status} />
                </div>

                <Link
                  to={`/challenges/${ch.id}`}
                  className="block text-sm font-bold text-slate-900 hover:text-navy-700 line-clamp-2"
                >
                  {ch.title}
                </Link>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {ch.description}
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  <span>{ch.location.district}, {ch.location.state}</span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">
                  Impact: <strong className="text-slate-800">{ch.impact.affectedPeopleCount.toLocaleString('en-IN')}</strong> affected
                </span>
                <Link
                  to={`/challenges/${ch.id}`}
                  className="font-semibold text-navy-700 hover:underline inline-flex items-center gap-1"
                >
                  Inspect →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Thematic Problem Sectors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight mb-4">
          Core Societal Domains
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              to={`/explore?category=${encodeURIComponent(cat)}`}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-navy-600 hover:text-navy-700 transition-colors shadow-2xs"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Institutional Collaboration Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-navy-900">Are you a University Faculty or Student Team?</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Discover government-validated societal challenges ready for academic research, engineering capstones, and NEP 2020 multidisciplinary innovation credits.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/university/dashboard"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-teal-700 hover:bg-teal-800 text-white shadow-sm transition-colors"
            >
              Enter University Portal
            </Link>
            <Link
              to="/universities"
              className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Participating Institutions
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
