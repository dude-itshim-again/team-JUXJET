import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  Handshake,
  Coins,
  Wrench,
  Rocket,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface IndustrySidebarProps {
  onItemClick?: () => void;
}

export const IndustrySidebar: React.FC<IndustrySidebarProps> = ({ onItemClick }) => {
  const { currentUser, projects } = useApp();

  const links = [
    { to: '/partners/dashboard', label: 'Partner Hub', icon: Building2 },
    { to: '/partners/opportunities', label: 'Fundable Projects', icon: Sparkles, badge: 'Active' },
    { to: '/partners/partnerships', label: 'My Pledges & Collabs', icon: Handshake },
    { to: '/partners/funding', label: 'CSR Grant Calls', icon: Coins },
    { to: '/partners/mentorship', label: 'Lab Equipment & Mentorship', icon: Wrench },
    { to: '/partners/pilots', label: 'Pilot Field Testing', icon: Rocket }
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-amber-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            CSR
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-xs font-bold text-slate-900 truncate">
              {currentUser?.organizationName || 'Tata Community Initiatives Trust'}
            </h3>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-900">
              <ShieldCheck className="w-3 h-3" />
              Verified Industry Partner
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Industry & CSR Portal
        </div>
        {links.map(link => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onItemClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.label}</span>
              </div>
              {link.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-900 font-semibold">
                  {link.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-200 bg-slate-50">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1">
          <p className="font-semibold text-slate-800">CSR Schedule VII Match</p>
          <p className="text-[11px] text-slate-500">
            Qualifies for 100% Section 135 CSR Compliance deduction.
          </p>
        </div>
      </div>
    </aside>
  );
};
