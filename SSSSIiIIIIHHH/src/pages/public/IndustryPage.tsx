import React from 'react';
import { useApp } from '../../context/AppContext';
import { Building2, Handshake, Coins, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrencyINR } from '../../utils/helpers';

export const IndustryPage: React.FC = () => {
  const { industryPartners } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl font-bold text-navy-900 tracking-tight">
          Industry & CSR Collaboration Ecosystem
        </h1>
        <p className="text-sm text-slate-600">
          Connecting corporate social responsibility (CSR) capital, technology providers, and mentors directly to high-impact university engineering prototypes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {industryPartners.map(partner => (
          <div
            key={partner.id}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-subtle space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                  {partner.type}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{partner.name}</h3>
              <p className="text-xs text-slate-500">Sector: {partner.sector}</p>

              <div className="space-y-1 text-xs pt-1">
                <span className="font-semibold text-slate-700 block">CSR Focus Areas:</span>
                <div className="flex flex-wrap gap-1">
                  {partner.csrFocusAreas.map((area, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Grants Pledged:</span>
                <span className="font-bold text-amber-700">{formatCurrencyINR(partner.totalGrantsPledged)}</span>
              </div>
              <Link
                to="/partners/dashboard"
                className="font-semibold text-navy-700 hover:underline inline-flex items-center gap-1"
              >
                <span>Partner Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
