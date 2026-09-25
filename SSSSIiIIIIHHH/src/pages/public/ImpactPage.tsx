import React from 'react';
import { useApp } from '../../context/AppContext';
import { Award, CheckCircle2, TrendingUp, Users, Droplets, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ImpactPage: React.FC = () => {
  const { challenges, projects } = useApp();

  const totalCitizensClaimed = challenges.reduce((acc, c) => acc + (c.impact?.affectedPeopleCount || 0), 0);
  const activePilots = projects.filter(p => p.stage === 'Pilot' || p.stage === 'Implementation');

  const impactData = [
    { metric: 'Kanke Drinking Water', verifiedBeneficiaries: 2400, unit: 'Villagers Served' },
    { metric: 'Gumla Forest Honey', verifiedBeneficiaries: 680, unit: 'Tribal Gatherers' },
    { metric: 'Deoghar ISL Healthcare', verifiedBeneficiaries: 1200, unit: 'Divyang Patients' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
          Public Impact & Transparency Dashboard
        </h1>
        <p className="text-sm text-slate-600">
          Independent verification of ground problem resolution. Fulfilling the highest standards of civic accountability.
        </p>
      </div>

      {/* Impact Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Reported Affected Population</span>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {totalCitizensClaimed.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-slate-500">Documented across citizen submissions</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Verified Ground Beneficiaries</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-700">4,280</div>
          <p className="text-[11px] text-slate-500">Certified by district water & health audits</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Safe Water Dispensed</span>
            <Droplets className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-3xl font-black text-teal-800">16,800 L</div>
              <p className="text-[11px] text-slate-500">Via AquaShuddhi solar ATM kiosk in Kanke</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Verified Field Beneficiaries by Project Pilot
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={impactData} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(val: any) => [val, 'Verified Beneficiaries']}
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
              />
              <Bar dataKey="verifiedBeneficiaries" fill="#176B68" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Verification Standard Explainer */}
      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-700" />
          Rigorous Three-Tier Impact Verification Standard
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          In JanSetu, a project is never declared completed merely upon prototype demonstration. Impact verification requires: (1) Laboratory test parameter passage under BIS standards, (2) Signed field pilot handoff agreement with the Gram Panchayat or Urban Local Body, and (3) Continuous 30-day telemetry monitoring with community satisfaction surveys.
        </p>
      </div>
    </div>
  );
};
